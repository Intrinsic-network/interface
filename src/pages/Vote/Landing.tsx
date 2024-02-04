import { CurrencyAmount, Token } from "@intrinsic-network/sdk-core";
import { Trans } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import { PageName } from "analytics/constants";
import { Trace } from "analytics/Trace";
import { ButtonPrimary } from "components/Button";
import { AutoColumn } from "components/Column";
import {
  CardBGImage,
  CardNoise,
  CardSection,
  DataCard,
} from "components/earn/styled";
import FormattedCurrencyAmount from "components/FormattedCurrencyAmount";
import Loader from "components/Loader";
import { AutoRow, RowBetween, RowFixed } from "components/Row";
import { SwitchLocaleLink } from "components/SwitchLocaleLink";
import Toggle from "components/Toggle";
import DelegateModal from "components/vote/DelegateModal";
import ProposalEmptyState from "components/vote/ProposalEmptyState";
import JSBI from "jsbi";
import { darken } from "polished";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "rebass/styled-components";
import {
  useModalIsOpen,
  useToggleDelegateModal,
} from "state/application/hooks";
import { ApplicationModal } from "state/application/reducer";
import { useTokenBalance } from "state/connection/hooks";
import { ProposalData, ProposalState } from "state/governance/hooks";
import {
  useAllProposalData,
  useUserDelegatee,
  useUserVotes,
} from "state/governance/hooks";
import styled, { useTheme } from "styled-components";
import { ExternalLink, ThemedText } from "theme";
import { shortenAddress } from "utils";
import { ExplorerDataType, getExplorerLink } from "utils/getExplorerLink";

import { ZERO_ADDRESS } from "../../constants/misc";
import { INT } from "../../constants/tokens";
import { ProposalStatus } from "./styled";

const PageWrapper = styled(AutoColumn)`
  padding-top: 68px;

  @media only screen and (max-width: ${({ theme }) =>
      `${theme.breakpoint.md}px`}) {
    padding: 48px 8px 0px;
  }

  @media only screen and (max-width: ${({ theme }) =>
      `${theme.breakpoint.sm}px`}) {
    padding-top: 20px;
  }
`;

const TopSection = styled(AutoColumn)`
  max-width: 800px;
  width: 100%;
  background: white;
  border-radius: 24px;
  padding: 32px;
`;

const Proposal = styled(Button)`
  padding: 0.75rem 1rem;
  width: 100%;
  margin-top: 1rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  outline: none;
  cursor: pointer;
  color: ${({ theme }) => theme.deprecated_text1};
  text-decoration: none;
  background-color: ${({ theme }) => theme.deprecated_bg1};
  &:focus {
    background-color: ${({ theme }) => darken(0.05, theme.deprecated_bg1)};
  }
  &:hover {
    background-color: ${({ theme }) => theme.deprecated_bg2};
  }
`;

const ProposalNumber = styled.span`
  opacity: ${({ theme }) => theme.opacity.hover};
  flex: 0 0 40px;
`;

const ProposalTitle = styled.span`
  font-weight: 600;
  flex: 1;
  max-width: 420px;
  white-space: initial;
  word-wrap: break-word;
  padding-right: 10px;
`;

const VoteCard = styled(DataCard)`
  background: white;
  overflow: hidden;
  color: black;
`;

const WrapSmall = styled(RowBetween)`
  margin-bottom: 24px;
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
    flex-wrap: wrap;
  `};
`;

const TextButton = styled(ThemedText.DeprecatedMain)`
  color: ${({ theme }) => theme.secondaryButtonColor};
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const AddressButton = styled.div`
  border: 1px solid ${({ theme }) => theme.deprecated_bg3};
  padding: 2px 4px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledExternalLink = styled(ExternalLink)`
  color: ${({ theme }) => theme.deprecated_text1};
