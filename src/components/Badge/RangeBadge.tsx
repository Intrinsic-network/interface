import { Trans } from "@lingui/macro";
import Badge, { BadgeVariant } from "components/Badge";
import { AlertCircle } from "react-feather";
import styled from "styled-components";

import { MouseoverTooltip } from "../../components/Tooltip";

const BadgeWrapper = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
`;

const BadgeText = styled.div`
  font-weight: 500;
  font-size: 14px;
`;

const ActiveDot = styled.span`
  background-color: ${({ theme }) => theme.deprecated_success};
  border-radius: 50%;
  height: 12px;
  width: 12px;
  margin-right: 4px;
`;

export default function RangeBadge({
  removed,
  inRange,
}: {
  removed: boolean | undefined;
  inRange: boolean | undefined;
}) {
  return (
    <BadgeWrapper>
      {removed ? (
        <MouseoverTooltip
          text={
            <Trans>
              Your position has 0 liquidity, and is not earning fees.
            </Trans>
          }
        >
          <Badge variant={"DEFAULT"}>
            <AlertCircle width={12} height={12} />
            &nbsp;
            <BadgeText>
              <Trans>Closed</Trans>
            </BadgeText>
          </Badge>
        </MouseoverTooltip>
      ) : inRange ? (
        <MouseoverTooltip
          text={
            <Trans>
              The price of this pool is within your selected range. Your
              position is currently earning fees.
            </Trans>
          }
        >
          <Badge variant={"DEFAULT"}>
            <ActiveDot /> &nbsp;
            <BadgeText>
              <Trans>In range</Trans>
            </BadgeText>
          </Badge>
        </MouseoverTooltip>
      ) : (
        <MouseoverTooltip
          text={
            <Trans>
              The price of this pool is outside of your selected range. Your
              position is not currently earning fees.
            </Trans>
          }
        >
          <Badge variant={"WARNING"}>
            <AlertCircle width={12} height={12} />
            &nbsp;
            <BadgeText>
              <Trans>Out of range</Trans>
            </BadgeText>
          </Badge>
        </MouseoverTooltip>
      )}
    </BadgeWrapper>
  );
}
