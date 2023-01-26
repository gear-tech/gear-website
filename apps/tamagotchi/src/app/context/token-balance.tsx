import type { Hex } from '@gear-js/api';
import type { ProviderProps } from '@gear-js/react-hooks';
import { createContext } from 'react';
import { ProgramMetadata } from '@gear-js/api';
import { useMetadata } from '../hooks/use-metadata';
import meta from 'assets/meta/meta-ft.txt';
import metaLogic from 'assets/meta/meta-ft_logic.txt';
import metaStorage from 'assets/meta/meta-ft_storage.txt';
import { ENV } from '../consts';

type Program = {
  programId: Hex;
  metaMain: ProgramMetadata;
  metaLogic: ProgramMetadata;
  metaStorage: ProgramMetadata;
};

const program: Program = {
  programId: '' as Hex,
  metaMain: {} as ProgramMetadata,
  metaLogic: {} as ProgramMetadata,
  metaStorage: {} as ProgramMetadata,
};

function useStore(): Program {
  const { metadata } = useMetadata(meta);
  const { metadata: metaL } = useMetadata(metaLogic);
  const { metadata: metaS } = useMetadata(metaStorage);
  return {
    programId: ENV.balance as Hex,
    metaMain: metadata as ProgramMetadata,
    metaLogic: metaL as ProgramMetadata,
    metaStorage: metaS as ProgramMetadata,
  };
}

export const TokensBalanceCtx = createContext<Program>(program);

export function TokensBalanceProvider({ children }: ProviderProps) {
  const { Provider } = TokensBalanceCtx;
  return <Provider value={useStore()}>{children}</Provider>;
}
