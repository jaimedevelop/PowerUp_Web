// src/services/shared/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  AuthError,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

// User types
export type UserRole = 'athlete' | 'coach' | 'admin';

export interface BaseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  profileComplete: boolean;
  isActive: boolean;
}

// UPDATED: Simplified signup data interfaces
export interface AthleteSignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // Removed: dateOfBirth, gender, emergencyContact - will be collected during meet registration
}

export interface CoachSignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  teamName: string;
  position: string;
  // Removed: experience field as requested
  certification: {
    hasCertification: boolean;
    certificationNumber?: string;
    expirationDate?: string;
  };
}

export interface AdminSignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organization: string;
  role: string;
  federations: string[]; // Added: federations array
}

// UPDATED: Simplified user profile interfaces
export interface AthleteProfile extends BaseUser {
  role: 'athlete';
  // All fields optional until meet registration or profile completion
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  weight?: number;
  federationMembership?: {
    federation: string;
    membershipNumber: string;
    expirationDate: Date;
  };
  coachId?: string;
  teamId?: string;
}

export interface CoachProfile extends BaseUser {
  role: 'coach';
  teamName: string;
  position: string;
  // Removed: yearsExperience field as requested
  certification?: {
    certificationNumber: string;
    expirationDate: Date;
  };
  canPost: boolean; // Coaches can post to feed
  // Additional fields
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
}

export interface AdminProfile extends BaseUser {
  role: 'admin';
  organization: string;
  adminRole: string;
  federations: string[]; // Added: federations array
  permissions: string[];
  canPost: boolean; // Admins can post to feed
}

export type UserProfile = AthleteProfile | CoachProfile | AdminProfile;

// Authentication result
export interface AuthResult {
  user: User;
  profile: UserProfile;
}

// Collections
const COLLECTIONS = {
  USERS: 'users',
} as const;

/**
 * UPDATED: Simplified athlete account creation
 */
export const createAthleteAccount = async (data: AthleteSignupData): Promise<AuthResult> => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, {
      displayName: `${data.firstName} ${data.lastName}`,
    });
    
    // Create minimal user profile in Firestore
    const profile: AthleteProfile = {
      id: user.uid,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: 'athlete',
      // No dateOfBirth, gender, emergencyContact - will be added during meet registration
      createdAt: new Date(),
      updatedAt: new Date(),
      profileComplete: false, // Will be true after meet registration details are filled
      isActive: true,
    };
    
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
      ...profile,
      createdAt: Timestamp.fromDate(profile.createdAt),
      updatedAt: Timestamp.fromDate(profile.updatedAt),
    });
    
    console.log('Athlete account created successfully:', user.uid);
    return { user, profile };
    
  } catch (error) {
    console.error('Error creating athlete account:', error);
    throw new Error(getAuthErrorMessage(error as AuthError));
  }
};

/**
 * UPDATED: Simplified coach account creation
 */
export const createCoachAccount = async (data: CoachSignupData): Promise<AuthResult> => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, {
      displayName: `${data.firstName} ${data.lastName}`,
    });
    
    // Create user profile in Firestore
    const profile: CoachProfile = {
      id: user.uid,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: 'coach',
      teamName: data.teamName,
      position: data.position,
      // Removed: yearsExperience field
      certification: data.certification.hasCertification && data.certification.certificationNumber ? {
        certificationNumber: data.certification.certificationNumber,
        expirationDate: new Date(data.certification.expirationDate!),
      } : undefined,
      canPost: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profileComplete: true, // Coach profiles complete after signup
      isActive: true,
    };
    
    const firestoreData = {
      ...profile,
      createdAt: Timestamp.fromDate(profile.createdAt),
      updatedAt: Timestamp.fromDate(profile.updatedAt),
    };
    
    if (profile.certification?.expirationDate) {
      firestoreData.certification = {
        ...profile.certification,
        expirationDate: Timestamp.fromDate(profile.certification.expirationDate),
      };
    }
    
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), firestoreData);
    
    console.log('Coach account created successfully:', user.uid);
    return { user, profile };
    
  } catch (error) {
    console.error('Error creating coach account:', error);
    throw new Error(getAuthErrorMessage(error as AuthError));
  }
};

