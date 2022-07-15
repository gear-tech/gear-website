import { filterEvents } from '@polkadot/api/util';
import { KAFKA_TOPICS } from '@gear-js/common';

import { eventListenerLogger } from '../common/event-listener.logger';
import { kafkaProducer } from '../kafka/producer';
import { SendByKafkaTopicInput } from '../kafka/types';
import { GearSignedBlock } from '../gear/types';
import { sleep } from '../utils';

async function updateMessagePayload<T>(
  signedBlock: GearSignedBlock | any,
  events: any,
  status: T | any,
): Promise<void> {
  await sleep(1000);
  const eventMethods = ['sendMessage', 'submitProgram', 'sendReply'];
  const extrinsics = signedBlock.block.extrinsics.filter(({ method: { method } }: { method: { method: string } }) =>
    eventMethods.includes(method),
  );

  for (const {
    hash,
    args,
    method: { method },
  } of extrinsics) {
    const filteredEvents: any[] = filterEvents(hash.toHex(), signedBlock, events, status)
      .events!.filter(({ event: { method } }) => method === 'MessageEnqueued')
      .map((event) => event.toHuman());

    const messageId = filteredEvents[0].event!.data.id;
    const payload = getPayload(args, method);

    try {
      const sendByKafkaTopicInput: SendByKafkaTopicInput = {
        topic: KAFKA_TOPICS.MESSAGE_UPDATE_DATA,
        params: { messageId, payload },
      };
      await kafkaProducer.send(sendByKafkaTopicInput);
    } catch (error) {
      eventListenerLogger.error(error);
      console.log(error);
    }
  }
}

function getPayload(args: any, method: string) {
  const index = ['sendMessage', 'sendReply'].includes(method) ? 1 : 2;
  return args[index].toHuman();
}

export const gearService = { updateMessagePayload };
