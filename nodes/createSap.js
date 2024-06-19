process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
const Support = require('./support');
const { VerifyErrorSL } = require('./manageErrors');

module.exports = function (RED) {
  function CreateSapNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    // reset status
    node.status({});

    node.on('input', async (msg, send, done) => {
      // reset status
      node.status({});
      try {
        let data = msg[config.bodyPost];
        if (!data) {
          node.status({ fill: 'red', shape: 'dot', text: 'bodyPost must have value' });
          done(new Error('bodyPost must have value'));
          return;
        }
        const options = { method: 'POST', hasRawQuery: false, data: data };
        const login = Support.login;
        const result = await Support.sendRequest({ node, msg, config, axios, login, options });
        msg.payload =VerifyErrorSL(node, msg, result.data);// result.data;
        msg.statusCode = result.status;
        if(msg.payload) {
          node.status({ fill: 'green', shape: 'dot', text: 'success' });
          node.send(msg);
        }
      } catch (error) {
        node.status({ fill: 'red', shape: 'dot', text: 'Error' });
        //node.error(error, msg);
       // done(error);
      }
    });
  }
  RED.nodes.registerType('createSap', CreateSapNode, {});
};
