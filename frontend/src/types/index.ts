export type Role = 'USER' | 'ORGANIZER' | 'REFEREE' | 'ADMIN';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  status: 'ACTIVE' | 'LOCKED';
  roles: Role[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Match {
  id: number;
  tournamentId?: number;
  groupId?: number | null;
  matchDate: string;
  stage: 'GROUP' | 'KNOCKOUT';
  round: string;
  status: string;
  homeScore?: number;
  awayScore?: number;
  homeTeam?: { id: number; name: string; shortName: string };
  awayTeam?: { id: number; name: string; shortName: string };
  winnerTeam?: { id: number; name: string; shortName: string };
  stadium?: { id: number; name: string; city: string };
}

export interface Tournament {
  id: number;
  name: string;
  season: string;
  hostCountry?: string;
  startDate: string;
  endDate: string;
  status: string;
  format: string;
}

export interface Group {
  id: number;
  name: string;
  orderNo?: number;
}

export interface Team {
  id: number;
  tournamentId?: number;
  groupId?: number;
  name: string;
  shortName: string;
  countryCode?: string;
  coachName?: string;
  logoUrl?: string;
  group?: Group;
  tournament?: Tournament;
}

export interface Player {
  id: number;
  teamId: number;
  fullName: string;
  shirtNumber?: number;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  birthDate?: string;
  nationality?: string;
  team?: Pick<Team, 'id' | 'name' | 'shortName'>;
}

export interface StandingRow {
  id: number;
  tournamentId: number;
  groupId: number;
  teamId: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  rank: number;
  team?: Pick<Team, 'id' | 'name' | 'shortName'>;
  group?: Pick<Group, 'id' | 'name'>;
}

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  type: 'NEWS' | 'ANNOUNCEMENT';
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt?: string;
}
