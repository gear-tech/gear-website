import { useApi } from '@gear-js/react-hooks';

import { useBalanceMultiplier } from './useBalanceMultiplier';

function useGasMultiplier() {
  const { api, isApiReady } = useApi();
  const valuePerGas = isApiReady ? api.valuePerGas.toString() : '0';

  const { balanceMultiplier } = useBalanceMultiplier();
  const gasMultiplier = balanceMultiplier.dividedBy(valuePerGas);

  // TODO: find a way to calculate logarithm without number
  const gasDecimals = Math.floor(Math.log10(gasMultiplier.toNumber()));

  return { gasMultiplier, gasDecimals };
}

export { useGasMultiplier };
