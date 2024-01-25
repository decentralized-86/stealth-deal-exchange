import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("StealthMarketExchange", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const [owner, ...accounts] = await ethers.getSigners();

    const Exchange = await ethers.getContractFactory("StealthMarketExchange");
    const FaucetToken = await ethers.getContractFactory("FaucetToken");
    const exchange = await Exchange.deploy();

    const tokenA = await FaucetToken.deploy("TokenA", "TokenA");
    const tokenB = await FaucetToken.deploy("TokenB", "TokenB");

    const [alice, bob] = accounts;

    await tokenA.mint(alice.address, 100000);
    await tokenB.mint(bob.address, 100000);

    const exchangeAddr = await exchange.getAddress();

    await tokenA.connect(alice).approve(exchangeAddr, 100000);
    await tokenB.connect(bob).approve(exchangeAddr, 100000);

    return { owner, exchange, tokenA, tokenB, accounts };
  }

  it("swap", async function () {
    const {
      exchange,
      tokenA,
      tokenB,
      accounts: [alice, bob],
    } = await loadFixture(deployOneYearLockFixture);

    await expect(
      exchange
        .connect(alice)
        .createSwap(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          100,
          200,
        ),
    ).to.emit(exchange, "SwapCreated");

    await expect(exchange.connect(bob).completeSwap(0)).to.emit(
      exchange,
      "SwapCompleted",
    );

    expect(await tokenA.balanceOf(bob.address)).to.eq("100");

    expect(await tokenB.balanceOf(alice.address)).to.eq("200");
  });
});
