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

  // @Prop({ required: true, lowercase: true })
  @Prop({ lowercase: true })
  to: string;

  // @Prop({ required: true, lowercase: true })
  @Prop({ lowercase: true })
  from: string;

  // @Prop({ required: true })
  @Prop()
  amount: string;

  @Prop({ required: true })
  status: Status;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
