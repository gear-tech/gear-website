import { Hex, ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { fetchMetadata, getLocalProgramMeta } from 'api';
import { useChain } from 'hooks';
import { StateForm } from 'widgets/stateForm';

import styles from './State.module.scss';

type Params = { programId: Hex };

const State = () => {
  const alert = useAlert();
  const { programId } = useParams() as Params;

  const metaBuffer = useRef<Buffer>();
  const [metadata, setMetadata] = useState<ProgramMetadata>();

  const { isDevChain } = useChain();
  const getMetadata = isDevChain ? getLocalProgramMeta : fetchMetadata;

  useEffect(() => {
    // get meta depends on full state or not
    // if full - read

    getMetadata(programId)
      .then(({ result }) => {
        if (!result.meta || !result.metaWasm) return Promise.reject(new Error('No metadata'));

        const parsedMeta = JSON.parse(result.meta) as ProgramMetadata;

        metaBuffer.current = Buffer.from(result.metaWasm, 'base64');
        setMetadata(parsedMeta);
      })
      .catch(({ message }: Error) => alert.error(message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const isLoading = !metadata || !metaBuffer.current;

  return (
    <>
      <h2 className={styles.heading}>Read state</h2>
      <StateForm meta={metadata} programId={programId} metaBuffer={metaBuffer.current} isLoading={isLoading} />
    </>
  );
};

export { State };
