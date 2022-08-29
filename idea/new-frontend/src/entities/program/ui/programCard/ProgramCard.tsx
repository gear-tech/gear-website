import { memo } from 'react';
import { CSSTransition } from 'react-transition-group';

import { getAnimationTimeout } from 'shared/helpers';
import sendSVG from 'shared/assets/images/actions/send.svg';
import readSVG from 'shared/assets/images/actions/read.svg';
import { IdBlock } from 'shared/ui/idBlock';
import { BulbBlock } from 'shared/ui/bulbBlock';
import { TimestampBlock } from 'shared/ui/timestampBlock';
import { ProgramActionLink } from 'shared/ui/programActionLink';

import styles from './ProgramCard.module.scss';
import { getBulbStatus } from '../../helpers';
import { IProgram } from '../../model/types';

type Props = {
  program: IProgram;
  isLoggedIn: boolean;
};

const ProgramCard = memo(({ program, isLoggedIn }: Props) => {
  const { id, name, initStatus, timestamp } = program;

  return (
    <article className={styles.programCard}>
      <div className={styles.cardContent}>
        <h1 className={styles.title}>Program name</h1>
        <h2 className={styles.name}>{name}</h2>
        <IdBlock id={id} className={styles.idBlock} />
        <div className={styles.otherInfo}>
          <BulbBlock text={initStatus} status={getBulbStatus(initStatus)} className={styles.bulbBlock} />
          <TimestampBlock timestamp={timestamp} />
        </div>
      </div>
      <div className={styles.actions}>
        <CSSTransition in={isLoggedIn} timeout={getAnimationTimeout(1)} exit={false} mountOnEnter unmountOnExit>
          <ProgramActionLink to="/" icon={sendSVG} text="Send Message" className={styles.sendMessage} />
        </CSSTransition>
        <ProgramActionLink to="/" icon={readSVG} text="Read State" />
      </div>
    </article>
  );
});

export { ProgramCard };
