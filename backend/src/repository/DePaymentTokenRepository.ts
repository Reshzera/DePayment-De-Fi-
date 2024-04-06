import {
  DePaymentTokenContract,
  InfuraNodeConnection,
} from '../services/DePaymentBlockchain';

class DePaymentTokenRepository {
  async ownerOf(tokenId: bigint): Promise<`0x${string}` | ''> {
    return await InfuraNodeConnection.readContract({
      ...DePaymentTokenContract,
      functionName: 'ownerOf',
      args: [tokenId],
    });
  }
}

export default new DePaymentTokenRepository();
