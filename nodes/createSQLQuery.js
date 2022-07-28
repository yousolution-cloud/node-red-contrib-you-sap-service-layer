process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
const Support = require('./support');

module.exports = function (RED) {
  function CreateSQLQuery(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    // reset status
    node.status({});

    node.on('input', async (msg, send, done) => {
      // reset status
      node.status({});
      try {
        // const data = msg[config.bodyPost];
        const data = {
          SqlCode: msg[config.sqlCode],
          SqlName: msg[config.sqlName],
          SqlText: msg[config.sqlText],
        };

        if (!data.SqlCode || !data.SqlName || !data.SqlText) {
          const missingParams = [];
          data.SqlCode ? null : missingParams.push('SqlCode');
          data.SqlName ? null : missingParams.push('SqlName');
          data.SqlText ? null : missingParams.push('SqlText');
          done(new Error(`Missing mandatory params: ${missingParams.join(',')}.`));
          return;
        }

        // if (!data.SqlCode) {
        //   node.status({ fill: 'red', shape: 'dot', text: 'SqlCode must have value' });
        //   done(new Error('SqlCode must have value'));
        //   return;
        // }
        // if (!data.SqlName) {
        //   node.status({ fill: 'red', shape: 'dot', text: 'SqlName must have value' });
        //   done(new Error('SqlName must have value'));
        //   return;
        // }
        // if (!data.SqlText) {
        //   node.status({ fill: 'red', shape: 'dot', text: 'SqlText must have value' });
        //   done(new Error('SqlText must have value'));
        //   return;
        // }

        // if (!data) {
        //   node.status({ fill: 'red', shape: 'dot', text: 'bodyPost must have value' });
        //   done(new Error('bodyPost must have value'));
        //   return;
        // }
        const options = { method: 'POST', hasRawQuery: false, isCreateSQLQuery: true, data: data };
        const login = Support.login;
        const result = await Support.sendRequest({ node, msg, config, axios, login, options });
        msg.payload = result;
        msg.statusCode = result.status;
        node.status({ fill: 'green', shape: 'dot', text: 'success' });
        node.send(msg);
      } catch (error) {
        node.status({ fill: 'red', shape: 'dot', text: 'Error' });
        done(error);
      }
    });
  }
  RED.nodes.registerType('createSQLQuery', CreateSQLQuery, {});
};
