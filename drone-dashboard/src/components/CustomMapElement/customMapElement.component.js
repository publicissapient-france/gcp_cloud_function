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
    top: calc(-${GAME_PARAMETERS.drone} / 2);
    left: calc(-${GAME_PARAMETERS.drone} / 2);
  }
  ${ParcelContainer} {
    position: absolute;
    top: calc(-${GAME_PARAMETERS.parcel} / 2);
    left: calc(-${GAME_PARAMETERS.parcel} / 2);
  }
  ${PinContainer} {
    position: absolute;
    top: calc(-${GAME_PARAMETERS.pin} / 2);
    left: calc(-${GAME_PARAMETERS.pin} / 2);
  }
`;
