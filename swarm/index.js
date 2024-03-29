const fs = require("fs");
const ethers = require("ethers");

const abi = [
  {
    inputs: [{ internalType: "address", name: "_bzzToken", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "batchId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "normalisedBalance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      { indexed: false, internalType: "uint8", name: "depth", type: "uint8" },
      {
        indexed: false,
        internalType: "uint8",
        name: "bucketDepth",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "immutableFlag",
        type: "bool",
      },
    ],
    name: "BatchCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "batchId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "newDepth",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "normalisedBalance",
        type: "uint256",
      },
    ],
    name: "BatchDepthIncrease",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "batchId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "topupAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "normalisedBalance",
        type: "uint256",
      },
    ],
    name: "BatchTopUp",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "PriceUpdate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PAUSER_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PRICE_ORACLE_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "batches",
    outputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint8", name: "depth", type: "uint8" },
      { internalType: "bool", name: "immutableFlag", type: "bool" },
      { internalType: "uint256", name: "normalisedBalance", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bzzToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_owner", type: "address" },
      {
        internalType: "uint256",
        name: "_initialBalancePerChunk",
        type: "uint256",
      },
      { internalType: "uint8", name: "_depth", type: "uint8" },
      { internalType: "uint8", name: "_bucketDepth", type: "uint8" },
      { internalType: "bytes32", name: "_nonce", type: "bytes32" },
      { internalType: "bool", name: "_immutable", type: "bool" },
    ],
    name: "createBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currentTotalOutPayment",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "getRoleMember",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleMemberCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_batchId", type: "bytes32" },
      { internalType: "uint8", name: "_newDepth", type: "uint8" },
    ],
    name: "increaseDepth",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lastPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastUpdatedBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "_batchId", type: "bytes32" }],
    name: "remainingBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_price", type: "uint256" }],
    name: "setPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_batchId", type: "bytes32" },
      {
        internalType: "uint256",
        name: "_topupAmountPerChunk",
        type: "uint256",
      },
    ],
    name: "topUp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalOutPayment",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unPause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Function to calculate file information
async function calculateFileInfo(filePath, ttl) {
  try {
    // Read file information
    const fileStats = fs.statSync(filePath);
    const fileSize = fileStats.size;
    const chunks = Math.ceil(fileSize / 4096);
    let depth = Math.ceil(Math.log2(chunks));
    if (depth < 20) depth = 20;

    // Initialize Ethereum provider and contract
    const provider = new ethers.providers.JsonRpcProvider(
      "https://goerli.mooo.com/",
      5
    );
    const contract = new ethers.Contract(
      "0x621e455c4a139f5c4e4a8122ce55dc21630769e4",
      abi,
      provider
    );
    // Get the last Ethereum block price
    const pricePerBlock = await contract.lastPrice();
    const blockTime = 15;

    // Calculate postage stamp chunks, initial balance per chunk, and total amount
    const postageStampChunks = 2 ** depth;
    const initialBalancePerChunk = pricePerBlock.mul(ttl).div(blockTime);
    const totalAmount = initialBalancePerChunk.mul(postageStampChunks);

    return {
      name: filePath,
      size: fileSize,
      sizeKB: fileSize / 1024,
      sizeMB: fileSize / 1024 / 1024,
      chunks: chunks,
      depth: depth,
      ttl: ttl,
      initialBalancePerChunk: initialBalancePerChunk.toString(),
      totalAmount: ethers.utils.formatUnits(totalAmount, 16),
      totalAmountPLUR: totalAmount.toString(),
    };
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Command-line arguments
const args = process.argv.slice(2);

const filePath = args[0];

// Calculate file information and log the result
calculateFileInfo(filePath, 31536000)
  .then((result) => {

    console.log(result);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
