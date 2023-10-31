import { HexString } from '@polkadot/util/types';
import { readFileSync } from 'fs';

import { GearApi, ProgramMetadata, getStateMetadata } from '@gear-js/api';
import { PATH_TO_META, PATH_TO_STATE_WASM } from '../config';

const [programId] = process.argv.slice(2) as [HexString];
const metaFile = readFileSync(PATH_TO_META, 'utf-8');
const meta = ProgramMetadata.from(metaFile);

const readFullState = async (api: GearApi) => {
  const state = await api.programState.read({ programId, payload: '0x' }, meta);

  console.log(JSON.stringify(state.toHuman(), undefined, 2));
};

const readStateUsingWasm = async (api: GearApi) => {
  const stateWasm = readFileSync(PATH_TO_STATE_WASM);

  const stateMeta = await getStateMetadata(stateWasm);

  console.log(
    'Available functions:',
    Object.keys(stateMeta.functions).map((fn) => meta.getTypeDef(stateMeta.functions[fn].input)),
  );

  const state = await api.programState.readUsingWasm(
    { programId, fn_name: 'wallet_by_id', wasm: stateWasm, argument: { decimal: 1, hex: '0x01' } },
    stateMeta,
    meta,
  );

  console.log(JSON.stringify(state.toHuman(), undefined, 2));
};

const main = async () => {
  const api = await GearApi.create();

  await readFullState(api);

  await readStateUsingWasm(api);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
