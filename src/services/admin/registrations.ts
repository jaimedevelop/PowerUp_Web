// src/services/admin/registrations.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  increment,
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { handleFirebaseError } from '../../firebase/index';
import { 
  MeetRegistration, 
  RegistrationStatus, 
  PaymentStatus,
  RegistrationStats 
} from '../meets/registration';

// Import your existing types
import { Athlete } from '../../types/athlete/athlete-types';
import { Federation } from '../../types/shared/common-types';

// Extended user profile interface that matches your Athlete type
export interface UserProfile extends Omit<Athlete, 'dateOfBirth'> {
  dateOfBirth?: string; // Keep as string for easier handling in forms
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
    email?: string;
  };
  // Additional profile fields that might exist
  profilePicture?: string;
  instagramHandle?: string;
  coachInfo?: {
    coachName?: string;
    coachEmail?: string;
    teamName?: string;
  };
}

// Admin-specific registration interface for UI components
export interface AdminRegistrationView {
  id: string;
  userId: string;
  meetId: string;
  
  // Athlete Information
  athleteInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
      email?: string;
    };
  };
  
  // Competition Details
  competitionInfo: {
    weightClass: string;
    division: string;
    equipment: string;
    expectedWeight: number;
    estimatedTotal?: number;
    personalRecords?: {
      squat?: number;
      bench?: number;
      deadlift?: number;
      total?: number;
    };
    openingAttempts?: {
      squat?: number;
      bench?: number;
      deadlift?: number;
    };
  };
  
  // Registration Status & Timing
  registrationDate: Date;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  
  // Meet Director Fields
  flight?: string;
  platform?: number;
  weightInStatus?: 'pending' | 'passed' | 'failed';
  actualWeight?: number;
  notes?: string;
  
  // Coach/Team Info (if provided)
  coachInfo?: {
    coachName?: string;
    coachEmail?: string;
    coachPhone?: string;
    teamName?: string;
  };
  
  // Federation Info (if provided)
  federationMembership?: {
    federation: string;
    membershipNumber: string;
    expirationDate: Date;
  };
}

// Filter and query options for admin registration queries
export interface AdminRegistrationQueryOptions {
  status?: RegistrationStatus;
  paymentStatus?: PaymentStatus;
  weightClass?: string;
  division?: string;
  equipment?: string;
  flight?: string;
  searchTerm?: string;
  orderBy?: 'registeredAt' | 'expectedWeight' | 'lastName' | 'weightClass';
  orderDirection?: 'asc' | 'desc';
  limit?: number;
}

// Bulk action results
export interface BulkActionResult {
  success: number;
  failed: number;
  errors: string[];
}

// Admin Registration Service
export class AdminRegistrationService {
  
  /**
   * Get user profile by user ID
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return {
          id: userId,
          firstName: userData.firstName || 'Unknown',
          lastName: userData.lastName || 'User',
          email: userData.email || '',
          phone: userData.phone,
          dateOfBirth: userData.dateOfBirth?.toDate?.()?.toISOString().split('T')[0] || userData.dateOfBirth,
          gender: userData.gender,
          federationMembership: userData.federationMembership ? {
            federation: userData.federationMembership.federation,
            membershipNumber: userData.federationMembership.membershipNumber,
            expirationDate: userData.federationMembership.expirationDate?.toDate?.() || new Date(userData.federationMembership.expirationDate)
          } : undefined,
          emergencyContact: userData.emergencyContact,
          profilePicture: userData.profilePicture,
          instagramHandle: userData.instagramHandle,
          coachInfo: userData.coachInfo
        };
      }
      
      return null;
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null; // Return null instead of throwing to handle missing users gracefully
    }
  }
  
  /**
   * Get multiple user profiles efficiently (batch fetch)
   */
  static async getUserProfiles(userIds: string[]): Promise<Record<string, UserProfile>> {
    const profiles: Record<string, UserProfile> = {};
    
    // Fetch all user profiles in parallel
    const profilePromises = userIds.map(async (userId) => {
      const profile = await this.getUserProfile(userId);
      if (profile) {
        profiles[userId] = profile;
      }
      return profile;
    });
    
    await Promise.all(profilePromises);
    return profiles;
  }

