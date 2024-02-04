import React from "react";
import styled from "styled-components";
import { Z_INDEX } from "theme/zIndex";

export const BodyWrapper = styled.main<{
  margin?: string;
  maxWidth?: string;
  width?: string;
}>`
  position: relative;
  margin-top: ${({ margin }) => margin ?? "0px"};
  max-width: ${({ maxWidth }) => maxWidth ?? "460px"};
  width: ${({ width }) => width ?? "100%"};
  background: ${({ theme }) => theme.backgroundSurface};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.backgroundOutline};
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  z-index: ${Z_INDEX.deprecated_content};
  font-feature-settings: "ss01" on, "ss02" on, "cv01" on, "cv03" on;
`;

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({
  children,
  ...rest
}: {
  children: React.ReactNode;
  maxWidth?: string;
  width?: string;
}) {
  return <BodyWrapper {...rest}>{children}</BodyWrapper>;
}
