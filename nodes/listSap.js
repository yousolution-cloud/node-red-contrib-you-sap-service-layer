process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
const Support = require('./support');
const buildQuery = require('odata-query').default;
const { VerifyErrorSL } = require('./manageErrors');

module.exports = function (RED) {
  function ListSapNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    // reset status
    node.status({});

    node.on('input', async (msg, send, done) => {
      // reset status
      node.status({});

      try {
        const options = { method: 'GET', hasRawQuery: true };
        const login = Support.login;
        const result = await Support.sendRequest({ node, msg, config, axios, login, options });
        msg.payload = VerifyErrorSL(node, msg, result.data);//result.data;
        msg.nextLink = result.data['odata.nextLink'] || result.data['@odata.nextLink'];
        msg.statusCode = result.status;
        if(msg.payload) {
          node.status({ fill: 'green', shape: 'dot', text: 'success' });
          node.send(msg);
        }
      } catch (error) {
        node.status({ fill: 'red', shape: 'dot', text: 'Error' });
        done(error);
      }
    });
  }
  RED.nodes.registerType('listSap', ListSapNode, {});
};
