import Tooltip from "components/Tooltip";
import { ReactNode, useCallback, useState } from "react";
import { Info } from "react-feather";
import styled from "styled-components";

const InfoTipContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  cursor: help;
`;

const InfoTipBody = styled.div`
  color: ${({ theme }) => theme.textPrimary};
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
`;

const InfoTipWrapper = styled.div`
  margin-left: 4px;
  display: flex;
  align-items: center;
`;

export default function InfoTip({ text }: { text: ReactNode; size?: number }) {
  const [show, setShow] = useState<boolean>(false);

  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <InfoTipWrapper>
      {show ? (
        <Tooltip
          text={<InfoTipBody>{text}</InfoTipBody>}
          show={true}
          placement="right"
        >
          <InfoTipContainer
            onClick={open}
            onMouseEnter={open}
            onMouseLeave={close}
          >
            <Info size={14} />
          </InfoTipContainer>
        </Tooltip>
      ) : null}
    </InfoTipWrapper>
  );
}
