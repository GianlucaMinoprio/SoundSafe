// typechain.config.ts
import { HardhatUserConfig } from 'hardhat/types';
import '@nomiclabs/hardhat-typechain';

const config: HardhatUserConfig = {
    typechain: {
        outDir: 'typechain',
        target: 'ethers-v5',
    },
};

export default config;