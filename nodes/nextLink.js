module.exports = function (RED) {
  function NextLinkNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', async (msg) => {
      const nextLink = msg[config.nextLink];

      if (nextLink) {
        node.log('NextLink Check for SL');
        if (nextLink.includes('/b1s/v2/')) {
          msg.nextLink = nextLink.replace('/b1s/v2/', "").trim();
          node.log('NextLink Replace SL SetUp /b1s/v2/');
        } else if (nextLink.includes('/b1s/v1/')) {
          msg.nextLink = nextLink.replace('/b1s/v1/', "").trim();
          node.log('NextLink Replace SL SetUp /b1s/v1/');
        } else {
          node.log('NextLink OK for SL');
        }
      }


      if (!nextLink) {
        node.send([null, msg]);
        return;
      }

      node.send([msg, null]);
    });
  }
  RED.nodes.registerType('nextLink', NextLinkNode, {});
};
