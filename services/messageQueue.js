import amqplib from 'amqplib';
import Customer from '../models/Customer.js';

const queue = 'crm_queue';
let channel;

export const connectQueue = async () => {
  try {
    const connection = await amqplib.connect('amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    console.log(`Connected to RabbitMQ and asserted queue: ${queue}`);
    consumeQueue();
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
};

export const publishToQueue = async (key, message) => {
  try {
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ key, message })), { persistent: true });
    console.log(`Published message to queue: ${queue} | Key: ${key} | Message: ${JSON.stringify(message)}`);
  } catch (error) {
    console.error('Error publishing message to RabbitMQ:', error);
  }
};

const consumeQueue = async () => {
  try {
    channel.consume(queue, async (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        const { key, message: payload } = content;
        console.log(`Received message from queue: ${queue} | Key: ${key} | Payload:`, payload);

     
        if (key === 'customer_created') {
          const newCustomer = new Customer(payload);
          await newCustomer.save();
        }

        channel.ack(message);
      }
    });
    console.log(`Started consuming messages from queue: ${queue}`);
  } catch (error) {
    console.error('Error consuming messages from RabbitMQ:', error);
  }
};

connectQueue();
