import { useRef, useEffect, ChangeEvent } from 'react';
import clsx from 'clsx';
import { ProgramMetadata, getProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { FileInput } from '@gear-js/ui';
import { isHex } from '@polkadot/util';

import { usePrevious } from 'hooks';
import { checkFileFormat } from 'shared/helpers';
import { FormText, formStyles } from 'shared/ui/form';

import { getMetadataProperties } from '../helpers';
import styles from './UploadMetadata.module.scss';

type Props = {
  metadata?: ProgramMetadata;
  onReset: () => void;
  onUpload: (meta: ProgramMetadata) => void;
};

const UploadMetadata = ({ metadata, onReset, onUpload }: Props) => {
  const alert = useAlert();

  const inputRef = useRef<HTMLInputElement>(null);
  const prevMetadata = usePrevious<ProgramMetadata | undefined>(metadata);

  const handleUploadMetaFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      onReset();

      return;
    }

    try {
      if (!checkFileFormat(file)) throw new Error('Wrong file format');

      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');

      reader.onload = ({ target }) => {
        if (target) {
          const { result } = target;

          if (isHex(result)) {
            const meta = getProgramMetadata(result);

            onUpload(meta);
          } else throw new Error('Wrong file format');
        }
      };
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    }
  };

  const renderMetadataProperties = (meta: ProgramMetadata) => {
    const metadataProperties = getMetadataProperties(meta);

    return Object.entries(metadataProperties).map(([name, value]) => (
      <FormText key={name} text={JSON.stringify(value)} label={name} direction="y" isTextarea={name === 'types'} />
    ));
  };

  // TODO: think about this
  useEffect(() => {
    const target = inputRef.current;

    if (!metadata && prevMetadata && target) {
      const change = new Event('change', { bubbles: true });

      target.value = '';
      target.files = null;
      target.dispatchEvent(change);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata]);

  return (
    <div className={styles.uploadMetadata}>
      <FileInput
        ref={inputRef}
        color="primary"
        label="Metadata file"
        direction="y"
        className={clsx(formStyles.field, formStyles.gap16)}
        onChange={handleUploadMetaFile}
      />
      {metadata ? renderMetadataProperties(metadata) : null}
    </div>
  );
};

export { UploadMetadata };
