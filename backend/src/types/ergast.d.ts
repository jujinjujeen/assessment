interface MRData {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
}

export interface Season {
  season: string;
  url: string;
}

interface SeasonTable {
  Seasons: Season[];
}

interface MRDataSeasons extends MRData {
  SeasonTable: SeasonTable;
}

export interface SeasonsResponse {
  MRData: MRDataSeasons;
}

interface Location {
  lat: string;
  long: string;
  locality: string;
  country: string;
}

interface Circuit {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: Location;
}

interface Driver {
  driverId: string;
  permanentNumber: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

interface Constructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

interface FastestLapTime {
  time: string;
}

interface FastestLap {
  rank: string;
  lap: string;
  Time: FastestLapTime;
}

interface ResultTime {
  millis: string;
  time: string;
}

interface RaceResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: ResultTime;
  FastestLap?: FastestLap;
}

interface Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: Circuit;
  date: string;
  time: string;
  Results: RaceResult[];
}

interface RaceTable {
  position?: string;
  season: string;
  Races: Race[];
}

interface MRDataRaceResults extends MRData {
  RaceTable: RaceTable;
}

export interface RaceResultsResponse extends MRData {
  MRData: MRDataRaceResults;
}

interface DriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor[];
}

interface StandingsList {
  season: string;
  round: string;
  DriverStandings: DriverStanding[];
}

interface StandingsTable {
  driverStandings: string;
  season: string;
  round: string;
  StandingsLists: StandingsList[];
}

interface MRDataDriverStandings extends MRData {
  StandingsTable: StandingsTable;
}

export interface DriverStandingsResponse {
  MRData: MRDataDriverStandings;
}