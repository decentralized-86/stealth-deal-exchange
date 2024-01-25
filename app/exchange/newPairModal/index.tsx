import React, {
  useEffect,
  ChangeEvent,
  useState,
  useCallback,
  useMemo,
} from "react";
import { DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatUnits, parseUnits } from "viem";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePublicClient, useBalance, useAccount, useNetwork } from "wagmi";
import Input from "@/components/input";
import Button from "@/components/button";
import Dropdown from "@/components/dropdown";
import { TOKENS } from "@/lib/constants";
import { NewSwap } from "../page";
import schema from "./schema";
import getBalance from "./getBalance";

interface NewPairModalProps extends DialogProps {
  onSubmit: (data: NewSwap) => void;
  pending?: boolean;
}

const NewPairModal: React.FC<NewPairModalProps> = ({
  onSubmit,
  pending,
  open,
  ...props
}) => {
  const { address, isConnected } = useAccount();

  const { chain } = useNetwork();

  const [sellToken, setSellToken] = useState("eth");

  const [buyToken, setBuyToken] = useState("eth");

  const [sellTokenBalance, setSellTokenBalance] = useState({
    balance: BigInt(0),
    decimals: 18,
  });

  const [buyTokenBalance, setBuyTokenBalance] = useState({
    balance: BigInt(0),
    decimals: 18,
  });

  const { data: etherBalance } = useBalance({ address });

  const publicClient = usePublicClient(
    isConnected ? undefined : { chainId: chain?.id },
  );

  const getBal = useMemo(
    () => getBalance(publicClient, address!, etherBalance?.value ?? BigInt(0)),
    [publicClient, address, etherBalance?.value],
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      schema(sellToken === "custom", buyToken === "custom"),
    ),
    context: {
      balanceOf: getBal,
      sellTokenBalance,
      setSellTokenBalance,
      buyTokenBalance,
      setBuyTokenBalance,
    },
    mode: "onBlur",
  });

  const [sellAmountSliderValue, setSellAmountSliderValue] = useState<string>(
    String(1),
  );

  const handleSellAmountSliderChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSellAmountSliderValue(e.target.value);
      setValue(
        "sellAmount",
        formatUnits(
          BigInt(
            e.target.value.includes("e+")
              ? Number(e.target.value)
              : e.target.value,
          ),
          sellTokenBalance.decimals,
        ),
      );
    },
    [sellTokenBalance.decimals, setValue],
  );

  const sellAmount = watch("sellAmount");

  useEffect(() => {
    if (etherBalance?.value) {
      setSellTokenBalance({
        balance: etherBalance?.value,
        decimals: 18,
      });
    }
  }, [etherBalance]);

  useEffect(() => {
    setSellAmountSliderValue(
      String(parseUnits(sellAmount ?? "0", sellTokenBalance.decimals)),
    );
  }, [sellAmount, sellTokenBalance]);

  useEffect(() => {
    reset();
    setSellToken("eth");
    setBuyToken("eth");
  }, [open, reset]);

  const handleSellTokenChange = useCallback(
    async (value: string) => {
      setSellToken(value);

      if (value === "eth") {
        setValue("sellToken", "");
      } else if (value === "custom") {
        setValue("sellToken", "");
      } else {
        setValue("sellToken", value);
      }
    },
    [setValue],
  );

  const handleBuyTokenChange = useCallback(
    async (value: string) => {
      setBuyToken(value);

      if (value === "eth") {
        setValue("buyToken", "");
      } else if (value === "custom") {
        setValue("buyToken", "");
      } else {
        setValue("buyToken", value);
      }
    },
    [setValue],
  );

  useEffect(() => {
    if (sellToken !== "custom") {
      getBal(sellToken === "eth" ? "" : sellToken).then((balance) => {
        if (balance !== false) {
          setSellTokenBalance(balance);
        }
      });
    }

    if (buyToken !== "custom") {
      getBal(buyToken === "eth" ? "" : buyToken).then((balance) => {
        if (balance !== false) {
          setBuyTokenBalance(balance);
        }
      });
    }
  }, [getBal, sellToken, buyToken]);

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        <Button>Create a new pair</Button>
      </DialogTrigger>
      {open && (
        <DialogContent>
          <form
            onSubmit={handleSubmit((data) =>
              onSubmit({
                sellToken: data.sellToken ?? "",
                buyToken: data.buyToken ?? "",
                sellAmount:
                  formatUnits(
                    sellTokenBalance.balance,
                    sellTokenBalance.decimals,
                  ) === data.sellAmount
                    ? sellTokenBalance.balance
                    : parseUnits(data.sellAmount!, sellTokenBalance.decimals),
                buyAmount: parseUnits(
                  data.buyAmount!,
                  buyTokenBalance.decimals,
                ),
              }),
            )}
          >
            <DialogHeader>
              <DialogTitle>Create a new pair</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 my-5">
              <div className="space-y-1">
                <div className="flex space-x-5 items-center">
                  <label className="block">Sell token</label>
                  <Dropdown
                    label="Select asset"
                    value={sellToken}
                    onChange={handleSellTokenChange}
                    options={[
                      { value: "eth", label: "ETH" },
                      { value: "custom", label: "CUSTOM" },
                    ].concat(
                      Object.entries(TOKENS[chain?.id ?? 1]).map(
                        ([label, value]) => ({
                          label: label.toUpperCase(),
                          value,
                        }),
                      ),
                    )}
                  />
                </div>
                {sellToken === "custom" && (
                  <Input
                    {...register("sellToken")}
                    className="w-full"
                    placeholder="Sell token address"
                  />
                )}
                {sellToken === "custom" && errors.sellToken && (
                  <div className="ml-4 text-yellow-700">
                    {errors.sellToken.message}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="block">
                  Sell amount
                  {sellTokenBalance && (
                    <em className="text-yellow-700 ml-2">
                      balance:{" "}
                      {formatUnits(
                        sellTokenBalance.balance,
                        sellTokenBalance.decimals,
                      )}
                    </em>
                  )}
                </label>
                <Input {...register("sellAmount")} className="w-full" />
                <Input
                  type="range"
                  className="w-full"
                  min={1}
                  max={errors.sellToken ? 1 : String(sellTokenBalance.balance)}
                  onChange={handleSellAmountSliderChange}
                  value={sellAmountSliderValue}
                />
                {errors.sellAmount && (
                  <div className="ml-4 text-yellow-700">
                    {errors.sellAmount.message}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex space-x-5 items-center">
                  <label className="block">Buy token</label>
                  <Dropdown
                    label="Select asset"
                    value={buyToken}
                    onChange={handleBuyTokenChange}
                    options={[
                      { value: "eth", label: "ETH" },
                      { value: "custom", label: "CUSTOM" },
                    ].concat(
                      Object.entries(TOKENS[chain?.id ?? 1]).map(
                        ([label, value]) => ({
                          label: label.toUpperCase(),
                          value,
                        }),
                      ),
                    )}
                  />
                </div>
                {buyToken === "custom" && (
                  <Input
                    {...register("buyToken")}
                    className="w-full"
                    placeholder="Buy token address"
                  />
                )}
                {buyToken === "custom" && errors.buyToken && (
                  <div className="ml-4 text-yellow-700">
                    {errors.buyToken.message}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="block">Buy amount</label>
                <Input {...register("buyAmount")} className="w-full" />
                {errors.buyAmount && (
                  <div className="ml-4 text-yellow-700">
                    {errors.buyAmount.message}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="sm:justify-end">
              <Button loading={pending}>Create</Button>
              <DialogClose asChild>
                <Button>Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default NewPairModal;
