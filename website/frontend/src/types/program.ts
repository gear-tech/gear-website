import { Metadata, PayloadType } from '@gear-js/api';
import { AnyNumber } from '@polkadot/types/types';

export enum ProgramStatus {
  Success = 'success',
  Failed = 'failed',
  InProgress = 'in progress',
}

export interface ProgramModel {
  id: string;
  blockHash?: string;
  programNumber?: number;
  name?: string;
  owner: string;
  callCount?: number;
  timestamp: string;
  initStatus: ProgramStatus;
  title?: string;
  meta?: any;
}

export interface ProgramPaginationModel {
  count: number;
  programs: ProgramModel[];
}

export interface UploadProgramModel {
  initPayload: string;
  gasLimit: number;
  value: number;
  meta: Metadata;
  id?: string;
  title?: string;
  programName?: string;
}

interface MessageModel {
  gasLimit: AnyNumber;
  value: AnyNumber;
  payload: PayloadType;
}

export interface Message extends MessageModel {
  destination: string;
}

export interface Reply extends MessageModel {
  replyToId: string;
}

export interface ProgramsPagintaionModel {
  jsonrpc: string;
  id: string;
  result: ProgramPaginationModel;
}

export interface ProgramRPCModel {
  jsonrpc: string;
  id: string;
  result: ProgramModel;
}

export interface BalanceModel {
  value: number;
}

export interface SearchModel {
  query: string;
}

export interface ProgramState {
  program: ProgramModel | null;
  programs: ProgramModel[] | null;
  programsCount: number | null;

  allUploadedPrograms: ProgramModel[] | null;
  allUploadedProgramsCount: number | null;

  isProgramUploading: boolean;
  isMetaUploading: boolean;
  isMessageSending: boolean;

  programStatus: null | string;
  payloadType: null | string;

  gas: null | number;

  loading: boolean;
  error: null | string;
  programUploadingError: null | string;
  metaUploadingError: null | string;
  messageSendingError: null | string;
}
