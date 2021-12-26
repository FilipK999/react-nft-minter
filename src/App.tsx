import React, { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import Minter from "./artifacts/contracts/NFTMinter.sol/NFTMinter.json";
const minterAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";

function App() {
  const [mintedCount, setMintedCount] = useState(0);
  const [mintAmount, setMintAmount] = useState(1);
  const [error, setError] = useState("");

  const isEthereum = typeof window.ethereum !== "undefined";
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  const fetchAmountMinted = async () => {
    if (isEthereum) {
      const contract = new ethers.Contract(minterAddress, Minter.abi, provider);
      try {
        const data = await contract.getMintedCount();
        console.log(data);
        setMintedCount(parseInt(data.toHexString()));
      } catch (err: any) {
        console.error(err);
        setError(err.data.message);
      }
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
        value: ethers.utils.parseEther((10 * amount).toString()),
      };

      const contract = new ethers.Contract(minterAddress, Minter.abi, signer);
      try {
        const transaction = await contract.mintToken(1, options);

        await transaction.wait();
      } catch (err: any) {
        setError(err.data.message);
      }
    }
  };

  useEffect(() => {
    fetchAmountMinted();
  }, []);

  const handleMint = () => {
    mint(mintAmount);
  };
  return (
    <div className="App">
      <header className="App-header">
        <div>NFTS minted: {mintedCount}/3</div>
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
        {error && <div style={{ color: "#e45c5c" }}>{error}</div>}
      </header>
    </div>
  );
}

export default App;
