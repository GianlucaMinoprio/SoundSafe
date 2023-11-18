import { HardhatRuntimeEnvironment } from 'hardhat/types';
import ethers from 'hardhat';
const deployModule = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy('Module', {
        from: deployer,
        args: [],
        log: true,
    });
}

deployModule.tags = ['Module'];
// async function main(hre: HardhatRuntimeEnvironment) {
//     const {deployments, getNamedAccounts} = hre;
//     const {deploy} = deployments;
//     const {deployer} = await getNamedAccounts();
//
//
//     // Call the deployModule function and pass the hre
//     await deployModule(hre);
// }


async function main(hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    // Deploy the TokenSwap contract
    await deploy('TokenSwap', {
        from: deployer,
        args: [""], // Replace with the actual ERC-20 token address
        log: true,
    });

    console.log('TokenSwap contract deployed.');

    // Your additional script logic here, if needed
}

main(ethers);
export {};