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

  @Prop({ lowercase: true })
  to: string;

  @Prop({ lowercase: true })
  from: string;

  @Prop()
  amount: string;

  @Prop()
  status: Statuses;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