/**
 * UPDATED: Admin account creation with federations
 */
export const createAdminAccount = async (data: AdminSignupData): Promise<AuthResult> => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    
    const user = userCredential.user;
    
    // Update display name
    await updateProfile(user, {
      displayName: `${data.firstName} ${data.lastName}`,
    });
    
    // Create user profile in Firestore
    const profile: AdminProfile = {
      id: user.uid,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: 'admin',
      organization: data.organization,
      adminRole: data.role,
      federations: data.federations, // Added: federations array
      permissions: [
        'create-meets', 
        'manage-registrations', 
        'view-reports',
        'manage-finances',
        'live-meet-operations'
      ], // Default permissions
      canPost: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profileComplete: true, // Admin profiles complete after signup
      isActive: true,
    };
    
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
      ...profile,
      createdAt: Timestamp.fromDate(profile.createdAt),
      updatedAt: Timestamp.fromDate(profile.updatedAt),
    });
    
    console.log('Admin account created successfully:', user.uid);
    return { user, profile };
    
  } catch (error) {
    console.error('Error creating admin account:', error);
    throw new Error(getAuthErrorMessage(error as AuthError));
  }
};

/**
 * Sign in user - FIXED EXPORT
 */
export const signInUser = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user profile from Firestore
    const profile = await getUserProfile(user.uid);
    if (!profile) {
      throw new Error('User profile not found');
    }
    
    console.log('User signed in successfully:', user.uid);
    return { user, profile };
    
  } catch (error) {
    console.error('Error signing in:', error);
    throw new Error(getAuthErrorMessage(error as AuthError));
  }
};

/**
 * Sign out user
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error('Failed to sign out');
  }
};

/**
 * Send password reset email
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error(getAuthErrorMessage(error as AuthError));
  }
};

/**
 * Get user profile from Firestore - UPDATED to handle optional fields
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    
    if (!userDoc.exists()) {
      console.log('User profile not found:', userId);
      return null;
    }
    
    const data = userDoc.data();
    
    // Convert Firestore Timestamps back to Dates
    const profile: UserProfile = {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as UserProfile;
    
    // Handle role-specific timestamp conversions for optional fields
    if (profile.role === 'athlete' && (profile as AthleteProfile).dateOfBirth) {
      (profile as AthleteProfile).dateOfBirth = 
        (data.dateOfBirth as Timestamp)?.toDate() || new Date();
    }
    
    if (profile.role === 'coach' && (profile as CoachProfile).certification?.expirationDate) {
      (profile as CoachProfile).certification!.expirationDate = 
        (data.certification.expirationDate as Timestamp)?.toDate() || new Date();
    }
    
    return profile;
    
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string, 
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    const processedUpdates = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    // Convert any Date objects to Timestamps
    if (updates.role === 'athlete' && (updates as Partial<AthleteProfile>).dateOfBirth) {
      processedUpdates.dateOfBirth = Timestamp.fromDate(
        (updates as Partial<AthleteProfile>).dateOfBirth!
      );
    }
    
    await updateDoc(doc(db, COLLECTIONS.USERS, userId), processedUpdates);
    console.log('User profile updated successfully:', userId);
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update profile');
  }
};

/**
 * Get current authenticated user with profile
 */
export const getCurrentUser = async (): Promise<AuthResult | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  
  const profile = await getUserProfile(user.uid);
  if (!profile) return null;
  
  return { user, profile };
};

/**
 * Convert Firebase Auth errors to user-friendly messages
 */
const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Account creation is currently disabled.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      console.error('Unhandled auth error:', error.code, error.message);
      return 'An error occurred. Please try again.';
  }
};