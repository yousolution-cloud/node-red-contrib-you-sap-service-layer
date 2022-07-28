module.exports = function (RED) {
  function NextLinkNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', async (msg) => {
      const nextLink = msg[config.nextLink];

      if (!nextLink) {
        node.send([null, msg]);
        return;
      }

      node.send([msg, null]);
    });
  }
  RED.nodes.registerType('nextLink', NextLinkNode, {});
};
