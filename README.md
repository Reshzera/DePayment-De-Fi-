# DePayment - DeFi Recurring Payment System

DePayment is a DeFi recurring payment system leveraging blockchain technology to provide a secure and decentralized solution for automatic payments. The system is built on Ethereum, utilizing smart contracts for transaction and subscription management, and a centralized backend for operations that do not require decentralization.

## Features

- Automated recurring payments via smart contracts.
- Use of ERC-20 tokens and NFTs (ERC-721) for managing subscriptions and payments.
- Express.js backend for handling off-chain tasks.
- Integrated cron job for automating recurring payments.
- Discord webhook notifications for tracking successful payments and failures.

## Project Structure

The project is divided into two main folders:

- `blockchain`: Contains the smart contracts and Hardhat configurations.
- `backend`: Contains the Express.js server and logic to interact with the blockchain.

### Blockchain

The `blockchain` folder uses Hardhat for developing, testing, and deploying smart contracts.

### Backend

The `backend` folder includes:

- `ABI`: Smart contract interfaces.
- `src`: TypeScript source code.
  - `controllers`: Control logic for API endpoints.
  - `repository`: Interacts with the blockchain to execute contract operations.
  - `routers`: Defines API routes.
  - `services`: Includes `DePaymentCron` for recurring payments.
  - `types`: TypeScript type definitions.

## Setup

### Prerequisites

- Node.js
- Yarn
- Ethereum Wallet with ETH for deploying contracts

### Configuration

1. Clone the repository:
   ```
   git clone https://github.com/Reshzera/DePayment-De-Fi-.git
   ```
2. Install dependencies:
   ```
   cd backend
   yarn install
   cd ../blockchain
   yarn install
   ```
3. Set up environment variables:
   Create a `.env` file following the `.env.example` included in the project.

### Execution

To run the backend:

```shell
cd backend
yarn start
```

To compile and deploy the contracts:

```shell
cd blockchain
yarn deploy:sepolia
```

## API Documentation

Document all available routes, such as:

- `GET /token/images/:id`: Returns the image of the NFT token with the specified ID.
- `GET /token/:id`: Returns the metadata of the NFT with the specified ID.
