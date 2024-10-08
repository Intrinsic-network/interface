import { Currency, Percent, TradeType } from "@intrinsic-network/sdk-core";
import { Trans } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import Card from "components/Card";
import { LoadingRows } from "components/Loader/styled";
import { SUPPORTED_GAS_ESTIMATE_CHAIN_IDS } from "constants/chains";
import useNativeCurrency from "lib/hooks/useNativeCurrency";
import { useMemo } from "react";
import { InterfaceTrade } from "state/routing/types";
import styled, { useTheme } from "styled-components";

import { Separator, ThemedText } from "../../theme";
import { computeRealizedPriceImpact } from "../../utils/prices";
import { AutoColumn } from "../Column";
import { RowBetween, RowFixed } from "../Row";
import { MouseoverTooltip } from "../Tooltip";
import FormattedPriceImpact from "./FormattedPriceImpact";
import { t } from "@lingui/macro";
const StyledCard = styled(Card)`
  padding: 0;
  font-size: 14px;
`;

const LeftDiv = styled.div``;

interface AdvancedSwapDetailsProps {
  trade?: InterfaceTrade<Currency, Currency, TradeType>;
  allowedSlippage: Percent;
  syncing?: boolean;
  hideInfoTooltips?: boolean;
}

function TextWithLoadingPlaceholder({
  syncing,
  width,
  children,
}: {
  syncing: boolean;
  width: number;
  children: JSX.Element;
}) {
  return syncing ? (
    <LoadingRows>
      <div style={{ height: "15px", width: `${width}px` }} />
    </LoadingRows>
  ) : (
    children
  );
}

export function AdvancedSwapDetails({
  trade,
  allowedSlippage,
  syncing = false,
  hideInfoTooltips = false,
}: AdvancedSwapDetailsProps) {
  const theme = useTheme() as any;
  const { chainId } = useWeb3React();
  const nativeCurrency = useNativeCurrency();

  const { expectedOutputAmount, priceImpact } = useMemo(() => {
    return {
      expectedOutputAmount: trade?.outputAmount,
      priceImpact: trade ? computeRealizedPriceImpact(trade) : undefined,
    };
  }, [trade]);

  return !trade ? null : (
    <StyledCard>
      <AutoColumn gap="8px">
        <RowBetween>
          <RowFixed>
            <LeftDiv
              title={t`The amount you expect to receive at the current market price.
              You may receive less or more if the market price changes while
              your transaction is pending.`}
            >
              <Trans>Expected Output</Trans>
            </LeftDiv>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={65}>
            <ThemedText.DeprecatedBlack textAlign="right" fontSize={14}>
              {expectedOutputAmount
                ? `${expectedOutputAmount.toSignificant(6)}  ${
                    expectedOutputAmount.currency.symbol
                  }`
                : "-"}
            </ThemedText.DeprecatedBlack>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <LeftDiv
              title={t`The impact your trade has on the market price of this pool.`}
            >
              <Trans>Price Impact</Trans>
            </LeftDiv>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={50}>
            <ThemedText.DeprecatedBlack textAlign="right" fontSize={14}>
              <FormattedPriceImpact priceImpact={priceImpact} />
            </ThemedText.DeprecatedBlack>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        <Separator />
        <RowBetween>
          <RowFixed style={{ marginRight: "20px" }}>
            <LeftDiv
              title={t`The minimum amount you are guaranteed to receive. If the price
              slips any further, your transaction will revert.`}
            >
              {trade.tradeType === TradeType.EXACT_INPUT ? (
                <Trans>Minimum received</Trans>
              ) : (
                <Trans>Maximum sent</Trans>
              )}{" "}
              <Trans>after slippage</Trans> ({allowedSlippage.toFixed(2)}%)
            </LeftDiv>
          </RowFixed>
          <TextWithLoadingPlaceholder syncing={syncing} width={70}>
            <ThemedText.DeprecatedBlack
              textAlign="right"
              fontSize={14}
              color={theme.deprecated_text3}
            >
              {trade.tradeType === TradeType.EXACT_INPUT
                ? `${trade
                    .minimumAmountOut(allowedSlippage)
                    .toSignificant(6)} ${trade.outputAmount.currency.symbol}`
                : `${trade.maximumAmountIn(allowedSlippage).toSignificant(6)} ${
                    trade.inputAmount.currency.symbol
                  }`}
            </ThemedText.DeprecatedBlack>
          </TextWithLoadingPlaceholder>
        </RowBetween>
        {!trade?.gasUseEstimateUSD ||
        !chainId ||
        !SUPPORTED_GAS_ESTIMATE_CHAIN_IDS.includes(chainId) ? null : (
          <RowBetween>
            <LeftDiv
              title={t`The fee paid to miners who process your transaction. This must
              be paid in ${nativeCurrency.symbol}.`}
            >
              <ThemedText.DeprecatedSubHeader color={theme.deprecated_text3}>
                <Trans>Network Fee</Trans>
              </ThemedText.DeprecatedSubHeader>
            </LeftDiv>

            <TextWithLoadingPlaceholder syncing={syncing} width={50}>
              <ThemedText.DeprecatedBlack
                textAlign="right"
                fontSize={14}
                color={theme.deprecated_text3}
              >
                ~${trade.gasUseEstimateUSD.toFixed(2)}
              </ThemedText.DeprecatedBlack>
            </TextWithLoadingPlaceholder>
          </RowBetween>
        )}
      </AutoColumn>
    </StyledCard>
  );
}
