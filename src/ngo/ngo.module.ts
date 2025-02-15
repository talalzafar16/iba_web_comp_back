import { Module } from '@nestjs/common';
import { NgoService } from './ngo.service';

@Module({
  providers: [NgoService]
})
export class NgoModule {}
