const Datastore = require('@google-cloud/datastore');
const turf = require('@turf/turf');

// creates datastore client
const datastore = new Datastore({});

const DISTANCE_PER_TICK = 0.1;

exports.droneLocationUpdater = (req, res) => {
    console.log('read from datastore with filter and require turf');

    const query = datastore
        .createQuery('DroneInfo')
        .filter('command.name', '=', 'MOVE');

    datastore.runQuery(query).then(results => {
        // Task entities found.
        const droneInfos = results[0];

        console.log('droneInfos:');
        droneInfos.forEach(droneInfo => {
            console.log('---------------');
            console.log(`-- droneInfo before update : ${JSON.stringify(droneInfo)}`);
            var currentLocation = turf.point([droneInfo.location.latitude, droneInfo.location.longitude]);
            var dest = turf.point([droneInfo.command.location.latitude, droneInfo.command.location.longitude]);

            // todo : compute distance to dest and if less than the distance done by the drone each update the set
            // current location with the destination distance and remove the command attribut
            const distance = turf.distance(currentLocation, dest, {});
            if (distance < DISTANCE_PER_TICK) {
                console.log('drone has arrived at destination');
                droneInfo.location.latitude = droneInfo.command.location.latitude;
                droneInfo.location.longitude = droneInfo.command.location.longitude;
                delete droneInfo.command;
            } else {
                bearing = turf.bearing(currentLocation, dest);
                console.log(`bearing for team ${JSON.stringify(droneInfo[datastore.KEY])}: ${bearing}`);
                var destination = turf.destination(currentLocation, DISTANCE_PER_TICK, bearing, {});
                console.log(`next point is: ${JSON.stringify(destination)}`);
                droneInfo.location.latitude = destination.geometry.coordinates[0];
                droneInfo.location.longitude = destination.geometry.coordinates[1];
            }
            console.log(`-- droneInfo after update : ${JSON.stringify(droneInfo)}`);
            upsert(droneInfo);
        });

        res.send('query datastore and require turf');
    });

};

upsert = (droneInfo) => {
    const droneInfoKey = droneInfo[datastore.KEY];

    const droneInfoEntity = {
        key: droneInfoKey,
        data: {
            command: droneInfo.command,
            location: droneInfo.location
        },
    };

    datastore
        .upsert(droneInfoEntity)
        .then(() => {
            console.log(`DroneInfo entity with id ${droneInfo.teamId} upserted successfully.`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}