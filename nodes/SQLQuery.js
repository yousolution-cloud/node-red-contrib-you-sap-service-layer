process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
const Support = require('./support');

module.exports = function (RED) {
  function SQLQuery(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    // reset status
    node.status({});

    node.on('input', async (msg, send, done) => {
      // reset status
      node.status({});
      try {
        const data = msg[config.bodyPost];
        const params = {
          SqlCode: msg[config.sqlCode],
        };

        if (!params.SqlCode) {
          const missingParams = [];
          params.SqlCode ? null : missingParams.push('SqlCode');
          done(new Error(`Missing mandatory params: ${missingParams.join(',')}.`));
          return;
        }

        const options = { method: 'POST', hasRawQuery: false, isSQLQuery: true, data: data };
        const login = Support.login;
        const result = await Support.sendRequest({ node, msg, config, axios, login, options });
        msg.payload = result.data;
        msg.nextLink = result.data['odata.nextLink'];
        msg.statusCode = result.status;
        node.status({ fill: 'green', shape: 'dot', text: 'success' });
        node.send(msg);
      } catch (error) {
        node.status({ fill: 'red', shape: 'dot', text: 'Error' });
        done(error);
      }
    });
  }
  RED.nodes.registerType('SQLQuery', SQLQuery, {});
};
