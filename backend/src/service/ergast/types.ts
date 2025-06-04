export type Driver = {
  driverId: string;
  givenName: string;
  familyName: string;
};

export type Result = {
  driverId: string;
  position: 1;
};

export type Race = {
  raceName: string;
  date: string;
  result: Result;
};

export type Season = {
  year: number;
  url: string;
  winner: Driver;
  races: Race[];
  drivers: Driver[];
};
