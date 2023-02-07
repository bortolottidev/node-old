import fastify from "fastify";
import S from "fluent-json-schema";
import amqp from "amqplib";

let amqpClient;
amqp
  .connect({
    username: "user",
    password: "password",
    port: 5671,
    protocol: "amqps",
    hostname: "hostname.amazonaws.com",
  })
  .then((client) => (amqpClient = client));

const app = fastify();

app.register(import("./opla.js"));

app.decorate("repeat", async (val, times) => {
  return val.repeat(times);
});

app.addHook("onRequest", async function (req, reply) {
  console.log(this.repeat("opla", 3));
});

app.addHook("onRequest", async (req, reply) => {
  console.log("OPLA");
});

app.get("/status", { version: "1.0.0" }, async (req, reply) => {
  return {
    status: "ok",
  };
});

app.get("/send", async () => {
  const channel = await amqpClient.createChannel()

  var queue = "hello"
  var msg = "Hello World!"

  channel.assertQueue(queue, {
    durable: false,
  })
  channel.sendToQueue(queue, Buffer.from(msg))

  console.log(" [x] Sent %s", msg)
  return { ok: 200 }
})

app.get("/receive", async () => {
  const channel = await amqpClient.createChannel()

  var queue = "hello"

  channel.assertQueue(queue, {
    durable: false,
  })
  console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue)

  // PRoblema; il canale così rimane aperto fino al primo ack.. 
  // Forse bisognerebbe  usare channel.get?
  channel.consume(
    queue,
    async (msg) => {
      console.log(" [x] Received %s", msg.content.toString())
      console.log(" -> %s msg waiting", prefetch)
      channel.ack(msg)
      channel.close()
    }
  )

  return { ok: 200 }
})

app.route({
  method: "POST",
  path: "/status",
  version: "2.0.0",
  schema: {
    body: S.object()
      .additionalProperties(false)
      .prop("name", S.string().required()),
    response: {
      200: S.object().prop("status", S.string()),
    },
  },
  handler: async (req, reply) => {
    console.log(app.foo);
    return {
      status: "ok",
      foo: "bar",
    };
  },
});

app.listen(3000, console.log);
