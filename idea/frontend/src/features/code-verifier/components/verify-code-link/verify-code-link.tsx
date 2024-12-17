import { HexString } from '@gear-js/api';
import clsx from 'clsx';
import { generatePath } from 'react-router-dom';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import { UILink } from '@/shared/ui';

import { VERIFY_ROUTES } from '../../consts';
import styles from './verify-code-link.module.scss';

type Props = {
  codeId?: HexString;
  className?: string;
};

function VerifyCodeLink({ codeId, className }: Props) {
  return (
    <UILink
      to={generatePath(VERIFY_ROUTES.MAIN + '/' + VERIFY_ROUTES.REQUEST, { codeId: codeId || null })}
      icon={ApplySVG}
      text="Verify Code"
      color="lightGreen"
      className={clsx(styles.link, className)}
    />
  );
}

export { VerifyCodeLink };