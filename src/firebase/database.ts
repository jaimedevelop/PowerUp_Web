// src/firebase/database.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  WhereFilterOp,
  OrderByDirection,
} from 'firebase/firestore';
import { db } from './config';

// Collection references
const COLLECTIONS = {
  MEETS: 'meets',
  REGISTRATIONS: 'registrations',
  DIRECTORS: 'directors',
} as const;

// Type definitions
export interface MeetLocation {
  venue: string;
  address?: string;
  city: string;
  state: string;
}

export interface BaseMeetData {
  name: string;
  date: string; // ISO date string for input
  location: MeetLocation;
  federation: 'USAPL' | 'USPA' | 'IPF' | 'Other';
  weightClasses: string[];
  divisions: string[];
  equipment: string[];
  registrationDeadline: string; // ISO date string for input
  earlyBirdDeadline?: string; // ISO date string for input
  registrationFee: number;
  earlyBirdFee?: number;
  maxParticipants: number;
  status: 'draft' | 'published' | 'registration-open' | 'registration-closed' | 'in-progress' | 'completed';
  directorId?: string;
  registrations?: number;
  revenue?: number;
}

export interface FirestoreMeetData {
  name: string;
  date: Timestamp;
  location: MeetLocation;
  federation: 'USAPL' | 'USPA' | 'IPF' | 'Other';
  weightClasses: string[];
  divisions: string[];
  equipment: string[];
  registrationDeadline: Timestamp;
  earlyBirdDeadline?: Timestamp;
  registrationFee: number;
  earlyBirdFee?: number;
  maxParticipants: number;
  status: 'draft' | 'published' | 'registration-open' | 'registration-closed' | 'in-progress' | 'completed';
  directorId: string;
  registrations: number;
  revenue: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MeetData extends BaseMeetData {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MeetQueryOptions {
  status?: string;
  federation?: string;
  limit?: number;
  startAfterDoc?: QueryDocumentSnapshot;
  orderByField?: string;
  orderDirection?: OrderByDirection;
}

export interface MeetStats {
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  totalRevenue: number;
  availableSpots: number;
  registrationProgress: number;
  estimatedMaxRevenue: number;
}

export interface OverallStats {
  totalMeets: number;
  totalRegistrations: number;
  totalRevenue: number;
  registrationOpenCount: number;
  publishedCount: number;
  draftCount: number;
  completedCount: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Utility function to convert dates to Firestore Timestamps
const convertDatesToTimestamps = (data: BaseMeetData): FirestoreMeetData => {
  const converted: Partial<FirestoreMeetData> = { ...data };
  
  // Convert date strings to Timestamps
  if (converted.date) {
    converted.date = Timestamp.fromDate(new Date(converted.date));
  }
  if (converted.registrationDeadline) {
    converted.registrationDeadline = Timestamp.fromDate(new Date(converted.registrationDeadline));
  }
  if (converted.earlyBirdDeadline) {
    converted.earlyBirdDeadline = Timestamp.fromDate(new Date(converted.earlyBirdDeadline));
  }
  
  // Add system timestamps
  const now = Timestamp.now();
  if (!converted.createdAt) {
    converted.createdAt = now;
  }
  converted.updatedAt = now;
  
  // Initialize registrations and revenue if not provided
  if (converted.registrations === undefined) {
    converted.registrations = 0;
  }
  if (converted.revenue === undefined) {
    converted.revenue = 0;
  }

  // Set default director ID if not provided
  if (!converted.directorId) {
    converted.directorId = 'temp-director-id';
  }
  
  return converted as FirestoreMeetData;
};

// Utility function to convert Firestore Timestamps back to date strings
const convertTimestampsToStrings = (data: FirestoreMeetData & { id: string }): MeetData => {
  const converted: Partial<MeetData> = { ...data };
  
  if (data.date?.toDate) {
    converted.date = data.date.toDate().toISOString().split('T')[0];
  }
  if (data.registrationDeadline?.toDate) {
    converted.registrationDeadline = data.registrationDeadline.toDate().toISOString().split('T')[0];
  }
  if (data.earlyBirdDeadline?.toDate) {
    converted.earlyBirdDeadline = data.earlyBirdDeadline.toDate().toISOString().split('T')[0];
  }
  if (data.createdAt?.toDate) {
    converted.createdAt = data.createdAt.toDate();
  }
  if (data.updatedAt?.toDate) {
    converted.updatedAt = data.updatedAt.toDate();
  }
  
  return converted as MeetData;
};

// MEET CRUD OPERATIONS

/**
 * Create a new meet - DEBUG VERSION
 * @param meetData - Meet data from the wizard
 * @returns Document ID of the created meet
 */
export const createMeet = async (meetData: BaseMeetData): Promise<string> => {
  try {
    console.log('=== DEBUG: createMeet called ===');
    console.log('1. Original meetData status:', meetData.status);
    console.log('1. Full original meetData:', meetData);
    
    // Add temporary director ID until authentication is implemented
    const dataWithMetadata: BaseMeetData = {
      ...meetData,
      directorId: meetData.directorId || 'temp-director-id',
      registrations: 0,
      revenue: 0,
    };
    
    console.log('2. After adding metadata, status:', dataWithMetadata.status);
    console.log('2. Full dataWithMetadata:', dataWithMetadata);
    
    const processedData = convertDatesToTimestamps(dataWithMetadata);
    
    console.log('3. After convertDatesToTimestamps, status:', processedData.status);
    console.log('3. Full processedData:', processedData);
    
    const docRef = await addDoc(collection(db, COLLECTIONS.MEETS), processedData);
    
    console.log('4. Meet created with ID:', docRef.id);
    console.log('=== END DEBUG ===');
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating meet:', error);
    throw new Error(`Failed to create meet: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update an existing meet
 * @param meetId - Meet document ID
 * @param updates - Updated meet data
 */
export const updateMeet = async (meetId: string, updates: Partial<BaseMeetData>): Promise<void> => {
  try {
    const processedUpdates = convertDatesToTimestamps(updates as BaseMeetData);
    const meetRef = doc(db, COLLECTIONS.MEETS, meetId);
    await updateDoc(meetRef, processedUpdates as Partial<FirestoreMeetData>);
    
    console.log('Meet updated successfully:', meetId);
  } catch (error) {
    console.error('Error updating meet:', error);
    throw new Error(`Failed to update meet: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Update meet registration count and revenue
 * @param meetId - Meet document ID
 * @param registrationCount - New registration count
 * @param revenue - New revenue amount
 */
export const updateMeetStats = async (
  meetId: string, 
  registrationCount: number, 
  revenue: number
): Promise<void> => {
  try {
    const meetRef = doc(db, COLLECTIONS.MEETS, meetId);
    await updateDoc(meetRef, {
      registrations: registrationCount,
      revenue: revenue,
      updatedAt: Timestamp.now(),
    });
    
    console.log('Meet stats updated successfully:', meetId);
  } catch (error) {
    console.error('Error updating meet stats:', error);
    throw new Error(`Failed to update meet stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get a single meet by ID
 * @param meetId - Meet document ID
 * @returns Meet data or null if not found
 */
export const getMeetById = async (meetId: string): Promise<MeetData | null> => {
  try {
    const meetRef = doc(db, COLLECTIONS.MEETS, meetId);
    const meetDoc = await getDoc(meetRef);
    
    if (meetDoc.exists()) {
      const data = { id: meetDoc.id, ...meetDoc.data() } as FirestoreMeetData & { id: string };
      return convertTimestampsToStrings(data);
    } else {
      console.log('Meet not found:', meetId);
      return null;
    }
  } catch (error) {
    console.error('Error getting meet:', error);
    throw new Error(`Failed to get meet: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get all meets with optional filtering and pagination
 * @param options - Query options
 * @returns Array of meet documents
 */
export const getMeets = async (options: MeetQueryOptions = {}): Promise<MeetData[]> => {
  try {
    const {
      status = null,
      federation = null,
      limit: queryLimit = 50,
      startAfterDoc = null,
      orderByField = 'updatedAt',
      orderDirection = 'desc',
    } = options;
    
    let meetQuery = collection(db, COLLECTIONS.MEETS);
    
    // Build query with filters
    const constraints: any[] = [];
    
    if (status) {
      constraints.push(where('status', '==', status));
    }
    
    if (federation) {
      constraints.push(where('federation', '==', federation));
    }
    
    // Add ordering
    constraints.push(orderBy(orderByField, orderDirection));
    
    // Add pagination
    if (queryLimit) {
      constraints.push(limit(queryLimit));
    }
    
    if (startAfterDoc) {
      constraints.push(startAfter(startAfterDoc));
    }
    
    // Execute query
    meetQuery = query(meetQuery, ...constraints);
    const querySnapshot = await getDocs(meetQuery);
    
    const meets: MeetData[] = [];
    querySnapshot.forEach((doc) => {
      const data = { id: doc.id, ...doc.data() } as FirestoreMeetData & { id: string };
      meets.push(convertTimestampsToStrings(data));
    });
    
    console.log(`Retrieved ${meets.length} meets`);
    return meets;
  } catch (error) {
    console.error('Error getting meets:', error);
    throw new Error(`Failed to get meets: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Delete a meet
 * @param meetId - Meet document ID
 */
export const deleteMeet = async (meetId: string): Promise<void> => {
  try {
    const meetRef = doc(db, COLLECTIONS.MEETS, meetId);
    await deleteDoc(meetRef);
    
    console.log('Meet deleted successfully:', meetId);
  } catch (error) {
    console.error('Error deleting meet:', error);
    throw new Error(`Failed to delete meet: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get meets by status
 * @param status - Meet status to filter by
 * @returns Array of meets with the specified status
 */
export const getMeetsByStatus = async (status: string): Promise<MeetData[]> => {
  return getMeets({ status });
};

/**
 * Get upcoming meets (published and future dates)
 * @param limitCount - Number of meets to return
 * @returns Array of upcoming meets
 */
export const getUpcomingMeets = async (limitCount: number = 10): Promise<MeetData[]> => {
  try {
    const today = Timestamp.fromDate(new Date());
    
    const meetQuery = query(
      collection(db, COLLECTIONS.MEETS),
      where('status', 'in', ['published', 'registration-open']),
      where('date', '>=', today),
      orderBy('date', 'asc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(meetQuery);
    const meets: MeetData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = { id: doc.id, ...doc.data() } as FirestoreMeetData & { id: string };
      meets.push(convertTimestampsToStrings(data));
    });
    
    return meets;
  } catch (error) {
    console.error('Error getting upcoming meets:', error);
    throw new Error(`Failed to get upcoming meets: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Search meets by name or location
 * @param searchTerm - Search term
 * @returns Array of matching meets
 */
export const searchMeets = async (searchTerm: string): Promise<MeetData[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation - consider using Algolia or similar for advanced search
    const meets = await getMeets({ status: 'published' });
    
    const searchResults = meets.filter((meet) => {
      const searchString = `${meet.name} ${meet.location.city} ${meet.location.state} ${meet.location.venue}`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    });
    
    return searchResults;
  } catch (error) {
    console.error('Error searching meets:', error);
    throw new Error(`Failed to search meets: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// UTILITY FUNCTIONS

/**
 * Get meet statistics
 * @param meetId - Meet document ID
 * @returns Meet statistics
 */
export const getMeetStats = async (meetId: string): Promise<MeetStats | null> => {
  try {
    const meet = await getMeetById(meetId);
    if (!meet) return null;
    
    const stats: MeetStats = {
      totalRegistrations: meet.registrations || 0,
      pendingRegistrations: 0, // TODO: Calculate from registrations collection when built
      approvedRegistrations: meet.registrations || 0,
      totalRevenue: meet.revenue || 0,
      availableSpots: meet.maxParticipants - (meet.registrations || 0),
      registrationProgress: ((meet.registrations || 0) / meet.maxParticipants) * 100,
      estimatedMaxRevenue: meet.maxParticipants * meet.registrationFee,
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting meet stats:', error);
    throw new Error(`Failed to get meet stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Calculate total statistics across all meets
 * @returns Overall statistics
 */
export const getAllMeetsStats = async (): Promise<OverallStats> => {
  try {
    const meets = await getMeets();
    
    const stats: OverallStats = {
      totalMeets: meets.length,
      totalRegistrations: meets.reduce((sum, meet) => sum + (meet.registrations || 0), 0),
      totalRevenue: meets.reduce((sum, meet) => sum + (meet.revenue || 0), 0),
      registrationOpenCount: meets.filter(m => m.status === 'registration-open').length,
      publishedCount: meets.filter(m => m.status === 'published').length,
      draftCount: meets.filter(m => m.status === 'draft').length,
      completedCount: meets.filter(m => m.status === 'completed').length,
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting overall stats:', error);
    throw new Error(`Failed to get overall stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Validate meet data before saving
 * @param meetData - Meet data to validate
 * @returns Validation result
 */
export const validateMeetData = (meetData: Partial<BaseMeetData>): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields validation
  if (!meetData.name?.trim()) {
    errors.push('Meet name is required');
  }
  
  if (!meetData.date) {
    errors.push('Meet date is required');
  }
  
  if (!meetData.location?.venue?.trim()) {
    errors.push('Venue name is required');
  }
  
  if (!meetData.location?.city?.trim()) {
    errors.push('City is required');
  }
  
  if (!meetData.location?.state?.trim()) {
    errors.push('State is required');
  }
  
  if (!meetData.federation) {
    errors.push('Federation is required');
  }
  
  if (!meetData.weightClasses?.length) {
    errors.push('At least one weight class is required');
  }
  
  if (!meetData.divisions?.length) {
    errors.push('At least one division is required');
  }
  
  if (!meetData.equipment?.length) {
    errors.push('At least one equipment category is required');
  }
  
  if (!meetData.registrationDeadline) {
    errors.push('Registration deadline is required');
  }
  
  if (meetData.registrationFee !== undefined && meetData.registrationFee < 0) {
    errors.push('Registration fee cannot be negative');
  }
  
  if (meetData.maxParticipants !== undefined && meetData.maxParticipants <= 0) {
    errors.push('Max participants must be greater than 0');
  }
  
  // Date validation
  if (meetData.date && meetData.registrationDeadline) {
    const meetDate = new Date(meetData.date);
    const regDeadline = new Date(meetData.registrationDeadline);
    
    if (regDeadline >= meetDate) {
      errors.push('Registration deadline must be before the meet date');
    }
  }
  
  // Early bird validation
  if (meetData.earlyBirdDeadline && !meetData.earlyBirdFee) {
    warnings.push('Early bird deadline set but no early bird fee specified');
  }
  
  if (meetData.earlyBirdFee && !meetData.earlyBirdDeadline) {
    warnings.push('Early bird fee set but no early bird deadline specified');
  }
  
  if (meetData.earlyBirdFee && meetData.registrationFee && meetData.earlyBirdFee >= meetData.registrationFee) {
    warnings.push('Early bird fee should be less than regular registration fee');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};