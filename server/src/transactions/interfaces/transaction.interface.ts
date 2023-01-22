export enum Statuses {
  'completed',
  'pending',
  'rejected',
}

export type Status = keyof typeof Statuses;
