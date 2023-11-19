const deploy = async (hre) => {
  const {
    deployments: { deploy },
  } = hre;
  const [deployer] = await hre.ethers.getSigners();
  const salt = "0x000000000000000000000000000000000000000000000000000000000000002A";


  const P256Signer = await deploy("P256Signer", {
    from: deployer.address,
    log: true,
    libraries: {
      secp256r1: ''
    },
    deterministicDeployment: salt,
  });

  const factory = await deploy("P256SignerFactory", {
    from: deployer.address,
    log: true,
    deterministicDeployment: salt,
    args: [P256Signer.address],
  });
};

module.exports = deploy;
deploy.tags = "p256-signer";
