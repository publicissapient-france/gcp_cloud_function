export const GAME_PARAMETERS = {
    speed: 3000,
    step: 0.0004,
    drone: '22px',
    parcel: '20px',
    pin: '20px',
    // Google map params
    center: {
        lat: 48.86,
        lng: 2.340,
    },
    zoom: 12,
    boundaries: {
        minLatitude: 48.816000,
        maxLatitude: 48.900000,
        minLongitude: 2.25000,
        maxLongitude: 2.42000,
    },
    showBoundaries: false,
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

export const TEAMS = [
    'blue',
    'red',
    'yellow',
    'green',
    'orange',
    'rose',
    'purple',
    'black',
    'grey',
    'pink',
];

export const STATUS = {
    READY_FAILED: 'READY_FAILED',
    AVAILABLE: 'AVAILABLE',
    GRABBED: 'GRABBED',
    TOGGLE: 'TOGGLE',
    MOVE: 'MOVE',
};
