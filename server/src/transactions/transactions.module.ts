import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { EthersModule, SEPOLIA_NETWORK } from 'nestjs-ethers';

const infuraAPIKey = '92354089326049f5b3b4d635be42b27f';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    EthersModule.forRoot({
      network: SEPOLIA_NETWORK,
      infura: infuraAPIKey,
      useDefaultProvider: false,
    }),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
