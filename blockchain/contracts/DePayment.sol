// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "./IDePaymentToken.sol";

import "hardhat/console.sol";

contract DePayment is Ownable, ERC721Holder {
    struct Customer {
        uint tokenId;
        uint nextPayment;
        uint index;
    }
    IDePaymentToken public nftAddress;
    IERC20 public coinAddress;
    uint public monthlyAmount = 0.001 ether;
    uint public thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    mapping(address => Customer) public payments;
    address[] public customers;

    event Payment(
        address indexed customer,
        uint indexed date,
        uint indexed amoun
    );

    event Granted(
        address indexed customer,
        uint indexed tokenId,
        uint indexed date
    );

    event Revoked(
        address indexed customer,
        uint indexed tokenId,
        uint indexed date
    );

    event Removed(
        address indexed customer,
        uint indexed tokenId,
        uint indexed date
    );

    constructor(address _nftAddress, address _coinAddress) Ownable(msg.sender) {
        nftAddress = IDePaymentToken(_nftAddress);
        coinAddress = IERC20(_coinAddress);
    }

    function getCustomers() external view returns (address[] memory) {
        return customers;
    }

    function setMonthlyAmount(uint _amount) external onlyOwner {
        monthlyAmount = _amount;
    }

    function removeCustomer(address _customer) external onlyOwner {
        Customer memory customer = payments[_customer];
        require(customer.tokenId != 0, "Customer not found");

        nftAddress.burn(customer.tokenId);

        delete payments[_customer];
        delete customers[customer.index];

        emit Removed(_customer, customer.tokenId, block.timestamp);
    }

    function pay(address _customer) external onlyOwner {
        bool thirtyDaysHavePassed = payments[_customer].nextPayment <=
            block.timestamp;
        bool firstPayment = payments[_customer].nextPayment == 0;
        bool hasAmount = coinAddress.balanceOf(_customer) >= monthlyAmount;
        bool hasAllowance = coinAddress.allowance(_customer, address(this)) >=
            monthlyAmount;

        if (
            (firstPayment || thirtyDaysHavePassed) &&
            (!hasAllowance || !hasAmount)
        ) {
            if (!firstPayment) {
                nftAddress.safeTransferFrom(
                    _customer,
                    address(this),
                    payments[_customer].tokenId
                );
                emit Revoked(
                    _customer,
                    payments[_customer].tokenId,
                    block.timestamp
                );
                return;
            } else revert("Insufficient funds");
        }

        if (firstPayment) {
            nftAddress.mint(_customer);
            payments[_customer] = Customer({
                tokenId: nftAddress.getLastTokenId(),
                nextPayment: block.timestamp + thirtyDaysInSeconds,
                index: customers.length
            });
            customers.push(_customer);
            emit Granted(
                _customer,
                nftAddress.getLastTokenId(),
                block.timestamp
            );
        }

        require(firstPayment || thirtyDaysHavePassed, "Payment already made");

        coinAddress.transferFrom(_customer, address(this), monthlyAmount);

        if (nftAddress.ownerOf(payments[_customer].tokenId) != _customer) {
            nftAddress.safeTransferFrom(
                address(this),
                _customer,
                payments[_customer].tokenId
            );

            emit Granted(
                _customer,
                payments[_customer].tokenId,
                block.timestamp
            );
        }

        payments[_customer].nextPayment = block.timestamp + thirtyDaysInSeconds;

        emit Payment(_customer, block.timestamp, monthlyAmount);
    }
}
