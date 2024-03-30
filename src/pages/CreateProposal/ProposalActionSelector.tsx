import { Trans } from '@lingui/macro'
import { ButtonDropdown } from 'components/Button'
import Column from 'components/Column'
import Modal from 'components/Modal'
import { RowBetween } from 'components/Row'
import { MenuItem, PaddedColumn, Separator } from 'components/SearchModal/styleds'
import React, { useCallback } from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import { CloseIcon } from 'theme'

export enum ProposalAction {
  TRANSFER_TOKEN = 'Transfer Token',
  APPROVE_TOKEN = 'Approve Token',
  SET_FEE_PROTOCOL = 'Set Fee Protocol',
  COLLECT_PROTOCOL = 'Collect Protocol',
  ACCEPT_ADMIN = 'Accept Admin',
}

interface ProposalActionSelectorModalProps {
  isOpen: boolean
  onDismiss: () => void
  onProposalActionSelect: (proposalAction: ProposalAction) => void
}

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
`


const ActionDropdown = styled(ButtonDropdown)`
  padding: 16px 12px;
  background-color: transparent;
  color: ${({ theme }) => theme.deprecated_text1};
  font-size: 16px;
  border: 1px solid #AAAAAA;
  border-radius: 6px;
  :hover,
  :active,
  :focus {
    outline: 0px;
    box-shadow: none;
    background-color: transparent;
  }
`

const ProposalActionSelectorFlex = styled.div`
  margin-top: 10px;
  display: flex;
  margin-right: 28px;

`

const ProposalActionSelectorContainer = styled.div`
  margin-left: 28px;
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 10px;
`

const ProposalActionSelectorLabel = styled.div`
  padding-top: 20px;
  width: 150px;
  font-weight: 600;
  font-size: 16px;
`

export const ProposalActionSelector = ({
  className,
  onClick,
  proposalAction,
}: {
  className?: string
  onClick: () => void
  proposalAction: ProposalAction
}) => {
  return (
    <ProposalActionSelectorFlex>
      <ProposalActionSelectorLabel><Trans>Proposed Action</Trans></ProposalActionSelectorLabel>
      <ProposalActionSelectorContainer className={className}>
        <ActionDropdown onClick={onClick}>{proposalAction}</ActionDropdown>
      </ProposalActionSelectorContainer>
    </ProposalActionSelectorFlex>
  )
}

export function ProposalActionSelectorModal({
  isOpen,
  onDismiss,
  onProposalActionSelect,
}: ProposalActionSelectorModalProps) {
  const handleProposalActionSelect = useCallback(
    (proposalAction: ProposalAction) => {
      onProposalActionSelect(proposalAction)
      onDismiss()
    },
    [onDismiss, onProposalActionSelect]
  )

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ContentWrapper>
        <PaddedColumn gap="16px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              <Trans>Select an action</Trans>
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        </PaddedColumn>
        <Separator />
        <MenuItem onClick={() => handleProposalActionSelect(ProposalAction.TRANSFER_TOKEN)}>
          <Column>
            <Text fontWeight={500}>
              <Trans>Transfer Token</Trans>
            </Text>
          </Column>
        </MenuItem>
        <MenuItem onClick={() => handleProposalActionSelect(ProposalAction.APPROVE_TOKEN)}>
          <Column>
            <Text fontWeight={500}>
              <Trans>Approve Token</Trans>
            </Text>
          </Column>
        </MenuItem>
        <MenuItem onClick={() => handleProposalActionSelect(ProposalAction.SET_FEE_PROTOCOL)}>
          <Column>
            <Text fontWeight={500}>
              <Trans>Set Fee Protocol</Trans>
            </Text>
          </Column>
        </MenuItem>
        <MenuItem onClick={() => handleProposalActionSelect(ProposalAction.COLLECT_PROTOCOL)}>
          <Column>
            <Text fontWeight={500}>
              <Trans>Collect Protocol</Trans>
            </Text>
          </Column>
        </MenuItem>
        <MenuItem onClick={() => handleProposalActionSelect(ProposalAction.ACCEPT_ADMIN)}>
          <Column>
            <Text fontWeight={500}>
              <Trans>Accept Admin</Trans>
            </Text>
          </Column>
        </MenuItem>
      </ContentWrapper>
    </Modal>
  )
}
