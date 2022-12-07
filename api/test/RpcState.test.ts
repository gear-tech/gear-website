import { KeyringPair } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { readFileSync } from 'fs';
import { join } from 'path';

import { Metadata, GearApi, getProgramMetadata, getStateMetadata, HumanStateMetadata } from '../src';
import { checkInit, getAccount, sleep } from './utilsFunctions';

const api = new GearApi();
let alice: KeyringPair;

const code = readFileSync(
  join('/Users/dmitriiosipov/gear/gear/target/wasm32-unknown-unknown/release', 'demo_meta.opt.wasm'),
);

const stateV1 = readFileSync(
  join('/Users/dmitriiosipov/gear/gear/target/wasm32-unknown-unknown/release', 'demo_meta_state_v1.meta.wasm'),
);

let stateV1Meta: HumanStateMetadata;

const stateV2 = readFileSync(
  join('/Users/dmitriiosipov/gear/gear/target/wasm32-unknown-unknown/release', 'demo_meta_state_v2.meta.wasm'),
);
let stateV2Meta: HumanStateMetadata;

const metaHex =
  '0x01000000000103000000010500000001090000000102000000010d000000010f00000001110000000112000000a9094c00083064656d6f5f6d6574615f696f344d657373616765496e6974496e0000080118616d6f756e74040108753800012063757272656e6379080118537472696e6700000400000503000800000502000c083064656d6f5f6d6574615f696f384d657373616765496e69744f7574000008013465786368616e67655f72617465100138526573756c743c75382c2075383e00010c73756d04010875380000100418526573756c740804540104044501040108084f6b040004000000000c457272040004000001000014083064656d6f5f6d6574615f696f244d657373616765496e000004010869641801084964000018083064656d6f5f6d6574615f696f084964000008011c646563696d616c1c010c75363400010c68657820011c5665633c75383e00001c000005060020000002040024083064656d6f5f6d6574615f696f284d6573736167654f7574000004010c7265732801384f7074696f6e3c57616c6c65743e00002804184f7074696f6e040454012c0108104e6f6e6500000010536f6d6504002c00000100002c083064656d6f5f6d6574615f696f1857616c6c6574000008010869641801084964000118706572736f6e300118506572736f6e000030083064656d6f5f6d6574615f696f18506572736f6e000008011c7375726e616d65080118537472696e670001106e616d65080118537472696e6700003400000238003800000504003c083064656d6f5f6d6574615f696f384d6573736167654173796e63496e0000040114656d707479400108282900004000000400004404184f7074696f6e04045401040108104e6f6e6500000010536f6d650400040000010000480000022c00';

const programMeta = getProgramMetadata(metaHex);

const meta = new Metadata(programMeta.reg);
let programId: HexString;

beforeAll(async () => {
  await api.isReadyOrError;
  [alice] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

describe('Read State', () => {
  test('Upload demo_meta_test program', async () => {
    const payload = meta.createType(programMeta.init.input!, { amount: 8, currency: 'GR' }).toHex();

    const program = api.program.upload({
      code: code,
      initPayload: payload,
      gasLimit: 20_000_000_000,
    });
    programId = program.programId;

    const initStatus = checkInit(api, programId);

    await program.extrinsic.signAndSend(alice, () => {});

    expect(await initStatus()).toBe('success');
  });

  test('Get program state', async () => {
    const state = await api.rpcState.readState({ programId }, programMeta.reg, programMeta.state!);
    expect([
      {
        id: { decimal: 1, hex: '0x01' },
        person: { surname: 'SomeSurname', name: 'SomeName' },
      },
      {
        id: { decimal: 2, hex: '0x02' },
        person: { surname: 'OtherName', name: 'OtherSurname' },
      },
    ]).toEqual(state.toJSON());
  });

  test('Get state v1 meta', async () => {
    stateV1Meta = await getStateMetadata(stateV1);
    console.log(stateV1Meta);
    expect(stateV1Meta).toEqual({ functions: [], reg: '0x' });
  });

  test.only('Get state v2 meta', async () => {
    stateV2Meta = await getStateMetadata(stateV2);
    console.log(stateV2Meta);
    expect(stateV2Meta).toEqual({ functions: [], reg: '0x' });
  });
});
