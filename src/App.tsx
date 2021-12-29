import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import Minter from "./artifacts/contracts/NFTMinter.sol/NFTMinter.json";
const minterAddress = "0x21ea4128E26e2e57aa0Cdf0fA70440F03730c770";

function App() {
  const [mintedCount, setMintedCount] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  const isEthereum = typeof window.ethereum !== "undefined";
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const contract = new ethers.Contract(minterAddress, Minter.abi, provider);

  const fetchAmountMinted = async () => {
    if (isEthereum) {
      try {
        const data = await contract.getMintedCount();
        setMintedCount(parseInt(data.toHexString()));
      } catch (err: any) {
        setError(err.data.message);
      }
    }
  };

  const fetchTotalSupply = async () => {
    try {
      const data = await contract.totalSupply();
      setTotalSupply(parseInt(data.toHexString()));
    } catch (err: any) {
      setError(err.data.message);
    }
  };
  const requestAccount = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const mint = async (amount: number) => {
    if (isEthereum) {
      await requestAccount();

      const signer = provider.getSigner();

      const options = {
        value: ethers.utils.parseEther((0.01 * amount).toString()),
      };

      const contract = new ethers.Contract(minterAddress, Minter.abi, signer);
      try {
        const transaction = await contract.mintToken(mintAmount, options);

        await transaction.wait();
      } catch (err: any) {
        setError(err.error.message);
      }
    }
  };

  useEffect(() => {
    fetchAmountMinted();
    fetchTotalSupply();
  }, [refresh]);

  const handleWithdraw = async () => {
    const signer = provider.getSigner();

    const contract = new ethers.Contract(minterAddress, Minter.abi, signer);
    try {
      const tx = await contract.withdraw();

      await tx.wait();
    } catch (err: any) {
      setError(err.error.message);
    }
  };

  const handleMint = async () => {
    setLoading(true);
    await mint(mintAmount);
    setLoading(false);
    setRefresh((prev) => !prev);
  };
  return (
    <div className="App">
      <header className="App-header">
        <div>
          NFTS minted: {mintedCount}/{totalSupply}
        </div>
        <br />

        <div>
          <input
            type="number"
            value={mintAmount}
            onChange={(e) => setMintAmount(parseInt(e.target.value))}
          />

          <button onClick={handleMint}>Mint your NFT</button>
        </div>
        <br />
        <button onClick={handleWithdraw}>withdraw</button>
        {loading ?? "Loading..."}
        {error && <div style={{ color: "#e45c5c" }}>{error}</div>}
      </header>
    </div>
  );
}

export default App;
