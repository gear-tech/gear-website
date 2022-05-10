import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { Listing, PriceModal } from 'components';
import { MARKETPLACE_CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS } from 'consts';
import { useAccount, useApi, useLoading, useMarketplaceMeta, useStatus } from 'hooks';
import { useState } from 'react';
import { sendMessage } from 'utils';
import AuctionModal from './auction-modal';

type Props = {
  isOwner: boolean;
  id: string;
  heading: string;
  description: string;
  owner: Hex;
  image: string;
  offers: any[];
  price?: string;
  royalty?: number;
  rarity?: string;
  attrs?: { [key: string]: string };
};

function OwnerListing(props: Props) {
  const { isOwner, id, heading, description, owner, image, offers, price, royalty, rarity, attrs } = props;

  const { api } = useApi();
  const { account } = useAccount();
  const { enableLoading } = useLoading();
  const { marketplaceMeta } = useMarketplaceMeta();
  const handleStatus = useStatus();

  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const openAuctionModal = () => {
    setIsAuctionModalOpen(true);
  };

  const openPriceModal = () => {
    setIsPriceModalOpen(true);
  };

  const closeModal = () => {
    setIsAuctionModalOpen(false);
    setIsPriceModalOpen(false);
  };

  const startSale = (priceValue: string) => {
    if (account && marketplaceMeta) {
      enableLoading();

      const payload = {
        AddMarketData: {
          nftContractId: NFT_CONTRACT_ADDRESS,
          ftContractId: null,
          tokenId: id,
          price: priceValue,
        },
      };

      sendMessage(api, account, MARKETPLACE_CONTRACT_ADDRESS, payload, marketplaceMeta, handleStatus);
    }
  };

  return (
    <>
      <Listing
        heading={heading}
        description={description}
        owner={owner}
        image={image}
        offers={offers}
        price={price}
        royalty={royalty}
        rarity={rarity}
        attrs={attrs}>
        {isOwner && (
          <>
            <Button text="Start auction" onClick={openAuctionModal} block />
            <Button text="Start sale" onClick={openPriceModal} block />
          </>
        )}
      </Listing>
      {isAuctionModalOpen && <AuctionModal close={closeModal} />}
      {isPriceModalOpen && <PriceModal heading="Enter price to start sale" close={closeModal} onSubmit={startSale} />}
    </>
  );
}

export default OwnerListing;
