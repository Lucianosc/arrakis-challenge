import { Abi, Address } from "viem";

type Contract = { address: Address; abi: Abi };

export const ARRAKIS_CONTRACTS: { [key: string]: Contract } = {
  vault: {
    address: "0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723", // Arbitrum WETH/rETH Arrakis vault
    abi: [
      {
        inputs: [
          { internalType: "address", name: "beacon", type: "address" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        stateMutability: "payable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, internalType: "address", name: "previousAdmin", type: "address" },
          { indexed: false, internalType: "address", name: "newAdmin", type: "address" },
        ],
        name: "AdminChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, internalType: "address", name: "beacon", type: "address" }],
        name: "BeaconUpgraded",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, internalType: "address", name: "implementation", type: "address" }],
        name: "Upgraded",
        type: "event",
      },
      { stateMutability: "payable", type: "fallback" },
      { stateMutability: "payable", type: "receive" },
    ],
  },
  helper: {
    address: "0x89E4bE1F999E3a58D16096FBe405Fc2a1d7F07D6", // Arbitrum Arrakis helper
    abi: [
      {
        inputs: [{ internalType: "contract IUniswapV3Factory", name: "factory_", type: "address" }],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [],
        name: "factory",
        outputs: [{ internalType: "contract IUniswapV3Factory", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              { internalType: "int24", name: "lowerTick", type: "int24" },
              { internalType: "int24", name: "upperTick", type: "int24" },
              { internalType: "uint24", name: "feeTier", type: "uint24" },
            ],
            internalType: "struct Range[]",
            name: "ranges_",
            type: "tuple[]",
          },
          { internalType: "address", name: "token0_", type: "address" },
          { internalType: "address", name: "token1_", type: "address" },
          { internalType: "address", name: "vaultV2_", type: "address" },
        ],
        name: "token0AndToken1ByRange",
        outputs: [
          {
            components: [
              {
                components: [
                  { internalType: "int24", name: "lowerTick", type: "int24" },
                  { internalType: "int24", name: "upperTick", type: "int24" },
                  { internalType: "uint24", name: "feeTier", type: "uint24" },
                ],
                internalType: "struct Range",
                name: "range",
                type: "tuple",
              },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            internalType: "struct Amount[]",
            name: "amount0s",
            type: "tuple[]",
          },
          {
            components: [
              {
                components: [
                  { internalType: "int24", name: "lowerTick", type: "int24" },
                  { internalType: "int24", name: "upperTick", type: "int24" },
                  { internalType: "uint24", name: "feeTier", type: "uint24" },
                ],
                internalType: "struct Range",
                name: "range",
                type: "tuple",
              },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            internalType: "struct Amount[]",
            name: "amount1s",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              { internalType: "int24", name: "lowerTick", type: "int24" },
              { internalType: "int24", name: "upperTick", type: "int24" },
              { internalType: "uint24", name: "feeTier", type: "uint24" },
            ],
            internalType: "struct Range[]",
            name: "ranges_",
            type: "tuple[]",
          },
          { internalType: "address", name: "token0_", type: "address" },
          { internalType: "address", name: "token1_", type: "address" },
          { internalType: "address", name: "vaultV2_", type: "address" },
        ],
        name: "token0AndToken1PlusFeesByRange",
        outputs: [
          {
            components: [
              {
                components: [
                  { internalType: "int24", name: "lowerTick", type: "int24" },
                  { internalType: "int24", name: "upperTick", type: "int24" },
                  { internalType: "uint24", name: "feeTier", type: "uint24" },
                ],
                internalType: "struct Range",
                name: "range",
                type: "tuple",
              },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            internalType: "struct Amount[]",
            name: "amount0s",
            type: "tuple[]",
          },
          {
            components: [
              {
                components: [
                  { internalType: "int24", name: "lowerTick", type: "int24" },
                  { internalType: "int24", name: "upperTick", type: "int24" },
                  { internalType: "uint24", name: "feeTier", type: "uint24" },
                ],
                internalType: "struct Range",
                name: "range",
                type: "tuple",
              },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            internalType: "struct Amount[]",
            name: "amount1s",
            type: "tuple[]",
          },
          {
            components: [
              {
                components: [
                  { internalType: "int24", name: "lowerTick", type: "int24" },
                  { internalType: "int24", name: "upperTick", type: "int24" },
                  { internalType: "uint24", name: "feeTier", type: "uint24" },
                ],
                internalType: "struct Range",
                name: "range",
                type: "tuple",
              },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            internalType: "struct Amount[]",
            name: "fee0s",
            type: "tuple[]",
          },
          {
            components: [
              {
                components: [
                  { internalType: "int24", name: "lowerTick", type: "int24" },
                  { internalType: "int24", name: "upperTick", type: "int24" },
                  { internalType: "uint24", name: "feeTier", type: "uint24" },
                ],
                internalType: "struct Range",
                name: "range",
                type: "tuple",
              },
              { internalType: "uint256", name: "amount", type: "uint256" },
            ],
            internalType: "struct Amount[]",
            name: "fee1s",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "contract IArrakisV2", name: "vault_", type: "address" }],
        name: "totalLiquidity",
        outputs: [
          {
            components: [
              { internalType: "uint128", name: "liquidity", type: "uint128" },
              {
                components: [
                  { internalType: "int24", name: "lowerTick", type: "int24" },
                  { internalType: "int24", name: "upperTick", type: "int24" },
                  { internalType: "uint24", name: "feeTier", type: "uint24" },
                ],
                internalType: "struct Range",
                name: "range",
                type: "tuple",
              },
            ],
            internalType: "struct PositionLiquidity[]",
            name: "liquidities",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "contract IArrakisV2", name: "vault_", type: "address" }],
        name: "totalUnderlying",
        outputs: [
          { internalType: "uint256", name: "amount0", type: "uint256" },
          { internalType: "uint256", name: "amount1", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "contract IArrakisV2", name: "vault_", type: "address" },
          { internalType: "uint160", name: "sqrtPriceX96_", type: "uint160" },
        ],
        name: "totalUnderlyingAtPrice",
        outputs: [
          { internalType: "uint256", name: "amount0", type: "uint256" },
          { internalType: "uint256", name: "amount1", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "contract IArrakisV2", name: "vault_", type: "address" }],
        name: "totalUnderlyingWithFees",
        outputs: [
          { internalType: "uint256", name: "amount0", type: "uint256" },
          { internalType: "uint256", name: "amount1", type: "uint256" },
          { internalType: "uint256", name: "fee0", type: "uint256" },
          { internalType: "uint256", name: "fee1", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "contract IArrakisV2", name: "vault_", type: "address" }],
        name: "totalUnderlyingWithFeesAndLeftOver",
        outputs: [
          {
            components: [
              { internalType: "uint256", name: "amount0", type: "uint256" },
              { internalType: "uint256", name: "amount1", type: "uint256" },
              { internalType: "uint256", name: "fee0", type: "uint256" },
              { internalType: "uint256", name: "fee1", type: "uint256" },
              { internalType: "uint256", name: "leftOver0", type: "uint256" },
              { internalType: "uint256", name: "leftOver1", type: "uint256" },
            ],
            internalType: "struct UnderlyingOutput",
            name: "underlying",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
  },
  router: {
    address: "0x6aC8Bab8B775a03b8B72B2940251432442f61B94", // Arbitrum Arrakis router
    abi: [
      {
        inputs: [
          { internalType: "address", name: "weth_", type: "address" },
          { internalType: "address", name: "resolver_", type: "address" },
          { internalType: "address", name: "permit2_", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [{ indexed: false, internalType: "uint8", name: "version", type: "uint8" }],
        name: "Initialized",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, internalType: "address", name: "vault", type: "address" },
          { indexed: false, internalType: "address[]", name: "blacklisted", type: "address[]" },
        ],
        name: "LogBlacklist",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, internalType: "address", name: "vault", type: "address" },
          { indexed: false, internalType: "uint256", name: "supplyCap", type: "uint256" },
          { indexed: false, internalType: "bool", name: "hasWhitelist", type: "bool" },
        ],
        name: "LogSetVault",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, internalType: "address", name: "vault", type: "address" },
          { indexed: false, internalType: "address[]", name: "whitelisted", type: "address[]" },
        ],
        name: "LogWhitelist",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
          { indexed: true, internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [{ indexed: false, internalType: "address", name: "account", type: "address" }],
        name: "Paused",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: false, internalType: "bool", name: "zeroForOne", type: "bool" },
          { indexed: false, internalType: "uint256", name: "amount0Diff", type: "uint256" },
          { indexed: false, internalType: "uint256", name: "amount1Diff", type: "uint256" },
          { indexed: false, internalType: "uint256", name: "amountOutSwap", type: "uint256" },
        ],
        name: "Swapped",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [{ indexed: false, internalType: "address", name: "account", type: "address" }],
        name: "Unpaused",
        type: "event",
      },
      {
        inputs: [
          {
            components: [
              { internalType: "uint256", name: "amount0Max", type: "uint256" },
              { internalType: "uint256", name: "amount1Max", type: "uint256" },
              { internalType: "uint256", name: "amount0Min", type: "uint256" },
              { internalType: "uint256", name: "amount1Min", type: "uint256" },
              { internalType: "uint256", name: "amountSharesMin", type: "uint256" },
              { internalType: "address", name: "vault", type: "address" },
              { internalType: "address", name: "receiver", type: "address" },
              { internalType: "address", name: "gauge", type: "address" },
            ],
            internalType: "struct AddLiquidityData",
            name: "params_",
            type: "tuple",
          },
        ],
        name: "addLiquidity",
        outputs: [
          { internalType: "uint256", name: "amount0", type: "uint256" },
          { internalType: "uint256", name: "amount1", type: "uint256" },
          { internalType: "uint256", name: "sharesReceived", type: "uint256" },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  { internalType: "uint256", name: "amount0Max", type: "uint256" },
                  { internalType: "uint256", name: "amount1Max", type: "uint256" },
                  { internalType: "uint256", name: "amount0Min", type: "uint256" },
                  { internalType: "uint256", name: "amount1Min", type: "uint256" },
                  { internalType: "uint256", name: "amountSharesMin", type: "uint256" },
                  { internalType: "address", name: "vault", type: "address" },
                  { internalType: "address", name: "receiver", type: "address" },
                  { internalType: "address", name: "gauge", type: "address" },
                ],
                internalType: "struct AddLiquidityData",
                name: "addData",
                type: "tuple",
              },
              {
                components: [
                  {
                    components: [
                      { internalType: "address", name: "token", type: "address" },
                      { internalType: "uint256", name: "amount", type: "uint256" },
                    ],
                    internalType: "struct TokenPermissions[]",
                    name: "permitted",
                    type: "tuple[]",
                  },
                  { internalType: "uint256", name: "nonce", type: "uint256" },
                  { internalType: "uint256", name: "deadline", type: "uint256" },
                ],
                internalType: "struct PermitBatchTransferFrom",
                name: "permit",
                type: "tuple",
              },
              { internalType: "bytes", name: "signature", type: "bytes" },
            ],
            internalType: "struct AddLiquidityPermit2Data",
            name: "params_",
            type: "tuple",
          },
        ],
        name: "addLiquidityPermit2",
        outputs: [
          { internalType: "uint256", name: "amount0", type: "uint256" },
          { internalType: "uint256", name: "amount1", type: "uint256" },
          { internalType: "uint256", name: "sharesReceived", type: "uint256" },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "vault_", type: "address" },
          { internalType: "address[]", name: "toBlacklist_", type: "address[]" },
        ],
        name: "blacklist",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "vault_", type: "address" }],
        name: "getWhitelist",
        outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "owner_", type: "address" }],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "mintRestrictedVaults",
        outputs: [
          { internalType: "uint256", name: "supplyCap", type: "uint256" },
          { internalType: "bool", name: "hasWhitelist", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      { inputs: [], name: "pause", outputs: [], stateMutability: "nonpayable", type: "function" },
      {
        inputs: [],
        name: "paused",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "permit2",
        outputs: [{ internalType: "contract IPermit2", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              { internalType: "uint256", name: "burnAmount", type: "uint256" },
              { internalType: "uint256", name: "amount0Min", type: "uint256" },
              { internalType: "uint256", name: "amount1Min", type: "uint256" },
              { internalType: "address", name: "vault", type: "address" },
              { internalType: "address payable", name: "receiver", type: "address" },
              { internalType: "address", name: "gauge", type: "address" },
              { internalType: "bool", name: "receiveETH", type: "bool" },
            ],
            internalType: "struct RemoveLiquidityData",
            name: "params_",
            type: "tuple",
          },
        ],
        name: "removeLiquidity",
        outputs: [
          { internalType: "uint256", name: "amount0", type: "uint256" },
          { internalType: "uint256", name: "amount1", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  { internalType: "uint256", name: "burnAmount", type: "uint256" },
                  { internalType: "uint256", name: "amount0Min", type: "uint256" },
                  { internalType: "uint256", name: "amount1Min", type: "uint256" },
                  { internalType: "address", name: "vault", type: "address" },
                  { internalType: "address payable", name: "receiver", type: "address" },
                  { internalType: "address", name: "gauge", type: "address" },
                  { internalType: "bool", name: "receiveETH", type: "bool" },
                ],
                internalType: "struct RemoveLiquidityData",
                name: "removeData",
                type: "tuple",
              },
              {
                components: [
                  {
                    components: [
                      { internalType: "address", name: "token", type: "address" },
                      { internalType: "uint256", name: "amount", type: "uint256" },
                    ],
                    internalType: "struct TokenPermissions",
                    name: "permitted",
                    type: "tuple",
                  },
                  { internalType: "uint256", name: "nonce", type: "uint256" },
                  { internalType: "uint256", name: "deadline", type: "uint256" },
                ],
                internalType: "struct PermitTransferFrom",
                name: "permit",
                type: "tuple",
              },
              { internalType: "bytes", name: "signature", type: "bytes" },
            ],
            internalType: "struct RemoveLiquidityPermit2Data",
            name: "params_",
            type: "tuple",
          },
        ],
        name: "removeLiquidityPermit2",
        outputs: [
          { internalType: "uint256", name: "amount0", type: "uint256" },
          { internalType: "uint256", name: "amount1", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
      {
        inputs: [],
        name: "resolver",
        outputs: [{ internalType: "contract IArrakisV2Resolver", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "vault_", type: "address" },
          { internalType: "uint256", name: "supplyCap_", type: "uint256" },
          { internalType: "bool", name: "hasWhitelist_", type: "bool" },
        ],
        name: "setMintRules",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  { internalType: "bytes", name: "swapPayload", type: "bytes" },
                  { internalType: "uint256", name: "amountInSwap", type: "uint256" },
                  { internalType: "uint256", name: "amountOutSwap", type: "uint256" },
                  { internalType: "address", name: "swapRouter", type: "address" },
                  { internalType: "bool", name: "zeroForOne", type: "bool" },
                ],
                internalType: "struct SwapData",
                name: "swapData",
                type: "tuple",
              },
              {
                components: [
                  { internalType: "uint256", name: "amount0Max", type: "uint256" },
                  { internalType: "uint256", name: "amount1Max", type: "uint256" },
                  { internalType: "uint256", name: "amount0Min", type: "uint256" },
                  { internalType: "uint256", name: "amount1Min", type: "uint256" },
                  { internalType: "uint256", name: "amountSharesMin", type: "uint256" },
                  { internalType: "address", name: "vault", type: "address" },
                  { internalType: "address", name: "receiver", type: "address" },
                  { internalType: "address", name: "gauge", type: "address" },
                ],
                internalType: "struct AddLiquidityData",
                name: "addData",
                type: "tuple",
              },
            ],
            internalType: "struct SwapAndAddData",
            name: "params_",
            type: "tuple",
          },
        ],
        name: "swapAndAddLiquidity",
        outputs: [
          { internalType: "uint256", name: "amount0", type: "uint256" },
          { internalType: "uint256", name: "amount1", type: "uint256" },
          { internalType: "uint256", name: "sharesReceived", type: "uint256" },
          { internalType: "uint256", name: "amount0Diff", type: "uint256" },
          { internalType: "uint256", name: "amount1Diff", type: "uint256" },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  {
                    components: [
                      { internalType: "bytes", name: "swapPayload", type: "bytes" },
                      { internalType: "uint256", name: "amountInSwap", type: "uint256" },
                      { internalType: "uint256", name: "amountOutSwap", type: "uint256" },
                      { internalType: "address", name: "swapRouter", type: "address" },
                      { internalType: "bool", name: "zeroForOne", type: "bool" },
                    ],
                    internalType: "struct SwapData",
                    name: "swapData",
                    type: "tuple",
                  },
                  {
                    components: [
                      { internalType: "uint256", name: "amount0Max", type: "uint256" },
                      { internalType: "uint256", name: "amount1Max", type: "uint256" },
                      { internalType: "uint256", name: "amount0Min", type: "uint256" },
                      { internalType: "uint256", name: "amount1Min", type: "uint256" },
                      { internalType: "uint256", name: "amountSharesMin", type: "uint256" },
                      { internalType: "address", name: "vault", type: "address" },
                      { internalType: "address", name: "receiver", type: "address" },
                      { internalType: "address", name: "gauge", type: "address" },
                    ],
                    internalType: "struct AddLiquidityData",
                    name: "addData",
                    type: "tuple",
                  },
                ],
                internalType: "struct SwapAndAddData",
                name: "swapAndAddData",
                type: "tuple",
              },
              {
                components: [
                  {
                    components: [
                      { internalType: "address", name: "token", type: "address" },
                      { internalType: "uint256", name: "amount", type: "uint256" },
                    ],
                    internalType: "struct TokenPermissions[]",
                    name: "permitted",
                    type: "tuple[]",
                  },
                  { internalType: "uint256", name: "nonce", type: "uint256" },
                  { internalType: "uint256", name: "deadline", type: "uint256" },
                ],
                internalType: "struct PermitBatchTransferFrom",
                name: "permit",
                type: "tuple",
              },
              { internalType: "bytes", name: "signature", type: "bytes" },
            ],
            internalType: "struct SwapAndAddPermit2Data",
            name: "params_",
            type: "tuple",
          },
        ],
        name: "swapAndAddLiquidityPermit2",
        outputs: [
          { internalType: "uint256", name: "amount0", type: "uint256" },
          { internalType: "uint256", name: "amount1", type: "uint256" },
          { internalType: "uint256", name: "sharesReceived", type: "uint256" },
          { internalType: "uint256", name: "amount0Diff", type: "uint256" },
          { internalType: "uint256", name: "amount1Diff", type: "uint256" },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "swapper",
        outputs: [{ internalType: "contract IRouterSwapExecutor", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      { inputs: [], name: "unpause", outputs: [], stateMutability: "nonpayable", type: "function" },
      {
        inputs: [{ internalType: "address", name: "swapper_", type: "address" }],
        name: "updateSwapExecutor",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "weth",
        outputs: [{ internalType: "contract IWETH", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "vault_", type: "address" },
          { internalType: "address[]", name: "toWhitelist_", type: "address[]" },
        ],
        name: "whitelist",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      { stateMutability: "payable", type: "receive" },
    ],
  },
  resolver: {
    address: "0x535c5fdf31477f799366df6e4899a12a801cc7b8", // Arbitrum Arrakis resolver
    abi: [
      {
        inputs: [{ internalType: "contract IUniswapV3Factory", name: "factory_", type: "address" }],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [],
        name: "factory",
        outputs: [{ internalType: "contract IUniswapV3Factory", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint160", name: "sqrtPriceX96_", type: "uint160" },
          { internalType: "int24", name: "lowerTick_", type: "int24" },
          { internalType: "int24", name: "upperTick_", type: "int24" },
          { internalType: "int128", name: "liquidity_", type: "int128" },
        ],
        name: "getAmountsForLiquidity",
        outputs: [
          { internalType: "uint256", name: "amount0", type: "uint256" },
          { internalType: "uint256", name: "amount1", type: "uint256" },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          { internalType: "contract IArrakisV2", name: "vaultV2_", type: "address" },
          { internalType: "uint256", name: "amount0Max_", type: "uint256" },
          { internalType: "uint256", name: "amount1Max_", type: "uint256" },
        ],
        name: "getMintAmounts",
        outputs: [
          { internalType: "uint256", name: "amount0", type: "uint256" },
          { internalType: "uint256", name: "amount1", type: "uint256" },
          { internalType: "uint256", name: "mintAmount", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "addr_", type: "address" },
          { internalType: "int24", name: "lowerTick_", type: "int24" },
          { internalType: "int24", name: "upperTick_", type: "int24" },
        ],
        name: "getPositionId",
        outputs: [{ internalType: "bytes32", name: "positionId", type: "bytes32" }],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          {
            components: [
              {
                components: [
                  { internalType: "int24", name: "lowerTick", type: "int24" },
                  { internalType: "int24", name: "upperTick", type: "int24" },
                  { internalType: "uint24", name: "feeTier", type: "uint24" },
                ],
                internalType: "struct Range",
                name: "range",
                type: "tuple",
              },
              { internalType: "uint256", name: "weight", type: "uint256" },
            ],
            internalType: "struct RangeWeight[]",
            name: "rangeWeights_",
            type: "tuple[]",
          },
          { internalType: "contract IArrakisV2", name: "vaultV2_", type: "address" },
        ],
        name: "standardRebalance",
        outputs: [
          {
            components: [
              {
                components: [
                  { internalType: "uint128", name: "liquidity", type: "uint128" },
                  {
                    components: [
                      { internalType: "int24", name: "lowerTick", type: "int24" },
                      { internalType: "int24", name: "upperTick", type: "int24" },
                      { internalType: "uint24", name: "feeTier", type: "uint24" },
                    ],
                    internalType: "struct Range",
                    name: "range",
                    type: "tuple",
                  },
                ],
                internalType: "struct PositionLiquidity[]",
                name: "burns",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "uint128", name: "liquidity", type: "uint128" },
                  {
                    components: [
                      { internalType: "int24", name: "lowerTick", type: "int24" },
                      { internalType: "int24", name: "upperTick", type: "int24" },
                      { internalType: "uint24", name: "feeTier", type: "uint24" },
                    ],
                    internalType: "struct Range",
                    name: "range",
                    type: "tuple",
                  },
                ],
                internalType: "struct PositionLiquidity[]",
                name: "mints",
                type: "tuple[]",
              },
              {
                components: [
                  { internalType: "bytes", name: "payload", type: "bytes" },
                  { internalType: "address", name: "router", type: "address" },
                  { internalType: "uint256", name: "amountIn", type: "uint256" },
                  { internalType: "uint256", name: "expectedMinReturn", type: "uint256" },
                  { internalType: "bool", name: "zeroForOne", type: "bool" },
                ],
                internalType: "struct SwapPayload",
                name: "swap",
                type: "tuple",
              },
              { internalType: "uint256", name: "minBurn0", type: "uint256" },
              { internalType: "uint256", name: "minBurn1", type: "uint256" },
              { internalType: "uint256", name: "minDeposit0", type: "uint256" },
              { internalType: "uint256", name: "minDeposit1", type: "uint256" },
            ],
            internalType: "struct Rebalance",
            name: "rebalanceParams",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
  },
};

export const TOKENS = {
  rETH: {
    address: "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8", // Arbitrum rETH
    decimals: 18,
    symbol: "rETH",
  },
  WETH: {
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // Arbitrum WETH
    decimals: 18,
    symbol: "WETH",
  },
};

export const CHAINLINK_FEEDS = {
  ETHUSD: {
    address: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612", // ETH/USD on Arbitrum
    decimals: 8,
  },
  rETHETH: {
    address: "0xD6aB2298946840262FcC278fF31516D39fF611eF", // rETH/ETH on Arbitrum
    decimals: 18,
  },
};

export const CHAINLINK_PRICE_FEED_ABI = [
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { name: "roundId", type: "uint80" },
      { name: "answer", type: "int256" },
      { name: "startedAt", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
      { name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
