import { readableColor } from "polished";
import { PropsWithChildren } from "react";
import styled from "styled-components";
import { Color } from "theme/styled";

export enum BadgeVariant {
  DEFAULT = "DEFAULT",
  NEGATIVE = "NEGATIVE",
  POSITIVE = "POSITIVE",
  PRIMARY = "PRIMARY",
  WARNING = "WARNING",

  WARNING_OUTLINE = "WARNING_OUTLINE",
}

interface BadgeProps {
  variant?: "DEFAULT" | "NEGATIVE" | "POSITIVE" | "PRIMARY" | "WARNING";
}

function pickBackgroundColor(variant: any, theme: any): Color {
  switch (variant) {
    case BadgeVariant.NEGATIVE:
      return theme.deprecated_error;
    case BadgeVariant.POSITIVE:
      return theme.deprecated_success;
    case BadgeVariant.PRIMARY:
      return theme.secondaryButtonColor;
    case BadgeVariant.WARNING:
      return theme.deprecated_warning;
    case BadgeVariant.WARNING_OUTLINE:
      return "transparent";
    default:
      return theme.deprecated_bg2;
  }
}

function pickBorder(variant: any, theme: any): string {
  console.log(variant);
  switch (variant) {
    case BadgeVariant.WARNING_OUTLINE:
      return `1px solid ${theme.deprecated_warning}`;
    default:
      return "unset";
  }
}

function pickFontColor(variant: any, theme: any): string {
  switch (variant) {
    case BadgeVariant.NEGATIVE:
      return readableColor(theme.deprecated_error);
    case BadgeVariant.POSITIVE:
      return readableColor(theme.deprecated_success);
    case BadgeVariant.WARNING:
      return readableColor(theme.deprecated_warning);
    case BadgeVariant.WARNING_OUTLINE:
      return theme.deprecated_warning;
    default:
      return readableColor(theme.deprecated_bg2);
  }
}

const Badge = styled.div<BadgeProps>`
  align-items: center;
  border: ${({ theme, variant }) => pickBorder(variant, theme)};
  border-radius: 0.5rem;
  color: ${({ theme, variant }) => pickFontColor(variant, theme)};
  display: inline-flex;
  padding: 4px 6px;
  justify-content: center;
  font-weight: 500;
`;

export default Badge;
