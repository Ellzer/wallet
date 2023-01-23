import { PartialType } from '@nestjs/mapped-types';
import { Status } from '../interfaces/transaction.interface';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  readonly to: string;
  readonly from: string;
  readonly amount: string;
  readonly status: Status;
}
