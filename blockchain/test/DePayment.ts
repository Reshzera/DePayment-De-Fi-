import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { parseEther } from "ethers";
import hre from "hardhat";

describe("DePayment", function () {
  async function deployFixture() {
    const [owner, otherAccount, noFoundAccounts] =
      await hre.ethers.getSigners();

    const DePaymentCoinContract = await hre.ethers.getContractFactory(
      "DePaymentCoin"
    );
    const DePaymentCoin = await DePaymentCoinContract.deploy();

    const DePaymentTokenContract = await hre.ethers.getContractFactory(
      "DePaymentToken"
    );
    const DePaymentToken = await DePaymentTokenContract.deploy();

    const DePaymentContract = await hre.ethers.getContractFactory("DePayment");
    const DePayment = await DePaymentContract.deploy(
      await DePaymentToken.getAddress(),
      await DePaymentCoin.getAddress()
    );

    await DePaymentToken.setAuthorizedContract(await DePayment.getAddress());
    await DePaymentCoin.mint(
      await otherAccount.getAddress(),
      parseEther("1000")
    );

    return {
      DePayment,
      owner,
      otherAccount,
      DePaymentCoin,
      DePaymentToken,
      noFoundAccounts,
    };
  }

  it("should deploy", async function () {
    const { DePayment } = await loadFixture(deployFixture);

    expect(await DePayment.getAddress()).to.not.be.undefined;
  });
  it("Should Do first payment", async function () {
    const { DePayment, DePaymentCoin, otherAccount } = await loadFixture(
      deployFixture
    );
    const instance = DePaymentCoin.connect(otherAccount);
    await instance.approve(await DePayment.getAddress(), parseEther("0.01"));

    await expect(DePayment.pay(await otherAccount.getAddress()))
      .to.emit(DePayment, "Granted")
      .and.to.emit(DePayment, "Payment");
  });

  it("Should NOT Do first payment (INSUFFICIENT FOUNDS)", async function () {
    const { DePayment, DePaymentCoin, otherAccount } = await loadFixture(
      deployFixture
    );
    const instance = DePaymentCoin.connect(otherAccount);
    await instance.approve(await DePayment.getAddress(), parseEther("0.0001"));

    await expect(DePayment.pay(await otherAccount.getAddress())).revertedWith(
      "Insufficient funds"
    );
  });

  it("Should NOT Do first payment (INSUFFICIENT COINS)", async function () {
    const { DePayment, DePaymentCoin, noFoundAccounts } = await loadFixture(
      deployFixture
    );
    const instance = DePaymentCoin.connect(noFoundAccounts);
    await instance.approve(await DePayment.getAddress(), parseEther("0.01"));

    await expect(
      DePayment.pay(await noFoundAccounts.getAddress())
    ).revertedWith("Insufficient funds");
  });

  it("Should Do second payment", async function () {
    const { DePayment, DePaymentCoin, otherAccount } = await loadFixture(
      deployFixture
    );
    const instance = DePaymentCoin.connect(otherAccount);
    await instance.approve(await DePayment.getAddress(), parseEther("0.01"));
    await DePayment.pay(await otherAccount.getAddress());
    await time.increase(60 * 60 * 24 * 30);
    await expect(DePayment.pay(await otherAccount.getAddress())).to.emit(
      DePayment,
      "Payment"
    );
  });
  it("Should NOT Do second payment (INSUFFICIENT FOUNDS)", async function () {
    const { DePayment, DePaymentCoin, otherAccount } = await loadFixture(
      deployFixture
    );
    const instance = DePaymentCoin.connect(otherAccount);
    await instance.approve(await DePayment.getAddress(), parseEther("0.001"));
    await DePayment.pay(await otherAccount.getAddress());
    await time.increase(60 * 60 * 24 * 30);
    await expect(DePayment.pay(await otherAccount.getAddress())).to.emit(
      DePayment,
      "Revoked"
    );
  });

  it("Should NOT pay (NOT THE OWNER)", async function () {
    const { DePayment, otherAccount } = await loadFixture(deployFixture);
    await expect(
      DePayment.connect(otherAccount).pay(await otherAccount.getAddress())
    ).revertedWithCustomError(DePayment, "OwnableUnauthorizedAccount");
  });
  it("Should NOT pay (NOT PASS 30 DAYS)", async function () {
    const { DePayment, DePaymentCoin, otherAccount } = await loadFixture(
      deployFixture
    );
    const instance = DePaymentCoin.connect(otherAccount);
    await instance.approve(await DePayment.getAddress(), parseEther("0.02"));
    await DePayment.pay(await otherAccount.getAddress());
    await expect(
      DePayment.pay(await otherAccount.getAddress())
    ).to.revertedWith("Payment already made");
  });

  it("Should change monthly amount", async function () {
    const { DePayment, DePaymentCoin, otherAccount } = await loadFixture(
      deployFixture
    );
    const instance = DePaymentCoin.connect(otherAccount);
    await instance.approve(await DePayment.getAddress(), parseEther("0.02"));
    await DePayment.pay(await otherAccount.getAddress());
    await time.increase(60 * 60 * 24 * 30);
    await DePayment.setMonthlyAmount(parseEther("0.02"));
    await expect(DePayment.pay(await otherAccount.getAddress())).to.emit(
      DePayment,
      "Revoked"
    );
  });
  it("Should NOT change monthly amount (NOT THE OWNER)", async function () {
    const { DePayment, otherAccount } = await loadFixture(deployFixture);
    await expect(
      DePayment.connect(otherAccount).setMonthlyAmount(parseEther("0.02"))
    ).revertedWithCustomError(DePayment, "OwnableUnauthorizedAccount");
  });

  it("Should grant customer after a failed payment", async function () {
    const { DePayment, DePaymentCoin, otherAccount } = await loadFixture(
      deployFixture
    );
    const instance = DePaymentCoin.connect(otherAccount);
    await instance.approve(await DePayment.getAddress(), parseEther("0.001"));
    await DePayment.pay(await otherAccount.getAddress());
    await time.increase(60 * 60 * 24 * 30);
    await DePayment.setMonthlyAmount(parseEther("0.02"));
    await expect(DePayment.pay(await otherAccount.getAddress())).to.emit(
      DePayment,
      "Revoked"
    );
    await instance.approve(await DePayment.getAddress(), parseEther("0.02"));
    await expect(DePayment.pay(await otherAccount.getAddress())).to.emit(
      DePayment,
      "Granted"
    );
  });

  it("Should remove customer", async function () {
    const { DePayment, DePaymentCoin, otherAccount } = await loadFixture(
      deployFixture
    );
    const instance = DePaymentCoin.connect(otherAccount);
    await instance.approve(await DePayment.getAddress(), parseEther("0.02"));
    await DePayment.pay(await otherAccount.getAddress());
    await expect(
      DePayment.removeCustomer(await otherAccount.getAddress())
    ).to.emit(DePayment, "Removed");
  });

  it("Should NOT remove customer (NOT THE OWNER)", async function () {
    const { DePayment, otherAccount } = await loadFixture(deployFixture);
    await expect(
      DePayment.connect(otherAccount).removeCustomer(
        await otherAccount.getAddress()
      )
    ).revertedWithCustomError(DePayment, "OwnableUnauthorizedAccount");
  });

  it("Should NOT remove customer (CUSTOMER NOT FOUND)", async function () {
    const { DePayment, otherAccount } = await loadFixture(deployFixture);
    await expect(
      DePayment.removeCustomer(await otherAccount.getAddress())
    ).revertedWith("Customer not found");
  });

  it("Should get customers", async function () {
    const { DePayment, DePaymentCoin, otherAccount } = await loadFixture(
      deployFixture
    );
    const instance = DePaymentCoin.connect(otherAccount);
    await instance.approve(await DePayment.getAddress(), parseEther("0.02"));
    await DePayment.pay(await otherAccount.getAddress());
    expect(await DePayment.getCustomers()).to.include(
      await otherAccount.getAddress()
    );
  });
});
