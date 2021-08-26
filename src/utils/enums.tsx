export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export enum HttpErrorCodes {
  NoError = 0,
  UnknownError = 1,
  BadRequestError = 2,
  AuthenticationFailed = 3,
  TokenExpired = 4,
  PermissionDenied = 5,
  DatabaseError = 6,
  ExternalConnectionError = 7,
  AutomaticPairingError = 8,
}

export enum ScreenTypes {
  Mobile,
  Desktop,
}

export enum UserRoles {
  Visitor = 'visitor',
  Admin = 'admin',
  Superuser = 'superuser',
}

export enum TournamentTypes {
  RoundRobin = 'round_robin',
  SwissPairing = 'swiss_pairing',
  Unidentified = 'unidentified',
}

export enum RoundTypes {
  Unidentified = 0,
  Automatic = 1,
  ManualNormal = 2,
  ManualSpecial = 3,
}

export enum SpecialConditionScores {
  Unidentified = 0,
  NotFinished = -1,
  Bye = -2,
}

export enum PlayerColor {
  Black = 1,
  White = 2,
}
