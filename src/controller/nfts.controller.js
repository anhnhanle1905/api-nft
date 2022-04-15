import Web3 from "web3";
import contract from "../contracts/TestNFT.json" assert { type: "json" };

const API_URL_MUMBAI = process.env.API_URL_MUMBAI;
// 2 address nay la co dinh, cua ben mint NFT
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

var web3 = new Web3(API_URL_MUMBAI);
const contractAddress = CONTRACT_ADDRESS;
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

// export const example = async (req, res) => {
//   const { id } = req.params;

//   try {
//     res.status(200).json({ message: `Test oke with ${id}` });
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// };

async function mintNFT(tokenURIs) {
  // for (let i = 0; i <= tokenURIs.length; i++) {}
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce

  let amountNft = tokenURIs.length;
  let gasLimit = 150000 * amountNft; //uoc luong khoang 130->150k/1 NFT

  console.log(`--> ${amountNft} NFT`);
  //check gaslimit
  console.log(`--> ${gasLimit} gas limit`);
  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: gasLimit, //gas limit
    data: nftContract.methods.mint(PUBLIC_KEY, tokenURIs).encodeABI(),
  };
  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log("The hash of your transaction is: ", hash);
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

export const mint = async (req, res) => {
  const { arrMetadata } = req.body;

  try {
    await mintNFT(arrMetadata);
    res.status(200).json({ message: `Mint NFT success` });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// transfer
async function transfer(tokenID) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods
      .transfer(
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
            console.log("The hash of your transaction is: ", hash);
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

export const transferNft = async (req, res) => {
  const { tokenId } = req.body;

  try {
    await transfer(tokenId);
    res.status(200).json({ message: `Transfer NFT success` });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
