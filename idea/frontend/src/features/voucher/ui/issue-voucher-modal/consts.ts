import { HexString, decodeAddress } from '@gear-js/api';
import { z } from 'zod';

import { isAccountAddressValid } from '@/shared/helpers';

const INPUT_NAME = {
  VOUCHER_TYPE: 'type',
  PROGRAM_ID: 'programId',
  ACCOUNT_ADDRESS: 'address',
  VALUE: 'value',
  DURATION: 'duration',
} as const;

const VOUCHER_TYPE = {
  PROGRAM: 'program',
  MIXED: 'mixed',
  CODE: 'code',
} as const;

const DEFAULT_VALUES = {
  [INPUT_NAME.VOUCHER_TYPE]: VOUCHER_TYPE.PROGRAM,
  [INPUT_NAME.PROGRAM_ID]: '' as HexString,
  [INPUT_NAME.ACCOUNT_ADDRESS]: '',
  [INPUT_NAME.VALUE]: '',
  [INPUT_NAME.DURATION]: '',
} as const;

const ADDRESS_SCHEMA = z
  .string()
  .trim()
  .min(0)
  .refine((value) => isAccountAddressValid(value), 'Invalid address')
  .transform((value) => decodeAddress(value));

export { INPUT_NAME, VOUCHER_TYPE, DEFAULT_VALUES, ADDRESS_SCHEMA };
