const Datastore = require('@google-cloud/datastore');
const PubSub = require(`@google-cloud/pubsub`);
const turf = require('@turf/turf');
const { get } = require('lodash');

const datastore = new Datastore({});
const pubsub = new PubSub();

const topicName = 'drone-events';
const DISTANCE_PER_TICK = 0.1;
const DEFAULT_LATITUDE = 48.8753487;
const DEFAULT_LONGITUDE = 2.3088396;

/**
 * 
 * gcloud command to deploy:
 * gcloud beta functions deploy droneLocationUpdater --runtime nodejs8 --trigger-http
 */
exports.droneLocationUpdater = async (req, res) => {
    console.log('read from datastore with filter and require turf');

    const query = datastore
        .createQuery('DroneInfo')
        .filter('command.name', '=', 'MOVE');

    const dronesQueryResults = await datastore.runQuery(query);
    // Task entities found.
    const droneInfos = dronesQueryResults[0];

    console.log('droneInfos:');
    const jobs = droneInfos.map(async (droneInfo = {}) => {
        console.log('---------------');
        console.log(`-- droneInfo before update : ${JSON.stringify(droneInfo)}`);
        const droneInfoKey = droneInfo[datastore.KEY];
        // Set default location
        droneInfo.location = {
            ...droneInfo.location,
            latitude: get(droneInfo, 'location.latitude') || DEFAULT_LATITUDE,
            longitude: get(droneInfo, 'location.longitude') || DEFAULT_LONGITUDE,
        };
        const currentLocation = turf.point([droneInfo.location.latitude, droneInfo.location.longitude]);
        const dest = turf.point([droneInfo.command.location.latitude, droneInfo.command.location.longitude]);

        const distance = turf.distance(currentLocation, dest, {});
        if (droneAsReachItsDestination(distance)) {
            console.log('drone has arrived at destination');
            droneInfo.location.latitude = droneInfo.command.location.latitude;
            droneInfo.location.longitude = droneInfo.command.location.longitude;
            delete droneInfo.command;

            try {
                // todo : checker s'il y a un colis à prendre si c'est le cas le prendre et envoyer l'event PARCEL_GRABBED (et ne pas envoyer l'event DESTINATION_REACHED)
                const teamId = droneInfoKey.name;
                const parcelsAroundDrone = await checkParcelAround(droneInfo.location, teamId);
                if (parcelsAroundDrone && parcelsAroundDrone.length > 0) {
                    console.log("Parcel around drone detected !");
                    droneInfo.parcels = droneInfo.parcels || []
                    droneInfo.parcels = [...droneInfo.parcels, ...parcelsAroundDrone]
                    const data = JSON.stringify({ teamId: droneInfoKey.name, droneInfo, event: 'PARCEL_GRABBED' });
                    console.log(`will send to topic : ${data}`)
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
                    // Envoyer un event DESTINATION_REACHED dans le topic drone-events
                    // TODO: pq ne pas envoyer directement un attribut droneInfo plutôt que location ?
                    const data = JSON.stringify({ teamId: droneInfoKey.name, location: droneInfo.location, event: 'DESTINATION_REACHED' });
                    console.log(`will send to topic : ${data}`)
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
            } catch (err) {
                console.log(`checkParcelAround error: ${err}`);
            }


        } else {
            // Continue moving to destination
            bearing = turf.bearing(currentLocation, dest);
            console.log(`bearing for team ${JSON.stringify(droneInfo[datastore.KEY])}: ${bearing}`);
            var destination = turf.destination(currentLocation, DISTANCE_PER_TICK, bearing, {});
            console.log(`next point is: ${JSON.stringify(destination)}`);
            droneInfo.location.latitude = destination.geometry.coordinates[0];
            droneInfo.location.longitude = destination.geometry.coordinates[1];

            const data = JSON.stringify({ teamId: droneInfoKey.name, location: droneInfo.location, command: droneInfo.command, event: 'MOVING' });
            console.log(`will send to topic : ${data}`)
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
        upsertDrone(droneInfo);
    });

    await Promise.all(jobs);

    res.send('query datastore and require turf');


};

const droneAsReachItsDestination = (distanceToDestination) => {
    return distanceToDestination < DISTANCE_PER_TICK;
}

const upsertDrone = (droneInfo) => {
    const droneInfoKey = droneInfo[datastore.KEY];
    console.log(`-- droneInfoKey : ${JSON.stringify(droneInfoKey)}`);
    const droneInfoEntity = {
        key: droneInfoKey,
        data: {
            command: droneInfo.command,
            location: droneInfo.location,
            parcels: droneInfo.parcels
        },
    };

    datastore
        .upsert(droneInfoEntity)
        .then(() => {
            console.log(`DroneInfo entity with id ${droneInfoKey.name} upserted successfully.`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}

const checkParcelAround = async (droneLocation, teamId) => {
    console.log(`checking parcels around the point for teamId: ${teamId} and location ${JSON.stringify(droneLocation)}`);
    let parcelsResult = [];

    const droneLocationPoint = turf.point([droneLocation.latitude, droneLocation.longitude]);

    const query = datastore
        .createQuery('Parcel')
        .filter('teamId', teamId);

    try {

        console.log('running query');
        const results = await datastore.runQuery(query);
        const parcels = results[0];
        console.log(`parcels before filter=${JSON.stringify(parcels)}`);
        parcelsResult = parcels
            .filter(p => {
                const parcelPickupLocationPoint = turf.point([p.location.pickup.latitude, p.location.pickup.longitude]);
                const distance = turf.distance(droneLocationPoint, parcelPickupLocationPoint, {});
                console.log(`distance (${distance}) < DISTANCE_PER_TICK (${DISTANCE_PER_TICK}) = ${distance < DISTANCE_PER_TICK}`);
                return distance < DISTANCE_PER_TICK;
            })
            .map(p => {
                p.parcelId = p[datastore.KEY].name;
                return p;
            });

        console.log(`parcelsResult=${JSON.stringify(parcelsResult)}`);
    } catch (err) {
        console.error(`checkParcelAround : Oups cannot get data for teamId ${teamId}`, err);
    }

    return parcelsResult;
} 