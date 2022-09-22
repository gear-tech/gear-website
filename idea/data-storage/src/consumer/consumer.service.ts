import { Injectable } from '@nestjs/common';
import {
  AddMetaParams,
  AddMetaResult,
  AllMessagesResult,
  FindMessageParams,
  FindProgramParams,
  GetAllCodeParams,
  GetAllCodeResult,
  GetAllProgramsParams,
  GetAllProgramsResult,
  GetAllUserProgramsParams,
  GetCodeParams,
  GetMessagesParams,
  GetMetaParams,
  GetMetaResult,
  ICode,
  IMessage,
  ProgramDataResult,
} from '@gear-js/common';
import { Message } from 'kafkajs';

import { Result } from './types';
import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { MetadataService } from '../metadata/metadata.service';
import { FormResponse } from '../middleware/formResponse';
import { CodeService } from '../code/code.service';
import { kafkaEventMap } from '../common/kafka-event.map';
import { SERVICE_DATA } from '../common/service-data';

@Injectable()
export class ConsumerService {
  constructor(
    private programService: ProgramService,
    private messageService: MessageService,
    private metaService: MetadataService,
    private codeService: CodeService,
  ) {}

  @FormResponse
  async programData(params: FindProgramParams): Result<ProgramDataResult> {
    return await this.programService.findProgram(params);
  }

  @FormResponse
  async allPrograms(params: GetAllProgramsParams): Result<GetAllProgramsResult> {
    if (params.owner) {
      return await this.programService.getAllUserPrograms(params as GetAllUserProgramsParams);
    }
    return await this.programService.getAllPrograms(params);
  }

  @FormResponse
  async allUserPrograms(params: GetAllUserProgramsParams): Result<GetAllProgramsResult> {
    return await this.programService.getAllUserPrograms(params);
  }

  @FormResponse
  async addMeta(params: AddMetaParams): Result<AddMetaResult> {
    return await this.metaService.addMeta(params);
  }

  @FormResponse
  async getMeta(params: GetMetaParams): Result<GetMetaResult> {
    return await this.metaService.getMeta(params);
  }

  @FormResponse
  async allMessages(params: GetMessagesParams): Result<AllMessagesResult> {
    return await this.messageService.getAllMessages(params);
  }

  @FormResponse
  async message(params: FindMessageParams): Result<IMessage> {
    return await this.messageService.getMessage(params);
  }

  @FormResponse
  async allCode(params: GetAllCodeParams): Result<GetAllCodeResult> {
    return await this.codeService.getAllCode(params);
  }

  @FormResponse
  async code(params: GetCodeParams): Result<ICode> {
    return await this.codeService.getByIdAndGenesis(params);
  }

  @FormResponse
  async servicesPartition(): Result<string> {
    return SERVICE_DATA.partition;
  }

  async servicePartitionGet(params: Message): Result<void> {
    const correlationId = params.headers.kafka_correlationId.toString();
    const resultFromService = kafkaEventMap.get(correlationId);

    if (resultFromService) await resultFromService(JSON.parse(params.value.toString()));
    kafkaEventMap.delete(correlationId);
  }
}
