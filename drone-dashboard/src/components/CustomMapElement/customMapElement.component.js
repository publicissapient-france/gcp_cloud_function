import styled from 'styled-components';

import {GAME_PARAMETERS} from '../../constants';
import { DroneContainer } from '../Drone';
import { ParcelContainer } from '../Parcel';
import { PinContainer } from '../Pin';

export const CustomMapElement = styled.div`
  position: relative;
  width: 4px;
  height: 4px;
  ${DroneContainer} {
    position: absolute;
    // FIXME find a way to put drone in upper layer
    //z-index: 300;
    top: calc(-${GAME_PARAMETERS.drone} / 2);
    left: calc(-${GAME_PARAMETERS.drone} / 2);
  }
  ${PinContainer} {
    // FIXME
    //z-index: 200;
    position: absolute;
    top: calc(-${GAME_PARAMETERS.pin} / 2);
    left: calc(-${GAME_PARAMETERS.pin} / 2);
  }
  ${ParcelContainer} {
    // FIXME
    //z-index: 100;
    position: absolute;
    top: calc(-${GAME_PARAMETERS.parcel} / 2);
    left: calc(-${GAME_PARAMETERS.parcel} / 2);
  }
`;
