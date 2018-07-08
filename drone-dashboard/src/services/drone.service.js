import { constants } from '../constants';

const data = {
  teamId : "blue",
  location : {
    latitude : 48.806294,
    longitude : 2.171485
  },
  command: {
    name : "MOVE" | "READY",
    location : {
      latitude : 45.3534,
      longitude : 2.3535
    }
  }
}

export const getDroneInfo = async () => {
  try {
    const response = await fetch(
      'https://us-central1-jbc-atl-sal-func-techevent.cloudfunctions.net/droneStateList',
      {
        method: 'GET',
        mode: 'cors',
      }
    );
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

export const parseDroneInfo = (data) => {
  return Object.values(data).map((teamInfo, index) => {
    let droneBaseInfo;
    let dronePositionInfo;
    droneBaseInfo = {
      id: index,
      color: teamInfo.team,
    };
    if (teamInfo && teamInfo.data && teamInfo.data.location) {
      dronePositionInfo = {
        latitude: teamInfo.data.location.latitude,
        longitude: teamInfo.data.location.longitude,
      };
    }
    return {
      ...droneBaseInfo,
      ...dronePositionInfo,
    };
  })
}

// random drones generator
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
const getRandomInteger = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
const getRandomColor = () => `hsla(${Math.random() * 360}, 100%, 42%, 1)`;
const getRandomOperator = () => constants.operators[getRandomInteger(0,1)]

export const createDrones = (quantity) => Array
  .from(Array(quantity).keys())
  .map((value) => (
    {
      id: value,
      latitude: getRandomFloat(constants.boundaries.minLatitude, constants.boundaries.maxLatitude),
      longitude: getRandomFloat(constants.boundaries.minLongitude, constants.boundaries.maxLongitude),
      color: getRandomColor(),
      latitudeOperator: getRandomOperator(),
      longitudeOperator: getRandomOperator(),
    }
  ));

export const moveDrone = (drone) => {
  return {
    ...drone,
    latitude: eval(`${drone.latitude} ${drone.latitudeOperator} ${constants.step} * ${getRandomFloat(1.5, 2)}`),
    longitude: eval(`${drone.longitude} ${drone.longitudeOperator} ${constants.step} * ${getRandomFloat(1.5, 2)}`),
  }
}
