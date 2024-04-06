import {
  InfuraNodeConnection,
  DePaymentContract,
  OwnerWallet,
  ownerAccount,
} from '../services/DePaymentBlockchain';

class DePaymentRepository {
  async getCustomers(): Promise<readonly `0x${string}`[]> {
    return await InfuraNodeConnection.readContract({
      ...DePaymentContract,
      functionName: 'getCustomers',
    });
  }
  async payments(
    costumerAddress: `0x${string}`,
  ): Promise<readonly [bigint, bigint, bigint]> {
    return await InfuraNodeConnection.readContract({
      ...DePaymentContract,
      functionName: 'payments',
      args: [costumerAddress],
    });
  }

  async pay(costumerAddress: `0x${string}`): Promise<void> {
    const { request } = await InfuraNodeConnection.simulateContract({
      ...DePaymentContract,
      functionName: 'pay',
      account: ownerAccount,
      args: [costumerAddress],
    });
    await OwnerWallet.writeContract(request);
  }
}

export default new DePaymentRepository();
