import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ethers } from 'ethers';
import { Statuses } from './interfaces/transaction.interface';
import { InjectEthersProvider } from 'nestjs-ethers';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    @InjectEthersProvider()
    private readonly provider: ethers.providers.InfuraProvider,
  ) {}

  async create({ hash }: CreateTransactionDto): Promise<Transaction> {
    try {
      const tx = await this.provider.getTransaction(hash);
      const createdTransaction = await this.transactionModel.create({
        hash,
        to: tx.to,
        from: tx.from,
        amount: ethers.utils.formatEther(tx.value),
      });
      return createdTransaction;
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  async updateStatus(hash: string, status: Statuses): Promise<Transaction> {
    try {
      const updatedTransaction = await this.transactionModel.findOneAndUpdate(
        { hash },
        { status },
        {
          new: true,
        },
      );
      return updatedTransaction;
    } catch (error) {
      throw new Error(`Failed to update transaction: ${error.message}`);
    }
  }

  async findAllByFrom(address: string): Promise<Transaction[]> {
    return await this.transactionModel.find({ from: address }).exec();
  }

  async subscribeTransaction(hash: string) {
    this.provider.once(hash, async (receipt) => {
      await this.updateStatus(hash, receipt.status);
    });
  }
}
