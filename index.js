const Fastify = require("fastify");
const path = require('path')

require("./login-handler")();

const fastify = Fastify({
  logger: true,
});

fastify.get("/getQR", (request, reply) => {
  reply.send({
    img: "data:image/png;base64,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",
  });
});

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'static'),
  prefix: '/',
})

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
});