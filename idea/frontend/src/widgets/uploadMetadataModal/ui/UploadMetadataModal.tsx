import { Button, Modal } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { HexString } from '@polkadot/util/types';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { addIdl } from '@/features/sails';
import { useContractApiWithFile, useMetadataUpload } from '@/hooks';
import { ModalProps } from '@/entities/modal';
import { UploadMetadata } from '@/features/uploadMetadata';
import { Input } from '@/shared/ui';

import styles from './UploadMetadataModal.module.scss';
import { useAlert } from '@gear-js/react-hooks';

const FIELD_NAME = {
  NAME: 'name',
} as const;

const DEFAULT_VALUES = {
  [FIELD_NAME.NAME]: '',
};

const SCHEMA = z.object({
  [FIELD_NAME.NAME]: z.string().trim().min(1),
});

type Props = ModalProps & {
  codeId: HexString;
  programId?: HexString;
  onSuccess: (name: string, metadataHex: HexString) => void;
};

const UploadMetadataModal = ({ codeId, programId, onSuccess, onClose }: Props) => {
  const alert = useAlert();

  // useContractApiWithFile is based on meta-storage requests, we don't need them here
  const { metadata, sails, ...contractApi } = useContractApiWithFile(undefined);
  const uploadMetadata = useMetadataUpload();

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(SCHEMA),
  });

  const handleSubmit = form.handleSubmit(({ name }) => {
    console.log(name);

    // if (!metadata.hex) return alert.error('M')

    if (metadata.hex) {
      if (!programId) throw new Error('ProgramId is not found');

      onSuccess(name, metadata.hex);

      return console.log('submitting metadata...');

      // uploadMetadata({ programId, codeHash: codeId, metaHex: metadata.hex });
    }

    if (sails.idl) {
      return console.log('submitting idl...');
      // addIdl(codeId, sails.idl);
    }

    alert.error('Metadata/sails file is required');
  });

  return (
    <Modal heading="Upload metadata/sails" size="large" className={styles.modal} close={onClose}>
      <FormProvider {...form}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input name={FIELD_NAME.NAME} label={programId ? 'Program Name' : 'Code Name'} direction="y" block />

          <UploadMetadata
            value={contractApi.file}
            onChange={contractApi.handleChange}
            metadata={metadata.value}
            idl={sails.idl}
          />

          <Button type="submit" text="Submit" block />
        </form>
      </FormProvider>
    </Modal>
  );
};

export { UploadMetadataModal };