`;

export default function Landing() {
  const theme = useTheme() as any;
  const { account, chainId } = useWeb3React();

  const [hideCancelled, setHideCancelled] = useState(true);

  // toggle for showing delegation modal
  const showDelegateModal = useModalIsOpen(ApplicationModal.DELEGATE);
  const toggleDelegateModal = useToggleDelegateModal();

  // get data to list all proposals
  const { data: allProposals, loading: loadingProposals } =
    useAllProposalData();

  // user data
  const { loading: loadingAvailableVotes, votes: availableVotes } =
    useUserVotes();
  const intBalance: CurrencyAmount<Token> | undefined = useTokenBalance(
    account ?? undefined,
    chainId ? INT[chainId] : undefined
  );
  const userDelegatee: string | undefined = useUserDelegatee();

  // show delegation option if they have have a balance, but have not delegated
  const showUnlockVoting = Boolean(
    intBalance &&
      JSBI.notEqual(intBalance.quotient, JSBI.BigInt(0)) &&
      userDelegatee === ZERO_ADDRESS
  );

  return (
    <>
      <Trace page={PageName.VOTE_PAGE} shouldLogImpression>
        <PageWrapper gap="32px" justify="center">
          <DelegateModal
            isOpen={showDelegateModal}
            onDismiss={toggleDelegateModal}
            title={
              showUnlockVoting ? (
                <Trans>Unlock Votes</Trans>
              ) : (
                <Trans>Update Delegation</Trans>
              )
            }
          />
          <TopSection gap="md">
            <VoteCard>
              <CardSection>
                <AutoColumn gap="md">
                  <RowBetween>
                    <ThemedText.DeprecatedBlack fontWeight={600} fontSize={24}>
                      <Trans>Intrinsic Governance</Trans>
                    </ThemedText.DeprecatedBlack>
                  </RowBetween>
                  <RowBetween>
                    <ThemedText.DeprecatedBlack fontSize={16} fontWeight={400}>
                      <Trans>
                        INT tokens represent voting shares in Intrinsic
                        governance. You can vote on each proposal yourself or
                        delegate your votes to a third party.
                      </Trans>
                    </ThemedText.DeprecatedBlack>
                  </RowBetween>
                  <ExternalLink
                    style={{
                      color: theme.externalLinkTextColor,
                      textDecoration: "underline",
                    }}
                    href="https://uniswap.org/blog/uni"
                    target="_blank"
                  >
                    <ThemedText.LinkText fontSize={16} fontWeight={400}>
                      <Trans>Read more about Intrinsic governance</Trans>
                    </ThemedText.LinkText>
                  </ExternalLink>
                </AutoColumn>
              </CardSection>
            </VoteCard>
          </TopSection>
          <TopSection gap="2px">
            <WrapSmall>
              <ThemedText.DeprecatedBlack fontSize={24} fontWeight={600}>
                <Trans>Proposals</Trans>
              </ThemedText.DeprecatedBlack>
              <AutoRow gap="6px" justify="flex-end">
                {loadingProposals || loadingAvailableVotes ? <Loader /> : null}
                {showUnlockVoting ? (
                  <ButtonPrimary
                    style={{ width: "fit-content" }}
                    padding="8px"
                    $borderRadius="8px"
                    onClick={toggleDelegateModal}
                  >
                    <Trans>Unlock Voting</Trans>
                  </ButtonPrimary>
                ) : availableVotes &&
                  JSBI.notEqual(JSBI.BigInt(0), availableVotes?.quotient) ? (
                  <ThemedText.DeprecatedBody fontWeight={500} mr="6px">
                    <Trans>
                      <FormattedCurrencyAmount
                        currencyAmount={availableVotes}
                      />{" "}
                      Votes
                    </Trans>
                  </ThemedText.DeprecatedBody>
                ) : intBalance &&
                  userDelegatee &&
                  userDelegatee !== ZERO_ADDRESS &&
                  JSBI.notEqual(JSBI.BigInt(0), intBalance?.quotient) ? (
                  <ThemedText.DeprecatedBody fontWeight={500} mr="6px">
                    <Trans>
                      <FormattedCurrencyAmount currencyAmount={intBalance} />{" "}
                      Votes
                    </Trans>
                  </ThemedText.DeprecatedBody>
                ) : (
                  ""
                )}
                <ButtonPrimary
                  as={Link}
                  to="/create-proposal"
                  style={{ width: "fit-content", borderRadius: "8px" }}
                  padding="8px"
                >
                  <Trans>Create Proposal</Trans>
                </ButtonPrimary>
              </AutoRow>
            </WrapSmall>
            {!showUnlockVoting && (
              <RowBetween>
                <div />
                {userDelegatee && userDelegatee !== ZERO_ADDRESS ? (
                  <RowFixed>
                    <ThemedText.DeprecatedBody fontWeight={500} mr="4px">
                      <Trans>Delegated to:</Trans>
                    </ThemedText.DeprecatedBody>
                    <AddressButton>
                      <StyledExternalLink
                        href={getExplorerLink(
                          1,
                          userDelegatee,
                          ExplorerDataType.ADDRESS
                        )}
                        style={{ margin: "0 4px" }}
                      >
                        {userDelegatee === account ? (
                          <Trans>Self</Trans>
                        ) : (
                          shortenAddress(userDelegatee)
                        )}
                      </StyledExternalLink>
                      <TextButton
                        onClick={toggleDelegateModal}
                        style={{ marginLeft: "4px" }}
                      >
                        <Trans>(edit)</Trans>
                      </TextButton>
                    </AddressButton>
                  </RowFixed>
                ) : (
                  ""
                )}
              </RowBetween>
            )}

            {allProposals?.length === 0 && <ProposalEmptyState />}

            {allProposals?.length > 0 && (
              <AutoColumn gap="md">
                <RowBetween>
                  <ThemedText.DeprecatedMain>
                    <Trans>Show Cancelled</Trans>
                  </ThemedText.DeprecatedMain>
                  <Toggle
                    isActive={!hideCancelled}
                    toggle={() =>
                      setHideCancelled((hideCancelled) => !hideCancelled)
                    }
                  />
                </RowBetween>
              </AutoColumn>
            )}

            {allProposals
              ?.slice(0)
              ?.reverse()
              ?.filter((p: ProposalData) =>
                hideCancelled ? p.status !== ProposalState.CANCELED : true
              )
              ?.map((p: ProposalData) => {
                return (
                  <Proposal
                    as={Link}
                    to={`/vote/${p.governorIndex}/${p.id}`}
                    key={`${p.governorIndex}${p.id}`}
                  >
                    <ProposalNumber>{p.id}</ProposalNumber>
                    <ProposalTitle>{p.title}</ProposalTitle>
                    <ProposalStatus status={p.status} />
                  </Proposal>
                );
              })}
            <div
              style={{
                paddingTop: "24px",
                borderTop: "1px solid #DDDDDD",
                marginTop: "24px",
              }}
            >
              <ThemedText.DeprecatedSubHeader color="text3">
                <Trans>
                  A minimum threshold of 0.25% of the total INT supply is
                  required to submit proposals
                </Trans>
              </ThemedText.DeprecatedSubHeader>
            </div>
          </TopSection>
        </PageWrapper>
      </Trace>
      <SwitchLocaleLink />
    </>
  );
}
