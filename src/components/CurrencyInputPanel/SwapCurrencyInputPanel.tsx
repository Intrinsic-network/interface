import {
  Currency,
  CurrencyAmount,
  Percent,
  Token,
} from "@intrinsic-network/sdk-core";
import { Trans } from "@lingui/macro";
import { Pair } from "@uniswap/v2-sdk";
import { useWeb3React } from "@web3-react/core";
import { ElementName, Event, EventName } from "analytics/constants";
import { TraceEvent } from "analytics/TraceEvent";
import { AutoColumn } from "components/Column";
import {
  LoadingOpacityContainer,
  loadingOpacityMixin,
} from "components/Loader/styled";
import { isSupportedChain } from "constants/chains";
import { darken } from "polished";
import { ReactNode, useCallback, useState } from "react";
import { Lock } from "react-feather";
import styled, { useTheme } from "styled-components";
import { formatCurrencyAmount } from "utils/formatCurrencyAmount";

import { ReactComponent as DropDown } from "../../assets/images/dropdown.svg";
import { useCurrencyBalance } from "../../state/connection/hooks";
import { ThemedText } from "../../theme";
import { ButtonGray } from "../Button";
import CurrencyLogo from "../CurrencyLogo";
import DoubleCurrencyLogo from "../DoubleLogo";
import { Input as NumericalInput } from "../NumericalInput";
import { RowBetween, RowFixed } from "../Row";
import CurrencySearchModal from "../SearchModal/CurrencySearchModal";
import { FiatValue } from "./FiatValue";

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? "16px" : "20px")};
  z-index: 1;
  width: ${({ hideInput }) => (hideInput ? "100%" : "initial")};
  transition: height 1s ease;
  will-change: height;
`;

const FixedContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const Container = styled.div<{ hideInput: boolean }>`
  min-height: 44px;
  border-radius: ${({ hideInput }) => (hideInput ? "16px" : "20px")};
  width: ${({ hideInput }) => (hideInput ? "100%" : "initial")};
`;

const CurrencySelect = styled(ButtonGray)<{
  visible: boolean;
  selected: boolean;
  hideInput?: boolean;
  disabled?: boolean;
}>`
  align-items: center;
  background-color: ${({ selected, theme }) =>
    selected ? theme.white : theme.white};
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};

  cursor: pointer;
  height: unset;
  border-radius: 16px;
  outline: none;
  user-select: none;
  border: none;
  font-size: 24px;
  font-weight: 400;
  width: ${({ hideInput }) => (hideInput ? "100%" : "initial")};
  padding: ${({ selected }) =>
    selected ? "4px 8px 4px 4px" : "6px 6px 6px 8px"};
  gap: 8px;
  justify-content: space-between;
  margin-left: ${({ hideInput }) => (hideInput ? "0" : "12px")};
  color: ${({ selected, theme }) =>
    selected ? theme.textColor : theme.intGray3};

  &:hover,
  &:active {
    background-color: ${({ theme, selected }) =>
      selected ? theme.backgroundInteractive : theme.backgroundInteractive};
  }

  &:before {
    background-size: 100%;
    border-radius: inherit;

    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    content: "";
  }

  &:hover:before {
    background-color: ${({ theme }) => theme.stateOverlayHover};
  }

  &:active:before {
    background-color: ${({ theme }) => theme.stateOverlayPressed};
  }

  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
`;

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: space-between;
`;

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.75rem;
  line-height: 1rem;

  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.deprecated_text2)};
  }
`;

const FiatRow = styled(LabelRow)`
  justify-content: flex-end;
  min-height: 20px;
  padding: 8px 0px 0px 0px;
`;

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.35rem;
  height: 35%;
  margin-left: 8px;

  path {
    stroke: ${({ selected, theme }) =>
      selected ? theme.deprecated_text1 : theme.deprecated_text1};
    stroke-width: 2px;
  }
`;

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) =>
    active
      ? "  margin: 0 0.25rem 0 0.25rem;"
      : "  margin: 0 0.25rem 0 0.25rem;"}
  font-size: 20px;
  font-weight: 600;
`;

const StyledBalanceMax = styled.button<{ disabled?: boolean }>`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.secondaryButtonColor};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  opacity: ${({ disabled }) => (!disabled ? 1 : 0.4)};
  padding: 4px 6px;
  pointer-events: ${({ disabled }) => (!disabled ? "initial" : "none")};

  :hover {
    opacity: ${({ disabled }) => (!disabled ? 0.8 : 0.4)};
  }

  :focus {
    outline: none;
  }
`;

const StyledNumericalInput = styled(NumericalInput)<{ $loading: boolean }>`
  ${loadingOpacityMixin};
  text-align: left;
  font-size: 36px;
  line-height: 44px;
  font-variant: small-caps;
  color: ${({ theme }) => theme.textColor};
`;

const TopRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  margin-bottom: 16px;
`;

