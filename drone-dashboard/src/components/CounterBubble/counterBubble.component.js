import styled from 'styled-components';

import {COLORS} from '../../styles/variables';
import {parseDroneTeamColor} from '../../services/data.service';

export const CounterBubble = styled.div`
  position: relative;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  padding: 2px;
  margin-top: -45px;
  min-width: 20px;
  background: ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
`;

