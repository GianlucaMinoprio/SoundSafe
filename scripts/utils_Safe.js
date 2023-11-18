const {
    SafeMultisigTransactionListResponse,
    SignatureResponse,
  } = require("@safe-global/api-kit");
  
  const {
    Safe,
    EthersAdapter,
    SafeAccountConfig,
    SafeFactory,
  } = require("@safe-global/protocol-kit");
  
  const {
    SafeMultisigTransactionResponse,
    SafeTransaction,
    SafeTransactionDataPartial,
  } = require("@safe-global/safe-core-sdk-types");
  
  const { ContractReceipt, ethers, Signer } = require("ethers");
  const { TransactionReceipt } = require("web3-core");
  
  const { getSafe, getSafeService } = require("../../Tap2Pay-Wallet/SafeServer/utils");
  
  const deploySafe = async (
    signerOrProvider,
    addresses
  ) => {
    const ethAdapterOwner = new EthersAdapter({
      ethers,
      signerOrProvider: signerOrProvider,
    });
    const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner });
    const safeAccountConfig = {
      owners: addresses,
      threshold: 1,
    };
  
    return await safeFactory.deploySafe({
      safeAccountConfig,
      saltNonce: Date.now().toString(),
    });
  };

deploySafe('0x',process.env.PUBLIC_KEY);

  const getOwners = async (
    safeAddress,
    signerOrProvider
  ) => {
    const safeSdkOwner = await getSafe(safeAddress, signerOrProvider);
    return await safeSdkOwner.getOwners();
  };
  
  const getSafesByOwner = async (
    signerOrProvider,
    address
  ) => {
    const safeService = getSafeService(signerOrProvider);
    return (await safeService.getSafesByOwner(address)).safes;
  };
  
  module.exports = {
    deploySafe,
    getOwners,
    getSafesByOwner,
  };
  