export const GAME_PARAMETERS = {
    step: 0.0004,
    speed: 3000,
    drone: '25px',
    parcel: '20px',
    pin: '20px',
    map: {
        center: {
            lat: 48.86,
            lng: 2.340,
        },
        zoom: 12,
    },
    boundaries: {
        minLatitude: 48.816000,
        maxLatitude: 48.900000,
        minLongitude: 2.25000,
        maxLongitude: 2.42000,
    },
    pinBoundaries: [
        {
            latitude: 48.900000,
            longitude: 2.25000,
        },
        {
            latitude: 48.816000,
            longitude: 2.42000,
        },
        {
            latitude: 48.900000,
            longitude: 2.42000,
        },
        {
            latitude: 48.816000,
            longitude: 2.25000,
        },
    ],
    operators: ['-', '+'],
};

export const TEAMS = ['blue', 'red', 'yellow'];
