import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './schemas/transaction.schema';
import { IsAddressPipe } from './transactions.pipes';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() hash: string) {
    try {
      const createdTransaction = await this.transactionsService.create({
        hash,
      });
      this.transactionsService.subscribeTransaction(hash);
      return createdTransaction;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @Get(':address')
  async findAllByFrom(
    @Param('address', new IsAddressPipe()) address: string,
  ): Promise<Transaction[]> {
    return this.transactionsService.findAllByFrom(address);
  }
}
