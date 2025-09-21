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
  deleteDoc,
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
  emailVerified: boolean;
}

// Email verification token interface
export interface EmailVerificationToken {
  token: string;
  userId: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
}

// Signup data interfaces
export interface AthleteSignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CoachSignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  teamName: string;
  position: string;
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
  federations: string[];
}

// UPDATED: AthleteProfile with all meet registration fields
export interface AthleteProfile extends BaseUser {
  role: 'athlete';
  
  // Display info
  displayName?: string;
  username?: string;
  bio?: string;
  location?: string;
  phone?: string;
  
  // Personal Information (required for meet registration)
  dateOfBirth?: Date;
  gender?: 'male' | 'female';
  
  // Competition Information
  weightClass?: string;
  division?: string;
  equipment?: string;
  federation?: string;
  
  // Emergency Contact (required for meet registration)
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
    email?: string;
  };
  
  // Federation Membership (required for meet registration)
  federationMembership?: {
    federation: string;
    membershipNumber: string;
    expirationDate: Date;
  };
  
  // Training Information
  gym?: string;
  coach?: string;
  coachPhone?: string;
  coachPowerUpUsername?: string;
  coachId?: string;
  teamName?: string;
  teamPowerUpUsername?: string;
  teamId?: string;
  
  // Settings
  notifications?: {
    email: boolean;
    push: boolean;
    workoutReminders: boolean;
    coachMessages: boolean;
  };
  privacy?: {
    profilePublic: boolean;
    statsPublic: boolean;
    competitionHistory: boolean;
  };
  theme?: 'light' | 'dark';
  
  // Social Media
  socialMedia?: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    website?: string;
  };
}

export interface CoachProfile extends BaseUser {
  role: 'coach';
  teamName: string;
  position: string;
  certification?: {
    certificationNumber: string;
    expirationDate: Date;
  };
  canPost: boolean;
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
  federations: string[];
  permissions: string[];
  canPost: boolean;
}

export type UserProfile = AthleteProfile | CoachProfile | AdminProfile;

// Authentication result
export interface AuthResult {
  user: User;
  profile: UserProfile;
}

// Email verification result
export interface EmailVerificationResult {
  success: boolean;
  message: string;
  requiresLogin?: boolean;
}

// Collections
const COLLECTIONS = {
  USERS: 'users',
  EMAIL_VERIFICATIONS: 'emailVerifications',
} as const;

/**
 * Generate a secure random verification token
 */
const generateVerificationToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Store email verification token
 */
const storeVerificationToken = async (userId: string, email: string): Promise<string> => {
  const token = generateVerificationToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  const verificationData: EmailVerificationToken = {
    token,
    userId,
    email,
    createdAt: now,
    expiresAt,
    used: false,
  };

  await setDoc(doc(db, COLLECTIONS.EMAIL_VERIFICATIONS, token), {
    ...verificationData,
    createdAt: Timestamp.fromDate(now),
    expiresAt: Timestamp.fromDate(expiresAt),
  });

  return token;
};

/**
 * Verify email token and activate account
 */
