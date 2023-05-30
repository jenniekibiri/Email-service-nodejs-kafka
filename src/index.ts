import { Kafka, EachMessagePayload } from "kafkajs";
import { createTransport } from "nodemailer";
const kafka = new Kafka({
  clientId: "email-consumer",
  brokers: ["pkc-6ojv2.us-west4.gcp.confluent.cloud:9092"],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: "BLM3TQS2LD7RBGRF",
    password:
      "ye+HC2dt2tyVeTfmW10GaxrATsKlX+mjJiZBMaYz42Njqk/CilL+b4K2a74XxTaH",
  },
  connectionTimeout: 3000,
  enforceRequestTimeout: true,
});
const transporter = createTransport({

  host: "mailhog",
  port: 1025,

});

const consumer = kafka.consumer({ groupId: "email-consumer" });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "default" });
  await consumer.run({
    eachMessage: async (message: EachMessagePayload) => {
      console.log("Email sent", message.message,"test");
      // const order = JSON.parse(message.message.value.toString());
      await transporter.sendMail({
        from: "from@example.com",
        to: "jennykibiri@gmail.com",
        subject: "An order has been completed",
        html: `Order #{order.id} with a total of {order.id} has been completed`,
      });

      await transporter.sendMail({
        from: "from@example.com",
        to: "from@example.com",
        subject: "An order has been completed",
        html: `You earned {order.ambassador_revenue} from the link #{order.code}`,
      });
    },
  });
  transporter.close();
};

run().then(() => console.error);
