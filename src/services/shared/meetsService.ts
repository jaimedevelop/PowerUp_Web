// src/services/shared/meetsService.ts
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../../firebase';

const COLLECTIONS = {
  MEETS: 'meets',
} as const;

export interface PublicMeet {
  id: string;
  name: string;
  federation: string;
  date: string;
  location: {
    venue: string;
    city: string;
    state: string;
    address?: string;
  };
  entryFee: string;
  status: string;
  spotsLeft: number;
  statusColor: string;
  registrations: number;
  maxParticipants: number;
  earlyBirdFee?: number;
  earlyBirdDeadline?: string;
}

export interface FeaturedMeet {
  id: string;
  name: string;
  federation: string;
  date: string;
  location: string;
  status: string;
  description: string;
  image: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// Helper function to calculate date ranges
export const getDateRangeFromOption = (option: string): DateRange => {
  const now = new Date();
  const start = new Date(now);
  let end = new Date(now);

  switch (option) {
    case '30days':
      end.setDate(now.getDate() + 30);
      break;
    case '3months':
      end.setMonth(now.getMonth() + 3);
      break;
    case '6months':
      end.setMonth(now.getMonth() + 6);
      break;
    case '1year':
      end.setFullYear(now.getFullYear() + 1);
      break;
    default:
      end.setMonth(now.getMonth() + 3); // Default to 3 months
  }

  return { start, end };
};

// Helper function to format entry fee
const formatEntryFee = (registrationFee: number, earlyBirdFee?: number): string => {
  if (earlyBirdFee && earlyBirdFee < registrationFee) {
    return `$${registrationFee} ($${earlyBirdFee} early)`;
  }
  return `$${registrationFee}`;
};

// Helper function to determine status color
const getStatusColor = (status: string, spotsLeft: number): string => {
  switch (status) {
    case 'registration-open':
    case 'published':
      return spotsLeft > 20 ? 'text-green-400' : 'text-yellow-400';
    case 'registration-closed':
      return 'text-red-400';
    case 'draft':
      return 'text-gray-400';
    default:
      return 'text-slate-400';
  }
};

// Helper function to get status display text
const getStatusDisplayText = (status: string, spotsLeft: number): string => {
  switch (status) {
    case 'registration-open':
      return spotsLeft > 0 ? 'Registration Open' : 'Waitlist Available';
    case 'published':
      return 'Registration Open'; // Treat published as open for registration
    case 'registration-closed':
      return 'Registration Closed';
    case 'draft':
      return 'Draft';
    default:
      return 'Coming Soon';
  }
};

// Convert Firestore document to PublicMeet
const convertToPublicMeet = (doc: QueryDocumentSnapshot): PublicMeet => {
  const data = doc.data();
  const spotsLeft = Math.max(0, (data.maxParticipants || 0) - (data.registrations || 0));
  const status = getStatusDisplayText(data.status, spotsLeft);
  
  // Safe date conversion helper
  const safeToDate = (timestamp: any): string | undefined => {
    if (!timestamp) return undefined;
    try {
      if (typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toISOString().split('T')[0];
      }
      // Handle if it's already a Date object
      if (timestamp instanceof Date) {
        return timestamp.toISOString().split('T')[0];
      }
      // Handle if it's a string date
      if (typeof timestamp === 'string') {
        return new Date(timestamp).toISOString().split('T')[0];
      }
    } catch (error) {
      console.warn('Failed to convert date:', timestamp, error);
    }
    return undefined;
  };

  // Safe date display helper
  const safeDisplayDate = (timestamp: any): string => {
    if (!timestamp) return 'TBD';
    try {
      if (typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      // Handle if it's already a Date object
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      // Handle if it's a string date
      if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } catch (error) {
      console.warn('Failed to display date:', timestamp, error);
    }
    return 'TBD';
  };
  
  return {
    id: doc.id,
    name: data.name || 'Untitled Meet',
    federation: data.federation || 'Other',
    date: safeDisplayDate(data.date),
    location: {
      venue: data.location?.venue || 'TBD',
      city: data.location?.city || 'TBD',
      state: data.location?.state || 'TBD',
      address: data.location?.address,
    },
    entryFee: formatEntryFee(data.registrationFee || 0, data.earlyBirdFee),
    status,
    spotsLeft,
    statusColor: getStatusColor(data.status, spotsLeft),
    registrations: data.registrations || 0,
    maxParticipants: data.maxParticipants || 0,
    earlyBirdFee: data.earlyBirdFee,
    earlyBirdDeadline: safeToDate(data.earlyBirdDeadline),
  };
};

/**
 * Get published meets available for public registration
 * FIXED: Now correctly queries for 'published' status meets
 */
export const getPublishedMeets = async (limitCount: number = 50): Promise<PublicMeet[]> => {
  try {
    console.log('Fetching published meets...');
    
    // FIXED: Query for 'published' status specifically (not an array)
    const meetsQuery = query(
      collection(db, COLLECTIONS.MEETS),
      where('status', '==', 'published'), // Changed from 'in' array to single value
      orderBy('date', 'asc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(meetsQuery);
    const meets: PublicMeet[] = [];
    
    querySnapshot.forEach((doc) => {
      meets.push(convertToPublicMeet(doc));
    });
    
    console.log(`Retrieved ${meets.length} published meets`);
    return meets;
  } catch (error) {
    console.error('Error fetching published meets:', error);
    
    // FALLBACK: If the query fails, try getting all meets and filter client-side
    try {
      console.log('Falling back to client-side filtering...');
      const allMeetsQuery = query(
        collection(db, COLLECTIONS.MEETS),
        orderBy('date', 'asc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(allMeetsQuery);
      const meets: PublicMeet[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filter for published status on client side
        if (data.status === 'published') {
          meets.push(convertToPublicMeet(doc));
        }
      });
      
      console.log(`Fallback retrieved ${meets.length} published meets`);
      return meets;
    } catch (fallbackError) {
      console.error('Fallback query also failed:', fallbackError);
      throw new Error(`Failed to fetch competitions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

/**
 * Search meets by location (city, state, venue)
 */
export const searchMeetsByLocation = async (location: string): Promise<PublicMeet[]> => {
  try {
    console.log('Searching meets by location:', location);
    
    if (!location.trim()) {
      return await getPublishedMeets();
    }
    
    // Get all published meets and filter client-side
    const allMeets = await getPublishedMeets(100);
    
    const searchTerm = location.toLowerCase();
    const filteredMeets = allMeets.filter((meet) => {
      const searchString = `${meet.location.venue} ${meet.location.city} ${meet.location.state}`.toLowerCase();
      return searchString.includes(searchTerm);
    });
    
    console.log(`Found ${filteredMeets.length} meets matching location: ${location}`);
    return filteredMeets;
  } catch (error) {
    console.error('Error searching meets by location:', error);
    throw new Error(`Failed to search by location: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get meets by federation
 * FIXED: Now uses the corrected getPublishedMeets function
 */
export const getMeetsByFederation = async (federation: string): Promise<PublicMeet[]> => {
  try {
    console.log('Fetching meets by federation:', federation);
    
    if (federation === 'all') {
      return await getPublishedMeets();
    }
    
    // Get all published meets first, then filter by federation
    const publishedMeets = await getPublishedMeets(100);
    const filteredMeets = publishedMeets.filter(meet => 
      meet.federation.toLowerCase() === federation.toLowerCase()
    );
    
    console.log(`Retrieved ${filteredMeets.length} meets for federation: ${federation}`);
    return filteredMeets;
  } catch (error) {
    console.error('Error fetching meets by federation:', error);
    throw new Error(`Failed to filter by federation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get meets within a date range
 * FIXED: Now properly filters for published meets with date range
 */
export const getMeetsByDateRange = async (dateRange: DateRange): Promise<PublicMeet[]> => {
  try {
    console.log('Fetching meets by date range:', dateRange);
    
    const startTimestamp = Timestamp.fromDate(dateRange.start);
    const endTimestamp = Timestamp.fromDate(dateRange.end);
    
    // Try compound query first
    try {
      const meetsQuery = query(
        collection(db, COLLECTIONS.MEETS),
        where('status', '==', 'published'),
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp),
        orderBy('date', 'asc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(meetsQuery);
      const meets: PublicMeet[] = [];
      
      querySnapshot.forEach((doc) => {
        meets.push(convertToPublicMeet(doc));
      });
      
      console.log(`Retrieved ${meets.length} meets in date range`);
      return meets;
    } catch (compoundQueryError) {
      // Fallback to client-side filtering if compound query fails
      console.log('Compound query failed, using client-side filtering...');
      
      const publishedMeets = await getPublishedMeets(100);
      const filteredMeets = publishedMeets.filter(meet => {
        const meetDate = new Date(meet.date);
        return meetDate >= dateRange.start && meetDate <= dateRange.end;
      });
      
      console.log(`Fallback retrieved ${filteredMeets.length} meets in date range`);
      return filteredMeets;
    }
  } catch (error) {
    console.error('Error fetching meets by date range:', error);
    throw new Error(`Failed to filter by date range: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Search meets with multiple filters
 * FIXED: Now uses the corrected base functions
 */
export const searchMeetsWithFilters = async (
  location: string = '',
  federation: string = 'all',
  dateRange: string = '3months'
): Promise<PublicMeet[]> => {
  try {
    console.log('Searching meets with filters:', { location, federation, dateRange });
    
    // Start with date range filter
    const dateRangeObj = getDateRangeFromOption(dateRange);
    let meets = await getMeetsByDateRange(dateRangeObj);
    
    // Apply federation filter if not 'all'
    if (federation !== 'all') {
      meets = meets.filter(meet => 
        meet.federation.toLowerCase() === federation.toLowerCase()
      );
    }
    
    // Apply location filter if provided
    if (location.trim()) {
      const searchTerm = location.toLowerCase();
      meets = meets.filter(meet => {
        const searchString = `${meet.location.venue} ${meet.location.city} ${meet.location.state}`.toLowerCase();
        return searchString.includes(searchTerm);
      });
    }
    
    console.log(`Found ${meets.length} meets with applied filters`);
    return meets;
  } catch (error) {
    console.error('Error searching meets with filters:', error);
    throw new Error(`Failed to search competitions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get featured competitions (most recent published meets)
 * This was already working correctly
 */
export const getFeaturedMeets = async (limitCount: number = 4): Promise<FeaturedMeet[]> => {
  try {
    console.log('Fetching featured meets...');
    
    // This query was already correct - using 'published' status
    const meetsQuery = query(
      collection(db, COLLECTIONS.MEETS),
      where('status', '==', 'published'), // Changed from array to single value for consistency
      orderBy('date', 'asc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(meetsQuery);
    const meets: FeaturedMeet[] = [];
    
    // Predefined gradient backgrounds for featured meets
    const gradients = [
      'bg-gradient-to-r from-blue-600 to-purple-600',
      'bg-gradient-to-r from-red-600 to-orange-600',
      'bg-gradient-to-r from-green-600 to-teal-600',
      'bg-gradient-to-r from-purple-600 to-pink-600',
    ];
    
    querySnapshot.forEach((doc, index) => {
      const data = doc.data();
      const spotsLeft = Math.max(0, (data.maxParticipants || 0) - (data.registrations || 0));
      
      meets.push({
        id: doc.id,
        name: data.name || 'Untitled Meet',
        federation: data.federation || 'Other',
        date: data.date?.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) || 'TBD',
        location: `${data.location?.city || 'TBD'}, ${data.location?.state || 'TBD'}`,
        status: spotsLeft > 20 ? 'Featured' : 'Popular',
        description: `Premier powerlifting event in ${data.location?.state || 'your area'}`,
        image: gradients[index % gradients.length],
      });
    });
    
    console.log(`Retrieved ${meets.length} featured meets`);
    return meets;
  } catch (error) {
    console.error('Error fetching featured meets:', error);
    throw new Error(`Failed to fetch featured competitions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Get meets count by category for popular categories display
 * FIXED: Now uses the corrected getPublishedMeets function
 */
export const getMeetsCountByCategory = async () => {
  try {
    console.log('Fetching meets count by category...');
    
    const allMeets = await getPublishedMeets(100);
    
    // Count by different categories
    const localCount = allMeets.filter(meet => 
      meet.location.city.toLowerCase().includes('tampa') || 
      meet.location.state.toLowerCase() === 'florida'
    ).length;
    
    const usaplCount = allMeets.filter(meet => 
      meet.federation === 'USAPL'
    ).length;
    
    const beginnerCount = allMeets.filter(meet => 
      meet.spotsLeft > 50 // Assuming larger meets are more beginner-friendly
    ).length;
    
    return {
      local: localCount,
      usapl: usaplCount,
      beginner: beginnerCount,
    };
  } catch (error) {
    console.error('Error fetching category counts:', error);
    return {
      local: 0,
      usapl: 0,
      beginner: 0,
    };
  }
};