import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const createdTransaction = new this.transactionModel({
      ...createTransactionDto,
      status: 'pending',
    });
    return await createdTransaction.save();
  }

  async findAll(): Promise<Transaction[]> {
    return await this.transactionModel.find().exec();
  }

  async find(
    transactionFilterQuery: FilterQuery<Transaction>,
  ): Promise<Transaction[]> {
    return await this.transactionModel.find(transactionFilterQuery).exec();
  }

  async findOne(
    transactionFilterQuery: FilterQuery<Transaction>,
  ): Promise<Transaction> {
    return await this.transactionModel.findOne(transactionFilterQuery).exec();
  }

  async findOneById(id: string): Promise<Transaction> {
    return this.transactionModel.findById(id).exec();
  }

  // async findOneAndUpdate(
  //   transactionFilterQuery: FilterQuery<Transaction>,
  //   updateTransactionDto: UpdateTransactionDto,
  // ): Promise<TransactionDocument> {
  //   return await this.transactionModel.findOneAndUpdate(
  //     transactionFilterQuery,
  //     updateTransactionDto,
  //   );
  // }

  // async update(
  //   id: string,
  //   updateTransactionDto: UpdateTransactionDto,
  // ): Promise<TransactionDocument> {
  //   return await this.transactionModel.findByIdAndUpdate(id, updateTransactionDto);
  // }

  // async remove(id: string) {
  //   return this.transactionModel.findByIdAndRemove(id);
  // }
}
