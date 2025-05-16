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

    event MoodSet(uint256 indexed tokenId, string mood);
    event GardenUpgraded(uint256 indexed tokenId, uint256 newLevel);

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
        emit MoodSet(tokenId, mood);
    }

    function upgradeGarden(uint256 tokenId) public {
        require(gardenNFT.ownerOf(tokenId) == msg.sender, "Not the owner of this garden");
        require(petalToken.balanceOf(msg.sender) >= UPGRADE_COST, "Insufficient PETAL tokens");
        require(petalToken.allowance(msg.sender, address(this)) >= UPGRADE_COST, "Approve tokens first");

        petalToken.transferFrom(msg.sender, owner(), UPGRADE_COST);
        gardenLevel[tokenId]++;
        emit GardenUpgraded(tokenId, gardenLevel[tokenId]);
    }

    function getMood(uint256 tokenId) public view returns (string memory) {
        return tokenMood[tokenId];
    }

    function getGardenLevel(uint256 tokenId) public view returns (uint256) {
        return gardenLevel[tokenId];
    }
}
// This contract manages the MoodGarden, allowing the owner to mint gardens, set moods, and upgrade gardens.
// It interacts with the PetalToken and GardenNFT contracts to handle token transfers and NFT minting.