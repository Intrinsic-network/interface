import { isAddress } from "@ethersproject/address";
import { Trans } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import { ReactNode, useState } from "react";
import { X } from "react-feather";
import styled from "styled-components";
import { formatCurrencyAmount } from "utils/formatCurrencyAmount";

import { INT } from "../../constants/tokens";
import useENS from "../../hooks/useENS";
import { useTokenBalance } from "../../state/connection/hooks";
import { useDelegateCallback } from "../../state/governance/hooks";
import { ButtonText, ThemedText } from "../../theme";
import AddressInputPanel from "../AddressInputPanel";
import { ButtonLight, ButtonLink, ButtonPrimary } from "../Button";
import { AutoColumn } from "../Column";
import Modal from "../Modal";
import { LoadingView, SubmittedView } from "../ModalViews";
import { AutoRow, RowBetween } from "../Row";

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 32px;
`;

const StyledClosed = styled(X)`
  :hover {
    cursor: pointer;
  }
`;

const TextButton = styled.div`
  :hover {
    cursor: pointer;
  }
`;

const StyledCancelButton = styled(ButtonLink)`
  font-weight: 400;
  font-size: 16px;
  width: 89px;
  height: 44px;
  padding: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
`;

interface VoteModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  title: ReactNode;
}

export default function DelegateModal({
  isOpen,
  onDismiss,
  title,
}: VoteModalProps) {
  const { account, chainId } = useWeb3React();

  // state for delegate input
  const [usingDelegate, setUsingDelegate] = useState(false);
  const [typed, setTyped] = useState("");
  function handleRecipientType(val: string) {
    setTyped(val);
  }

  // monitor for self delegation or input for third part delegate
  // default is self delegation
  const activeDelegate = usingDelegate ? typed : account;
  const { address: parsedAddress } = useENS(activeDelegate);

  // get the number of votes available to delegate
  const uniBalance = useTokenBalance(
    account ?? undefined,
    chainId ? INT[chainId] : undefined
  );

  const delegateCallback = useDelegateCallback();

  // monitor call to help UI loading state
  const [hash, setHash] = useState<string | undefined>();
  const [attempting, setAttempting] = useState(false);

  // wrapper to reset state on modal close
  function wrappedOnDismiss() {
    setHash(undefined);
    setAttempting(false);
    onDismiss();
  }

  async function onDelegate() {
    setAttempting(true);

    // if callback not returned properly ignore
    if (!delegateCallback) return;

    // try delegation and store hash
    const hash = await delegateCallback(parsedAddress ?? undefined)?.catch(
      (error) => {
        setAttempting(false);
        console.log(error);
      }
    );

    if (hash) {
      setHash(hash);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      maxWidth={100}
      onDismiss={wrappedOnDismiss}
      maxHeight={90}
    >
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <AutoColumn gap="lg">
            <RowBetween>
              <ThemedText.DeprecatedMediumHeader fontWeight={600} fontSize={24}>
                {title}
              </ThemedText.DeprecatedMediumHeader>
              <StyledClosed stroke="black" onClick={wrappedOnDismiss} />
            </RowBetween>
            <ThemedText.DeprecatedBody>
              <Trans>
                Earned INT tokens represent voting shares in Intrinsic
                governance.
              </Trans>
            </ThemedText.DeprecatedBody>
            <ThemedText.DeprecatedBody>
              <Trans>
                You can either vote on each proposal yourself or delegate your
                votes to a third party.
              </Trans>
            </ThemedText.DeprecatedBody>
            {usingDelegate && (
              <AddressInputPanel value={typed} onChange={handleRecipientType} />
            )}
            <AutoRow  align="center">
              <StyledCancelButton onClick={wrappedOnDismiss} style={{marginRight: "auto"}}>
                Cancel
              </StyledCancelButton>
              <div style={{ display: "flex", marginLeft: "auto" }}>
                <StyledCancelButton
                  style={{
                    width: "192px",
                    marginRight: "65px",
                    marginLeft: "49px",
                  }}
                  onClick={() => setUsingDelegate(!usingDelegate)}
                >
                  {usingDelegate ? (
                    <Trans>Remove Delegate</Trans>
                  ) : (
                    <Trans>Add Delegate +</Trans>
                  )}
                </StyledCancelButton>
               
              </div>
              <ButtonPrimary
                  style={{
                    height: "44px",
                    fontSize: "16px",
                    width: "144px",
                    padding: "10px",
                    marginLeft:"auto"
                  }}
                  disabled={!isAddress(parsedAddress ?? "")}
                  onClick={onDelegate}
                >
                  <ThemedText.DeprecatedMediumHeader
                    color="white"
                    fontSize={"16px"}
                  >
                    {usingDelegate ? (
                      <Trans>Delegate Votes</Trans>
                    ) : (
                      <Trans>Self Delegate</Trans>
                    )}
                  </ThemedText.DeprecatedMediumHeader>
                </ButtonPrimary>
            </AutoRow>
          </AutoColumn>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={"center"}>
            <ThemedText.DeprecatedLargeHeader>
              {usingDelegate ? (
                <Trans>Delegating votes</Trans>
              ) : (
                <Trans>Unlocking Votes</Trans>
              )}
            </ThemedText.DeprecatedLargeHeader>
            <ThemedText.DeprecatedMain fontSize={36}>
              {" "}
              {formatCurrencyAmount(uniBalance, 4)}
            </ThemedText.DeprecatedMain>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={"center"}>
            <ThemedText.DeprecatedLargeHeader>
              <Trans>Transaction Submitted</Trans>
            </ThemedText.DeprecatedLargeHeader>
            <ThemedText.DeprecatedMain fontSize={36}>
              {formatCurrencyAmount(uniBalance, 4)}
            </ThemedText.DeprecatedMain>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  );
}
