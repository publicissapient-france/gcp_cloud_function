import React, { Component } from 'react';
import styled from 'styled-components';

import {COLORS} from '../../styles/variables';
import {
    GAME_PARAMETERS,
    STATUS,
    PARCEL_TYPES,
} from '../../constants';
import { CustomMapElement } from '../CustomMapElement';
import ParcelSprite from '../ParcelSprite';
import ParcelCustomSprite from '../ParcelBoostSprite';
import ParcelAllSprite from '../ParcelAllSprite';
import ParcelAllBoostSprite from '../ParcelAllBoostSprite';
import {parseDroneTeamColor} from '../../services/data.service';

export const ParcelContainer = styled.div`
  div {  
    svg {
      width: ${GAME_PARAMETERS.parcel};
      height: ${GAME_PARAMETERS.parcel};
      fill: ${(props) => COLORS[parseDroneTeamColor(props.teamId)]};
      filter: drop-shadow(2px 4px 3px rgba(0,0,0,0.8));
    }
  }
`;

export class Parcel extends Component {
    render() {
        return (
            !this.props.status ||
            (this.props.status && this.props.status !== STATUS.GRABBED) ||
            (this.props.status && this.props.status === STATUS.AVAILABLE) ?
            <CustomMapElement>
                <ParcelContainer {...this.props}>
                { this.props.teamId === 'all' && this.props.type === PARCEL_TYPES.SPEED_BOOST
                    ? <ParcelAllBoostSprite/>
                    : null
                }
                { this.props.teamId === 'all' && this.props.type === PARCEL_TYPES.CLASSIC
                    ? <ParcelAllSprite/>
                    : null
                }
                { this.props.teamId !== 'all' && this.props.type === PARCEL_TYPES.SPEED_BOOST
                    ? <ParcelCustomSprite/>
                    : null
                }
                { this.props.teamId !== 'all' && this.props.type === PARCEL_TYPES.CLASSIC
                    ? <ParcelSprite/>
                    : null
                }
                </ParcelContainer>
            </CustomMapElement>
            : null
        );
    }
}
