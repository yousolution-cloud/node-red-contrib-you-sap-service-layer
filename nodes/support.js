process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axiosLibrary = require('axios');
const buildQuery = require('odata-query').default;

const thickIdApi = [
  'AccrualTypes',
  'AssetClasses',
  'AssetDepreciationGroups',
  'AssetGroups',
  'BankChargesAllocationCodes',
  'BusinessPartners',
  'CampaignResponseType',
  'CashDiscounts',
  'ChartOfAccounts',
  'ChooseFromList',
  'ContractTemplates',
  'CostCenterTypes',
  'CostElements',
  'Countries',
  'CreditCardPayments',
  'Currencies',
  'CustomsDeclaration',
  'CycleCountDeterminations',
  'DeductionTaxSubGroups',
  'DepreciationAreas',
  'DepreciationTypePools',
  'DepreciationTypes',
  'DistributionRules',
  'DunningTerms',
  'EmailGroups',
  'EmployeeIDType',
  'FAAccountDeterminations',
  'FactoringIndicators',
  'FiscalPrinter',
  'ItemImages',
  'Items',
  'JournalEntryDocumentTypes',
  'KPIs',
  'LandedCostsCodes',
  'LocalEra',
  'MobileAddOnSetting',
  'NFModels',
  'ProductTrees',
  'ProfitCenters',
  'Projects',
  'Queue',
  'ReportTypes',
  'Resources',
  'SalesTaxCodes',
  'TargetGroups',
  'TaxInvoiceReport',
  'TransactionCodes',
  'UserDefaultGroups',
  'UserObjectsMD',
  'UserPermissionTree',
  'UserTablesMD',
  'VatGroups',
  'Warehouses',
  'WithholdingTaxCodes',
  'WizardPaymentMethods',
  'UDT',
];

async function login(node, idAuth) {
  const flowContext = node.context().flow;

  const host = flowContext.get(`_YOU_SapServiceLayer_${idAuth}.host`);
  const port = flowContext.get(`_YOU_SapServiceLayer_${idAuth}.port`);
  const version = flowContext.get(`_YOU_SapServiceLayer_${idAuth}.version`);

  const url = `https://${host}:${port}/b1s/${version}/Login`;

  const credentials = flowContext.get(`_YOU_SapServiceLayer_${idAuth}.credentials`);
  const dataString = JSON.stringify(credentials);

  const options = {
    method: 'POST',
    url: url,
    rejectUnauthorized: false,
    data: credentials,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length,
    },
  };

  // try {
  return await axiosLibrary(options);
  // } catch (error) {
  //   throw Error(`ERROR FUNCTION LOGIN: ${error}`);
  // }
}

async function sendRequest({ node, msg, config, axios, login, options }) {
  if (!node || !msg || !config || !axios || !login) {
    const missingParams = [];
    node ? null : missingParams.push('node');
    msg ? null : missingParams.push('msg');
    config ? null : missingParams.push('config');
    axios ? null : missingParams.push('axios');
    login ? null : missingParams.push('login');
    throw new Error(`Missing mandatory params: ${missingParams.join(',')}.`);
  }
  let requestOptions = generateRequest(node, msg, config, options);
  try {
    return await axios(requestOptions.axiosOptions);
  } catch (error) {
    // Refresh headers re-login
    if (error.response && (error.response.status == 401 || error.response.status == 301)) {
      const flowContext = node.context().flow;
      // try {
      // update cookies for session timeout
      const result = await login(node, requestOptions.idAuthNode);
      flowContext.set(`_YOU_SapServiceLayer_${requestOptions.idAuthNode}.headers`, result.headers['set-cookie']);

      try {
        const headers = flowContext.get(`_YOU_SapServiceLayer_${requestOptions.idAuthNode}.headers`).join(';');

        requestOptions.axiosOptions.headers.Cookie = headers;

        return await axios(requestOptions.axiosOptions);
      } catch (error) {
        if (error.response && error.response.data) {
          msg.statusCode = error.response.status;
          msg.payload = error.response.data;
          msg.requestUrl = requestOptions.axiosOptions.url;
          node.send(msg);
          throw new Error(JSON.stringify(error.response.data));
        }
        throw error;
      }
      // }
    }
    if (error.response && error.response.data) {
      msg.statusCode = error.response.status;
      msg.payload = error.response.data;
      msg.requestUrl = requestOptions.axiosOptions.url;
      node.send(msg);
      throw new Error(JSON.stringify(error.response.data));
    }
    throw error;
  }
}

