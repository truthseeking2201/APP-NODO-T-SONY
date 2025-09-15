import { FormattedNumberInput } from "@/components/ui/formatted-number-input-v2";
import { formatAmount } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import SelectTokens from "../select-tokens";
import { DepositForm } from "./deposit-form";
import BigNumber from "bignumber.js";

type DepositInputProps = {
  paymentTokens: {
    symbol: string;
    decimals: number;
    balance: string;
    min_deposit_amount: string;
    max_deposit_amount: string;
  }[];
};

const DepositInput = ({ paymentTokens }: DepositInputProps) => {
  const { watch, setValue, control, clearErrors } =
    useFormContext<DepositForm>();
  const selectedToken = watch("token");

  const currentToken = paymentTokens.find(
    (token) => token.symbol.toLowerCase() === selectedToken.toLowerCase()
  );

  const minDepositAmount = new BigNumber(1)
    .div(10 ** currentToken?.decimals)
    .toNumber();

  return (
    <Controller
      name="amount"
      control={control}
      rules={{
        required: {
          value: true,
          message: "Please enter an amount.",
        },
        pattern: {
          value: /^\d*\.?\d*$/,
          message: "Please enter a valid number",
        },
        min: {
          value: minDepositAmount,
          message: `Minimum deposit is ${minDepositAmount.toFixed(
            currentToken?.decimals
          )}`,
        },
        max: {
          value: +currentToken?.balance,
          message: `Not enough balance to deposit. Please top-up your wallet.`,
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <FormattedNumberInput
          value={value ? `${value}` : ""}
          amountAvailable={`${currentToken?.balance}`}
          maxDecimals={currentToken?.decimals}
          onChange={onChange}
          onBlur={onBlur}
          balanceInput={
            <div className="flex items-center space-x-2">
              <span className="text-white/80 text-sm font-medium font-sans">
                {currentToken
                  ? formatAmount({
                      amount: currentToken.balance,
                      precision: currentToken.decimals,
                    })
                  : "--"}{" "}
                {currentToken?.symbol}
              </span>
            </div>
          }
          rightInput={
            <SelectTokens
              selectedToken={selectedToken}
              tokens={paymentTokens}
              onSelectToken={(token) => {
                setValue("token", token);
                setValue("amount", "");
                clearErrors("amount");
              }}
              title="Select Token"
            />
          }
        />
      )}
    />
  );
};

export default DepositInput;
