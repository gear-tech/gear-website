import { Hex } from '@gear-js/api';

const ADDRESS = {
  NODE: process.env.REACT_APP_NODE_ADDRESS as string,
  LOTTERY_CONTRACT: process.env.REACT_APP_LOTTERY_CONTRACT_ADDRESS as Hex,
};

const LOCAL_STORAGE = {
  ACCOUNT: 'account',
};

const SUBHEADING = {
  START: {
    OWNER: "Press 'Start' to set the lottery options.",
    PLAYER: 'Waiting for owner to start the lottery.',
  },
  FORM: "Specify lottery duration and, if necessary, the address of the token contract and click the 'Submit and start' button to launch the lottery.",
  PENDING: 'You can see here the lottery status.',
};

const STATUS = {
  PENDING: 'In progress',
  FINISHED: 'Finished',
};

const MULTIPLIER = {
  MILLISECONDS: 1000,
  SECONDS: 60,
  MINUTES: 60,
  HOURS: 24,
};

export { ADDRESS, LOCAL_STORAGE, SUBHEADING, STATUS, MULTIPLIER };
