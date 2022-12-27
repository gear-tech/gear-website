import { Link } from 'react-router-dom';
import { Icon } from 'components/ui/icon';

export const Logo = () => {
  return (
    <Link to="/" className="inline-flex text-white transition-colors hover:text-opacity-70">
      <Icon name="logo" width={180} height={44} className="h-10" />
    </Link>
  );
};
