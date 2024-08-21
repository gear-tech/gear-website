import { HexString } from '@gear-js/api';
import { isHex } from '@polkadot/util';
import { useState } from 'react';

import {
  IssueVoucher,
  Vouchers as VouchersFeature,
  VoucherFilters,
  useVoucherFilters,
  useVouchers,
} from '@/features/voucher';
import { SearchForm } from '@/shared/ui';

import styles from './vouchers.module.scss';

const Vouchers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterParams, handleFiltersSubmit] = useVoucherFilters();
  const { data, isLoading, hasNextPage, refetch, fetchNextPage } = useVouchers({
    id: searchQuery as HexString,
    ...filterParams,
  });

  return (
    <div className={styles.vouchers}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Vouchers: {data?.count}</h2>

        <IssueVoucher onSubmit={refetch} />
      </header>

      <SearchForm
        placeholder="Search by id..."
        getSchema={(schema) => schema.refine((value) => isHex(value), 'Value should be hex')}
        onSubmit={(query) => setSearchQuery(query)}
      />

      <VouchersFeature
        items={data?.vouchers}
        isLoading={isLoading}
        hasMore={hasNextPage}
        noItemsSubheading="Wait until someone will issue a voucher for you, or issue voucher by yourself"
        onVoucherChange={refetch}
        fetchMore={fetchNextPage}
      />

      <VoucherFilters onSubmit={handleFiltersSubmit} />
    </div>
  );
};

export { Vouchers };
