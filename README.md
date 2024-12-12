# Arrakis Challenge

This project implements an Add Liquidity feature for Arrakis vaults on Arbitrum One.
Built on top of Scaffold Eth 2.

## Tech Stack

- Next.js
- TypeScript
- TailwindCSS
- shadcn/ui
- Viem
- Wagmi
- RainbowKit
- Tenderly

## Project Structure

The project is a monorepo with the following structure:

- `root/packages/nextjs`: Frontend implementation
- `root/packages/foundry`: Backend (not used in this project)

## Setup Instructions

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Fork Arbitrum One chain in Tenderly
   - Set `NEXT_PUBLIC_TENDERLY_RPC_URL` in `.env` with your Tenderly fork URL

4. Start the development server:

```bash
yarn start
```

## Local Development

The project uses a Tenderly fork of Arbitrum One for local development. Key folders:

- `/contracts`: Contains all provided contract data
- `/configs`: Contains Arrakis vault and token configurations

### Component Structure

- `AddLiquidity`: Main component for handling liquidity inputs
- `TransactionModal`: Handles transaction flow with dynamic user feedback

Note: `AddLiquidity` component uses dynamic import due to RainbowKit Button hydration issues.

## Assumptions

1. This feature is part of a larger application
2. Users access the Add Liquidity page directly
3. Component focuses on:
   - Input handling for AddLiquidity
   - Transaction flow management
   - Error prevention and handling
   - Dynamic user feedback

## Supported Chains

While the project supports two chains, it currently only functions on Arbitrum One as the provided contracts are deployed there.

## Known Limitations

1. **Single Vault Support**

   - Currently handles only one specific vault and its token pair

2. **Transaction Confirmation**

   - Due to Tenderly fork limitations, transaction confirmations are set to 1
   - Should be adjusted for other environments

3. **UI Constraints**

   - Balance and token display may break with large decimal numbers
   - Decimal handling needs improvement

4. **Error Handling**
   - Transaction error feedback relies on `wagmi's error.shortMessage`
   - Error mapping could be more comprehensive

## Areas for Improvement

1. **Transaction Feedback System**

   - Show AddLiquidity transaction output to the user (amounts of shares received)
   - Bypass token allowance transaction if there is an existing one that is equal or bigger

2. **Transaction Management**

   - Implement proper transaction confirmation counts for different networks

3. **UI/UX Enhancements**

   - Implement proper decimal handling for large numbers
   - Improve balance and token display

4. **Error Handling**

   - Create a comprehensive error mapping system
   - Implement more user-friendly error messages

5. **Code Comments**

   - Code comments and documentation could be greatly enhanced.
