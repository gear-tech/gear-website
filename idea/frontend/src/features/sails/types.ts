import { Sails } from 'sails-js';

import { RESULT } from './consts';
import { getPayloadSchema } from './utils';

// TODO: import from sails-js
type ISailsFuncArg = InstanceType<typeof Sails>['services'][string]['functions'][string]['args'][number];
type TypeDef = ReturnType<InstanceType<typeof Sails>['getTypeDef']>;
type Ctors = InstanceType<typeof Sails>['ctors'];
type Services = InstanceType<typeof Sails>['services'];
type SailsService = Services[string];
type Functions = SailsService[keyof SailsService];

type PrimitiveDef = TypeDef['asPrimitive'];
type EnumDef = TypeDef['asEnum'];
type UserDefinedDef = TypeDef['asUserDefined'];
type StructDef = TypeDef['asStruct'];
type OptionalDef = TypeDef['asOptional'];
type ResultDef = TypeDef['asResult'];
type VecDef = TypeDef['asVec'];
type MapDef = TypeDef['asMap'];
type FixedSizeArrayDef = TypeDef['asFixedSizeArray'];

type Result = typeof RESULT[keyof typeof RESULT];
type PayloadValue = string | null | Array<PayloadValue> | { [key: string]: PayloadValue };
type PayloadValueSchema = ReturnType<typeof getPayloadSchema>;

export type {
  ISailsFuncArg,
  TypeDef,
  PrimitiveDef,
  EnumDef,
  UserDefinedDef,
  StructDef,
  OptionalDef,
  ResultDef,
  VecDef,
  MapDef,
  FixedSizeArrayDef,
  Result,
  PayloadValue,
  PayloadValueSchema,
  Ctors,
  Services,
  Functions,
};
