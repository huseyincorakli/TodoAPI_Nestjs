

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ClampIntPipe implements PipeTransform {
  constructor(){}
  transform(value: any) {
    const val = parseInt(value,10)

    if (isNaN(val)) throw new BadRequestException('Value must be a number');

    if(val<=0) throw  new BadRequestException('The minimum value must be 1 or greater than 1.');

    if(val>=Number.MAX_SAFE_INTEGER) throw  new BadRequestException('Value is to large');


    return val;
  }
}
