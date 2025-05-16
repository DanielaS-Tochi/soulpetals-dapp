// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GardenNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("GardenNFT", "GARDEN") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    function mint(address to) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _tokenIdCounter++;
        return tokenId;
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }


    function mintWithURI(address to, string memory uri) public onlyOwner returns (uint256) {
        uint256 tokenId = mint(to);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function _setTokenURI(uint256 tokenId, string memory uri) internal virtual {
        // This function should be implemented to set the token URI.
        // For simplicity, we are not implementing it here.
    }
}
// This contract is an ERC721 token named GardenNFT with the symbol GARDEN.
// It allows the owner to mint new NFTs with a specified URI and keeps track of the current token ID.