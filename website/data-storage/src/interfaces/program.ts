import { Meta } from '.';
import { RequestParams } from './general';

export enum InitStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PROGRESS = 'in progress',
}

export interface Program {
  id: string;
  chain: string;
  genesis: string;
  owner: string;
  uploadedAt: Date;
  name?: string;
  meta?: Meta;
  title?: string;
  initStatus: InitStatus;
}

export interface GetAllProgramsParams extends RequestParams {
  publicKeyRaw?: string;
  owner?: string;
  limit?: number;
  offset?: number;
}

export interface GetAllProgramsResult {
  programs: Program[];
  count: number;
}

export interface FindProgramParams extends RequestParams {
  id: string;
  owner?: string;
}
