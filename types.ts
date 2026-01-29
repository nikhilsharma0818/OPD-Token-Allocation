export enum PatientType {
  EMERGENCY = 'EMERGENCY',
  PAID_PRIORITY = 'PAID_PRIORITY',
  FOLLOW_UP = 'FOLLOW_UP',
  ONLINE = 'ONLINE',
  WALK_IN = 'WALK_IN'
}

export const PriorityMap: Record<PatientType, number> = {
  [PatientType.EMERGENCY]: 0,
  [PatientType.PAID_PRIORITY]: 1,
  [PatientType.FOLLOW_UP]: 2,
  [PatientType.ONLINE]: 3,
  [PatientType.WALK_IN]: 4
};

export enum TokenStatus {
  BOOKED = 'BOOKED',
  CHECKED_IN = 'CHECKED_IN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export interface Patient {
  id: string;
  name: string;
  type: PatientType;
}

export interface Token {
  id: string;
  tokenId: number;
  patient: Patient;
  status: TokenStatus;
  slotId: string;
  bookedAt: number;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  tokens: Token[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  slots: TimeSlot[];
}