export const verifyEmailToken = async (token: string): Promise<EmailVerificationResult> => {
  try {
    const tokenDoc = await getDoc(doc(db, COLLECTIONS.EMAIL_VERIFICATIONS, token));
    
    if (!tokenDoc.exists()) {
      return {
        success: false,
        message: 'Invalid verification link. Please check your email or request a new verification.',
      };
    }

    const tokenData = tokenDoc.data();
    const now = new Date();
    const expiresAt = tokenData.expiresAt.toDate();

    // Check if token is expired
    if (now > expiresAt) {
      await deleteDoc(doc(db, COLLECTIONS.EMAIL_VERIFICATIONS, token));
      return {
        success: false,
        message: 'Verification link has expired. Please create a new account or request a new verification.',
      };
    }

    // Check if token was already used
    if (tokenData.used) {
      return {
        success: false,
        message: 'This verification link has already been used.',
      };
    }

    // Mark token as used
    await updateDoc(doc(db, COLLECTIONS.EMAIL_VERIFICATIONS, token), {
      used: true,
      usedAt: Timestamp.now(),
    });

    // Activate user account
    await updateDoc(doc(db, COLLECTIONS.USERS, tokenData.userId), {
      emailVerified: true,
      isActive: true,
      updatedAt: Timestamp.now(),
    });

    console.log('Email verified successfully for user:', tokenData.userId);
    
    return {
      success: true,
      message: 'Email verified successfully! You can now log in to your account.',
      requiresLogin: true,
    };

  } catch (error) {
    console.error('Error verifying email token:', error);
    return {
      success: false,
      message: 'An error occurred while verifying your email. Please try again.',
    };
  }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (email: string): Promise<boolean> => {
  try {
    // Find user by email (you'd need to implement getUserByEmail)
    // For now, this is a placeholder - you might need to add email indexing
    throw new Error('Resend functionality requires email indexing - implement if needed');
  } catch (error) {
    console.error('Error resending verification email:', error);
    return false;
  }
};

/**
 * Create athlete account with email verification
 */
export const createAthleteAccount = async (data: AthleteSignupData): Promise<{ userId: string; verificationToken: string }> => {
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
    
    // Create user profile in Firestore with default settings
    const profile: AthleteProfile = {
      id: user.uid,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      displayName: `${data.firstName} ${data.lastName}`,
      role: 'athlete',
      createdAt: new Date(),
      updatedAt: new Date(),
      profileComplete: false,
      isActive: false, // Will be activated after email verification
      emailVerified: false,
      // Default settings
      notifications: {
        email: true,
        push: true,
        workoutReminders: true,
        coachMessages: true
      },
      privacy: {
        profilePublic: true,
        statsPublic: true,
        competitionHistory: true
      },
      theme: 'dark',
    };
    
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
      ...profile,
      createdAt: Timestamp.fromDate(profile.createdAt),
      updatedAt: Timestamp.fromDate(profile.updatedAt),
    });

    // Generate and store verification token
    const verificationToken = await storeVerificationToken(user.uid, data.email);
    
    console.log('Athlete account created successfully (pending verification):', user.uid);
    
    // Sign out the user since they need to verify email first
    await signOut(auth);
    
    return { userId: user.uid, verificationToken };
    
  } catch (error) {
    console.error('Error creating athlete account:', error);
    throw new Error(getAuthErrorMessage(error as AuthError));
  }
};

/**
 * Create coach account with email verification
 */
export const createCoachAccount = async (data: CoachSignupData): Promise<{ userId: string; verificationToken: string }> => {
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
      certification: data.certification.hasCertification && data.certification.certificationNumber ? {
        certificationNumber: data.certification.certificationNumber,
        expirationDate: new Date(data.certification.expirationDate!),
      } : undefined,
      canPost: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profileComplete: true,
      isActive: false,
      emailVerified: false,
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

    // Generate and store verification token
    const verificationToken = await storeVerificationToken(user.uid, data.email);
    
    console.log('Coach account created successfully (pending verification):', user.uid);
    
    // Sign out the user since they need to verify email first
    await signOut(auth);
    
    return { userId: user.uid, verificationToken };
    
  } catch (error) {
    console.error('Error creating coach account:', error);
    throw new Error(getAuthErrorMessage(error as AuthError));
  }
};

/**
 * Create admin account with email verification
 */
export const createAdminAccount = async (data: AdminSignupData): Promise<{ userId: string; verificationToken: string }> => {
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
      federations: data.federations,
      permissions: [
        'create-meets', 
        'manage-registrations', 
        'view-reports',
        'manage-finances',
        'live-meet-operations'
      ],
      canPost: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profileComplete: true,
      isActive: false,
      emailVerified: false,
    };
    
    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
      ...profile,
      createdAt: Timestamp.fromDate(profile.createdAt),
      updatedAt: Timestamp.fromDate(profile.updatedAt),
    });

    // Generate and store verification token
    const verificationToken = await storeVerificationToken(user.uid, data.email);
    
    console.log('Admin account created successfully (pending verification):', user.uid);
    
    // Sign out the user since they need to verify email first
    await signOut(auth);
    
    return { userId: user.uid, verificationToken };
    
  } catch (error) {
    console.error('Error creating admin account:', error);
    throw new Error(getAuthErrorMessage(error as AuthError));
  }
};

/**
 * Sign in user - checks email verification
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

    // Check if email is verified
    if (!profile.emailVerified) {
      await signOut(auth);
      throw new Error('Please verify your email address before logging in. Check your inbox for a verification link.');
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
 * Get user profile from Firestore - handles all timestamp conversions
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
      emailVerified: data.emailVerified || false,
    } as UserProfile;
    
    // Handle role-specific timestamp conversions for optional fields
    if (profile.role === 'athlete') {
      const athleteProfile = profile as AthleteProfile;
      
      if (data.dateOfBirth) {
        athleteProfile.dateOfBirth = (data.dateOfBirth as Timestamp).toDate();
      }
      
      if (data.federationMembership?.expirationDate) {
        athleteProfile.federationMembership = {
          ...data.federationMembership,
          expirationDate: (data.federationMembership.expirationDate as Timestamp).toDate()
        };
      }
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
 * Update user profile - handles all date conversions
 */
