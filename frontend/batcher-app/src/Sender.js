import React, { useState, useEffect } from "react";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import BatcherABI from "./Batcher.json";
import Web3 from "web3";
import ERC20ABI from "./ERC20.json";

function Sender() {
  const [recipients, setRecipients] = useState([""]);
  const [amounts, setAmounts] = useState([""]);
  const [selectedOptions, setSelectedOptions] = useState();
  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const optionList = [
    { value: "0xe9DcE89B076BA6107Bb64EF30678efec11939234", label: "USDC" },
    { value: "sushiaddress", label: "JEUR" },
    { value: "linkaddress", label: "LINK" }
  ];

  // web3
  // Check if MetaMask is installed and accessible in the browser
  if (window.ethereum) {
    // Use MetaMask provider
    window.web3 = new Web3(window.ethereum);
  } else {
    console.log("MetaMask not detected. Please install MetaMask.");
  }

  const batcherAddress = "0x8131542965Fb3a4C1b0b2D958bBF0a4D1372d663"; // Replace with the actual Batcher contract address
  const batcherContract = new window.web3.eth.Contract(
    BatcherABI,
    batcherAddress
  );

  async function sendBatchTransaction(tokenAddress, recipients, amounts) {
    try {
      const accounts = await window.web3.eth.getAccounts();
      const senderAddress = accounts[0];

      // Get the contract instance
      const token = new window.web3.eth.Contract(ERC20ABI, tokenAddress);

      // Calculate the total amount of tokens to be transferred
      const totalAmount = amounts.reduce(
        (acc, curr) => acc.add(window.web3.utils.toBN(curr)),
        window.web3.utils.toBN(0)
      );

      // Convert the totalAmount to the token's smallest unit (e.g., wei for Ether)
      const decimals = await token.methods.decimals().call();
      const adjustedTotalAmount = window.web3.utils
        .toBN(totalAmount)
        .mul(window.web3.utils.toBN(10 ** decimals));

      // Check if the contract has enough allowance to spend tokens on behalf of the user
      const allowance = await token.methods
        .allowance(senderAddress, batcherAddress)
        .call();

      if (window.web3.utils.toBN(allowance).lt(adjustedTotalAmount)) {
        // If allowance is not enough, approve the contract to spend tokens
        await token.methods
          .approve(batcherAddress, adjustedTotalAmount)
          .send({ from: senderAddress });
      }

      // Call the 'sendToMultipleRecipients' function
      await batcherContract.methods
        .sendToMultipleRecipients(tokenAddress, recipients, amounts)
        .send({ from: senderAddress });

      console.log("Transaction successful!");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  // web3 END

  // Function to retrieve inputs as arrays
  function getInputsAsArrays() {
    const filteredRecipients = recipients.filter(
      (recipient) => recipient.trim() !== ""
    );
    const filteredAmounts = amounts.filter((amount) => amount.trim() !== "");

    return { recipients: filteredRecipients, amounts: filteredAmounts };
  }

  // Function to add a new recipient and amount input
  function addRecipientAndAmount() {
    setRecipients([...recipients, ""]);
    setAmounts([...amounts, ""]);
  }

  // Function to delete a recipient and its corresponding amount
  function deleteRecipient(index) {
    const updatedRecipients = recipients.filter((_, i) => i !== index);
    const updatedAmounts = amounts.filter((_, i) => i !== index);
    setRecipients(updatedRecipients);
    setAmounts(updatedAmounts);
  }

  // Function to handle sending the data (you can implement your logic here)
  function send() {
    const { recipients, amounts } = getInputsAsArrays();
    // setShow(true);
    const tokenAddress = selectedOptions.value;
    sendBatchTransaction(tokenAddress, recipients, amounts);
    // Implement your logic to send the data here
    console.log("Recipients:", recipients);
    console.log("Amounts:", amounts);
    console.log("Token", selectedOptions.value);
  }

  function handleSelect(data) {
    setSelectedOptions(data);
  }

  return (
    <main className="gray-bg">
      <div className="py-4 otomar">
        {/*  */}

        <Card className="minmaxwid">
          <Card.Body>
            <h1 className="fontbody">Send Tokens</h1>
            <div className="minmaxWidth">
              <Select
                options={optionList}
                placeholder="Select Token to Send"
                value={selectedOptions}
                onChange={handleSelect}
                isSearchable={true}
              />
            </div>

            {recipients.map((recipient, index) => (
              <div key={index}>
                <div>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => {
                      const updatedRecipients = [...recipients];
                      updatedRecipients[index] = e.target.value;
                      setRecipients(updatedRecipients);
                    }}
                    placeholder="Recipient"
                    className="my-2"
                  />
                  <input
                    type="text"
                    value={amounts[index]}
                    onChange={(e) => {
                      const updatedAmounts = [...amounts];
                      updatedAmounts[index] = e.target.value;
                      setAmounts(updatedAmounts);
                    }}
                    placeholder="Amount"
                    className="mx-3"
                  />

                  <Button
                    variant="danger"
                    className="mx-1"
                    onClick={() => deleteRecipient(index)}
                  >
                    Delete
                  </Button>
                </div>
                {index === recipients.length - 1 && (
                  <Button
                    variant="primary"
                    className="my-1"
                    onClick={addRecipientAndAmount}
                  >
                    + Add Recipient
                  </Button>
                )}
              </div>
            ))}

            <Button variant="success" onClick={send}>
              Send
            </Button>
          </Card.Body>
        </Card>

        {/* <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Transaction(s) sent!</Modal.Title>
          </Modal.Header>
          <Modal.Body>Recipients: {recipients.join(", ")}</Modal.Body>
          <Modal.Body>Amounts: {amounts.join(", ")}</Modal.Body>
          <Modal.Body>
            Token: {selectedOptions && selectedOptions.label}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              See in etherscan ->
            </Button>
          </Modal.Footer>
        </Modal> */}
      </div>
    </main>
  );
}

export default Sender;
