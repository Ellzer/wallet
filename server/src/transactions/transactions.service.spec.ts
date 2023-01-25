import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { Transaction } from './schemas/transaction.schema';
import { getModelToken } from '@nestjs/mongoose';
import { ethers } from 'ethers';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { getEthersToken } from 'nestjs-ethers';

const mockTransaction = {
  _id: '63d02bc686667a3d98acc4dd',
  hash: '0x123',
  to: '0x456',
  from: '0x789',
  amount: '1',
  status: 2,
  created: '2023-01-24T19:04:38.856Z',
  updated: '2023-01-24T19:04:51.588Z',
};

const mockGetTransactionResponse = {
  to: '0x456',
  from: '0x789',
  value: '1000000000000000000',
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionModel: Model<Transaction>;
  let provider: ethers.providers.InfuraProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getEthersToken(),
          useValue: {
            getTransaction: jest.fn(),
            once: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionModel = module.get(getModelToken(Transaction.name));
    provider = module.get(getEthersToken());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateTransactionDto = { hash: '0x123' };
    it('should create a new transaction', async () => {
      jest
        .spyOn(transactionModel, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockTransaction));
      jest
        .spyOn(provider, 'getTransaction')
        .mockResolvedValue(mockGetTransactionResponse as any);

      const newTransaction = await service.create(createDto);

      expect(provider.getTransaction).toBeCalledWith(createDto.hash);
      expect(transactionModel.create).toHaveBeenCalledWith({
        hash: createDto.hash,
        to: mockGetTransactionResponse.to,
        from: mockGetTransactionResponse.from,
        amount: '1.0',
      });
      expect(newTransaction).toEqual(mockTransaction);
    });

    it('should throw an error if getTransaction throws an error', async () => {
      const errorMessage = 'Invalid hash.';
      jest
        .spyOn(provider, 'getTransaction')
        .mockRejectedValue({ message: errorMessage });

      try {
        await service.create(createDto);
      } catch (error) {
        expect(error.message).toEqual(
          'Failed to create transaction: ' + errorMessage,
        );
      }
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a transaction', async () => {
      jest
        .spyOn(transactionModel, 'findOneAndUpdate')
        .mockResolvedValueOnce({ ...mockTransaction, status: 1 });

      jest.spyOn(transactionModel, 'findOneAndUpdate').mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValueOnce({ ...mockTransaction, status: 1 }),
      } as any);

      const hash = '0x123';
      const status = 1;
      const updatedTransaction = await service.updateStatus(hash, status);

      expect(updatedTransaction).toEqual({ ...mockTransaction, status: 1 });
      expect(transactionModel.findOneAndUpdate).toHaveBeenCalledWith(
        { hash },
        { status },
        { new: true },
      );
    });
  });

  describe('findAllByFrom', () => {
    it('should return all transactions from a specific address', async () => {
      jest.spyOn(transactionModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([mockTransaction]),
      } as any);

      const transactions = await service.findAllByFrom('0x789');
      expect(transactionModel.find).toHaveBeenCalledWith({ from: '0x789' });
      expect(transactions).toEqual([mockTransaction]);
    });
  });

  describe('subscribeTransaction', () => {
    it('should subscribe to a transaction and update its status', async () => {
      const receipt = { status: 1 };

      jest
        .spyOn(provider, 'once')
        .mockImplementationOnce(jest.fn((hash, cb) => cb(receipt)) as any);

      await service.subscribeTransaction('0x123');
      expect(provider.once).toHaveBeenCalledWith('0x123', expect.any(Function));
      expect(transactionModel.findOneAndUpdate).toHaveBeenCalledWith(
        { hash: '0x123' },
        { status: 1 },
        { new: true },
      );
    });
  });
});
