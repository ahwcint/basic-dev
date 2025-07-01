import { User } from "./user.type";

export type ConcertType = {
  id: string;
  active: boolean;
  name: string;
  description: string;
  totalSeats: number;
  createdAt: Date;
  auditLogConcerts: ConcertAuditLog[];
};

export enum ConcertAuditLogAction {
  RESERVE = "RESERVE",
  CANCEL = "CANCEL",
}

export type ConcertAuditLog = {
  id: string;
  action: ConcertAuditLogAction;
  concertId: string;
  concert: Pick<ConcertType, "name">;
  user: Pick<User, "username">;
  userId: string;
  createdAt: string;
};

export type SeatsInformation = {
  totalSeats: number;
  reserve: number;
  cancel: number;
};
