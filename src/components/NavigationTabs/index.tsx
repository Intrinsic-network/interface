import { Percent } from "@intrinsic-finance/sdk-core";
import { Trans } from "@lingui/macro";
import { ReactNode } from "react";
import { ArrowLeft } from "react-feather";
import { Link as HistoryLink, useLocation } from "react-router-dom";
import { Box } from "rebass";
import { useAppDispatch } from "state/hooks";
import { resetMintState } from "state/mint/actions";
import { resetMintState as resetMintV3State } from "state/mint/v3/actions";
import styled, { useTheme } from "styled-components";
import { ThemedText } from "theme";

import Row, { RowBetween } from "../Row";
import SettingsTab from "../Settings";

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`;

const StyledHistoryLink = styled(HistoryLink)<{ flex: string | undefined }>`
  flex: ${({ flex }) => flex ?? "none"};
  margin-right: 16px;
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    flex: none;
    margin-right: 16px;
  `};
`;

const ActiveText = styled.div`
  font-weight: 600;
  font-size: 24px;
`;

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.deprecated_text1};
`;

export function FindPoolTabs({ origin }: { origin: string }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: "1rem 1rem 0 1rem", position: "relative" }}>
        <HistoryLink to={origin}>
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Trans>Import V2 Pool</Trans>
        </ActiveText>
      </RowBetween>
    </Tabs>
  );
}

export function AddRemoveTabs({
  adding,
  creating,
  defaultSlippage,
  positionID,
  children,
}: {
  adding: boolean;
  creating: boolean;
  defaultSlippage: Percent;
  positionID?: string | undefined;
  showBackLink?: boolean;
  children?: ReactNode | undefined;
}) {
  const theme = useTheme() as any;
  // reset states on back
  const dispatch = useAppDispatch();
  const location = useLocation();

  // detect if back should redirect to v3 or v2 pool page
  const poolLink = location.pathname.includes("add/v2")
    ? "/pool/v2"
    : "/pool" + (!!positionID ? `/${positionID.toString()}` : "");

  return (
    <Tabs>
      <RowBetween style={{ padding: "1rem 1rem 0 1rem" }}>
        <div style={{ display: "flex" }}>
          <StyledHistoryLink
            to={poolLink}
            onClick={() => {
              if (adding) {
                // not 100% sure both of these are needed
                dispatch(resetMintState());
                dispatch(resetMintV3State());
              }
            }}
            flex={children ? "1" : undefined}
          >
            <StyledArrowLeft stroke={theme.deprecated_text2} />
          </StyledHistoryLink>
          <ThemedText.DeprecatedMediumHeader
            fontWeight={600}
            fontSize={24}
            style={{
              
              margin: "auto",
              textAlign: children ? "start" : "center",
            }}
          >
            {creating ? (
              <Trans>Create a pair</Trans>
            ) : adding ? (
              <Trans>Add Liquidity</Trans>
            ) : (
              <Trans>Remove Liquidity</Trans>
            )}
          </ThemedText.DeprecatedMediumHeader>
        </div>
        <div style={{ display: "flex" }}>
          <Box style={{ marginRight: ".5rem", paddingTop: "12px" }}>{children}</Box>
          <SettingsTab placeholderSlippage={defaultSlippage} />
        </div>
      </RowBetween>
    </Tabs>
  );
}

export function CreateProposalTabs() {
  return (
    <Tabs>
      <div style={{ padding: "32px 32px 0px 32px", width: "100%" }}>
        <Row
          style={{
            borderBottom: "1px solid #DDDDDD",
            paddingBottom: "24px",
          }}
        >
          <HistoryLink to="/vote">
            <StyledArrowLeft />
          </HistoryLink>
          <ActiveText style={{ marginLeft: "16px" }}>
            Create Proposal
          </ActiveText>
        </Row>
      </div>
    </Tabs>
  );
}
