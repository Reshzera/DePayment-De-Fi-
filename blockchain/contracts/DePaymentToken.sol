// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IDePaymentToken.sol";

contract DePaymentToken is IDePaymentToken, ERC721, Ownable {
    uint256 private _nextTokenId;

    address public authorizedContract;
    string public baseURI = "http://localhost:300/ntfs/";

    constructor() ERC721("DePaymentToken", "DPT") Ownable(msg.sender) {}

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setAuthorizedContract(address contractAddress) external onlyOwner {
        authorizedContract = contractAddress;
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return string.concat(_baseURI(), Strings.toString(tokenId), ".json");
    }

    function getLastTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    function burn(uint256 tokenId) external {
        require(
            msg.sender == authorizedContract || msg.sender == owner(),
            "DePaymentToken: caller is not the owner or authorized contract"
        );
        _burn(tokenId);
    }

    function setApprovalForAll(
        address owner,
        bool approved
    ) public override(ERC721, IERC721) onlyOwner {
        _setApprovalForAll(owner, authorizedContract, approved);
    }

    function mint(address customer) external returns (uint256) {
        require(
            msg.sender == authorizedContract || msg.sender == owner(),
            "DePaymentToken: caller is not the owner or authorized contract"
        );
        _nextTokenId++;
        _safeMint(customer, _nextTokenId);
        _setApprovalForAll(customer, authorizedContract, true);

        return _nextTokenId;
    }
}
