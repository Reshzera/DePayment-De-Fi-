import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DePaymentModule = buildModule("DePayment", (m) => {
  const DePaymentCoin = m.contract("DePaymentCoin");
  const DePaymentToken = m.contract("DePaymentToken");
  const DePayment = m.contract("DePayment", [DePaymentToken, DePaymentCoin]);

  m.call(DePaymentToken, "setAuthorizedContract", [DePayment]);

  return { DePayment };
});

export default DePaymentModule;
