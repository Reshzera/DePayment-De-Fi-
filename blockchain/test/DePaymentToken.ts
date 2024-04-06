import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers";
import hre from "hardhat";

describe("DePaymentToken", function () {
  async function deployFixture() {
    const [owner, otherAccount, noFoundAccounts] =
      await hre.ethers.getSigners();

    const DePaymentTokenContract = await hre.ethers.getContractFactory(
      "DePaymentToken"
    );
    const DePaymentToken = await DePaymentTokenContract.deploy();

    return {
      owner,
      otherAccount,
      DePaymentToken,
      noFoundAccounts,
    };
  }

  it("Should deploy", async function () {
    const { DePaymentToken } = await loadFixture(deployFixture);

    expect(await DePaymentToken.getAddress()).to.not.be.undefined;
  });
  it("Should return baseURI", async function () {
    const { DePaymentToken } = await loadFixture(deployFixture);

    expect(await DePaymentToken.baseURI()).to.equal(
      "http://localhost:300/ntfs/"
    );
  });

  it("Should set Authorized Contract", async function () {
    const { DePaymentToken, owner } = await loadFixture(deployFixture);

    await expect(DePaymentToken.setAuthorizedContract(await owner.getAddress()))
      .to.not.be.reverted;
  });
  it("Should burn", async function () {
    const { DePaymentToken, owner } = await loadFixture(deployFixture);
    await DePaymentToken.setAuthorizedContract(await owner.getAddress());
    await DePaymentToken.mint(await owner.getAddress());

    await expect(DePaymentToken.burn(1)).to.not.be.reverted;
  });
  it("Should NOT burn (NOT THE OWNER)", async function () {
    const { DePaymentToken, owner, otherAccount } = await loadFixture(
      deployFixture
    );
    await DePaymentToken.setAuthorizedContract(await owner.getAddress());
    await DePaymentToken.mint(await owner.getAddress());
    const instance = DePaymentToken.connect(otherAccount);
    await expect(instance.burn(1)).to.be.revertedWith(
      "DePaymentToken: caller is not the owner or authorized contract"
    );
  });
});
