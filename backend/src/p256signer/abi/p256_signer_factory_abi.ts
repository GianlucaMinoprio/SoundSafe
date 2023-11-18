export default [
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "uint256", name: "x", type: "uint256" },
            { indexed: true, internalType: "uint256", name: "y", type: "uint256" },
            {
                indexed: false,
                internalType: "address",
                name: "signer",
                type: "address",
            },
        ],
        name: "NewSignerCreated",
        type: "event",
    },
    {
        inputs: [
            { internalType: "uint256", name: "x", type: "uint256" },
            { internalType: "uint256", name: "y", type: "uint256" },
        ],
        name: "create",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];