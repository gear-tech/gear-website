import { Event } from '@polkadot/types/interfaces';
import { AnyJson } from '@polkadot/types/types';

export type FilterValues = { [filter: string]: boolean };

export enum Sections {
  SYSTEM = 'system',
}

export enum Methods {
  TRANSFER = 'Transfer',
  LOG = 'Log',
  INIT_SUCCESS = 'InitSuccess',
  INIT_FAILURE = 'InitFailure',
  DISPATCH_MESSAGE_ENQUEUED = 'DispatchMessageEnqueued',
  MESSAGE_DISPATCHED = 'MessageDispatched',
}

export type TypeKey = 'handle_output' | 'init_output';

export type EventGroup = {
  list: Event[];
  id: string;
  method: string;
  caption: string;
  description: AnyJson;
};

export type GroupedEvents = EventGroup[];

export type GroupedEventsProps = {
  groupedEvents: GroupedEvents;
};
