// src/firebase/database.js
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
} from 'firebase/firestore';
import { db } from './config.js';

// Collection references
const COLLECTIONS = {
  MEETS: 'meets',
  REGISTRATIONS: 'registrations',
  DIRECTORS: 'directors',
};

// Utility function to convert dates to Firestore Timestamps
const convertDatesToTimestamps = (data) => {
  const converted = { ...data };
  
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
  
  return converted;
};

// Utility function to convert Firestore Timestamps back to date strings
const convertTimestampsToStrings = (data) => {
  const converted = { ...data };
  
  if (converted.date?.toDate) {
    converted.date = converted.date.toDate().toISOString().split('T')[0];
  }
  if (converted.registrationDeadline?.toDate) {
    converted.registrationDeadline = converted.registrationDeadline.toDate().toISOString().split('T')[0];
  }
  if (converted.earlyBirdDeadline?.toDate) {
    converted.earlyBirdDeadline = converted.earlyBirdDeadline.toDate().toISOString().split('T')[0];
  }
  if (converted.createdAt?.toDate) {
    converted.createdAt = converted.createdAt.toDate();
  }
  if (converted.updatedAt?.toDate) {
    converted.updatedAt = converted.updatedAt.toDate();
  }
  
  return converted;
};


// MEET CRUD OPERATIONS

/**
 * Create a new meet
 * @param {Object} meetData - Meet data from the wizard
 * @returns {Promise<string>} - Document ID of the created meet
 */
export const createMeet = async (meetData) => {
  try {
    // Add temporary director ID until authentication is implemented
    const dataWithMetadata = {
      ...meetData,
      directorId: 'temp-director-id', // TODO: Replace with actual user ID when auth is implemented
      registrations: 0, // Initialize with 0 registrations
      revenue: 0, // Initialize with 0 revenue
    };
    
    const processedData = convertDatesToTimestamps(dataWithMetadata);
    const docRef = await addDoc(collection(db, COLLECTIONS.MEETS), processedData);
    
    console.log('Meet created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating meet:', error);
    throw new Error(`Failed to create meet: ${error.message}`);
  }
};

/**
 * Update an existing meet
 * @param {string} meetId - Meet document ID
 * @param {Object} updates - Updated meet data
 * @returns {Promise<void>}
 */
export const updateMeet = async (meetId, updates) => {
  try {
    const processedUpdates = convertDatesToTimestamps(updates);
    const meetRef = doc(db, COLLECTIONS.MEETS, meetId);
    await updateDoc(meetRef, processedUpdates);
    
    console.log('Meet updated successfully:', meetId);
  } catch (error) {
    console.error('Error updating meet:', error);
    throw new Error(`Failed to update meet: ${error.message}`);
  }
};

/**
 * Update meet registration count and revenue
 * @param {string} meetId - Meet document ID
 * @param {number} registrationCount - New registration count
 * @param {number} revenue - New revenue amount
 * @returns {Promise<void>}
 */
export const updateMeetStats = async (meetId, registrationCount, revenue) => {
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
    throw new Error(`Failed to update meet stats: ${error.message}`);
  }
};

/**
 * Get a single meet by ID
 * @param {string} meetId - Meet document ID
 * @returns {Promise<Object|null>} - Meet data or null if not found
 */
export const getMeetById = async (meetId) => {
  try {
    const meetRef = doc(db, COLLECTIONS.MEETS, meetId);
    const meetDoc = await getDoc(meetRef);
    
    if (meetDoc.exists()) {
      const data = { id: meetDoc.id, ...meetDoc.data() };
      return convertTimestampsToStrings(data);
    } else {
      console.log('Meet not found:', meetId);
      return null;
    }
  } catch (error) {
    console.error('Error getting meet:', error);
    throw new Error(`Failed to get meet: ${error.message}`);
  }
};

/**
 * Get all meets with optional filtering and pagination
 * @param {Object} options - Query options
 * @returns {Promise<Array>} - Array of meet documents
 */
export const getMeets = async (options = {}) => {
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
    const constraints = [];
    
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
    
    const meets = [];
    querySnapshot.forEach((doc) => {
      const data = { id: doc.id, ...doc.data() };
      meets.push(convertTimestampsToStrings(data));
    });
    
    console.log(`Retrieved ${meets.length} meets`);
    return meets;
  } catch (error) {
    console.error('Error getting meets:', error);
    throw new Error(`Failed to get meets: ${error.message}`);
  }
};

/**
 * Delete a meet
 * @param {string} meetId - Meet document ID
 * @returns {Promise<void>}
 */
export const deleteMeet = async (meetId) => {
  try {
    const meetRef = doc(db, COLLECTIONS.MEETS, meetId);
    await deleteDoc(meetRef);
    
    console.log('Meet deleted successfully:', meetId);
  } catch (error) {
    console.error('Error deleting meet:', error);
    throw new Error(`Failed to delete meet: ${error.message}`);
  }
};

/**
 * Get meets by status
 * @param {string} status - Meet status to filter by
 * @returns {Promise<Array>} - Array of meets with the specified status
 */
export const getMeetsByStatus = async (status) => {
  return getMeets({ status });
};

/**
 * Get upcoming meets (published and future dates)
 * @param {number} limitCount - Number of meets to return
 * @returns {Promise<Array>} - Array of upcoming meets
 */
export const getUpcomingMeets = async (limitCount = 10) => {
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
    const meets = [];
    
    querySnapshot.forEach((doc) => {
      const data = { id: doc.id, ...doc.data() };
      meets.push(convertTimestampsToStrings(data));
    });
    
    return meets;
  } catch (error) {
    console.error('Error getting upcoming meets:', error);
    throw new Error(`Failed to get upcoming meets: ${error.message}`);
  }
};

/**
 * Search meets by name or location
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} - Array of matching meets
 */
export const searchMeets = async (searchTerm) => {
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
    throw new Error(`Failed to search meets: ${error.message}`);
  }
};

// UTILITY FUNCTIONS

/**
 * Get meet statistics
 * @param {string} meetId - Meet document ID
 * @returns {Promise<Object>} - Meet statistics
 */
export const getMeetStats = async (meetId) => {
  try {
    const meet = await getMeetById(meetId);
    if (!meet) return null;
    
    const stats = {
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
    throw new Error(`Failed to get meet stats: ${error.message}`);
  }
};

/**
 * Calculate total statistics across all meets
 * @returns {Promise<Object>} - Overall statistics
 */
export const getAllMeetsStats = async () => {
  try {
    const meets = await getMeets();
    
    const stats = {
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
    throw new Error(`Failed to get overall stats: ${error.message}`);
  }
};

/**
 * Validate meet data before saving
 * @param {Object} meetData - Meet data to validate
 * @returns {Object} - Validation result
 */
export const validateMeetData = (meetData) => {
  const errors = [];
  const warnings = [];
  
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
  
  if (meetData.registrationFee < 0) {
    errors.push('Registration fee cannot be negative');
  }
  
  if (meetData.maxParticipants <= 0) {
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
  
  if (meetData.earlyBirdFee >= meetData.registrationFee) {
    warnings.push('Early bird fee should be less than regular registration fee');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};