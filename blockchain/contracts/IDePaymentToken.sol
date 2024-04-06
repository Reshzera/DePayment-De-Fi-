// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IDePaymentToken is IERC721 {
    function setAuthorizedContract(address contractAddress) external;

    function setBaseURI(string memory newBaseURI) external;

    function getLastTokenId() external view returns (uint256);

    function burn(uint256 tokenId) external;

    function mint(address customer) external returns (uint256);
}