  /**
   * Get all registrations for a meet (admin view) - Updated to fetch user profiles
   */
  static async getMeetRegistrations(
    meetId: string, 
    options: AdminRegistrationQueryOptions = {}
  ): Promise<AdminRegistrationView[]> {
    try {
      const registrationsRef = collection(db, 'meets', meetId, 'registrations');
      
      let q = query(registrationsRef);
      
      // Add filters
      if (options.status) {
        q = query(q, where('registrationStatus', '==', options.status));
      }
      
      if (options.paymentStatus) {
        q = query(q, where('paymentStatus', '==', options.paymentStatus));
      }
      
      if (options.weightClass) {
        q = query(q, where('weightClass', '==', options.weightClass));
      }
      
      if (options.division) {
        q = query(q, where('division', '==', options.division));
      }
      
      if (options.equipment) {
        q = query(q, where('equipment', '==', options.equipment));
      }
      
      if (options.flight) {
        q = query(q, where('flight', '==', options.flight));
      }
      
      // Add ordering
      const orderField = options.orderBy || 'registeredAt';
      const orderDirection = options.orderDirection || 'desc';
      q = query(q, orderBy(orderField, orderDirection));
      
      // Add limit
      if (options.limit) {
        q = query(q, limit(options.limit));
      }
      
      const querySnapshot = await getDocs(q);
      const registrationData: any[] = [];
      const userIds: string[] = [];
      
      // First pass: collect registration data and user IDs
      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        registrationData.push(data);
        userIds.push(data.userId);
      });
      
      // Fetch all user profiles in batch
      const userProfiles = await this.getUserProfiles(userIds);
      
      // Second pass: combine registration data with user profiles
      const registrations: AdminRegistrationView[] = [];
      
      registrationData.forEach((data) => {
        const userProfile = userProfiles[data.userId];
        
        if (userProfile) {
          const registration = this.transformToAdminView(data, userProfile);
          
          // Apply search filter if provided (client-side filtering for complex searches)
          if (options.searchTerm) {
            const searchTerm = options.searchTerm.toLowerCase();
            const searchableText = [
              registration.athleteInfo.firstName,
              registration.athleteInfo.lastName,
              registration.athleteInfo.email,
              registration.athleteInfo.phone || '',
              registration.competitionInfo.weightClass,
              registration.competitionInfo.division,
              registration.competitionInfo.equipment,
              registration.coachInfo?.teamName || '',
              registration.notes || ''
            ].join(' ').toLowerCase();
            
            if (!searchableText.includes(searchTerm)) {
              return; // Skip this registration
            }
          }
          
          registrations.push(registration);
        } else {
          // Handle case where user profile is missing
          console.warn(`User profile not found for userId: ${data.userId}`);
          const registration = this.transformToAdminView(data, {
            id: data.userId,
            firstName: 'Unknown',
            lastName: 'User',
            email: 'No email on file',
            phone: 'No phone on file'
          } as UserProfile);
          registrations.push(registration);
        }
      });
      
