import { RpcMethods } from 'shared/config';
import { rpcService } from 'shared/services/rpcService';
import { ProgramModel } from 'entities/program';

import { PaginationModel } from '../types';
import { FetchUserProgramsParams, ProgramPaginationModel } from './types';

const fetchAllPrograms = (params: PaginationModel) =>
  rpcService.callRPC<ProgramPaginationModel>(RpcMethods.GetAllPrograms, params);

const fetchUserPrograms = (params: FetchUserProgramsParams) =>
  rpcService.callRPC<ProgramPaginationModel>(RpcMethods.GetUserPrograms, params);

const fetchProgram = (id: string) => rpcService.callRPC<ProgramModel>(RpcMethods.GetProgram, { id });

export { fetchProgram, fetchUserPrograms, fetchAllPrograms };