const LabelContainer = styled.div`
  font-size: 16px;
  font-weight: 400;
`;

interface SwapCurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: ReactNode;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  fiatValue?: CurrencyAmount<Token> | null;
  priceImpact?: Percent;
  id: string;
  showCommonBases?: boolean;
  showCurrencyAmount?: boolean;
  disableNonToken?: boolean;
  renderBalance?: (amount: CurrencyAmount<Currency>) => ReactNode;
  locked?: boolean;
  loading?: boolean;
}

export default function SwapCurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  onCurrencySelect,
  currency,
  otherCurrency,
  id,
  showCommonBases,
  showCurrencyAmount,
  disableNonToken,
  renderBalance,
  fiatValue,
  priceImpact,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  locked = false,
  loading = false,
  label,
}: SwapCurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { account, chainId } = useWeb3React();
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined
  );
  const theme = useTheme() as any;

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  const chainAllowed = isSupportedChain(chainId);

  return (
    <InputPanel id={id} hideInput={hideInput}>
      <TopRow style={{ color: theme.intGray }}>
        <LabelContainer>{label}</LabelContainer>

        <ThemedText.DeprecatedBody
          color={"#8A8A8A"}
          fontSize={16}
          style={{ display: "inline", marginLeft: "auto" }}
        >
          {!hideBalance && currency && selectedCurrencyBalance ? (
            renderBalance ? (
              renderBalance(selectedCurrencyBalance)
            ) : (
              <Trans>
                Balance: {formatCurrencyAmount(selectedCurrencyBalance, 4)}
              </Trans>
            )
          ) : null}
        </ThemedText.DeprecatedBody>
      </TopRow>
      {locked && (
        <FixedContainer>
          <AutoColumn gap="sm" justify="center">
            <Lock />
            <ThemedText.DeprecatedLabel
              fontSize="12px"
              textAlign="center"
              padding="0 12px"
            >
              <Trans>
                The market price is outside your specified price range.
                Single-asset deposit only.
              </Trans>
            </ThemedText.DeprecatedLabel>
          </AutoColumn>
        </FixedContainer>
      )}
      <Container hideInput={hideInput}>
        <InputRow
          style={hideInput ? { padding: "0", borderRadius: "8px" } : {}}
        >
          {!hideInput && (
            <StyledNumericalInput
              className="token-amount-input"
              value={value}
              onUserInput={onUserInput}
              disabled={!chainAllowed}
              $loading={loading}
            />
          )}

          <CurrencySelect
            disabled={!chainAllowed}
            visible={currency !== undefined}
            selected={!!currency}
            hideInput={hideInput}
            className="open-currency-select-button"
            onClick={() => {
              if (onCurrencySelect) {
                setModalOpen(true);
              }
            }}
          >
            <Aligner>
              <RowFixed>
                {pair ? (
                  <span style={{ marginRight: "0.5rem" }}>
                    <DoubleCurrencyLogo
                      currency0={pair.token0}
                      currency1={pair.token1}
                      size={24}
                      margin={true}
                    />
                  </span>
                ) : currency ? (
                  <CurrencyLogo
                    style={{ marginRight: "2px" }}
                    currency={currency}
                    size={"24px"}
                  />
                ) : null}
                {pair ? (
                  <StyledTokenName className="pair-name-container">
                    {pair?.token0.symbol}:{pair?.token1.symbol}
                  </StyledTokenName>
                ) : (
                  <StyledTokenName
                    className="token-symbol-container"
                    active={Boolean(currency && currency.symbol)}
                  >
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? currency.symbol.slice(0, 4) +
                        "..." +
                        currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length
                        )
                      : currency?.symbol) || <Trans>Select token</Trans>}
                  </StyledTokenName>
                )}
              </RowFixed>
              {onCurrencySelect && <StyledDropDown selected={!!currency} />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
        {!hideInput && !!currency && (!!fiatValue || showMaxButton) && (
          <FiatRow>
            <RowBetween>
              <LoadingOpacityContainer $loading={loading}>
                <FiatValue fiatValue={fiatValue} priceImpact={priceImpact} />
              </LoadingOpacityContainer>
              {account ? (
                <RowFixed style={{ height: "17px" }}>
                  {showMaxButton && selectedCurrencyBalance ? (
                    <TraceEvent
                      events={[Event.onClick]}
                      name={EventName.SWAP_MAX_TOKEN_AMOUNT_SELECTED}
                      element={ElementName.MAX_TOKEN_AMOUNT_BUTTON}
                    >
                      <StyledBalanceMax onClick={onMax}>
                        <Trans>Max</Trans>
                      </StyledBalanceMax>
                    </TraceEvent>
                  ) : null}
                </RowFixed>
              ) : null}
            </RowBetween>
          </FiatRow>
        )}
      </Container>
      {onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
          showCurrencyAmount={showCurrencyAmount}
          disableNonToken={disableNonToken}
        />
      )}
    </InputPanel>
  );
}
