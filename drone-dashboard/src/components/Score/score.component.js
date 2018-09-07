import React from 'react';
import styled from 'styled-components';

import {COLORS} from '../../styles/variables';
import {parseDroneTeamColor} from '../../services/drone.service';

const ScoreItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 50px;
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
  border: 1px solid ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
  border-left: 20px solid ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
  border-radius: 5px;
`;

export const ScoresContainer = styled.div`
  display: flex;
  flex: 0 1 200px;
  flex-flow: column nowrap;
  align-items: flex-start;
  padding: 0 15px;
  ${ScoreItem}:not(:last-of-type) {
    margin-bottom: 10px;
  }
`;

export const Score = ({
    ...props,
}) => (
    <ScoreItem {...props}>
        {props.score}
    </ScoreItem>
);
