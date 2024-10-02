import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';

import { Balance } from '../balance';
import { WalletModal } from '../wallet-modal';
import { UI_CONFIG } from '../ui-config';
import styles from './wallet.module.scss';

type Props = {
  variant?: 'gear' | 'vara';
  displayBalance?: boolean;

  // temp solution to support responsiveness in dApps MenuHandler, until it's supported here
  accountButtonClassName?: string;
};

function Wallet({ variant = 'vara', displayBalance = true, accountButtonClassName }: Props) {
  const { account, isAccountReady } = useAccount();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!isAccountReady) return null;
  const { Button, AccountButton } = UI_CONFIG[variant];

  return (
    <>
      <div className={styles.wallet}>
        {displayBalance && <Balance variant={variant} />}

        {account ? (
          <div className={accountButtonClassName}>
            <AccountButton address={account.address} name={account.meta.name} onClick={openModal} />
          </div>
        ) : (
          <Button text="Connect Wallet" color="primary" onClick={openModal} />
        )}
      </div>

      {isModalOpen && <WalletModal variant={variant} close={closeModal} />}
    </>
  );
}

export { Wallet };
