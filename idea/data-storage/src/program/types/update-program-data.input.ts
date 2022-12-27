import { Meta } from '../../database/entities';

export interface UpdateProgramDataInput {
  id: string;
  genesis: string;
  name?: string;
  meta?: Meta;
}
