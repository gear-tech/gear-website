import { Channel, connect, Connection } from 'amqplib';
import { RabbitMQExchanges, RabbitMQueues } from '@gear-js/common';

import config from '../config/configuration';
import { gearService } from '../gear';
import { directMessageConsumer, topicMessageConsumer } from './consumer';

export let connectionAMQP: Connection;
export let mainChannelAMQP: Channel;
export let topicChannelAMQP: Channel;

export async function initAMQ(): Promise<void> {
  try {
    connectionAMQP = await connect(config.rabbitmq.url);
    mainChannelAMQP = await connectionAMQP.createChannel();
    topicChannelAMQP = await connectionAMQP.createChannel();
    const directExchange = RabbitMQExchanges.DIRECT_EX;
    const topicExchange = RabbitMQExchanges.TOPIC_EX;
    const genesis = gearService.getGenesisHash();
    const directExchangeType = 'direct';
    const topicExchangeType = 'topic';
    const routingKey = `tb.${genesis}`;

    //send genesis
    const messageBuff = JSON.stringify({ service: 'tb', action: 'add', genesis });
    mainChannelAMQP.publish(directExchange, RabbitMQueues.GENESISES, Buffer.from(messageBuff));

    await mainChannelAMQP.assertExchange(directExchange, directExchangeType);
    await mainChannelAMQP.assertExchange(topicExchange, topicExchangeType);

    const assertTopicQueue = await topicChannelAMQP.assertQueue(`tbt.${genesis}`, {
      durable: false,
      autoDelete: true,
      exclusive: false,
    });

    await mainChannelAMQP.bindQueue(routingKey, directExchange, routingKey);
    await mainChannelAMQP.bindQueue(assertTopicQueue.queue, topicExchange, 'tb.genesises');

    await directMessageConsumer(mainChannelAMQP, routingKey);
    await topicMessageConsumer(topicChannelAMQP, assertTopicQueue);
  } catch (error) {
    console.error(`${new Date()} | Init AMQP error`, error);
  }
}