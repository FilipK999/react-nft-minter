import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { Contract, Wallet } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getWallet } from "./wallet";

export function getContract(
  name: string,
  hre: HardhatRuntimeEnvironment,
  address: string,
  wallet?: Wallet
): Promise<Contract> {
  return getContractAt(hre, name, address, wallet ?? getWallet());
}
