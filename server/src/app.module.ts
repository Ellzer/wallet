import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    TransactionsModule,
    MongooseModule.forRoot('mongodb://localhost/transactions'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
