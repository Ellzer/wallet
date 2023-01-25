import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Statuses } from '../interfaces/transaction.interface';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
})
export class Transaction {
  @Prop({ required: true, unique: true, lowercase: true })
  hash: string;

  @Prop({ required: true, lowercase: true })
  to: string;

  @Prop({ required: true, lowercase: true })
  from: string;

  @Prop({ required: true })
  amount: string;

  @Prop({ required: true, default: Statuses.pending })
  status: Statuses;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
