module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // await deploy("SampleNft", {
  //   from: deployer,
  //   args: ["SampleNft", "SampleNft"],
  //   log: true,
  // });
};

module.exports.tags = ["SampleNft"];
