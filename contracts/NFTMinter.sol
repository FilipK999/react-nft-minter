pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMinter is ERC721URIStorage, Ownable {
  using SafeMath for uint256;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint256 public constant NFT_PRICE = 0.1 ether;
  uint256 public constant MAX_PURCHASE = 20;
  uint256 public maxSupply;
  mapping(uint256 => string) private _tokenURIs;
  uint256 private _mintedCount = 0;

  constructor(uint256 _maxSupply) ERC721("Colors", "CLRS") {
    maxSupply = _maxSupply;
  }

  function totalSupply() public view returns (uint256) {
    return maxSupply;
  }

  function withdraw() public onlyOwner {
    uint256 balance = address(this).balance;
    payable(msg.sender).transfer(balance);
  }

  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function getMintedCount() public view returns (uint256) {
    return _mintedCount;
  }

  function increaseMintedCount(uint256 by) private {
    _mintedCount = _mintedCount.add(by);
  }

  function mintToken(uint256 numberOfTokens, string memory tokenURI)
    public
    payable
  {
    require(
      numberOfTokens <= MAX_PURCHASE,
      "Can only mint 20 tokens at a time"
    );
    require(
      getMintedCount().add(numberOfTokens) <= maxSupply,
      "Purchase would exceed the max supply"
    );
    require(
      NFT_PRICE.mul(numberOfTokens) <= msg.value,
      "Ether value sent is not correct"
    );

    for (uint256 i = 0; i < numberOfTokens; i++) {
      uint256 mintIndex = getMintedCount();
      if (getMintedCount() < maxSupply) {
        _safeMint(msg.sender, mintIndex);
        _setTokenURI(mintIndex, tokenURI);
        increaseMintedCount(1);
      }
    }
  }
}
