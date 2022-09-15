import { Keys } from '@gear-js/common';
import { MessagesDispatchedData, ProgramChangedData, UserMessageReadData, UserMessageSentData } from '@gear-js/api';

import { GenericEventData } from '@polkadot/types';
import { getMessageReadStatus } from './get-message-read-status';
import { UserMessageSentInput } from '../../message/types/user-message-sent.input';
import { UserMessageReadInput } from '../../message/types/user-message-read.input';
import { ProgramChangedInput } from '../../program/types/program-changed.input';
import { MessageDispatchedDataInput } from '../../message/types/message-dispatched-data.input';
import { MessageStatus } from '../enums';
import { GearEventPayload } from '../types';

function userMessageSentPayload(data: UserMessageSentData): UserMessageSentInput {
  const { id, source, destination, payload, value, reply } = data.message;
  return {
    id: id.toHex(),
    source: source.toHex(),
    destination: destination.toHex(),
    payload: payload.toHex(),
    value: value.toString(),
    replyToMessageId: reply.isSome ? reply.unwrap().replyTo.toHex() : null,
    exitCode: reply.isSome ? reply.unwrap().exitCode.toNumber() : null,
  };
}

function userMessageReadPayload(data: UserMessageReadData): UserMessageReadInput {
  return {
    id: data.id.toHex(),
    reason: getMessageReadStatus(data),
  };
}

function programChangedPayload(
  data: ProgramChangedData,
): ProgramChangedInput | null {
  const { id, change } = data;
  if (change.isActive || change.isInactive) {
    return {
      id: id.toHex(),
      isActive: change.isActive ? true : false
    };
  }
  return null;
}

function messagesDispatchedPayload(
  data: MessagesDispatchedData,
): MessageDispatchedDataInput | null {
  const { statuses } = data;
  if (statuses.size > 0) {
    return {  statuses: statuses.toHuman() as { [key: string]: MessageStatus } };
  }
  return null;
}

export function getPayloadByGearEvent (method: string, data: GenericEventData): GearEventPayload {
  const payloads = {
    [Keys.UserMessageSent]: (data: UserMessageSentData):UserMessageSentInput => {
      return userMessageSentPayload(data);
    },
    [Keys.UserMessageRead]: (data: UserMessageReadData): UserMessageReadInput => {
      return userMessageReadPayload(data);
    },
    [Keys.ProgramChanged]: (data: ProgramChangedData): ProgramChangedInput | null => {
      return programChangedPayload(data);
    },
    [Keys.MessagesDispatched]: (data: MessagesDispatchedData): MessageDispatchedDataInput => {
      return messagesDispatchedPayload(data);
    },
    [Keys.DatabaseWiped]: () => {
      return {};
    }
  };

  if(method in payloads){
    return payloads[method](data);
  } else {
    return null;
  }
}
