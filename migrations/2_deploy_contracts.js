const Batcher = artifacts.require("Batcher");

module.exports = function (deployer) {
  deployer.deploy(Batcher);
};
