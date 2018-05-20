const Datastore = require('@google-cloud/datastore');
const PubSub = require(`@google-cloud/pubsub`);
const turf = require('@turf/turf');

const datastore = new Datastore({});
const pubsub = new PubSub();

const topicName = 'drone-events';
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

            const distance = turf.distance(currentLocation, dest, {});
            if (distance < DISTANCE_PER_TICK) {
                console.log('drone has arrived at destination');
                droneInfo.location.latitude = droneInfo.command.location.latitude;
                droneInfo.location.longitude = droneInfo.command.location.longitude;
                delete droneInfo.command;
                // todo : envoyer un event DESTINATION_REACHED dans le topic drone-events
                // todo : checker s'il y a un colis à prendre si c'est le cas le prendre et envoyer l'event PARCEL_GRABBED (et ne pas envoyer l'event DESTINATION_REACHED)

                const data = JSON.stringify({ event: 'DESTINATION_REACHED' });
                const dataBuffer = Buffer.from(data);
                pubsub
                    .topic(topicName)
                    .publisher()
                    .publish(dataBuffer)
                    .then(messageId => {
                        console.log(`Message ${messageId} published.`);
                    })
                    .catch(err => {
                        console.error('ERROR:', err);
                    });
            } else {
                // Continue moving to destination
                bearing = turf.bearing(currentLocation, dest);
                console.log(`bearing for team ${JSON.stringify(droneInfo[datastore.KEY])}: ${bearing}`);
                var destination = turf.destination(currentLocation, DISTANCE_PER_TICK, bearing, {});
                console.log(`next point is: ${JSON.stringify(destination)}`);
                droneInfo.location.latitude = destination.geometry.coordinates[0];
                droneInfo.location.longitude = destination.geometry.coordinates[1];

                const data = JSON.stringify({ event: 'MOVING' });
                const dataBuffer = Buffer.from(data);
                pubsub
                    .topic(topicName)
                    .publisher()
                    .publish(dataBuffer)
                    .then(messageId => {
                        console.log(`Message ${messageId} published.`);
                    })
                    .catch(err => {
                        console.error('ERROR:', err);
                    });
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