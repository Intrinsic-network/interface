import { Currency, CurrencyAmount, Percent } from "@intrinsic-network/sdk-core";
import { Trans } from "@lingui/macro";
// eslint-disable-next-line no-restricted-imports
import { t } from "@lingui/macro";
import { useMemo } from "react";
import { useTheme } from "styled-components";

import { ThemedText } from "../../theme";
import { warningSeverity } from "../../utils/prices";
import { MouseoverTooltip } from "../Tooltip";

export function FiatValue({
  fiatValue,
  priceImpact,
}: {
  fiatValue: CurrencyAmount<Currency> | null | undefined;
  priceImpact?: Percent;
}) {
  const theme = useTheme() as any;
  const priceImpactColor = useMemo(() => {
    if (!priceImpact) return undefined;
    if (priceImpact.lessThan("0")) return theme.deprecated_green1;
    const severity = warningSeverity(priceImpact);
    if (severity < 1) return theme.deprecated_text3;
    if (severity < 3) return theme.deprecated_yellow1;
    return theme.deprecated_red1;
  }, [
    priceImpact,
    theme.deprecated_green1,
    theme.deprecated_red1,
    theme.deprecated_text3,
    theme.deprecated_yellow1,
  ]);

  const p = Number(fiatValue?.toFixed());
  const visibleDecimalPlaces = p < 1.05 ? 4 : 2;

  return (
    <ThemedText.DeprecatedBody fontSize={14} color={theme.textSecondary}>
      {fiatValue && (
        <>
          ${fiatValue?.toFixed(visibleDecimalPlaces, { groupSeparator: "," })}
        </>
      )}
      {priceImpact ? (
        <span
          style={{ color: priceImpactColor }}
          title={t`The estimated difference between the USD values of input and output amounts.`}
        >
          {" "}
          <Trans>{priceImpact.multiply(-1).toSignificant(3)}%</Trans>
        </span>
      ) : null}
    </ThemedText.DeprecatedBody>
  );
}
