import { ethers } from "ethers";

export function getProvider(): ethers.providers.Provider {
  return ethers.getDefaultProvider("http://127.0.0.1:8545/");
}
