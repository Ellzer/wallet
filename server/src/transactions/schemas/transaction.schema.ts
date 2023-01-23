import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Status } from '../interfaces/transaction.interface';

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
  status: Status;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
