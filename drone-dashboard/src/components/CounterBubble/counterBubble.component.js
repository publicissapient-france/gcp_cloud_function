import styled from 'styled-components';

import {GAME_PARAMETERS} from '../../constants';
import {COLORS} from '../../styles/variables';
import {parseDroneTeamColor} from '../../services/data.service';

export const CounterBubble = styled.div`
  position: relative;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  padding: 2px;
  margin-top: ${(props) => `calc((-${GAME_PARAMETERS[props.addMargin]} / 2) + 10px)`};
  margin-left: ${(props) => `calc(-${GAME_PARAMETERS[props.addMargin]} / 2)`};
  min-width: 20px;
  background: ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
`;

