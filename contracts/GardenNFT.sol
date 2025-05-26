// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GardenNFT is ERC721URIStorage, Ownable {
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

    function setTokenURI(uint256 tokenId, string memory uri) public {
        require(_ownerOf(tokenId) == _msgSender() || 
                isApprovedForAll(_ownerOf(tokenId), _msgSender()) ||
                getApproved(tokenId) == _msgSender(), 
                "ERC721: caller is not owner nor approved");
        _setTokenURI(tokenId, uri);
    }
}