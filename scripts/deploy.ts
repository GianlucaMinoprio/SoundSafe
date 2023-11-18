import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const factory = await deploy("ModuleProxyFactory", {
    from: deployer,
    args: [],
    log: true,
  });
  await hre.run("verify:verify", {
    address: factory.address,
    constructorArguments: [],
  });
};

deploy.tags = ["ModuleProxyFactory"];
deploy.dependencies = ["ModuleProxyFactory"];
deploy.skip = async (hre: HardhatRuntimeEnvironment) => {
  return hre.network.name !== "hardhat";
};


export default deploy;