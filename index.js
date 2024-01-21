const Fastify = require("fastify");
const path = require("path");
const loginUtils = require("./login-utils");
const QRCode = require("qrcode");

const fastify = Fastify({
  logger: true,
});

fastify.get("/QR", async (request, reply) => {
  const response = await loginUtils.QR(request.headers["user-agent"]);
  reply.send({
    key: response["data"]["qrcode_key"],
    img: await QRCode.toDataURL(response["data"]["url"], {
      margin: 0,
      scale: 140 / 49,
    }),
  });
});

fastify.get("/poll", async (request, reply) => {
  const response = await loginUtils.poll(
    request.headers["user-agent"],
    request.query["key"]
  );
  reply.send({
    code: response["data"]["code"],
  });
});

fastify.get("/confirm", async (request, reply) => {
  const response = await loginUtils.confirm(
    request.headers["user-agent"],
    request.query["key"]
  );
  reply.send({
    code: response,
  });
});

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "static"),
  prefix: "/",
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
});
