import React, { useEffect, useState } from 'react';
import Identicon from '@polkadot/react-identicon';
import clsx from 'clsx';
import { toShortAddress, copyToClipboard } from '../../../helpers';

import './AccountList.scss';

type Props = {
  list: any;
  toggleAccount: (event: any, index: number) => void;
};

export const AccountList = ({ list, toggleAccount }: Props) => {
  const accountItem = list.map((account: any, index: number) => (
    <button
      type="button"
      className={clsx('account-list__item', account.isActive && 'active')}
      key={account.address}
      onClick={(event: any) => {
        toggleAccount(event, index);
      }}
    >
      <span className="account-list__icon">
        <Identicon value={account.address} size={25} theme="polkadot" />
      </span>
      <span className="account-list__name">{account.meta.name}</span>
      <span className="account-list__address">{toShortAddress(account.address)}</span>
    </button>
  ));

  return (
    <div className="account-list__wrapper">
      {(list.length > 0 && accountItem) || (
        <p>
          No accounts found. Please open your Polkadot extension and create a new account or import existing. Then
          reload this page.
        </p>
      )}
    </div>
  );
};
