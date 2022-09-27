import { Module } from '@nestjs/common';

import { GearEventListener } from './gear-event-listener';
import { MetadataModule } from '../metadata/metadata.module';
import { ProgramModule } from '../program/program.module';
import { MessageModule } from '../message/message.module';
import { CodeModule } from '../code/code.module';
import { ProducerModule } from '../producer/producer.module';


@Module({
  imports: [
    MetadataModule,
    ProgramModule,
    MessageModule,
    CodeModule,
    ProducerModule
  ],
  providers: [GearEventListener],
  exports: [GearEventListener],
})
export class GearModule {}
