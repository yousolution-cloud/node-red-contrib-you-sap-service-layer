const should = require('should');
const helper = require('node-red-node-test-helper');
const createSap = require('../nodes/createSap');
const Context = require('../node_modules/./@node-red/runtime/lib/nodes/context/index');
const sinon = require('sinon');
const Support = require('../nodes/support');

helper.init(require.resolve('node-red'));

describe('createSap Node', () => {
  beforeEach((done) => {
    helper.startServer(done);
  });

  function initContext(done) {
    Context.init({
      contextStorage: {
        memory0: {
          module: 'memory',
        },
        memory1: {
          module: 'memory',
        },
      },
    });
    Context.load().then(function () {
      done();
    });
  }

  afterEach((done) => {
    helper
      .unload()
      .then(function () {
        return Context.clean({ allNodes: {} });
      })
      .then(function () {
        return Context.close();
      })
      .then(function () {
        helper.stopServer(done);
      });

    // Restore the default sandbox here
    sinon.restore();

    // helper.unload();
    // helper.stopServer(done);
  });

  it('should be loaded', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'createSap',
        name: 'createSap',
        wires: [['n2']],
        z: 'flow',
        rules: [{ t: 'set', p: 'payload', to: '#:(memory1)::flowValue', tot: 'flow' }],
      },
    ];

    helper.load(createSap, flow, () => {
      initContext(function () {
        const n1 = helper.getNode('n1');

        // console.log(helper.log().args);

        // n1.context().flow.set('A', 1, 'memory1', function (error) {
        //   console.log(error);
        // });

        // console.log(n1.context().flow.get('A', 'memory1'));
        // console.log('- - - B- - - -');

        // n1.id
        // flow.push({
        //   [`_YOU_SapServiceLayer_${n1.id}.headers`]:
        // })

        try {
          // n1.status.calledWith({ fill: 'gray', shape: 'ring', text: 'Set credentials1' });
          // should.equal(n1.status.calledWith({ fill: 'gray', shape: 'ring', text: 'Missing credentials' }), true);
          n1.should.have.property('name', 'createSap');
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  it('should have correct request with data', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'createSap',
        name: 'createSap',
        wires: [['n2']],
        z: 'flow',
        bodyPost: 'data',
        rules: [{ t: 'set', p: 'payload', to: '#:(memory1)::flowValue', tot: 'flow' }],
      },
      { id: 'n2', type: 'helper' },
    ];
    helper.load(createSap, flow, () => {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');

      sinon.stub(Support, 'sendRequest').resolves('ok');

      n1.receive({ data: { cardCode: '00000001', cardName: '0000001' } });

      n2.on('input', (msg) => {
        try {
          msg.should.have.property('_msgid');
          msg.should.have.property('payload', 'ok');
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  it('should have request without data', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'createSap',
        name: 'createSap',
        wires: [['n2']],
        z: 'flow',
        bodyPost: 'data',
        rules: [{ t: 'set', p: 'payload', to: '#:(memory1)::flowValue', tot: 'flow' }],
      },
    ];
    helper.load(createSap, flow, () => {
      const n1 = helper.getNode('n1');

      n1.receive({});

      n1.on('call:error', (error) => {
        try {
          error.should.have.property('firstArg', new Error('bodyPost must have value'));
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  it('should handle the error', (done) => {
    const flow = [
      {
        id: 'n1',
        type: 'createSap',
        name: 'createSap',
        wires: [['n2']],
        z: 'flow',
        bodyPost: 'data',
        rules: [{ t: 'set', p: 'payload', to: '#:(memory1)::flowValue', tot: 'flow' }],
      },
      { id: 'n2', type: 'helper' },
    ];
    helper.load(createSap, flow, () => {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode('n1');

      const expected = new Error('Custom error');

      sinon.stub(Support, 'sendRequest').rejects(expected);

      n1.receive({ data: { cardCode: '00000001', cardName: '0000001' } });

      n1.on('call:error', (error) => {
        should.deepEqual(error.args[0], expected);
        done();
      });
    });
  });
});
