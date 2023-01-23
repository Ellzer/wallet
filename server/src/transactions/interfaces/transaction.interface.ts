export enum Statuses {
  'rejected',
  'completed',
  'pending',
}

export type Status = keyof typeof Statuses;
