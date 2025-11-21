process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const Support = require('./support');

module.exports = function (RED) {
  function AuthenticateSapNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    // reset status
    node.status({});

    let ConfigsHeaders = config.headers ? config.headers.reduce((acc, header) => {
    // Se keyValue è vuoto, usa keyType come chiave
    const key = header.keyValue === "" ? header.keyType : header.keyValue;
    const value = header.valueValue;
    
    acc[key] = value;
    return acc;
    }, {}) : {};


    const globalContext = node.context().global;

    globalContext.set(`_YOU_SapServiceLayer_${node.id}`, {
      host: config.host,
      port: config.port,
      version: config.version,
      staticHeaders: ConfigsHeaders,
      credentials: {
        CompanyDB: node.credentials.company,
        UserName: node.credentials.user,
        Password: node.credentials.password,
      },
    });

    if (!node.credentials.user || !node.credentials.company) {
      node.status({ fill: 'gray', shape: 'ring', text: 'Missing credentials' });
    }

    node.on('input', async (msg, send, done) => {

      if(!node.credentials.password && !msg.password){
        node.status({ fill: 'gray', shape: 'ring', text: 'Missing credentials Password Code' });
      }

      if(msg.password){
        globalContext.set(`_YOU_SapServiceLayer_${node.id}.credentials.Password`, msg.password);
        //node.status({ fill: 'gray', shape: 'ring', text: 'Missing credentials Password Code' });
      }
      
      // If Company setted from msg
      if (node.credentials.companyType == 'msg') {
        const company = msg[node.credentials.company];
        let currentCompany = globalContext.get(`_YOU_SapServiceLayer_${node.id}.credentials.CompanyDB`);

        if(company !== currentCompany) {
          globalContext.set(`_YOU_SapServiceLayer_${node.id}.headers`, null);
        }

        globalContext.set(`_YOU_SapServiceLayer_${node.id}.credentials.CompanyDB`, company);

      }

      //If User setted from msg
      if (node.credentials.userType == 'msg') {
        const user = msg[node.credentials.user];
        let currentUser = globalContext.get(`_YOU_SapServiceLayer_${node.id}.credentials.UserName`);
        
        if(user !== currentUser) {
          globalContext.set(`_YOU_SapServiceLayer_${node.id}.headers`, null);
        }
        globalContext.set(`_YOU_SapServiceLayer_${node.id}.credentials.UserName`, user);
      }

      // reset status
      node.status({});

      if (!node.credentials.user || !node.credentials.company) {
        node.status({ fill: 'red', shape: 'dot', text: 'Missing credentials' });
        done(new Error('Missing credentials'));
        return;
      }

      let currentDate = new Date();
      const headers = globalContext.get(`_YOU_SapServiceLayer_${node.id}.headers`);
      const exipiredTime = globalContext.get(`_YOU_SapServiceLayer_${node.id}.exp`);
      let validToken = true;

      msg._YOU_SapServiceLayer = {
        idAuth: node.id,
      };

      if(headers && exipiredTime) {
        let providedDate = new Date(exipiredTime);
        let timeDifference = currentDate - providedDate;
        let minutesDifference = timeDifference / (1000 * 60);
        validToken = minutesDifference > 25 ? false : true;
      }

      if (!headers  || !validToken) {
        try {
          const result = await Support.login(node, node.id);
          if(result.data.hasOwnProperty("error")) {
            node.error( result.data.error , msg);
            node.status({ fill: 'red', shape: 'dot', text: 'disconnected' });
          }
          else {
            globalContext.set(`_YOU_SapServiceLayer_${node.id}.headers`, result.headers['set-cookie']);
            globalContext.set(`_YOU_SapServiceLayer_${node.id}.exp`, currentDate.toISOString());
            node.send(msg);
            node.status({ fill: 'green', shape: 'dot', text: 'connected' });
          }
          // globalContext.set(`_YOU_SapServiceLayer_${node.id}.headers`, result.headers['set-cookie']);
          // globalContext.set(`_YOU_SapServiceLayer_${node.id}.exp`, currentDate.toISOString());
        } catch (error) {
          msg.payload = error;
          if (error.response && error.response.data) {
            msg.statusCode = error.response.status;
            msg.payload = error.response.data;
          }
          node.error( error , msg);
          //node.send(msg);
          node.status({ fill: 'red', shape: 'dot', text: 'disconnected' });
          done(error);
          //return;
        }
      }
      else {
        node.send(msg);
        node.status({ fill: 'green', shape: 'dot', text: 'connected' });
      }

    });
  }
  RED.nodes.registerType('authenticateSap', AuthenticateSapNode, {
    credentials: {
      company: { type: 'text' },
      companyType: { type: 'text' },
      user: { type: 'text' },
      userType: { type: 'text' },
      password: { type: 'password' },
      headers: {},
    },
  });
};
