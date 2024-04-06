import dotenv from 'dotenv';
import { createPublicClient, createWalletClient, http } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import DePayementABIType from '../types/DePaymentABIType';
import DePaymentTokenABITypes from '../types/DePaymentTokenABITypes';
dotenv.config();

const DePaymentContract = {
  address: process.env.DEPAYMENT_CONTRACT_ADDRESS as `0x${string}`,
  abi: DePayementABIType,
};

const DePaymentTokenContract = {
  address: process.env.DEPAYMENT_TOKEN_CONTRACT_ADDRESS as `0x${string}`,
  abi: DePaymentTokenABITypes,
};

const ownerAccount = mnemonicToAccount(
  process.env.OWNER_MNEMONIC as `0x${string}`,
);
const InfuraNodeConnection = createPublicClient({
  chain: sepolia,
  transport: http(process.env.INFURA_URL as string),
});

const OwnerWallet = createWalletClient({
  account: ownerAccount,
  chain: sepolia,
  transport: http(process.env.INFURA_URL as string),
});

export {
  DePaymentContract,
  InfuraNodeConnection,
  OwnerWallet,
  ownerAccount,
  DePaymentTokenContract,
};
