import { Trans } from "@lingui/macro";
// eslint-disable-next-line no-restricted-imports
import { t } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import { ChangeEvent, ReactNode, useCallback } from "react";
import styled, { useTheme } from "styled-components";

import useENS from "../../hooks/useENS";
import { ExternalLink, ThemedText } from "../../theme";
import { ExplorerDataType, getExplorerLink } from "../../utils/getExplorerLink";
import { AutoColumn } from "../Column";
import { AutoRow, RowBetween } from "../Row";

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  z-index: 1;
  width: 100%;
`;

const ContainerRow = styled.div<{ error: boolean }>`
  display: flex;

  align-items: center;
  transition: border-color 300ms
      ${({ error }) => (error ? "step-end" : "step-start")},
    color 500ms ${({ error }) => (error ? "step-end" : "step-start")};
`;

const InputContainer = styled.div`
  flex: 1;
  margin-left: 28px;
`;

const Input = styled.input<{ error?: boolean }>`
  font-size: 16px;
  padding: 16px 12px;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  border: 1px solid #AAAAAA;
  border-radius: 6px;
  transition: color 300ms ${({ error }) => (error ? "step-end" : "step-start")};

  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  height: 48px
  ::placeholder {
    color: ${({ theme }) => theme.deprecated_text4};
  }

  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.deprecated_text4};
  }
`;

export default function AddressInputPanel({
  id,
  className = "recipient-address-input",
  label,
  placeholder,
  value,
  onChange,
}: {
  id?: string;
  className?: string;
  label?: ReactNode;
  placeholder?: string;
  // the typed string value
  value: string;
  // triggers whenever the typed value changes
  onChange: (value: string) => void;
}) {
  const { chainId } = useWeb3React();
  const theme = useTheme() as any;

  const { address, loading, name } = useENS(value);

  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;
      const withoutSpaces = input.replace(/\s+/g, "");
      onChange(withoutSpaces);
    },
    [onChange]
  );

  const error = Boolean(value.length > 0 && !loading && !address);

  return (
    <InputPanel id={id}>
      <ContainerRow error={error}>
        <div style={{ width: "150px" }}>
          <ThemedText.DeprecatedBlack fontWeight={600} fontSize={16} textAlign={'left'}>
            {label ?? <Trans>Recipient</Trans>}
          </ThemedText.DeprecatedBlack>
          {address && chainId && (
            <ExternalLink
              href={getExplorerLink(
                chainId,
                name ?? address,
                ExplorerDataType.ADDRESS
              )}
              style={{ fontSize: "14px" }}
            >
              <Trans>(View on Explorer)</Trans>
            </ExternalLink>
          )}
        </div>
        <InputContainer>
          <AutoRow gap="md">
            <Input
              className={className}
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder={placeholder ?? t`Wallet Address or ENS name`}
              error={error}
              pattern="^(0x[a-fA-F0-9]{40})$"
              onChange={handleInput}
              value={value}
            />
          </AutoRow>
        </InputContainer>
      </ContainerRow>
    </InputPanel>
  );
}
