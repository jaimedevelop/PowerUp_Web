// Types used by both athletes and meet directors

export type Federation = 'USAPL' | 'USPA' | 'IPF' | 'Other';

export interface MeetLocation {
  venue: string;
  address: string;
  city: string;
  state: string;
}

// Meet interface for list display (matches MeetCard expectations)
export interface MeetListItem {
  id: string;
  name: string;
  date: string;
  location: MeetLocation; // Full location object
  registrations: number;
  maxParticipants: number;
  status: MeetStatus;
  revenue: number;
}

// Standard Data Sets
export interface WeightClassSet {
  men: string[];
  women: string[];
}