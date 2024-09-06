import styled from "styled-components";

export const ToggleWrapper = styled.button<{ width?: string }>`
  display: flex;
  align-items: center;
  padding: 0px;
  width: ${({ width }) => width ?? "100%"};
  background: #e5f0fa;
  border-radius: 24px;
  border: ${({ theme }) => "1px solid " + theme.deprecated_bg2};
  cursor: pointer;
  outline: none;
`;

export const ToggleElement = styled.span<{
  isActive?: boolean;
  fontSize?: string;
}>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 16px;
  border-radius: 24px;
  justify-content: center;
  height: 100%;
  background: ${({ theme, isActive }) =>
    isActive ? theme.thumbColor : "#E5F0FA"};
  color: ${({ theme, isActive }) => (isActive ? theme.white : theme.black)};
  font-size: ${({ fontSize }) => fontSize ?? "1rem"};
  font-weight: 500;
  white-space: nowrap;
  :hover {
    user-select: initial;
    color: ${({ theme, isActive }) =>
      isActive ? theme.deprecated_text2 : theme.deprecated_text3};
  }
`;