export const updateUserProfile = async (
  userId: string, 
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    const processedUpdates: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    // Handle athlete-specific date conversions
    if (updates.role === 'athlete' || !updates.role) {
      const athleteUpdates = updates as Partial<AthleteProfile>;
      
      if (athleteUpdates.dateOfBirth) {
        processedUpdates.dateOfBirth = Timestamp.fromDate(new Date(athleteUpdates.dateOfBirth));
      }
      
      // Handle federation membership - only process if it has valid data
      if (athleteUpdates.federationMembership) {
        // Check if federation membership has any actual data
        const hasFederationData = athleteUpdates.federationMembership.federation || 
                                  athleteUpdates.federationMembership.membershipNumber ||
                                  athleteUpdates.federationMembership.expirationDate;
        
        if (hasFederationData && athleteUpdates.federationMembership.expirationDate) {
          processedUpdates.federationMembership = {
            ...athleteUpdates.federationMembership,
            expirationDate: Timestamp.fromDate(new Date(athleteUpdates.federationMembership.expirationDate))
          };
        } else if (!hasFederationData) {
          // If federation membership is empty, remove it
          delete processedUpdates.federationMembership;
        } else {
          // If there's partial data but no expiration date, keep the data but remove undefined expiration
          processedUpdates.federationMembership = { ...athleteUpdates.federationMembership };
          if (!processedUpdates.federationMembership.expirationDate) {
            delete processedUpdates.federationMembership.expirationDate;
          }
        }
      }
    }
    
    // Deep clean undefined values from nested objects
    const cleanObject = (obj: any): any => {
      Object.keys(obj).forEach(key => {
        if (obj[key] === undefined || obj[key] === '') {
          delete obj[key];
        } else if (obj[key] && typeof obj[key] === 'object' && !(obj[key] instanceof Date) && !(obj[key]._seconds !== undefined)) {
          cleanObject(obj[key]);
          // Remove empty objects
          if (Object.keys(obj[key]).length === 0) {
            delete obj[key];
          }
        }
      });
      return obj;
    };
    
    cleanObject(processedUpdates);
    
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
 * Check if athlete has all required fields for meet registration
 */
export const hasRequiredRegistrationInfo = (profile: UserProfile): boolean => {
  if (profile.role !== 'athlete') return false;
  
  const athleteProfile = profile as AthleteProfile;
  
  return !!(
    athleteProfile.dateOfBirth &&
    athleteProfile.gender &&
    athleteProfile.emergencyContact?.name &&
    athleteProfile.emergencyContact?.phone &&
    athleteProfile.emergencyContact?.relationship &&
    athleteProfile.federationMembership?.federation &&
    athleteProfile.federationMembership?.membershipNumber &&
    athleteProfile.federationMembership?.expirationDate &&
    new Date(athleteProfile.federationMembership.expirationDate) > new Date()
  );
};

/**
 * Get missing registration fields for athlete
 */
export const getMissingRegistrationFields = (profile: UserProfile): string[] => {
  if (profile.role !== 'athlete') return [];
  
  const athleteProfile = profile as AthleteProfile;
  const missing: string[] = [];
  
  if (!athleteProfile.dateOfBirth) missing.push('Date of Birth');
  if (!athleteProfile.gender) missing.push('Gender');
  if (!athleteProfile.emergencyContact?.name) missing.push('Emergency Contact Name');
  if (!athleteProfile.emergencyContact?.phone) missing.push('Emergency Contact Phone');
  if (!athleteProfile.emergencyContact?.relationship) missing.push('Emergency Contact Relationship');
  if (!athleteProfile.federationMembership?.federation) missing.push('Federation');
  if (!athleteProfile.federationMembership?.membershipNumber) missing.push('Federation Membership Number');
  if (!athleteProfile.federationMembership?.expirationDate) missing.push('Federation Membership Expiration');
  
  const federationExpired = athleteProfile.federationMembership?.expirationDate && 
    new Date(athleteProfile.federationMembership.expirationDate) <= new Date();
  if (federationExpired) missing.push('Federation Membership (Expired)');
  
  return missing;
};

/**
 * Convert Firebase Auth errors to user-friendly messages
 */
const getAuthErrorMessage = (error: AuthError | Error): string => {
  if ('code' in error) {
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
  }
  
  // Handle custom error messages (like email verification)
  return error.message;
};