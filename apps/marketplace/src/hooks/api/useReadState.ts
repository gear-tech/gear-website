import { ProgramId } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import { useApi, useLoading } from 'hooks/context';
import { useEffect, useState } from 'react';

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
        .then((codecState) => codecState.toHuman())
        .then(setState)
        .finally(() => disableLoading());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaBuffer, payload]);

  return state;
}

export default useReadState;
