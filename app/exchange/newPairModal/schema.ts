import { formatUnits, parseUnits } from "viem";
import * as yup from "yup";

const validAddrRegx = /^$|^0x[a-fA-F0-9]{40}$/;

const schema = (customSellToken: boolean, customBuyToken: boolean) =>
  yup
    .object({
      sellToken: customSellToken
        ? yup
            .string()
            .matches(validAddrRegx, { message: "Invalid token address" })
            .required("Sell token is required")
            .test("Not ERC20Check", "Invalid token address", function (value) {
              return new Promise(async (res) => {
                try {
                  const balance = await this.options.context?.balanceOf(value);
                  this.options.context?.setSellTokenBalance(balance);
                  res(typeof balance.balance === "bigint");
                } catch {
                  res(false);
                }
              });
            })
        : yup.string(),
      buyToken: customBuyToken
        ? yup
            .string()
            .matches(validAddrRegx, { message: "Invalid token address" })
            .required("Buy token is required")
            .test("Not ERC20Check", "Invalid token address", function (value) {
              return new Promise(async (res) => {
                try {
                  const balance = await this.options.context?.balanceOf(value);
                  this.options.context?.setBuyTokenBalance(balance);
                  res(typeof balance.balance === "bigint");
                } catch {
                  res(false);
                }
              });
            })
        : yup.string(),
      sellAmount: yup
        .string()
        .test(
          "Number",
          "Amount must be a number",
          (value) => !isNaN(Number(value)),
        )
        .test(
          "Positive",
          "Amount must be greater than zero",
          (value) => Number(value) > 0,
        )
        .test(
          "maxAmount",
          "Should not be greater than your balance",
          function (value) {
            const val = parseUnits(
              value || "0",
              this.options.context?.sellTokenBalance.decimals,
            );

            const balance = formatUnits(
              this.options.context?.sellTokenBalance.balance ?? 0,
              this.options.context?.sellTokenBalance.decimals,
            );

            if (value === balance) {
              return true;
            }

            return val <= this.options.context?.sellTokenBalance.balance;
          },
        ),
      buyAmount: yup
        .string()
        .test(
          "Number",
          "Amount must be a number",
          (value) => !isNaN(Number(value)),
        )
        .test(
          "Positive",
          "Amount must be greater than zero",
          (value) => Number(value) > 0,
        ),
    })
    .required();

export default schema;
