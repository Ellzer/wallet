import { IsAddressPipe } from './transactions.pipes';

describe('IsAddressPipe', () => {
  let pipe: IsAddressPipe;
  beforeEach(() => {
    pipe = new IsAddressPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return the value unchanged', async () => {
    const address = '0xb21090c8f6bac1ba614a3f529aae728ea92b6487';
    expect(await pipe.transform(address)).toBe(address);
  });

  it('should return an error when value is not valid', async () => {
    const address = '0x1234567890';
    try {
      await pipe.transform(address);
    } catch (err) {
      expect(err.message).toBe('Invalid address.');
    }
  });
});
