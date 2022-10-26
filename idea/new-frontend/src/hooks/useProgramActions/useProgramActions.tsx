import { useCallback } from 'react';
import { generatePath } from 'react-router-dom';
import { EventRecord } from '@polkadot/types/interfaces';
import { web3FromSource } from '@polkadot/extension-dapp';
import { Hex } from '@gear-js/api';
import { useApi, useAccount, useAlert, DEFAULT_ERROR_OPTIONS, DEFAULT_SUCCESS_OPTIONS } from '@gear-js/react-hooks';

import { useChain, useModal } from 'hooks';
import { uploadLocalProgram } from 'api/LocalDB';
import { Method } from 'entities/explorer';
import { OperationCallbacks } from 'entities/hooks';
import { PROGRAM_ERRORS, TransactionName, TransactionStatus, absoluteRoutes } from 'shared/config';
import { checkWallet, readFileAsync, getExtrinsicFailedMessage } from 'shared/helpers';
import { CustomLink } from 'shared/ui/customLink';

import { useMetadataUplaod } from '../useMetadataUpload';
import { waitForProgramInit } from './helpers';
import { ALERT_OPTIONS } from './consts';
import { Payload, ParamsToCreate, ParamsToUpload, ParamsToSignAndUpload } from './types';

const useProgramActions = () => {
  const alert = useAlert();
  const { api } = useApi();
  const { account } = useAccount();
  const { isDevChain } = useChain();

  const { showModal } = useModal();
  const uploadMetadata = useMetadataUplaod();

  const getProgramMessage = (programId: string) => (
    <p>
      ID: <CustomLink to={generatePath(absoluteRoutes.program, { programId })} text={programId} />
    </p>
  );

  const createProgram = async (codeId: Hex, payload: Payload) => {
    const { gasLimit, value, initPayload, metadata, payloadType } = payload;

    const program = {
      value,
      codeId,
      gasLimit,
      initPayload,
    };

    const result = await api.program.create(program, metadata, payloadType);

    return result.programId;
  };

  const uploadProgram = async (file: File, payload: Payload) => {
    const fileBuffer = await readFileAsync(file, 'buffer');

    const { gasLimit, value, initPayload, metadata, payloadType } = payload;

    const program = {
      code: new Uint8Array(fileBuffer),
      value,
      gasLimit,
      initPayload,
    };

    const result = await api.program.upload(program, metadata, payloadType);

    return result.programId;
  };

  const handleEventsStatus = (events: EventRecord[], { reject, resolve }: OperationCallbacks) => {
    events.forEach(({ event }) => {
      const { method, section } = event;
      const alertOptions = { title: `${section}.${method}` };

      if (method === Method.ExtrinsicFailed) {
        alert.error(getExtrinsicFailedMessage(api, event), alertOptions);

        if (reject) reject();
      } else if (method === Method.MessageEnqueued) {
        alert.success('Success', alertOptions);

        if (resolve) resolve();
      }
    });
  };

  const signAndUpload = async ({ name, title, signer, payload, programId, reject, resolve }: ParamsToSignAndUpload) => {
    const alertId = alert.loading('SignIn', { title });

    try {
      const initialization = waitForProgramInit(api, programId);

      await api.program.signAndSend(account!.address, { signer }, ({ status, events }) => {
        if (status.isReady) {
          alert.update(alertId, TransactionStatus.Ready);
        } else if (status.isInBlock) {
          alert.update(alertId, TransactionStatus.InBlock);
        } else if (status.isFinalized) {
          alert.update(alertId, TransactionStatus.Finalized, DEFAULT_SUCCESS_OPTIONS);
          handleEventsStatus(events, { reject, resolve });
        } else if (status.isInvalid) {
          alert.update(alertId, PROGRAM_ERRORS.INVALID_TRANSACTION, DEFAULT_ERROR_OPTIONS);

          if (reject) reject();
        }
      });

      const initStatus = await initialization;

      const programMessage = getProgramMessage(programId);

      // TODO: replace w/ ProgramStatus.Terminated
      if (initStatus === 'failed') {
        alert.error(programMessage, ALERT_OPTIONS);

        if (reject) reject();

        return;
      }

      const { title: payloadTitle, metadata, metadataBuffer } = payload;

      if (isDevChain) {
        await uploadLocalProgram({ id: programId, name, owner: account?.decodedAddress!, title: payloadTitle || null });
      }

      if (name) {
        uploadMetadata({
          name,
          title,
          signer,
          metadata,
          programId,
          metadataBuffer,
          resolve: () => alert.success(programMessage, ALERT_OPTIONS),
        });
      }
    } catch (error) {
      const message = (error as Error).message;

      alert.update(alertId, message, DEFAULT_ERROR_OPTIONS);

      if (reject) reject();
    }
  };

  const create = useCallback(
    async ({ codeId, payload, reject, resolve }: ParamsToCreate) => {
      try {
        checkWallet(account);

        const { meta, address } = account!;

        const [{ signer }, programId] = await Promise.all([
          web3FromSource(meta.source),
          createProgram(codeId, payload),
        ]);

        const { partialFee } = await api.program.paymentInfo(address, { signer });

        const name = payload.programName || codeId;

        const handleConfirm = () =>
          signAndUpload({ name, title: TransactionName.CreateProgram, signer, payload, programId, reject, resolve });

        showModal('transaction', {
          fee: partialFee.toHuman(),
          name: TransactionName.CreateProgram,
          addressFrom: address,
          onAbort: reject,
          onConfirm: handleConfirm,
        });
      } catch (error) {
        const message = (error as Error).message;

        alert.error(message);
        if (reject) reject();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account, uploadMetadata],
  );

  const upload = useCallback(
    async ({ file, payload, reject, resolve }: ParamsToUpload) => {
      try {
        checkWallet(account);

        const { meta, address } = account!;

        const [{ signer }, programId] = await Promise.all([web3FromSource(meta.source), uploadProgram(file, payload)]);

        const { partialFee } = await api.program.paymentInfo(address, { signer });

        const name = payload.programName || file.name;

        const handleConfirm = () =>
          signAndUpload({ name, title: TransactionName.UploadProgram, signer, payload, programId, reject, resolve });

        showModal('transaction', {
          fee: partialFee.toHuman(),
          name: TransactionName.UploadProgram,
          addressFrom: address,
          onAbort: reject,
          onConfirm: handleConfirm,
        });
      } catch (error) {
        const message = (error as Error).message;

        alert.error(message);
        if (reject) reject();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [api, account, uploadMetadata],
  );

  return { uploadProgram: upload, createProgram: create };
};

export { useProgramActions };