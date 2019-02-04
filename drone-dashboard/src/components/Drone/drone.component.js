import React, { Component } from 'react';
import styled from 'styled-components';

import {COLORS} from '../../styles/variables';
import {GAME_PARAMETERS} from '../../constants';
import { CustomMapElement } from '../CustomMapElement';
import { CounterBubble } from '../CounterBubble';
import DroneSprite from '../DroneSprite';
import {parseDroneTeamColor} from '../../services/data.service';

export const DroneContainer = styled.div`
  div {
    svg {
      margin-top: calc(-${GAME_PARAMETERS.drone} / 2);
      margin-left: calc(-${GAME_PARAMETERS.drone} / 2);
      width: ${GAME_PARAMETERS.drone};
      height: ${GAME_PARAMETERS.drone};
      fill: ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
      filter: drop-shadow(2px 4px 4px rgba(0,0,0,0.8));
    }
  }
`;

export class Drone extends Component {
    renderDroneParcelsCounter() {
        return (
            this.props.parcels &&
            this.props.parcels.length > 0 &&
            <CounterBubble {...this.props} addMargin='drone'>
                {this.props.parcels.length}
            </CounterBubble>
        );
    }

    render() {
        if (this.props.latitude && this.props.longitude) {
            return (
                <CustomMapElement>
                    <DroneContainer {...this.props} >
                        <DroneSprite/>
                        {this.renderDroneParcelsCounter()}
                    </DroneContainer>
                </CustomMapElement>
            )
        }
    }
}
