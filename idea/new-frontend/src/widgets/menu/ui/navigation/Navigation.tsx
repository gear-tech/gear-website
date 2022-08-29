import { routes } from 'shared/config';
import { Indicator } from 'shared/ui/indicator';
import { ReactComponent as IdeSVG } from 'shared/assets/images/menu/ide.svg';
import { ReactComponent as HomeSVG } from 'shared/assets/images/menu/home.svg';
import { ReactComponent as CodesSVG } from 'shared/assets/images/menu/codes.svg';
import { ReactComponent as MailboxSVG } from 'shared/assets/images/menu/mailbox.svg';
import { ReactComponent as ProgramsSVG } from 'shared/assets/images/menu/programs.svg';
import { ReactComponent as MessagesSVG } from 'shared/assets/images/menu/messages.svg';
import { ReactComponent as ExplorerSVG } from 'shared/assets/images/menu/explorer.svg';

import styles from './Navigation.module.scss';
import { NavigationItem } from '../navigationItem';
import { AppExamplesLink } from '../appExamplesLink';

type Props = {
  isOpen: boolean;
};

const Navigation = ({ isOpen }: Props) => (
  <nav className={styles.navigation}>
    <NavigationItem to={routes.home} icon={<HomeSVG />} text="Dashboard" isFullWidth={isOpen} />
    <NavigationItem to={routes.programs} icon={<ProgramsSVG />} text="Programs" isFullWidth={isOpen} />
    <NavigationItem to={routes.codes} icon={<CodesSVG />} text="Codes" isFullWidth={isOpen} />
    <NavigationItem to={routes.messages} icon={<MessagesSVG />} text="Messages" isFullWidth={isOpen} />
    <NavigationItem to={routes.explorer} icon={<ExplorerSVG />} text="Explorer" isFullWidth={isOpen} />
    <NavigationItem to={routes.editor} icon={<IdeSVG />} text="IDE" isFullWidth={isOpen} />
    <AppExamplesLink isFullWidth={isOpen} />
    <NavigationItem to={routes.mailbox} icon={<MailboxSVG />} text="Mailbox" isFullWidth={isOpen}>
      <Indicator value={24} />
    </NavigationItem>
  </nav>
);

export { Navigation };
