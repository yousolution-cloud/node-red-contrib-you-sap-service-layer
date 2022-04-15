process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const Support = require('./support');

module.exports = function (RED) {
  function AuthenticateSapNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    // reset status
    node.status({});

    const flowContext = node.context().flow;

    flowContext.set(`_YOU_SapServiceLayer_${node.id}`, {
      host: config.host,
      port: config.port,
      version: config.version,
      credentials: {
        CompanyDB: node.credentials.company,
        UserName: node.credentials.user,
        Password: node.credentials.password,
      },
    });

    if (!node.credentials.user || !node.credentials.password || !node.credentials.company) {
      node.status({ fill: 'gray', shape: 'ring', text: 'Missing credentials' });
    }

    node.on('input', async (msg, send, done) => {
      // reset status
      node.status({});

      if (!node.credentials.user || !node.credentials.password || !node.credentials.company) {
        node.status({ fill: 'red', shape: 'dot', text: 'Missing credentials' });
        done(new Error('Missing credentials'));
        return;
      }

      const headers = flowContext.get(`_YOU_SapServiceLayer_${node.id}.headers`);

      msg._YOU_SapServiceLayer = {
        idAuth: node.id,
      };

      if (!headers) {
        try {
          const result = await Support.login(node, node.id);
          flowContext.set(`_YOU_SapServiceLayer_${node.id}.headers`, result.headers['set-cookie']);
        } catch (error) {
          msg.payload = error;
          if (error.response && error.response.data) {
            msg.statusCode = error.response.status;
            msg.payload = error.response.data;
          }
          node.send(msg);
          node.status({ fill: 'red', shape: 'dot', text: 'disconnected' });
          done(error);
          return;
        }
      }
      node.send(msg);
      node.status({ fill: 'green', shape: 'dot', text: 'connected' });
    });
  }
  RED.nodes.registerType('authenticateSap', AuthenticateSapNode, {
    credentials: {
      company: { type: 'text' },
      user: { type: 'text' },
      password: { type: 'password' },
    },
  });
};
