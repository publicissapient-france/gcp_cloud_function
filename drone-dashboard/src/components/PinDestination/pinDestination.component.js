import React, { Component } from 'react';
import styled from 'styled-components';
import { some } from 'lodash';

import {GAME_PARAMETERS} from '../../constants';
import {COLORS} from '../../styles/variables';
import {STATUS} from '../../constants';
import { CustomMapElement } from '../CustomMapElement';
import PinDestinationSprite from '../PinDestinationSprite';
import {CounterBubble} from '../CounterBubble';
import {parseDroneTeamColor} from '../../services/data.service';

export const PinContainer = styled.div`
  margin-top: ${(props) => `calc((-${GAME_PARAMETERS[props.addMargin]} / 2) + ${props.addMargin === 'pin' ? '-18px' : '-10px'})`};
  div {  
    svg {
      margin-top: -6px;
      margin-left: ${(props) => `calc((-${GAME_PARAMETERS[props.addMargin]} / 2) + ${props.addMargin === 'pin' ? '-7px' : '3px'})`};
      width: 12px;
      height: 12px;
    }
  }
`;

export class PinDestination extends Component {
    renderParcelScoreCounter() {
        return (
            this.props.score &&
            <CounterBubble {...this.props} addMargin='pin'>
                {this.props.score}
            </CounterBubble>
        );
    }

    render() {
        const isDestinationDelivery = this.props.drone &&
            this.props.drone.parcels &&
            some(this.props.drone.parcels, (parcel) => {
                return (
                  parcel.location.delivery.latitude === this.props.lat &&
                  parcel.location.delivery.longitude === this.props.lng
                );
            });
        return (
            this.props.status &&
            (
                this.props.status === STATUS.TOGGLE ||
                this.props.status === STATUS.GRABBED
            ) ?
            <CustomMapElement>
                <PinContainer {...this.props} addMargin={isDestinationDelivery ? 'pin' : 'parcel'}>
                    <PinDestinationSprite baseColor={COLORS[parseDroneTeamColor(this.props.teamId)]}/>
                    {this.renderParcelScoreCounter()}
                </PinContainer>
            </CustomMapElement>
            : null
        );
    }
}
