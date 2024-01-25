module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // await deploy("FaucetToken", {
  //   from: deployer,
  //   args: ["FaucetA", "FaucetA"],
  //   log: true,
  // });

  // await deploy("FaucetToken", {
  //   from: deployer,
  //   args: ["FaucetB", "FaucetB"],
  //   log: true,
  // });

  // await deploy("FaucetToken", {
  //   from: deployer,
  //   args: ["FaucetC", "FaucetC"],
  //   log: true,
  // });

  // await deploy("FaucetToken", {
  //   from: deployer,
  //   args: ["FaucetD", "FaucetD"],
  //   log: true,
  // });
};

module.exports.tags = ["Faucet"];
