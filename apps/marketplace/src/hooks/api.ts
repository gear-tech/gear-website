import { useEffect, useState } from 'react';
import { AnyJson } from '@polkadot/types/types';
import { getWasmMetadata, Metadata, ProgramId } from '@gear-js/api';
import { useApi } from 'hooks';
import { useLoading } from './context';

function useMetadata(input: RequestInfo) {
  const [metadata, setMetadata] = useState<Metadata>();
  const [metaBuffer, setMetaBuffer] = useState<Buffer>();

  const getBuffer = (arrayBuffer: ArrayBuffer) => {
    const buffer = Buffer.from(arrayBuffer);

    setMetaBuffer(buffer);
    return buffer;
  };

  useEffect(() => {
    fetch(input)
      .then((response) => response.arrayBuffer())
      .then(getBuffer)
      .then((buffer) => getWasmMetadata(buffer))
      .then(setMetadata);
  }, [input]);

  return { metadata, metaBuffer };
}

// TODO: are payload and state AnyJson? to disable useEffect deps or to memoize payload? should we handle loading on useMetadata?
function useReadState(programId: ProgramId, metaBuffer: Buffer | undefined, payload?: AnyJson) {
  const [state, setState] = useState<AnyJson>();
  const { api } = useApi();
  const { enableLoading, disableLoading } = useLoading();

  useEffect(() => {
    if (metaBuffer) {
      enableLoading();

      api.programState
        .read(programId, metaBuffer, payload)
        .then((codecState) => setState(codecState.toHuman()))
        .finally(() => disableLoading());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaBuffer]);

  return state;
}

export { useMetadata, useReadState };
