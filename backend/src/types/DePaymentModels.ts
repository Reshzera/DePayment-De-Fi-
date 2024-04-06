export type Cosutmer = {
  tokenId: number;
  nextPayment: number;
  index: number;
};

export function convertCustomer(
  costumer: readonly [bigint, bigint, bigint],
): Cosutmer {
  return {
    tokenId: Number(costumer[0]),
    nextPayment: Number(costumer[1]),
    index: Number(costumer[2]),
  };
}
