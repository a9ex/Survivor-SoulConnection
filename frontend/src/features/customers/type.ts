export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: string;
  description: string;
  phoneNumber: string;
  address: string;
  astrologicalSign: string;
  coachId: number;
  image: string;
}

export interface Encounter {
  date: string;
  rating: number;
  comment: string;
  source: string;
}

export interface Payment {
  date: string;
  paymentMethod: string;
  amount: number;
  comment: string;
}

export interface DetailedCustomer extends Customer {
  encounters: Encounter[];
  payments: Payment[];
}
