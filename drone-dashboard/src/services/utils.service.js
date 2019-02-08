import {get, some} from 'lodash';

export const isDestinationLocationType = (drone, parcels) => (parcelLocationType = 'delivery') => (
    drone && parcels && parcels.length &&
    some(parcels, (parcel) => (
        parcel &&
        parcel.location &&
        parcel.location[parcelLocationType] &&
        parcel.location[parcelLocationType].latitude === get(drone, 'command.location.latitude') &&
        parcel.location[parcelLocationType].longitude === get(drone, 'command.location.longitude')
    ))
);
