import { useContext, useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui';
import { GasWallet } from 'components/common/gas-wallet';
import { SelectAccountPopup } from 'components/popups/select-account-popup';
import { TokensWallet } from 'components/common/tokens-wallet';
import { AccountButton } from 'components/common/account-button';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { TmgContext } from 'app/context';

export const AccountComponent = () => {
  const { state } = useContext(TmgContext);
  const { account, accounts } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {account ? (
        <div className="flex gap-4">
          {state && state.lesson > 2 && (
            <>
              <Link to="/store" className={clsx('btn whitespace-nowrap', buttonStyles.primary)}>
                Open Store
              </Link>

              <TokensWallet
                balance={account.balance}
                address={account.address}
                name={account.meta.name}
                onClick={openModal}
              />
            </>
          )}
          <GasWallet balance={account.balance} address={account.address} name={account.meta.name} onClick={openModal} />
          <AccountButton address={account.address} name={account.meta.name} onClick={openModal} />
        </div>
      ) : (
        <Button text="Connect account" onClick={openModal} color="lightGreen" />
      )}
      {isModalOpen && <SelectAccountPopup accounts={accounts} close={closeModal} />}
    </>
  );
};