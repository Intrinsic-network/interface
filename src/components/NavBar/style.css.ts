import { style } from "@vanilla-extract/css";

import { subhead } from "../../nft/css/common.css";
import { sprinkles, vars } from "../../nft/css/sprinkles.css";

export const nav = style([
  sprinkles({
    paddingX: "32",
    paddingY: "24",
    width: "full",
    height: "72",
    zIndex: "2",
    background: "backgroundFloating",
  }),
]);

export const logoContainer = style([
  sprinkles({
    display: "flex",
    marginRight: { sm: "12", xxl: "20" },
    alignItems: "center",
  }),
]);

export const logo = style([
  sprinkles({
    display: "block",
    color: "textPrimary",
  }),
]);

export const baseContainer = style([
  sprinkles({
    alignItems: "center",
  }),
]);

export const baseSideContainer = style([
  baseContainer,
  sprinkles({
    display: "flex",
    width: "full",
  }),
]);

export const leftSideContainer = style([
  baseSideContainer,
  sprinkles({
    justifyContent: "flex-start",
  }),
]);

export const searchBarContainerDiv = style({
  width: "625px",
  marginLeft: "32px",
});

export const middleContainer = style([
  baseContainer,
  sprinkles({
    flex: "1",
    flexShrink: "1",
    justifyContent: "center",
    display: { sm: "none", xl: "flex" },
  }),
]);

export const rightSideContainer = style([
  baseSideContainer,
  sprinkles({
    justifyContent: "flex-end",
  }),
]);

const baseMenuItem = style([
  subhead,
  sprinkles({
    paddingY: "8",
    paddingX: "16",
    marginY: "4",
    borderRadius: "12",
    transition: "250",
    height: "min",
    width: "full",
    textAlign: "center",
  }),
  {
    lineHeight: "24px",
    textDecoration: "none",
    ":hover": {
      background: vars.color.lightGrayOverlay,
    },
  },
]);

export const menuItem = style([
  baseMenuItem,
  sprinkles({
    color: "textSecondary",
  }),
]);

export const roundedUnderline = style({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  "::after": {
    content: '""',
    display: "block",
    width: "22px",
    height: "4px",
    background: "#FFFFFF",
    borderRadius: "4px",
  },
});

export const activeMenuItem = style([
  baseMenuItem,
  sprinkles({
    background: "backgroundFloating",
  }),
  roundedUnderline,
]);

export const mobileBottomBar = style([
  sprinkles({
    position: "fixed",
    display: { sm: "flex", lg: "none" },
    bottom: "0",
    right: "0",
    left: "0",
    justifyContent: "space-between",
    paddingY: "4",
    paddingX: "8",
    height: "56",
    background: "backgroundSurface",
  }),
]);
