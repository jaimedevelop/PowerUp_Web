// src/contexts/shared/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { 
  getUserProfile, 
  UserProfile, 
  AthleteProfile, 
  CoachProfile, 
  AdminProfile,
  hasRequiredRegistrationInfo,
  getMissingRegistrationFields,
  signOutUser
} from '../../services/shared/auth';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAthlete: boolean;
  isCoach: boolean;
  isAdmin: boolean;
  hasCompleteRegistrationInfo: boolean;
  missingRegistrationFields: string[];
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Type guards for profile types
  getAthleteProfile: () => AthleteProfile | null;
  getCoachProfile: () => CoachProfile | null;
  getAdminProfile: () => AdminProfile | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompleteRegistrationInfo, setHasCompleteRegistrationInfo] = useState(false);
  const [missingRegistrationFields, setMissingRegistrationFields] = useState<string[]>([]);

  // Fetch and update user profile
  const fetchUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      const profile = await getUserProfile(user.uid);
      
      if (profile) {
        // Check registration info if athlete
        if (profile.role === 'athlete') {
          const hasComplete = hasRequiredRegistrationInfo(profile);
          const missing = getMissingRegistrationFields(profile);
          setHasCompleteRegistrationInfo(hasComplete);
          setMissingRegistrationFields(missing);
        } else {
          setHasCompleteRegistrationInfo(true);
          setMissingRegistrationFields([]);
        }
      }
      
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        
        if (user) {
          // Get user profile from Firestore
          const profile = await fetchUserProfile(user);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
          setHasCompleteRegistrationInfo(false);
          setMissingRegistrationFields([]);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUserProfile(null);
        setHasCompleteRegistrationInfo(false);
        setMissingRegistrationFields([]);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setUserProfile(null);
      setHasCompleteRegistrationInfo(false);
      setMissingRegistrationFields([]);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Refresh profile function
  const refreshProfile = async (): Promise<void> => {
    if (!currentUser) return;
    
    try {
      const profile = await fetchUserProfile(currentUser);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  // Type guard functions
  const getAthleteProfile = (): AthleteProfile | null => {
    if (userProfile?.role === 'athlete') {
      return userProfile as AthleteProfile;
    }
    return null;
  };

  const getCoachProfile = (): CoachProfile | null => {
    if (userProfile?.role === 'coach') {
      return userProfile as CoachProfile;
    }
    return null;
  };

  const getAdminProfile = (): AdminProfile | null => {
    if (userProfile?.role === 'admin') {
      return userProfile as AdminProfile;
    }
    return null;
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    isAuthenticated: !!currentUser && !!userProfile,
    isAthlete: userProfile?.role === 'athlete',
    isCoach: userProfile?.role === 'coach',
    isAdmin: userProfile?.role === 'admin',
    hasCompleteRegistrationInfo,
    missingRegistrationFields,
    signOut,
    refreshProfile,
    getAthleteProfile,
    getCoachProfile,
    getAdminProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;