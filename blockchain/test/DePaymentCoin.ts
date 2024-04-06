import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers";
import hre from "hardhat";

describe("DePaymentCoin", function () {
  async function deployFixture() {
    const [owner, otherAccount, noFoundAccounts] =
      await hre.ethers.getSigners();

    const DePaymentCoinContract = await hre.ethers.getContractFactory(
      "DePaymentCoin"
    );
    const DePaymentCoin = await DePaymentCoinContract.deploy();

    return {
      owner,
      otherAccount,
      DePaymentCoin,
      noFoundAccounts,
    };
  }

  it("should deploy and mint to the owner", async function () {
    const { DePaymentCoin, owner } = await loadFixture(deployFixture);

    expect(await DePaymentCoin.getAddress()).to.not.be.undefined;
    expect(await DePaymentCoin.balanceOf(await owner.getAddress())).to.equal(
      10000000000000000000000n
    );
  });
  it("Should mint to other account", async function () {
    const { DePaymentCoin, otherAccount } = await loadFixture(deployFixture);

    await DePaymentCoin.mint(
      await otherAccount.getAddress(),
      parseEther("0.01")
    );

    expect(
      await DePaymentCoin.balanceOf(await otherAccount.getAddress())
    ).to.equal(parseEther("0.01"));
  });
});
