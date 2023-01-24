import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ethers } from 'ethers';
import { Statuses } from './interfaces/transaction.interface';

const infuraAPIKey = '92354089326049f5b3b4d635be42b27f';
const networkName = 'goerli';

@Injectable()
export class TransactionsService {
  private provider: ethers.providers.InfuraProvider;

  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {
    this.provider = new ethers.providers.InfuraProvider(
      networkName,
      infuraAPIKey,
    );
  }

  async create({ hash }: CreateTransactionDto): Promise<Transaction> {
    try {
      const tx = await this.provider.getTransaction(hash);
      const createdTransaction = new this.transactionModel({
        hash,
        to: tx.to,
        from: tx.from,
        amount: ethers.utils.formatEther(tx.value),
        status: Statuses.pending,
      });
      return await createdTransaction.save();
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  async updateStatus(hash: string, status: Statuses): Promise<Transaction> {
    return await this.transactionModel.findOneAndUpdate(
      { hash },
      { status },
      {
        new: true,
      },
    );
  }

  // async findAll(): Promise<Transaction[]> {
  //   return await this.transactionModel.find().exec();
  // }

  async findAllByFrom(address: string): Promise<Transaction[]> {
    return await this.transactionModel.find({ from: address }).exec();
  }

  async subscribeTransaction(hash: string) {
    this.provider.once(hash, async (receipt) => {
      await this.updateStatus(hash, receipt.status);
    });
  }
}
