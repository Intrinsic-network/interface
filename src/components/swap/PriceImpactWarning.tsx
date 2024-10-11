import { Percent } from "@intrinsic-finance/sdk-core";
import { Trans } from "@lingui/macro";
import { OutlineCard } from "components/Card";
import styled, { useTheme } from "styled-components";
import { opacify } from "theme/utils";

import { ThemedText } from "../../theme";
import { AutoColumn } from "../Column";
import { RowBetween, RowFixed } from "../Row";
import { MouseoverTooltip } from "../Tooltip";
import { formatPriceImpact } from "./FormattedPriceImpact";
import { t } from "@lingui/macro";

const StyledCard = styled(OutlineCard)`
  padding: 12px;
  border: 1px solid ${({ theme }) => opacify(24, theme.deprecated_error)};
`;

interface PriceImpactWarningProps {
  priceImpact: Percent;
}

export default function PriceImpactWarning({
  priceImpact,
}: PriceImpactWarningProps) {
  const theme = useTheme() as any;

  return (
    <StyledCard>
      <AutoColumn gap="8px">
        <RowBetween>
          <RowFixed
            title={t`A swap of this size may have a high price impact, given the current liquidity in the pool. There may be a
              large difference between the amount of your input token and what you will receive in the output token`}
          >
            <ThemedText.DeprecatedSubHeader color={theme.deprecated_error}>
              <Trans>Price impact warning</Trans>
            </ThemedText.DeprecatedSubHeader>
          </RowFixed>
          <ThemedText.DeprecatedLabel
            textAlign="right"
            fontSize={14}
            color={theme.deprecated_error}
          >
            {formatPriceImpact(priceImpact)}
          </ThemedText.DeprecatedLabel>
        </RowBetween>
      </AutoColumn>
    </StyledCard>
  );
}