function generateRequest(node, msg, config, options) {
  options = options || {
    hasRawQuery: false,
    hasEntityId: false,
    isClose: false,
    isCrossJoin: false,
    service: null,
    manipulateMethod: null,
    method: 'GET',
    data: null,
  };
  // if (!options.typeOfNode) {
  //   throw new Error('Missing type of node');
  // }
  options.hasRawQuery = options.hasRawQuery || false;
  options.method = options.method || 'GET';
  options.data = options.data || null;
  options.hasEntityId = options.hasEntityId || false;
  options.isClose = options.isClose || false;
  options.isCrossJoin = options.isCrossJoin || false;
  options.isManipulate = options.isManipulate || false;
  options.isService = options.isService || false;
  options.service = options.service || null;
  options.manipulateMethod = options.manipulateMethod || null;

  const { idAuthNode, host, port, version, cookies } = getSapParams(node, msg, config);

  let rawQuery = null;
  let url;
  if (options.hasRawQuery) {
    try {
      rawQuery = eval(config.query);
    } catch (error) {
      throw new Error('Query editor error');
    }
  }

  let entity = config.entity;
  if (!entity && !options.isService) {
    throw new Error('Missing entity');
  }

  if (options.isService) {
    if (!config.service) {
      throw new Error('Missing service');
    }
  }

  if (entity == 'UDO') {
    entity = config.udo;
  }

  if (entity == 'UDT') {
    entity = config.udt;
  }

  if (entity == 'script') {
    const partnerName = config.partnerName;
    const scriptName = config.scriptName;
    url = `https://${host}:${port}/b1s/${version}/${entity}/${partnerName}/${scriptName}`;
  }

  const odataNextLink = msg[config.nextLink];

  if (!odataNextLink) {
    url = `https://${host}:${port}/b1s/${version}/${entity}`;
  }

  if (options.isCrossJoin) {
    url = `https://${host}:${port}/b1s/${version}/$crossjoin(${entity})`;
  }

  if (odataNextLink) {
    url = `https://${host}:${port}/b1s/${version}/${odataNextLink}`;
  }
  if (options.isClose && !options.hasEntityId) {
    throw new Error(`The options are not correct. If 'isClose' is true then 'hasEntityId' must be true.`);
  }

  if (options.hasEntityId) {
    let entityId = msg[config.entityId];
    if (!entityId && config.entity != 'UDO' && config.entity != 'UDT') {
      throw new Error('Missing entityId');
    }
    const docEntry = msg[config.docEntry];
    if (config.entity == 'UDO') {
      if (!docEntry) {
        throw new Error('Missing docEntry');
      }
      entityId = docEntry;
    }

    const code = msg[config.code];
    if (config.entity == 'UDT') {
      if (!code) {
        throw new Error('Missing Code');
      }
      entityId = code;
    }

    if (thickIdApi.includes(entity) || config.entity === 'UDT') {
      url = `https://${host}:${port}/b1s/${version}/${entity}('${entityId}')`;
    } else {
      url = `https://${host}:${port}/b1s/${version}/${entity}(${entityId})`;
    }

    if (options.isClose) {
      url += `/Close`;
    }

    if (options.isManipulate) {
      if (!config.manipulateMethod) {
        throw new Error('Missing method');
      }
      if (thickIdApi.includes(entity)) {
        url = `https://${host}:${port}/b1s/${version}/${entity}('${entityId}')/${config.manipulateMethod}`;
      } else {
        url = `https://${host}:${port}/b1s/${version}/${entity}(${entityId})/${config.manipulateMethod}`;
      }
    }
  }

  if (config.service) {
    url = `https://${host}:${port}/b1s/${version}/${config.service}`;
  }

  if (rawQuery && !odataNextLink) {
    const urlOdata = buildQuery(rawQuery);
    msg.odata = urlOdata;
    url = `${url}${urlOdata}`;
  }

  // const cookies = flowContext.get(`_YOU_SapServiceLayer_${idAuthNode}.headers`).join(';');
  const headers = { ...msg[config.headers], Cookie: cookies };

  let axiosOptions = {
    method: options.method,
    url: url,
    rejectUnauthorized: false,
    withCredentials: true,
    headers: headers,
  };

  if (options.data) {
    axiosOptions = { ...axiosOptions, ...{ data: options.data } };
  }

  return {
    axiosOptions: axiosOptions,
    idAuthNode: idAuthNode,
  };
}

function getSapParams(node, msg) {
  try {
    const flowContext = node.context().flow;

    const idAuthNode = msg._YOU_SapServiceLayer.idAuth;
    const host = flowContext.get(`_YOU_SapServiceLayer_${idAuthNode}.host`);
    const port = flowContext.get(`_YOU_SapServiceLayer_${idAuthNode}.port`);
    const version = flowContext.get(`_YOU_SapServiceLayer_${idAuthNode}.version`);

    // if (!flowContext.get(`_YOU_SapServiceLayer_${idAuthNode}.headers`)) {
    //   throw new Error('Authentication failed');
    // }
    const cookies = flowContext.get(`_YOU_SapServiceLayer_${idAuthNode}.headers`).join(';');

    return { idAuthNode: idAuthNode, host: host, port: port, version: version, cookies: cookies };
  } catch (error) {
    throw new Error('Authentication failed');
  }
}

module.exports = {
  login: login,
  generateRequest: generateRequest,
  sendRequest: sendRequest,
  thickIdApi: thickIdApi,
};
// if (process.env.NODE_ENV === 'test') {
//   console.log('TEST');
//   module.exports = {
//     login: login,
//     generateRequest: generateRequest,
//     sendRequest: sendRequest,
//     thickIdApi: thickIdApi,
//   };
// }
