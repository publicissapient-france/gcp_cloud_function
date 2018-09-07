import styled from 'styled-components';

import {COLORS} from '../../styles/variables';
import {parseDroneTeamColor} from '../../services/drone.service';

export const CounterBubble = styled.div`
  position: relative;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  padding: 2px;
  //border: #fff solid 1px;
  margin-top: -45px;
  background: ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
  &:before {
    position: absolute;
    top: -23px;
    left: 50px;
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
    z-index: 200;
  }
`;

