import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { NFTMinter } from "../typechain";
import "./App.css";
import Minter from "./artifacts/contracts/NFTMinter.sol/NFTMinter.json";

function App() {
  const [mintedCount, setMintedCount] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  // const [loading, setLoading] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [error, setError] = useState("");

  const minterAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
  const isEthereum = typeof window.ethereum !== "undefined";

  //TODO: Change network if incorrect
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as any,
    "any"
  );

  const contract = new ethers.Contract(
    minterAddress,
    Minter.abi,
    provider.getSigner()
  ) as NFTMinter;

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

  const handleMint = async () => {
    try {
      await requestAccount();

      const contract = new ethers.Contract(
        minterAddress,
        Minter.abi,
        provider.getSigner()
      );
      await contract.mintToken(mintAmount, "tokenURI" + Math.random() * 1000, {
        value: ethers.utils.parseEther((0.1 * mintAmount).toString()),
      }); //TODO
    } catch (err: any) {
      console.log(err);
      setError(err.data.message);
    }
  };

  const requestAccount = async () => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((a) => console.log(a))
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log("Please connect to MetaMask.");
        } else {
          console.error(error);
        }
      });
  };

  useEffect(() => {
    const fn = () => {
      fetchAmountMinted();
      fetchTotalSupply();
    };
    fn();
  }, []);

  return (
    <div className="App">
      <div>
        React <strong>NFT</strong> Minter
      </div>

      <div className="choose">
        Choose amount to mint:
        <select onChange={(e) => setMintAmount(parseInt(e.target.value))}>
          {Array.from(Array(20)).map((_, id) => (
            <option value={id + 1} key={id + 1}>
              {id + 1}
            </option>
          ))}
        </select>
      </div>

      <div>Price per token: </div>
      <button onClick={handleMint}>Mint</button>
      <div>
        <strong>{mintedCount}</strong>/<strong>{totalSupply}</strong> tokens
        minted
      </div>
    </div>
  );
}

export default App;
