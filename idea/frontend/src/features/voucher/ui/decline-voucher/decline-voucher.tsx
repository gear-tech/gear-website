import { HexString } from '@gear-js/api';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { Button, Modal } from '@gear-js/ui';

import CloseSVG from '@/shared/assets/images/actions/close.svg?react';

import RemoveSVG from '../../assets/remove.svg?react';
import { useLoading, useModal, useSignAndSend } from '../../hooks';
import styles from './decline-voucher.module.scss';

type Props = {
  id: HexString;
};

const DeclineVoucher = ({ id }: Props) => {
  const { isApiReady, api } = useApi();
  const alert = useAlert();
  const signAndSend = useSignAndSend();

  const [isModalOpen, openModal, closeModal] = useModal();
  const [isLoading, enableLoading, disableLoading] = useLoading();

  const handleSubmitClick = () => {
    if (!isApiReady) throw new Error('API is not initialized');

    enableLoading();

    const extrinsic = api.voucher.decline(id);

    const onSuccess = () => {
      alert.success('Voucher has been declined');
      closeModal();
    };

    const onError = (error: string) => {
      alert.error(error);
      disableLoading();
    };

    signAndSend(extrinsic, 'VoucherDeclined', { onSuccess, onError });
  };

  return (
    <>
      <Button icon={RemoveSVG} onClick={openModal} color="transparent" />

      {isModalOpen && (
        <Modal heading="Decline Voucher" close={closeModal}>
          <p className={styles.text}>
            This action cannot be undone. If you change your mind, voucher&apos;s owner will have to issue a new voucher
            manually.
          </p>

          <div className={styles.buttons}>
            <Button icon={RemoveSVG} text="Submit" onClick={handleSubmitClick} disabled={isLoading} />
            <Button icon={CloseSVG} text="Cancel" color="light" onClick={closeModal} />
          </div>
        </Modal>
      )}
    </>
  );
};

export { DeclineVoucher };
