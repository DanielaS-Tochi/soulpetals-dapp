// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PetalToken.sol";
import "./GardenNFT.sol";

contract MoodGarden is Ownable {
    PetalToken public petalToken;
    GardenNFT public gardenNFT;

    mapping(uint256 => string) public tokenMood;
    uint256 public constant UPGRADE_COST = 100 * 10 ** 18;
    mapping(uint256 => uint256) public gardenLevel;
    
    // Base URI for metadata
    string public baseURI = "https://soulpetals-dapp.vercel.app/api/metadata/";

    event MoodSet(uint256 indexed tokenId, string mood);
    event GardenUpgraded(uint256 indexed tokenId, uint256 newLevel);
    event BaseURIChanged(string newBaseURI);

    constructor(address _petalToken, address _gardenNFT) Ownable(msg.sender) {
        petalToken = PetalToken(_petalToken);
        gardenNFT = GardenNFT(_gardenNFT);
    }

    function mintGarden(address to) public {
        gardenNFT.mint(to);
    }

    function setMood(uint256 tokenId, string memory mood) public {
        require(gardenNFT.ownerOf(tokenId) == msg.sender, "Not the owner of this garden");
        tokenMood[tokenId] = mood;
        
        // Update the token URI to reflect the new mood
        string memory tokenURI = string(abi.encodePacked(
            baseURI, 
            "?tokenId=", 
            _toString(tokenId),
            "&mood=",
            mood,
            "&level=",
            _toString(gardenLevel[tokenId])
        ));
        
        gardenNFT.setTokenURI(tokenId, tokenURI);
        
        emit MoodSet(tokenId, mood);
    }

    function upgradeGarden(uint256 tokenId) public {
        require(gardenNFT.ownerOf(tokenId) == msg.sender, "Not the owner of this garden");
        require(petalToken.balanceOf(msg.sender) >= UPGRADE_COST, "Insufficient PETAL tokens");
        require(petalToken.allowance(msg.sender, address(this)) >= UPGRADE_COST, "Approve tokens first");

        petalToken.transferFrom(msg.sender, owner(), UPGRADE_COST);
        gardenLevel[tokenId]++;
        
        // Update the token URI to reflect the new level
        string memory mood = tokenMood[tokenId];
        string memory tokenURI = string(abi.encodePacked(
            baseURI, 
            "?tokenId=", 
            _toString(tokenId),
            "&mood=",
            mood,
            "&level=",
            _toString(gardenLevel[tokenId])
        ));
        
        gardenNFT.setTokenURI(tokenId, tokenURI);
        
        emit GardenUpgraded(tokenId, gardenLevel[tokenId]);
    }

    function getMood(uint256 tokenId) public view returns (string memory) {
        return tokenMood[tokenId];
    }

    function getGardenLevel(uint256 tokenId) public view returns (uint256) {
        return gardenLevel[tokenId];
    }
    
    function setBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
        emit BaseURIChanged(newBaseURI);
    }
    
    // Helper function to convert uint to string
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
}