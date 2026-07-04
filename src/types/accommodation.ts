export interface Accommodation {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  images: string[];
  bedrooms: number;
  livingRooms: number;
  bathrooms: number;
  maxGuests: number;
  childrenCount: number;
  acceptsChildren: boolean;
  hasBabyBed: boolean;
  babyBedPrice?: number;
  surfaceArea: number;

  price?: number; // ✅ HERE

  amenities: {
    ac: boolean;
    heating: boolean;
    wifi: boolean;
    kitchen: boolean;
    washingMachine: boolean;
    tv: boolean;
    pool: boolean;
    jacuzzi: boolean;
    minibar: boolean;
    balcony: boolean;
    garden: boolean;
    terrace: boolean;
  };

  breakfastIncluded: boolean;
  parking: 'free' | 'paid' | 'none';
  parkingPrice?: number;

  languages: string[];
  smokingAllowed: boolean;
  eventsAllowed: boolean;
  petsAllowed: 'yes' | 'on_request' | 'no';

  openingHours: {
    start: string;
    end: string;
  };

  rooms: {
    type: string;
    beds: { type: string; quantity: number }[];
  }[];

  host: {
    name: string;
    avatar: string;
    isSuperhost: boolean;
    responseRate: number;
  };
}