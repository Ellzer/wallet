import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { utils } from 'ethers';

@Injectable()
export class IsAddressPipe implements PipeTransform {
  transform(value: string): string {
    if (utils.isAddress(value)) {
      return value.toLowerCase();
    } else {
      throw new BadRequestException('Invalid address.');
    }
  }
}
