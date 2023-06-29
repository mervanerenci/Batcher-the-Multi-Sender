const Batcher = artifacts.require("Batcher");
const IERC20 = artifacts.require("IERC20");


module.exports = async function (callback) {
  try {
    // Replace these values with the actual token, recipients, and amounts
    const tokenAddress = "0x960998daFA1339d040Cf99A4E8AC6D38d79250bD"; // ERC20 token address
    const recipients = ["0x45587faCBe6E8882FE298506D218a67855B93Dd7", "0xC2f7379e4e91C1Fd7bBB3b77239df43b3F3a654B", "0xf8F0625Cdd077A73b4344fE1A8779a493B656Fab", "0x79F406e4a3bC865bf80916c7daDbC5b126a2fE51", "0xF9105C11235c25b90733Ed6550C4716D2575e00b"]; // Array of recipient addresses
    const amounts = [100, 200, 300, 200, 500]; // Array of amounts to send

    const accounts = await web3.eth.getAccounts();
    const batcher = await Batcher.deployed();
    const token = await IERC20.at(tokenAddress);

    // Approve the MultiSender contract to transfer tokens on behalf of the sender
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
    await token.approve(batcher.address, totalAmount, { from: accounts[0] });

    // Call the sendToMultipleRecipients function in the MultiSender contract
    const result = await batcher.sendToMultipleRecipients(tokenAddress, recipients, amounts, { from: accounts[0] });

    console.log("Tokens sent successfully!");
    console.log("Transaction hash:", result.tx);

    callback();
  } catch (error) {
    console.error("Error:", error);
    callback(error);
  }
};
