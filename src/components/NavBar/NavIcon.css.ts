import { style } from "@vanilla-extract/css";

import { sprinkles, vars } from "../../nft/css/sprinkles.css";

export const navIcon = style([
  sprinkles({
    alignItems: "center",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    border: "none",
    justifyContent: "center",
    textAlign: "center",
    cursor: "pointer",
    borderRadius: "8",
    transition: "250",
  }),
  {
    ":hover": {
      background: vars.color.grey500,
    },
    zIndex: 1,
    color: vars.color.navTextColor2,
    background: vars.color.navTextColor,
  },
]);
