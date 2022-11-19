const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

const RPC_URL_GOERLI = process.env.RPC_URL_GOERLI_INFURA
const PRIVATE_KEY = process.env.PRIVATE_KEY_ACCOUNT_A
const RPC_URL = process.env.RPC_URL

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL_GOERLI)
    const signer = new ethers.Wallet(PRIVATE_KEY, provider)
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8")
    // to deploy the contract we need the abi, bin and a wallet
    const contractFactory = new ethers.ContractFactory(abi, binary, signer)
    console.log("Deploying contract, please wait...")
    const contract = await contractFactory.deploy()
    // console.log(contract)

    // Interacting with the contract using ethers.js:
    const currentFavoriteNumber = await contract.retrieve()
    console.log(`The current favorite number is: ${currentFavoriteNumber.toString()}`)
    // It's good practice to pass params to functions as strings, ethers.js is smart enough to know
    // the string is actually a number
    const transactionResponse = await contract.store("7")
    const transactionReceipt = await transactionResponse.wait(1)
    // You only get a Transaction Receipt after the block containing your transaction has been mined
    //console.log(transactionReceipt)
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(`The stored number is: ${updatedFavoriteNumber}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