      return registrations;
      
    } catch (error) {
      console.error('Error getting meet registrations:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Get detailed registration statistics for a meet
   */
  static async getMeetRegistrationStats(meetId: string): Promise<RegistrationStats> {
    try {
      const registrations = await this.getMeetRegistrations(meetId);
      
      const stats: RegistrationStats = {
        totalRegistrations: registrations.length,
        approvedRegistrations: registrations.filter(r => r.status === 'approved').length,
        pendingRegistrations: registrations.filter(r => r.status === 'pending').length,
        waitlistedRegistrations: registrations.filter(r => r.status === 'waitlisted').length,
        paidRegistrations: registrations.filter(r => r.paymentStatus === 'paid').length,
        totalRevenue: 0, // Will be calculated from meet data
        pendingRevenue: 0,
        averageWeight: 0,
        divisionBreakdown: {},
        weightClassBreakdown: {},
      };
      
      // Calculate breakdowns
      registrations.forEach(registration => {
        // Division breakdown
        stats.divisionBreakdown[registration.competitionInfo.division] = 
          (stats.divisionBreakdown[registration.competitionInfo.division] || 0) + 1;
        
        // Weight class breakdown
        stats.weightClassBreakdown[registration.competitionInfo.weightClass] = 
          (stats.weightClassBreakdown[registration.competitionInfo.weightClass] || 0) + 1;
      });
      
      // Calculate average expected weight
      if (registrations.length > 0) {
        const totalWeight = registrations.reduce((sum, r) => sum + r.competitionInfo.expectedWeight, 0);
        stats.averageWeight = totalWeight / registrations.length;
      }
      
      return stats;
      
    } catch (error) {
      console.error('Error getting registration stats:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Update registration status (approve, reject, etc.)
   */
  static async updateRegistrationStatus(
    meetId: string,
    registrationId: string,
    newStatus: RegistrationStatus,
    notes?: string
  ): Promise<void> {
    try {
      const registrationRef = doc(db, 'meets', meetId, 'registrations', registrationId);
      
      const updateData: any = {
        registrationStatus: newStatus,
        updatedAt: Timestamp.fromDate(new Date()),
      };
      
      if (notes) {
        updateData.notes = notes;
      }
      
      await updateDoc(registrationRef, updateData);
      
    } catch (error) {
      console.error('Error updating registration status:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Assign athlete to a flight
   */
  static async assignToFlight(
    meetId: string,
    registrationId: string,
    flight: string,
    platform?: number
  ): Promise<void> {
    try {
      const registrationRef = doc(db, 'meets', meetId, 'registrations', registrationId);
      
      const updateData: any = {
        flight,
        updatedAt: Timestamp.fromDate(new Date()),
      };
      
      if (platform) {
        updateData.platform = platform;
      }
      
      await updateDoc(registrationRef, updateData);
      
    } catch (error) {
      console.error('Error assigning to flight:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Record weigh-in results
   */
  static async recordWeighIn(
    meetId: string,
    registrationId: string,
    actualWeight: number,
    passed: boolean,
    notes?: string
  ): Promise<void> {
    try {
      const registrationRef = doc(db, 'meets', meetId, 'registrations', registrationId);
      
      const updateData: any = {
        actualWeight,
        weightInStatus: passed ? 'passed' : 'failed',
        updatedAt: Timestamp.fromDate(new Date()),
      };
      
      if (notes) {
        updateData.notes = (updateData.notes || '') + `\nWeigh-in: ${notes}`;
      }
      
      await updateDoc(registrationRef, updateData);
      
    } catch (error) {
      console.error('Error recording weigh-in:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Add notes to a registration
   */
  static async addNotes(
    meetId: string,
    registrationId: string,
    notes: string,
    appendToExisting: boolean = true
  ): Promise<void> {
    try {
      const registrationRef = doc(db, 'meets', meetId, 'registrations', registrationId);
      
      let updateData: any = {
        updatedAt: Timestamp.fromDate(new Date()),
      };
      
      if (appendToExisting) {
        // In a real implementation, you'd first fetch the existing notes
        // For now, we'll just set the notes directly
        updateData.notes = notes;
      } else {
        updateData.notes = notes;
      }
      
      await updateDoc(registrationRef, updateData);
      
    } catch (error) {
      console.error('Error adding notes:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Remove/withdraw a registration
   */
  static async removeRegistration(
    meetId: string,
    registrationId: string,
    reason: string
  ): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Update registration status to withdrawn
      const registrationRef = doc(db, 'meets', meetId, 'registrations', registrationId);
      batch.update(registrationRef, {
        registrationStatus: 'withdrawn',
        notes: `Removed by director: ${reason}`,
        updatedAt: Timestamp.fromDate(new Date()),
      });
      
      // Decrement meet registration count
      const meetRef = doc(db, 'meets', meetId);
      batch.update(meetRef, {
        registrations: increment(-1),
        updatedAt: Timestamp.fromDate(new Date()),
      });
      
      await batch.commit();
      
    } catch (error) {
      console.error('Error removing registration:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Bulk update registration statuses
   */
  static async bulkUpdateStatus(
    meetId: string,
    registrationIds: string[],
    newStatus: RegistrationStatus,
    notes?: string
  ): Promise<BulkActionResult> {
    const result: BulkActionResult = {
      success: 0,
      failed: 0,
      errors: []
    };
    
    try {
      const batch = writeBatch(db);
      const now = Timestamp.fromDate(new Date());
      
      for (const registrationId of registrationIds) {
        try {
          const registrationRef = doc(db, 'meets', meetId, 'registrations', registrationId);
          
          const updateData: any = {
            registrationStatus: newStatus,
            updatedAt: now,
          };
          
          if (notes) {
            updateData.notes = notes;
          }
          
          batch.update(registrationRef, updateData);
          result.success++;
          
        } catch (error) {
          result.failed++;
          result.errors.push(`Failed to update ${registrationId}: ${error}`);
        }
      }
      
      await batch.commit();
      
    } catch (error) {
      console.error('Error in bulk update:', error);
      result.errors.push(`Batch commit failed: ${error}`);
    }
    
    return result;
  }
  
  /**
   * Get registrations by flight for competition management
   */
  static async getRegistrationsByFlight(
    meetId: string,
    flight?: string
  ): Promise<Record<string, AdminRegistrationView[]>> {
    try {
      const allRegistrations = await this.getMeetRegistrations(meetId, {
        status: 'approved',
        orderBy: 'lastName'
      });
      
      const flightGroups: Record<string, AdminRegistrationView[]> = {};
      
      allRegistrations.forEach(registration => {
        const flightKey = registration.flight || 'unassigned';
        if (!flightGroups[flightKey]) {
          flightGroups[flightKey] = [];
        }
        flightGroups[flightKey].push(registration);
      });
      
      // If specific flight requested, return only that flight
      if (flight) {
        return { [flight]: flightGroups[flight] || [] };
      }
      
      return flightGroups;
      
    } catch (error) {
      console.error('Error getting registrations by flight:', error);
      throw handleFirebaseError(error);
    }
  }
  
  // Private helper methods
  
  /**
   * Transform Firebase registration data to admin view format (updated with user profile)
   */
  private static transformToAdminView(data: any, userProfile: UserProfile): AdminRegistrationView {
    return {
      id: data.id,
      userId: data.userId,
      meetId: data.meetId,
      athleteInfo: {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName, 
        email: userProfile.email,
        phone: userProfile.phone || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        gender: userProfile.gender || 'male',
        emergencyContact: userProfile.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        }
      },
      competitionInfo: {
        weightClass: data.weightClass,
        division: data.division,
        equipment: data.equipment,
        expectedWeight: data.expectedWeight || 0,
        estimatedTotal: data.personalRecords?.total,
        personalRecords: data.personalRecords,
        openingAttempts: data.openingAttempts
      },
      registrationDate: data.registeredAt?.toDate?.() || new Date(),
      status: data.registrationStatus || 'pending',
      paymentStatus: data.paymentStatus || 'unpaid',
      flight: data.flight,
      platform: data.platform,
      weightInStatus: data.weightInStatus,
      actualWeight: data.actualWeight,
      notes: data.notes,
      coachInfo: userProfile.coachInfo || data.coachInfo,
      federationMembership: userProfile.federationMembership || (data.federationMembership ? {
        ...data.federationMembership,
        expirationDate: data.federationMembership.expirationDate?.toDate?.() || new Date()
      } : undefined)
    };
  }
}