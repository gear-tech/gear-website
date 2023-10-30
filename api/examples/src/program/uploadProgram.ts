import { GearApi, GearKeyring, ProgramMetadata, decodeAddress } from '@gear-js/api';
import { readFileSync } from 'fs';

import { PATH_TO_META, PATH_TO_OPT } from '../config';
import { waitForInit } from './waitForInit';

const main = async () => {
  const api = await GearApi.create();

  const alice = await GearKeyring.fromSuri('//Alice');

  const code = readFileSync(PATH_TO_OPT);
  const metaTxt = readFileSync(PATH_TO_META, 'utf-8');

  const meta = ProgramMetadata.from(metaTxt);

  const initPayload = [1, 2, 3];

  const gas = await api.program.calculateGas.initUpload(decodeAddress(alice.address), code, initPayload, 0, true, meta);

  const { programId } = api.program.upload({ code, initPayload, gasLimit: gas.min_limit }, meta);

  console.log(`ProgramID: ${programId}\n`);

  waitForInit(api, programId)
    .then(() => console.log('Program initialized successfully'))
    .catch((error) => {
      console.log(`Program initialization failed due to next error: ${error}\n`);
    });

  try {
    return await new Promise((resolve, reject) => {
      api.program.signAndSend(alice, ({ events, status }) => {
        console.log(`STATUS: ${status.toString()}`);
        if (status.isFinalized) resolve(status.asFinalized);
        events.forEach(({ event }) => {
          if (event.method === 'ExtrinsicFailed') {
            reject(api.getExtrinsicFailedError(event).docs.join('/n'));
          }
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
