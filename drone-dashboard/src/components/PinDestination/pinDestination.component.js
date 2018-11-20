import React, { Component } from 'react';
import styled from 'styled-components';

import {COLORS} from '../../styles/variables';
import {STATUS} from '../../constants';
import { CustomMapElement } from '../CustomMapElement';
import PinDestinationSprite from '../PinDestinationSprite';
import {CounterBubble} from '../CounterBubble';
import {parseDroneTeamColor} from '../../services/data.service';

export const PinContainer = styled.div`
  margin-top: -20px;
  margin-left: -6px;
  div {  
    svg {
      width: 12px;
      height: 12px;
      filter: drop-shadow(2px 6px 4px rgba(0,0,0,0.8));
    }
  }
`;

export class PinDestination extends Component {
    renderParcelScoreCounter() {
        return (
            this.props.score &&
            <CounterBubble {...this.props}>
                {this.props.score}
            </CounterBubble>
        );
    }

    render() {
        return (
            this.props.status &&
            (
                this.props.status === STATUS.TOGGLE ||
                this.props.status === STATUS.GRABBED
            ) ?
            <CustomMapElement>
                <PinContainer {...this.props} >
                    <PinDestinationSprite baseColor={COLORS[parseDroneTeamColor(this.props.teamId)]}/>
                    {this.renderParcelScoreCounter()}
                </PinContainer>
            </CustomMapElement>
            : null
        );
    }
}
