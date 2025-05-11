// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GardenNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("GardenNFT", "GARDEN") Ownable(msg.sender) {}

    function mintWithURI(address to, string memory uri) external onlyOwner returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, uri);
        return newTokenId;
    }

    function getCurrentTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
// This contract is an ERC721 token named GardenNFT with the symbol GARDEN.
// It allows the owner to mint new NFTs with a specified URI and keeps track of the current token ID.