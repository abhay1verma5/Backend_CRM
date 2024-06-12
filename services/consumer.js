import amqplib from 'amqplib';
import CommunicationLog from '../models/CommunicationLog.js';

const queue = 'crm_queue';

export const connectQueue = async () => {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    console.log(`Connected to RabbitMQ and asserted queue: ${queue}`);
    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
};

export const processMessage = async (key,message) => {

  if (!message ) {
    console.error('Received message is invalid:', message);
    return;
  }

  



  if (key === 'send_campaign') {
    const { logId, customerId,status} = message;


    const Status = Math.random() > 0.1 ? 'PENDING' : 'SENT';
    const log = await CommunicationLog.findById(logId);

    if (!log) {
      console.error(`Log with ID ${logId} not found`);
      return;
    }

    const messageIndex = log.messages.findIndex((msg) => msg.customerId.toHexString() === customerId);
    console.log(messageIndex,log.messages[0])
    if (messageIndex === -1) {
      console.error(`Message for customer ${customerId} not found in log ${logId}`);
      return;
    }

    
   
    log.messages[messageIndex].status = Status;
    await log.save();
    console.log(`Message for customer ${customerId} ${Status}`);
  } else {
    console.error(`Unknown key: ${key}`);
  }
};

const startConsumer = async () => {
  const channel = await connectQueue();
  if (!channel) return;

  channel.consume(queue, async (message) => {
    if (message !== null) {
      await processMessage(message);
      channel.ack(message);
    }
  }, { noAck: false });
};

startConsumer();
