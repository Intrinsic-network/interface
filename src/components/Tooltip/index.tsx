import { transparentize } from "polished";
import { ReactNode, useCallback, useState } from "react";
import styled from "styled-components";

import Popover, { PopoverProps } from "../Popover";

export const TooltipContainer = styled.div`
  max-width: 256px;
  padding: 0.6rem 1rem;
  font-weight: 400;
  word-break: break-word;

  background: ${({ theme }) => theme.deprecated_bg0};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.deprecated_bg2};
  box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.9, theme.shadow1)};
`;

interface TooltipProps extends Omit<PopoverProps, "content"> {
  text: ReactNode;
  disableHover?: boolean; // disable the hover and content display
}

interface TooltipContentProps extends Omit<PopoverProps, "content"> {
  content: ReactNode;
  onOpen?: () => void;
  // whether to wrap the content in a `TooltipContainer`
  wrap?: boolean;
  disableHover?: boolean; // disable the hover and content display
}

export default function Tooltip({ text, show, children }: TooltipProps) {
  return (
    <Popover
      content={text && <TooltipContainer>{text}</TooltipContainer>}
      children={children}
      show={show}
    />
  );
}

function TooltipContent({
  content,
  wrap = false,
  show,
  children,
}: TooltipContentProps) {
  return (
    <Popover
      content={wrap ? <TooltipContainer>{content}</TooltipContainer> : content}
      show={show}
      children={children}
    />
  );
}

/** Standard text tooltip. */
export function MouseoverTooltip({
  text,
  disableHover,
  children,
}: Omit<TooltipProps, "show">) {
  const [show, setShow] = useState(false);
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  return show ? (
    <Tooltip show={true} text={disableHover ? null : text}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  ) : null;
}

/** Tooltip that displays custom content. */
export function MouseoverTooltipContent({
  content,
  children,
  onOpen: openCallback = undefined,
  disableHover,
  wrap,
}: Omit<TooltipContentProps, "show">) {
  const [show, setShow] = useState(false);
  const open = useCallback(() => {
    setShow(true);
    openCallback?.();
  }, [openCallback]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <TooltipContent
      show={show}
      wrap={wrap}
      content={disableHover ? null : content}
    >
      <div
        style={{ display: "inline-block", lineHeight: 0, padding: "0.25rem" }}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {children}
      </div>
    </TooltipContent>
  );
}
