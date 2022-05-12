const should = require('should');
const expect = require('chai').expect;
const sinon = require('sinon');
const Support = require('../nodes/support');
// import * as Support from '../nodes/support';

describe('support library', () => {
  // beforeEach((done) => {
  //   // helper.startServer(done);
  // });

  // afterEach(() => {
  //   // Restore the default sandbox here
  //   sinon.restore();
  // });

  describe('generateRequest() ', () => {
    it('should generate a correct request', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
      };
      const config = {
        entity: 'businessPartner',
        query: { select: ['ItemCode', 'ItemName'] },
      };
      let options = { method: 'GET', hasRawQuery: true };
      const expectedValue = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
          },
          method: 'GET',
          rejectUnauthorized: false,
          url: 'https://host:port/b1s/version/businessPartner?$select=ItemCode,ItemName',
          withCredentials: true,
        },
        idAuthNode: 1,
      };
      should.deepEqual(Support.generateRequest(node, msg, config, options), expectedValue);

      // Headers
      const config2 = {
        entity: 'businessPartner',
        headers: 'myHeaders',
        query: { select: ['ItemCode', 'ItemName'] },
      };
      const msg2 = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
        myHeaders: { Prefer: 'odata.maxpagesize=5' },
      };
      const options2 = { method: 'GET', hasRawQuery: false };
      const expectedValue2 = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
            Prefer: 'odata.maxpagesize=5',
          },
          method: 'GET',
          rejectUnauthorized: false,
          url: 'https://host:port/b1s/version/businessPartner',
          withCredentials: true,
        },
        idAuthNode: 1,
      };
      should.deepEqual(Support.generateRequest(node, msg2, config2, options2), expectedValue2);
    });

    it('should generate a correct request with entityId', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
        entityId: 1,
      };
      let config = {
        entity: 'BusinessPartner',
        entityId: 'entityId',
      };
      const options = { method: 'GET', hasRawQuery: true, hasEntityId: true };
      const expectedValue = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
          },
          method: 'GET',
          rejectUnauthorized: false,
          url: 'https://host:port/b1s/version/BusinessPartner(1)',
          withCredentials: true,
        },
        idAuthNode: 1,
      };

      should.deepEqual(Support.generateRequest(node, msg, config, options), expectedValue);

      config.entity = 'EmailGroups';
      const expectedValue1 = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
          },
          method: 'GET',
          rejectUnauthorized: false,
          url: `https://host:port/b1s/version/EmailGroups('1')`,
          withCredentials: true,
        },
        idAuthNode: 1,
      };

      // thick SAP hack
      should.deepEqual(Support.generateRequest(node, msg, config, options), expectedValue1);
    });
    it('should generate a correct request change HTTP VERB', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
      };
      let config = {
        entity: 'BusinessPartner',
      };
      const options = { method: 'POST', hasRawQuery: true, hasEntityId: false };
      const expectedValue = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
          },
          method: 'POST',
          rejectUnauthorized: false,
          url: 'https://host:port/b1s/version/BusinessPartner',
          withCredentials: true,
        },
        idAuthNode: 1,
      };

      should.deepEqual(Support.generateRequest(node, msg, config, options), expectedValue);
    });
    it('should generate a correct request with nextLink', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
        nextLink: 'BusinessPartners?$select=CardCode&$skip=50005',
      };
      const config = {
        entity: 'businessPartner',
        nextLink: 'nextLink',
        query: { select: ['ItemCode', 'ItemName'] },
      };
      let options = { method: 'GET', hasRawQuery: true };
      const expectedValue = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
          },
          method: 'GET',
          rejectUnauthorized: false,
          url: 'https://host:port/b1s/version/BusinessPartners?$select=CardCode&$skip=50005',
          withCredentials: true,
        },
        idAuthNode: 1,
      };
      should.deepEqual(Support.generateRequest(node, msg, config, options), expectedValue);
    });

    it('should generate a correct request Close', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
        entityId: 1,
      };
      const config = {
        entity: 'BusinessPartners',
        entityId: 'entityId',
      };
      let options = { method: 'POST', hasRawQuery: false, isClose: true, hasEntityId: true };
      const expectedValue = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
          },
          method: 'POST',
          rejectUnauthorized: false,
          url: `https://host:port/b1s/version/BusinessPartners('1')/Close`,
          withCredentials: true,
        },
        idAuthNode: 1,
      };
      should.deepEqual(Support.generateRequest(node, msg, config, options), expectedValue);
    });

    it('should generate a correct request with UDO', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
        DocEntry: 1,
      };
      let config = {
        entity: 'UDO',
        udo: 'YOU_SAP_CUSTOM_ENTITY',
        docEntry: 'DocEntry',
      };
      const options = { method: 'GET', hasRawQuery: true, hasEntityId: true };
      const expectedValue = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
          },
          method: 'GET',
          rejectUnauthorized: false,
          url: 'https://host:port/b1s/version/YOU_SAP_CUSTOM_ENTITY(1)',
          withCredentials: true,
        },
        idAuthNode: 1,
      };

      should.deepEqual(Support.generateRequest(node, msg, config, options), expectedValue);
    });

    it('should generate a request without DocEntry (UDO)', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
      };
      let config = {
        entity: 'UDO',
        udo: 'YOU_SAP_CUSTOM_ENTITY',
        docEntry: 'docEntry',
      };
      const options = { method: 'GET', hasRawQuery: true, hasEntityId: true };

      expect(() => {
        Support.generateRequest(node, msg, config, options);
      }).to.throw('Missing docEntry');
    });

    it('should generate a correct request with UDT', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
        Code: '0001',
      };
      let config = {
        entity: 'UDT',
        udt: 'YOU_SAP_CUSTOM_ENTITY',
        code: 'Code',
      };
      const options = { method: 'GET', hasRawQuery: true, hasEntityId: true };
      const expectedValue = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
          },
          method: 'GET',
          rejectUnauthorized: false,
          url: `https://host:port/b1s/version/YOU_SAP_CUSTOM_ENTITY('0001')`,
          withCredentials: true,
        },
        idAuthNode: 1,
      };

      should.deepEqual(Support.generateRequest(node, msg, config, options), expectedValue);
    });

    it('should generate a request without Code (UDT)', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
      };
      let config = {
        entity: 'UDT',
        udt: 'YOU_SAP_CUSTOM_ENTITY',
        code: 'Code',
      };
      const options = { method: 'GET', hasRawQuery: true, hasEntityId: true };

      expect(() => {
        Support.generateRequest(node, msg, config, options);
      }).to.throw('Missing Code');
    });

    it('should generate a correct cross join request', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const rawQuery = {
        expand: {
          Orders: { select: ['DocEntry', 'DocNum'] },
          BusinessPartners: { select: ['CardCode', 'CardName'] },
        },
        filter: {
          'Orders/CardCode': { eq: { type: 'raw', value: 'BusinessPartners/CardCode' } },
        },
        orderBy: ['CardCode desc'],
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
      };
      const config = {
        entity: 'BusinessPartners,Orders',
        query: rawQuery,
      };
      const options = { method: 'GET', hasRawQuery: true, hasEntityId: false, isCrossJoin: true };
      const expectedValue = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
          },
          method: 'GET',
          rejectUnauthorized: false,
          url: 'https://host:port/b1s/version/$crossjoin(BusinessPartners,Orders)?$filter=Orders/CardCode eq BusinessPartners/CardCode&$expand=Orders($select=DocEntry,DocNum),BusinessPartners($select=CardCode,CardName)&$orderby=CardCode desc',
          withCredentials: true,
        },
        idAuthNode: 1,
      };

      should.deepEqual(Support.generateRequest(node, msg, config, options), expectedValue);
    });

    it('should generate a correct request with Services', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
        DocEntry: 1,
      };
      let config = {
        service: 'ApprovalTemplatesService_GetApprovalTemplateList',
      };
      const options = { method: 'POST', hasRawQuery: false, hasEntityId: false, isService: true };
      const expectedValue = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
          },
          method: 'POST',
          rejectUnauthorized: false,
          url: 'https://host:port/b1s/version/ApprovalTemplatesService_GetApprovalTemplateList',
          withCredentials: true,
        },
        idAuthNode: 1,
      };

      should.deepEqual(Support.generateRequest(node, msg, config, options), expectedValue);
    });

    it('should generate a error request with Services missing service', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
        DocEntry: 1,
      };
      let config = {
        //  service: 'ApprovalTemplatesService_GetApprovalTemplateList',
      };
      const options = { method: 'POST', hasRawQuery: false, hasEntityId: false, isService: true };
      const expectedValue = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
          },
          method: 'POST',
          rejectUnauthorized: false,
          url: 'https://host:port/b1s/version/ApprovalTemplatesService_GetApprovalTemplateList',
          withCredentials: true,
        },
        idAuthNode: 1,
      };

      expect(() => {
        Support.generateRequest(node, msg, config, options);
      }).to.throw('Missing service');
    });

    it('should generate a correct request with Manipulate Entity', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
        entityId: 3,
      };
      let config = {
        entity: 'PickLists',
        entityId: 'entityId',
        manipulateMethod: 'GetReleasedAllocation',
      };
      const options = { method: 'POST', hasRawQuery: false, hasEntityId: true, isManipulate: true };
      const expectedValue = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
          },
          method: 'POST',
          rejectUnauthorized: false,
          url: 'https://host:port/b1s/version/PickLists(3)/GetReleasedAllocation',
          withCredentials: true,
        },
        idAuthNode: 1,
      };

      should.deepEqual(Support.generateRequest(node, msg, config, options), expectedValue);
    });

    it('should generate an error request with Manipulate Entity missing entity', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
        entityId: 3,
      };
      let config = {
        // entity: 'PickLists',
        entityId: 'entityId',
        manipulateMethod: 'GetReleasedAllocation',
      };
      const options = { method: 'POST', hasRawQuery: false, hasEntityId: true, isManipulate: true };

      expect(() => {
        Support.generateRequest(node, msg, config, options);
      }).to.throw('Missing entity');
    });

    it('should generate an error request with Manipulate Entity missing entity id', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
        entityId: 3,
      };
      let config = {
        entity: 'PickLists',
        // entityId: 'entityId',
        manipulateMethod: 'GetReleasedAllocation',
      };
      const options = { method: 'POST', hasRawQuery: false, hasEntityId: true, isManipulate: true };

      expect(() => {
        Support.generateRequest(node, msg, config, options);
      }).to.throw('Missing entityId');
    });

    it('should generate an error request with Manipulate Entity missing method', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
        entityId: 3,
      };
      let config = {
        entity: 'PickLists',
        entityId: 'entityId',
        // manipulateMethod: 'GetReleasedAllocation',
      };
      const options = { method: 'POST', hasRawQuery: false, hasEntityId: true, isManipulate: true };

      expect(() => {
        Support.generateRequest(node, msg, config, options);
      }).to.throw('Missing method');
    });

    it('should generate a correct request with SQLQuery create query', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
        entityId: 3,
      };
      let config = {
        sqlCode: 'sqlCode',
        sqlName: 'sqlName',
        sqlText: 'sqlText',
      };
      const options = { method: 'POST', hasRawQuery: false, hasEntityId: false, isSQLQuery: true };
      const expectedValue = {
        axiosOptions: {
          headers: {
            Cookie: 'header:1;header:2',
          },
          method: 'POST',
          rejectUnauthorized: false,
          url: 'https://host:port/b1s/version/SQLQueries',
          withCredentials: true,
        },
        idAuthNode: 1,
      };

      should.deepEqual(Support.generateRequest(node, msg, config, options), expectedValue);
    });

    it('should have error missing object', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
      };
      const config = {};
      const options = { method: 'GET', hasRawQuery: true };

      expect(() => {
        Support.generateRequest(node, msg, config, options);
      }).to.throw('Missing entity');
    });

    it('should have error missing idAuthNode', () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {},
            },
          };
        },
      };

      const msg = {};
      const config = {};
      const options = { method: 'GET', hasRawQuery: true };

      expect(() => {
        Support.generateRequest(node, msg, config, options);
      }).to.throw('Authentication failed');
    });
  });

  describe('sendRequest()', () => {
    it('should send a correct request', async () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const login = async () => Promise.resolve();

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
      };
      const config = {
        entity: 'businessPartner',
      };
      const options = { method: 'GET', hasRawQuery: true };
      const axios = async () => {
        return true;
      };

      const actual = await Support.sendRequest({ node, msg, config, login, axios, options });

      should.equal(actual, true);
    });

    it('should send a request without mandatory arguments', async () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
      };
      const config = {
        entity: 'businessPartner',
      };
      const options = { method: 'GET', hasRawQuery: true };

      const expect = new Error(`Missing mandatory params: config,axios,login.`);
      try {
        await Support.sendRequest({ node, msg, options });
      } catch (error) {
        should.deepEqual(error, expect);
      }
    });

    it('should send session error', async () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
              set: (param) => {},
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
      };
      const config = {
        entity: 'businessPartner',
      };
      const options = { method: 'GET', hasRawQuery: true };

      const stubLogin = sinon.stub();
      stubLogin.resolves({
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': 100,
          'set-cookie': 'cookie1=1;cookie2',
        },
      });

      const axios = sinon.stub();
      axios.onCall(0).returns(
        Promise.reject({
          response: {
            status: 301,
          },
        })
      );
      axios.onCall(1).returns(true);

      const actual = await Support.sendRequest({ node, msg, config, login: stubLogin, axios, options });
      should.equal(actual, true);
    });

    it('should send a generic error', async () => {
      const node = {
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
      };
      const config = {
        entity: 'businessPartner',
      };
      const options = { method: 'GET', hasRawQuery: true };
      const login = async () => Promise.resolve();
      const axios = async () => {
        return Promise.reject(new Error('Custom error'));
      };

      let actual = null;
      try {
        await Support.sendRequest({ node, msg, config, axios, login, options });
      } catch (error) {
        actual = error;
      }

      should.deepEqual(actual, new Error('Custom error'));
    });

    it('should handle axios response error #1', async () => {
      const node = {
        send: () => {},
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
      };
      const config = {
        entity: 'businessPartner',
      };
      const options = { method: 'GET', hasRawQuery: true };

      const axiosError = {
        response: {
          data: 'Custom Error',
        },
      };

      const expect = new Error(JSON.stringify(axiosError.response.data));

      const login = async () => Promise.resolve({});
      const axios = async () => {
        return Promise.reject(axiosError);
      };

      let actual = null;
      try {
        await Support.sendRequest({ node, msg, config, axios, login, options });
      } catch (error) {
        actual = error;
      }

      should.deepEqual(actual, expect);
    });

    it('should handle axios response error 401 #2', async () => {
      const node = {
        send: () => {},
        context: () => {
          return {
            flow: {
              get: (param) => {
                if (param == '_YOU_SapServiceLayer_1.host') {
                  return 'host';
                }
                if (param == '_YOU_SapServiceLayer_1.port') {
                  return 'port';
                }
                if (param == '_YOU_SapServiceLayer_1.version') {
                  return 'version';
                }
                if (param == '_YOU_SapServiceLayer_1.headers') {
                  return ['header:1', 'header:2'];
                }
              },
              set: () => {},
            },
          };
        },
      };

      const msg = {
        _YOU_SapServiceLayer: {
          idAuth: 1,
        },
      };
      const config = {
        entity: 'businessPartner',
      };
      const options = { method: 'GET', hasRawQuery: true };

      const axiosError = {
        response: {
          status: 401,
          data: 'Custom Error',
        },
      };

      const expect = new Error(JSON.stringify(axiosError.response.data));

      const login = async () =>
        Promise.resolve({
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': 100,
            'set-cookie': 'cookie1=1;cookie2',
          },
        });
      const axios = async () => {
        return Promise.reject(axiosError);
      };

      let actual = null;
      try {
        await Support.sendRequest({ node, msg, config, axios, login, options });
      } catch (error) {
        actual = error;
      }

      should.deepEqual(actual, expect);
    });
  });
});
