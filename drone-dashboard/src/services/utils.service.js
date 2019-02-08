import {get, some} from 'lodash';

export const isDestinationLocationType = (drone) => (parcelLocationType = 'delivery') => (
    drone && drone.parcels &&
    some(drone.parcels, (parcel) => (
        parcel.location[parcelLocationType].latitude === get(drone, 'command.location.latitude') &&
        parcel.location[parcelLocationType].longitude === get(drone, 'command.location.longitude')
    ))
);
