import cron from 'node-cron';
import DePaymentRepository from '../repository/DePaymentRepository';
import DiscrodWebook from './DiscrodWebook';
import { convertCustomer } from '../types/DePaymentModels';

async function DePaymentCron() {
  cron.schedule('0 * * * *', async () => {
    const costumersAllAddress = await DePaymentRepository.getCustomers();
    const totalPaymentsRealized: `0x${string}`[] = [];
    const totalPaymentsFailed: `0x${string}`[] = [];

    for (const costumerAddress of costumersAllAddress) {
      const costumerFromBlockchain =
        await DePaymentRepository.payments(costumerAddress);
      const costumer = convertCustomer(costumerFromBlockchain);

      const nowInSeconds = Math.floor(Date.now() / 1000);

      if (costumer.nextPayment <= nowInSeconds) {
        try {
          await DePaymentRepository.pay(costumerAddress);
          totalPaymentsRealized.push(costumerAddress);
        } catch (error) {
          totalPaymentsFailed.push(costumerAddress);
        }
      }
    }
    await DiscrodWebook.send(
      costumersAllAddress as string[],
      totalPaymentsFailed,
      totalPaymentsRealized,
    );
  });
}

export default DePaymentCron;
