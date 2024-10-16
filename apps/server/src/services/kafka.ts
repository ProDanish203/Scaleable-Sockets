import { Kafka, Producer } from "kafkajs";
import fs from "fs";
import path from "path";
import prisma from "./prisma";

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER as string],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./src/services/ca.pem"), "utf-8")],
  },
  sasl: {
    username: process.env.KAFKA_USERNAME as string,
    password: process.env.KAFKA_PASSWORD as string,
    mechanism: "plain",
  },
});

let producer: Producer | null = null;

export const createProducer = async () => {
  if (producer) return producer;
  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
};

export const produceMessage = async (message: string) => {
  const producer = await createProducer();
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: message }],
    topic: "Messages",
  });
  return true;
};

export const createConsumer = async (topic: string) => {
  const consumer = kafka.consumer({ groupId: "test-group" });
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  return consumer;
};

export const startMessageConsumer = async () => {
  const consumer = await createConsumer("Messages");
  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ topic, partition, message, pause }) => {
      console.log("Received message", message);
      if (!message.value) return;
      try {
        await prisma.messages.create({
          data: {
            message: message.value.toString(),
          },
        });
      } catch (error) {
        console.log("Something went wrong", error);
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "Messages" }]);
        }, 60 * 1000);
      }
    },
  });
};

export default kafka;
