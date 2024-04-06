import dotenv from 'dotenv';
dotenv.config();

class DiscrodWebook {
  async send(
    toalCostumes: string[],
    totalPaymentsFailed: string[],
    totalPaymentsRealized: string[],
  ): Promise<void> {
    fetch(process.env.DISCORD_WEBHOOK_URL as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'DePayment',
        avatar_url:
          'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Ethereum-ETH-icon.png',
        content: "Cron job's result",
        embeds: [
          {
            title: 'DePayment',
            description: `This is the result of the cron job's execution`,
            color: 16711680,
            fields: [
              {
                name: 'Total costumers processed',
                value: toalCostumes.length,
              },
              {
                name: 'Total payments realized',
                value: totalPaymentsRealized.length,
              },
              {
                name: 'Total payments failed',
                value: totalPaymentsFailed.length,
              },
            ],
            footer: {
              text: 'Powered by DePayment',
              icon_url:
                'https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/512/Ethereum-ETH-icon.png',
            },
          },
        ],
      }),
    });
  }
}

export default new DiscrodWebook();
