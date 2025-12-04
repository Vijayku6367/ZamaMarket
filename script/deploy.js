const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying DarkMarket FHE contracts...");
  
  // Deploy MockEncryptedMath first
  const EncryptedMath = await hre.ethers.getContractFactory("MockEncryptedMath");
  const encryptedMath = await EncryptedMath.deploy();
  await encryptedMath.deployed();
  console.log("✅ MockEncryptedMath deployed to:", encryptedMath.address);
  
  // Deploy MockDarkMarket
  const DarkMarket = await hre.ethers.getContractFactory("MockDarkMarket");
  const darkMarket = await DarkMarket.deploy();
  await darkMarket.deployed();
  console.log("✅ MockDarkMarket deployed to:", darkMarket.address);
  
  // Save addresses to file for frontend
  const fs = require("fs");
  const addresses = {
    encryptedMath: encryptedMath.address,
    darkMarket: darkMarket.address
  };
  
  fs.writeFileSync(
    "./frontend/contracts/addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  
  console.log("📝 Contract addresses saved to frontend/contracts/addresses.json");
  console.log("\n🎉 Deployment complete!");
  console.log("\nTo start the demo:");
  console.log("1. Run: npx hardhat node");
  console.log("2. In another terminal: npm run demo");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
