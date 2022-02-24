require("dotenv").config();

const express = require("express");
const { PORT } = require("./config");
const app = express();

const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
const contract = require("./MyNFT.json");
const contractAddress = "0x05F79F4d868ecD532c3fcEc43f73E18Ff0fE8F51";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

app.use(express.json());

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  user = { email, password };
  res.json({
    success: true,
    message: "Oke",
  });
});

async function transfer(tokenID) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods
      .transfer2(
        "0xFc704cB253A586A6539f29705ecC5FAeEa3e2FB3",
        "0x94516F310cB119BD79E24eA969b8374025cA9D48",
        tokenID
      )
      .encodeABI(),
  };
  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash
              // "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}

app.post("/transfer", (req, res) => {
  const { ids } = req.body;
  transfer(ids);

  res.json({
    success: true,
    message: "Done transfer",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
