import { Button } from '@gear-js/ui';
import { Content, Info } from 'components';

type Props = {
  price: string | undefined;
  onSubmit: () => void;
};

function Start({ price, onSubmit }: Props) {
  const text = price ? `token was purchased for ${price}` : `token wasn't purchased`;

  return (
    <Content heading="Expired">
      <Info text={`Auction is over, ${text}. \nFeel free to start a new one.`} />
      <Button text="Create" onClick={onSubmit} block />
    </Content>
  );
}

export { Start };
