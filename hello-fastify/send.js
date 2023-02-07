var amqp = require("amqplib/callback_api");

amqp.connect(
  {
    username: "user",
    password: "password",
    port: 5671,
    protocol: "amqps",
    hostname: "amazon.amazonaws.com",
  },
  function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      var queue = "hello";
      var msg = "Hello World!";

      channel.assertQueue(queue, {
        durable: false,
      });
      channel.sendToQueue(queue, Buffer.from(msg));

      console.log(" [x] Sent %s", msg);
    });
    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  }
);
