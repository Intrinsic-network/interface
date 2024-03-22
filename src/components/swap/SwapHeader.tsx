import { Percent } from "@intrinsic-network/sdk-core";
import { Trans } from "@lingui/macro";
import styled, { css, useTheme } from "styled-components";

import { ThemedText } from "../../theme";
import { RowBetween, RowFixed } from "../Row";
import SettingsTab from "../Settings";
import { isSupportedChain } from "@looksrare/sdk";

import { TraceEvent } from "analytics/TraceEvent";
import { EventName, ElementName, Event } from "analytics/constants";
import { RefreshCcw } from "react-feather";
import { useDerivedSwapInfo, useSwapActionHandlers } from "state/swap/hooks";
import { useWeb3React } from "@web3-react/core";

const FlipArrowContainer = styled.div`
  margin-right: 8px;
`;

const StyledSwapHeader = styled.div`
  margin-bottom: 8px;
  width: 100%;
  color: ${({ theme }) => theme.deprecated_text2};
`;

const FlipTokenWrapper = styled.div<{ clickable: boolean }>`
  display: flex;

  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`;

const StyledMenuButton = styled.button<{ disabled: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0px 12px 0px 0px;
  padding: 12px;
  border-radius: 0.5rem;

  ${({ disabled }) =>
    !disabled &&
    `
    :hover,
    :focus {
      cursor: pointer;
      outline: none;
      opacity: 0.7;
    }
  `}
`;

export default function SwapHeader({
  allowedSlippage,
  setApprovalSubmitted,
}: {
  allowedSlippage: Percent;
  setApprovalSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { onSwitchTokens } = useSwapActionHandlers();

  const { currencies } = useDerivedSwapInfo();

  const { chainId } = useWeb3React();

  const theme = useTheme() as any;

  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFixed>
          <ThemedText.DeprecatedBlack
            fontWeight={600}
            fontSize={24}
            style={{ marginRight: "12px" }}
          >
            <Trans>Swap</Trans>
          </ThemedText.DeprecatedBlack>
        </RowFixed>
        <RowFixed>
          <StyledMenuButton
            disabled={isSupportedChain(chainId as any)}
            id="flip-token-button"
            aria-label={`Flip Token`}
            onClick={() => {
              setApprovalSubmitted(false); // reset 2 step UI for approvals
              onSwitchTokens();
            }}
          >
            <FlipArrowContainer>
              <RefreshCcw size="24" color={theme.textColor} />
            </FlipArrowContainer>
          </StyledMenuButton>
          <SettingsTab placeholderSlippage={allowedSlippage} />
        </RowFixed>
      </RowBetween>
    </StyledSwapHeader>
  );
}
