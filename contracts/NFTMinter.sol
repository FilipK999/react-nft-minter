pragma solidity ^0.8.4;


import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract NFTMinter is ERC721, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public constant nftPrice = 10 * (10**18);
    uint256 public constant maxPurchase = 2;
    uint256 public maxSupply;
    mapping (uint256 => string) private _tokenURIs;
    uint256 private _mintedCount = 0;

    constructor() ERC721("Colors", "CLRS") {
        maxSupply = 3;
    }

   function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }


    function getMintedCount() public view returns (uint256) {
        return _mintedCount;
    }

    function increaseMintedCount(uint256 by) private {
        _mintedCount = _mintedCount.add(by);
    }

    function mintToken(uint numberOfTokens) public payable {
        require(numberOfTokens <= maxPurchase, "Can only mint 2 tokens at a time");
        require(getMintedCount().add(numberOfTokens) <= maxSupply, "Purchase would exceed the max supply");
        require(nftPrice.mul(numberOfTokens) <= msg.value, "Ether value sent is not correct");

        for(uint i = 0; i < numberOfTokens; i++) {
            uint256 mintIndex = getMintedCount();
            if (getMintedCount() < maxSupply) {
                increaseMintedCount(1);
                _safeMint(msg.sender, mintIndex);
                _setTokenURI(mintIndex, string(abi.encodePacked("http://localhost:3000/metadata/", mintIndex, ".json"))); //TODO: Check if this works properly
            }
        }
    }

}
