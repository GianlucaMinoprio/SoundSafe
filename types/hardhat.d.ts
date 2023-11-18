/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "MockERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockERC20__factory>;
    getContractFactory(
      name: "SwapModule",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SwapModule__factory>;
    getContractFactory(
      name: "TokenSwap",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenSwap__factory>;

    getContractAt(
      name: "Ownable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "MockERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.MockERC20>;
    getContractAt(
      name: "SwapModule",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SwapModule>;
    getContractAt(
      name: "TokenSwap",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TokenSwap>;

    deployContract(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "MockERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MockERC20>;
    deployContract(
      name: "SwapModule",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SwapModule>;
    deployContract(
      name: "TokenSwap",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenSwap>;

    deployContract(
      name: "Ownable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "IERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "MockERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.MockERC20>;
    deployContract(
      name: "SwapModule",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SwapModule>;
    deployContract(
      name: "TokenSwap",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenSwap>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
