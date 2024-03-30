// eslint-disable-next-line no-restricted-imports
import { t, Trans } from "@lingui/macro";
import { ResizingTextArea, TextInput } from "components/TextInput";
import React, { memo } from "react";
import { Text } from "rebass";
import styled from "styled-components";

const ProposalEditorHeader = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  padding-top: 20px;
  width: 150px
`;

const ProposalTitle = memo(styled(TextInput)`
  margin-left: 28px;
  width: 100%;
  height: 48px;
  border: 1px solid #AAAAAA;
  border-radius: 6px;
  padding: 12px 16px;
  

  input {
    background-color: transparent !important;
  }
`);

const ProposalEditorContainer = styled.div`
  margin-top: 10px;
  
  border-radius: 20px;
`;

const ProposalHeaderContainer = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

export const ProposalEditor = ({
  className,
  title,
  body,
  onTitleInput,
  onBodyInput,
}: {
  className?: string;
  title: string;
  body: string;
  onTitleInput: (title: string) => void;
  onBodyInput: (body: string) => void;
}) => {
  const bodyPlaceholder = `## Summary

Insert your summary here

## Methodology
  
Insert your methodology here

## Conclusion
  
Insert your conclusion here
  
  `;

  return (
    <ProposalEditorContainer className={className}>
      <ProposalHeaderContainer>
        <ProposalEditorHeader>
          <Trans>Proposal</Trans>
        </ProposalEditorHeader>
        <ProposalTitle
          value={title}
          onUserInput={onTitleInput}
          placeholder={t`Proposal Title`}
          fontSize="16px"
        />
      </ProposalHeaderContainer>

      <ResizingTextArea
        value={body}
        onUserInput={onBodyInput}
        placeholder={bodyPlaceholder}
        fontSize="16px"
      />
    </ProposalEditorContainer>
  );
};
