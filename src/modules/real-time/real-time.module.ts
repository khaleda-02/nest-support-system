import { Module } from '@nestjs/common';
import { Gateway } from './real-time.gateway';

@Module({
  providers: [Gateway],
  exports: [Gateway],
})
export class RealTimeModule {}
