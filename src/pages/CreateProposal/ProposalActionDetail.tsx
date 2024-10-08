import { Currency } from '@intrinsic-finance/sdk-core'
import { Trans } from '@lingui/macro'
import AddressInputPanel from 'components/AddressInputPanel'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import React from 'react'
import styled from 'styled-components'

import { ProposalAction } from './ProposalActionSelector'

enum ProposalActionDetailField {
  ADDRESS,
  CURRENCY,
  RECIPIENT_ADDRESS,
}

const ProposalActionDetailContainer = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 10px;
`

export const ProposalActionDetail = ({
  className,
  proposalAction,
  currency,
  amount,
  toAddress,
  recipientAddress,
  onCurrencySelect,
  onAmountInput,
  onToAddressInput,
  onRecipientAddressInput,
}: {
  className?: string
  proposalAction: ProposalAction
  currency: Currency | undefined
  amount: string
  toAddress: string
  recipientAddress: string
  onCurrencySelect: (currency: Currency) => void
  onAmountInput: (amount: string) => void
  onToAddressInput: (address: string) => void
  onRecipientAddressInput: (address: string) => void
}) => {
  const proposalActionsData = {
    [ProposalAction.TRANSFER_TOKEN]: [
      {
        type: ProposalActionDetailField.ADDRESS,
        label: <Trans>To</Trans>,
      },
      {
        type: ProposalActionDetailField.CURRENCY,
      },
    ],
    [ProposalAction.APPROVE_TOKEN]: [
      {
        type: ProposalActionDetailField.ADDRESS,
        label: <Trans>To</Trans>,
      },
      {
        type: ProposalActionDetailField.CURRENCY,
      },
    ],
    [ProposalAction.SET_FEE_PROTOCOL]: [
      {
        type: ProposalActionDetailField.ADDRESS,
        label: <Trans>Pool Address</Trans>,
      },
    ],
    [ProposalAction.COLLECT_PROTOCOL]: [
      {
        type: ProposalActionDetailField.ADDRESS,
        label: <Trans>Pool Address</Trans>,
      },
      {
        type: ProposalActionDetailField.RECIPIENT_ADDRESS,
        label: <Trans>Recipient</Trans>,
      },
    ],
    [ProposalAction.ACCEPT_ADMIN]: [
      {
        type: ProposalActionDetailField.ADDRESS,
        label: <Trans>Delegator Address</Trans>,
      },
    ],
  }

  return (
    <ProposalActionDetailContainer className={className}>
      {proposalActionsData[proposalAction].map((field, i) =>
        field.type === ProposalActionDetailField.ADDRESS ? (
          <AddressInputPanel
            key={i}
            label={field.label}
            value={toAddress}
            onChange={onToAddressInput}
            placeholder={
              proposalAction === ProposalAction.SET_FEE_PROTOCOL || proposalAction === ProposalAction.COLLECT_PROTOCOL
                ? 'Intrinsic Pool Address'
                : ''
            }
          />
        ) : field.type === ProposalActionDetailField.RECIPIENT_ADDRESS ? (
          <AddressInputPanel
            key={i}
            label={field.label}
            value={recipientAddress}
            onChange={onRecipientAddressInput}
            placeholder={'Wallet Address'}
          />
        ) : field.type === ProposalActionDetailField.CURRENCY ? (
          <CurrencyInputPanel
            key={i}
            value={amount}
            currency={currency}
            onUserInput={(amount: string) => onAmountInput(amount)}
            onCurrencySelect={(currency: Currency) => onCurrencySelect(currency)}
            showMaxButton={false}
            showCommonBases={false}
            showCurrencyAmount={false}
            disableNonToken={true}
            hideBalance={true}
            id="currency-input"
          />
        ) : null
      )}
    </ProposalActionDetailContainer>
  )
}
