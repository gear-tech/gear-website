import { Hex } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { Content, Loader } from 'components';
import { useFormOpen, useLottery, useLotteryStatus } from 'hooks';
import { getDate, getNumber } from 'utils';
import { STATUS, SUBHEADING } from 'consts';
import { OwnerStart } from './owner-start';
import { PlayerStart } from './player-start';
import { Pending } from './pending';

function Home() {
  const { account } = useAccount();

  const { lottery, isLotteryRead } = useLottery();
  const { lotteryOwner, lotteryStartTime, lotteryDuration } = lottery || {};

  const cost = lottery?.participationCost || '';
  const prizeFund = lottery?.prizeFund || '';
  const players = lottery ? Object.values(lottery.players) : [];
  const isOwner = account?.decodedAddress === lotteryOwner;
  const isPlayer = players.some(({ playerId }) => playerId === account?.decodedAddress);
  const isParticipant = isPlayer || isOwner;

  const startTime = getNumber(lotteryStartTime || '');
  const duration = getNumber(lotteryDuration || '');
  const endTime = startTime + duration;

  const { status, countdown } = useLotteryStatus(endTime);
  const isLotteryStarted = status !== STATUS.AWAIT;
  const isLotteryActive = status === STATUS.PENDING;
  const dashboard = { startTime: getDate(startTime), endTime: getDate(endTime), status, winner: '' as Hex, countdown };

  const { isFormOpen, openForm } = useFormOpen(isLotteryStarted, isOwner);

  // eslint-disable-next-line no-nested-ternary
  return isLotteryRead ? (
    isFormOpen ? (
      <OwnerStart />
    ) : (
      <>
        {isLotteryStarted && isParticipant && (
          <Pending
            isOwner={isOwner}
            dashboard={dashboard}
            prizeFund={prizeFund}
            players={players}
            onResetButtonClick={openForm}
          />
        )}
        {isLotteryActive && !isParticipant && <PlayerStart cost={cost} />}
        {!isLotteryActive && !isOwner && <Content subheading={SUBHEADING.AWAIT} />}
      </>
    )
  ) : (
    <Loader />
  );
}

export { Home };
