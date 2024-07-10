import * as dotenv from "dotenv";
import { Kafka, logLevel } from "kafkajs";

dotenv.config();

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:29092"],
  logLevel: logLevel.ERROR,
});

const admin = kafka.admin();
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "kafka-node-group" });

async function getTopicsMatchingPattern(pattern: RegExp): Promise<string[]> {
  await admin.connect();
  const topics = await admin.listTopics();
  await admin.disconnect();

  return topics.filter((topic) => pattern.test(topic));
}

async function main() {
  if (!process.env.KAFKA_SOURCE_TOPICS) {
    throw new Error("KAFKA_SOURCE_TOPICS is not defined");
  }

  const pattern = new RegExp(process.env.KAFKA_SOURCE_TOPICS); // 정규 표현식 패턴
  console.log("Pattern: ", pattern);
  const topicsToConsume = await getTopicsMatchingPattern(pattern);

  if (topicsToConsume.length === 0) {
    console.log("No matching topics found");
    return;
  }

  console.log("Topics to consume: ", topicsToConsume);

  await producer.connect();
  await consumer.connect();

  console.log("Connected to Kafka");

  for (const topic of topicsToConsume) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        message: message.value?.toString(),
      });

      const payload = {
        topic: "all-changes-topic",
        messages: [{ value: message.value?.toString() || null }],
      };

      await producer.send(payload);
    },
  });
}

main().catch(console.error);
