import { Link, generatePath } from 'react-router-dom';
import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';

import pageStyles from '../../Upload.module.scss';

import { routes } from 'routes';
import letterSVG from 'assets/images/letter.svg';

const SendMessage = () => {
  const linkText = 'Send Message';
  const linkPath = generatePath(routes.testRoute);
  const linkStyles = clsx(buttonStyles.button, buttonStyles.normal, buttonStyles.secondary);

  return (
    <div className={pageStyles.action}>
      <div className={pageStyles.actionContent}>
        <Link to={linkPath} className={linkStyles}>
          <img src={letterSVG} className={buttonStyles.icon} alt="letter icon" />
          {linkText}
        </Link>
        <p className={pageStyles.actionDescription}>{`Click “${linkText}” to write and send a message`}</p>
      </div>
    </div>
  );
};

export { SendMessage };
