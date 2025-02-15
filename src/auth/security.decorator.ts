import { SetMetadata } from '@nestjs/common';

export const SECURITY_LEVEL_KEY= 'securoty_level';
export enum SecurityLevel{
  LOW = 'flexible',
}

export const SecurityLevelDec = (lvl: SecurityLevel) => SetMetadata(SECURITY_LEVEL_KEY, lvl);
