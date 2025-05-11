// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PetalToken is ERC20, Ownable {
    constructor() ERC20("PetalToken", "PETAL") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
// This contract is an ERC20 token named PetalToken with the symbol PETAL.
// It allows the owner to mint new tokens and has an initial supply of 1,000,000 tokens.