process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
const Support = require('./support');

module.exports = function (RED) {
  function PatchSapNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    // reset status
    node.status({});

    node.on('input', async (msg, send, done) => {
      // reset status
      node.status({});
      try {
        const data = msg[config.bodyPatch];
        if (!data) {
          node.status({ fill: 'red', shape: 'dot', text: 'bodyPatch must have value' });
          done(new Error('bodyPatch must have value'));
          return;
        }
        const options = { method: 'PATCH', hasRawQuery: false, hasEntityId: true, data: data };
        const login = Support.login;
        const result = await Support.sendRequest({ node, msg, config, axios, login, options });
        msg.payload = result.data;
        msg.statusCode = result.status;
        node.status({ fill: 'green', shape: 'dot', text: 'success' });
        node.send(msg);
      } catch (error) {
        node.status({ fill: 'red', shape: 'dot', text: 'Error' });
        done(error);
      }
    });
  }
  RED.nodes.registerType('patchSap', PatchSapNode, {});
};
