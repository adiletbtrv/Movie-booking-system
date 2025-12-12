
export enum Role {
  USER = 'ROLE_USER',
  ADMIN = 'ROLE_ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  durationMin: number;
  genres: string[];
  director: string;
  releaseDate: string;
}

export interface Screening {
  id: string;
  movieId: string;
  cinemaId: string;
  hallId: string;
  startTime: string; 
  price: number;
  type: '2D' | '3D' | 'IMAX';
}

export enum SeatStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  SELECTED = 'selected',
  VIP = 'vip',
  LOCKED = 'locked'
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  rowIndex: number;
  seatIndex: number;
  status: SeatStatus;
  priceModifier: number;
}

export interface BookedTicket {
  rowIndex: number;
  seatIndex: number;
}

export interface Hall {
  id: string;
  name: string;
  rows: number;
  cols: number;
}

export interface Ticket {
  id: string;
  movieTitle: string;
  startTime: string;
  hallName: string;
  row: string;
  number: number;
  price: number;
  status: string;
}

export interface AdminStats {
  totalRevenue: number;
  ticketsSold: number;
  moviesCount: number;
}
