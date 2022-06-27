import { CreateType, GearApi, GearKeyring, GearMessage, GearMessageReply, Metadata } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { InjectedExtension } from '@polkadot/extension-inject/types';

import { localPrograms } from './LocalDBService';
import ServerRPCRequestService from './ServerRPCRequestService';
import { waitForProgramInit } from './helpers';

import { nodeApi } from 'api/initApi';

import { GetMetaResponse } from 'api/responses';
import { RPC_METHODS, PROGRAM_ERRORS, LOCAL_STORAGE, GEAR_BALANCE_TRANSFER_VALUE } from 'consts';
import { readFileAsync, signPayload, isDevChain, getLocalProgramMeta } from 'helpers';
import { Account } from 'context/types';
import { AlertContainerFactory } from 'context/alert/types';
import { DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from 'context/alert/const';
import { UploadProgramModel, Message, Reply, ProgramStatus } from 'types/program';
import { AddressOrPair } from '@polkadot/api/types';

export const uploadMetadata = async (
  programId: string,
  account: Account,
  name: string,
  injector: InjectedExtension,
  alert: AlertContainerFactory,
  metaFile?: any,
  meta?: Metadata,
  title?: string
) => {
  const jsonMeta = JSON.stringify(meta);

  if (isDevChain()) {
    localPrograms
      .setItem(programId, {
        id: programId,
        name,
        title,
        meta: {
          meta: jsonMeta,
          metaFile,
          programId,
        },
        owner: account.decodedAddress,
        timestamp: Date(),
        initStatus: ProgramStatus.Success,
      })
      .then(() => {
        alert.success('Program added to the localDB successfully');
      })
      .catch((error) => {
        alert.error(String(error));
      });

    return;
  }

  const apiRequest = new ServerRPCRequestService();

  await signPayload(injector, account.address, jsonMeta, async (signature: string) => {
    try {
      const response = await apiRequest.callRPC(RPC_METHODS.ADD_METADATA, {
        name,
        meta: jsonMeta,
        title,
        metaFile,
        signature,
        programId,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      alert.success('Metadata saved successfully');
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
      console.error(error);
    }
  });
};

export const UploadProgram = async (
  api: GearApi,
  account: Account,
  file: File,
  programModel: UploadProgramModel,
  metaFile: any,
  alert: AlertContainerFactory,
  callback: () => void
) => {
  const injector = await web3FromSource(account.meta.source);
  const fileBuffer = (await readFileAsync(file)) as ArrayBufferLike;

  const { gasLimit, value, initPayload, meta, title, programName, payloadType } = programModel;

  const program = {
    code: new Uint8Array(fileBuffer),
    gasLimit: gasLimit.toString(),
    value: value.toString(),
    initPayload,
  };

  const name = programName ?? file.name;

  const alertTitle = 'gear.submitProgram';

  const alertId = alert.loading('SignIn', { title: alertTitle });

  try {
    const { programId } = api.program.submit(program, meta, payloadType);

    const getProgramUploadStatus = waitForProgramInit(api, programId);

    await api.program.signAndSend(account.address, { signer: injector.signer }, (data) => {
      if (data.status.isReady) {
        alert.update(alertId, 'Ready');

        return;
      }

      if (data.status.isInBlock) {
        alert.update(alertId, 'InBlock');

        return;
      }

      if (data.status.isFinalized) {
        alert.update(alertId, 'Finalized', DEFAULT_SUCCESS_OPTIONS);

        data.events.forEach(({ event: { method, section } }) => {
          const eventTitle = `${section}.${method}`;

          if (method === 'MessageEnqueued') {
            alert.success('Success', { title: eventTitle });
            callback();
          }

          if (method === 'ExtrinsicFailed') {
            alert.error('Extrinsic Failed', {
              title: eventTitle,
            });
          }
        });

        return;
      }

      if (data.status.isInvalid) {
        alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);
      }
    });

    const programUploadStatus = await getProgramUploadStatus();
    // link to program
    if (programUploadStatus === 'failed') {
      alert.error(PROGRAM_ERRORS.PROGRAM_INIT_FAILED);

      return;
    }

    await uploadMetadata(programId, account, name, injector, alert, metaFile, meta, title);
    // maybe add timeout 100ms
    alert.success('Program initializated successfully');
  } catch (error) {
    alert.update(alertId, String(error), DEFAULT_ERROR_OPTIONS);
  }
};

export const sendMessage = async (
  api: GearMessage | GearMessageReply,
  account: Account,
  message: Message & Reply,
  alert: AlertContainerFactory,
  callback: () => void,
  meta?: Metadata,
  payloadType?: string
) => {
  const alertTitle = 'gear.sendMessage';

  const alertId = alert.loading('SignIn', { title: alertTitle });

  try {
    const { signer } = await web3FromSource(account.meta.source);

    api.submit(message, meta, payloadType);

    await api.signAndSend(account.address, { signer }, (data) => {
      if (data.status.isReady) {
        alert.update(alertId, 'Ready');

        return;
      }

      if (data.status.isInBlock) {
        alert.update(alertId, 'InBlock');

        return;
      }

      if (data.status.isFinalized) {
        alert.update(alertId, 'Finalized', DEFAULT_SUCCESS_OPTIONS);

        data.events.forEach(({ event }) => {
          const { method, section } = event;

          const eventTitle = `${section}.${method}`;

          if (method === 'MessageEnqueued') {
            alert.success('Success', { title: eventTitle });
            callback();

            return;
          }

          if (method === 'ExtrinsicFailed') {
            alert.error('Extrinsic Failed', { title: eventTitle });
          }
        });

        return;
      }

      if (data.status.isInvalid) {
        alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);
      }
    });
  } catch (error) {
    alert.update(alertId, String(error), DEFAULT_ERROR_OPTIONS);
  }
};

export const addMetadata = async (
  meta: Metadata,
  metaFile: any,
  account: Account,
  programId: string,
  name: any,
  alert: AlertContainerFactory
) => {
  const injector = await web3FromSource(account.meta.source);

  await uploadMetadata(programId, account, name, injector, alert, metaFile, meta, meta.title);
};

export const transferBalance = (
  api: GearApi,
  addressTo: string,
  addressFrom: AddressOrPair,
  alert: AlertContainerFactory
) => {
  api.balance.transfer(addressTo, GEAR_BALANCE_TRANSFER_VALUE);

  api.balance.signAndSend(addressFrom, ({ events }) => {
    events.forEach(({ event: { method, section } }) => {
      const eventTitle = `${section}.${method}`;

      if (method === 'Transfer') {
        alert.success('Balance received successfully', { title: eventTitle });

        return;
      }

      if (method === 'ExtrinsicFailed') {
        alert.error('Error when receiving balance', { title: eventTitle });
      }
    });
  });
};

export const subscribeToEvents = (alert: AlertContainerFactory) => {
  const filterKey = localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW);

  nodeApi.subscribeToUserMessageSentEvents(async ({ data: { message } }) => {
    const { source, destination, reply, payload } = message;

    if (destination.toHex() === filterKey) {
      let meta = null;
      let decodedPayload: any;
      const programId = source.toHex();
      const apiRequest = new ServerRPCRequestService();

      const { result } = isDevChain()
        ? await getLocalProgramMeta(programId)
        : await apiRequest.callRPC<GetMetaResponse>(RPC_METHODS.GET_METADATA, { programId });

      if (result && result.meta) {
        meta = JSON.parse(result.meta);
      }

      try {
        decodedPayload =
          meta.output && !(reply.isSome && reply.unwrap()[1].toNumber() !== 0)
            ? CreateType.create(meta.output, payload, meta).toHuman()
            : payload.toHuman();
      } catch (error) {
        console.error('Decode payload failed');
      }

      // TODO: add payload parsing
      const alertMessage = `LOG from program\n ${source.toHex()}\n ${
        decodedPayload ? `Response: ${decodedPayload}` : ''
      }`;

      const isSuccess = (reply.isSome && reply.unwrap()[1].toNumber() === 0) || reply.isNone;

      const showAlert = isSuccess ? alert.success : alert.error;

      showAlert(alertMessage);
    }
  });

  nodeApi.subscribeToTransferEvents(({ data: { from, to, amount } }) => {
    if (to.toHex() === filterKey) {
      const message = `TRANSFER BALANCE\n FROM:${GearKeyring.encodeAddress(from.toHex())}\n VALUE:${amount.toString()}`;

      alert.info(message);
    }
  });
};
