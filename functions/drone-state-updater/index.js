const Datastore = require('@google-cloud/datastore');
const PubSub = require(`@google-cloud/pubsub`);
const turf = require('@turf/turf');
const { get, some } = require('lodash');

const datastore = new Datastore({});
const pubsub = new PubSub();

const topicName = 'projects/jbc-atl-sal-func-techevent/topics/drone-events';
const DISTANCE_PER_TICK = 0.1;
const DEFAULT_LATITUDE = 48.8753487;
const DEFAULT_LONGITUDE = 2.3088396;
const COMMANDS = ['MOVE', 'READY'];

exports.droneStateUpdater = async (req, res) => {
    console.log('read from datastore with filter and require turf');

    const droneReadyInfos = await getDroneInfosForCommand('READY');
    const droneMoveInfos = await getDroneInfosForCommand('MOVE');
    const dronesWithNoCommand = await getDroneInfosWithNoCommand();

    console.log(`dronesWithNoCommand=${dronesWithNoCommand}`);

    let readyJobs;
    let moveJobs;
    let waitingForCommandJobs;

    if (droneReadyInfos) {
        readyJobs = await getJobsDroneReady(droneReadyInfos) || [];
    }
    if (droneMoveInfos) {
        moveJobs = await getJobsDroneMove(droneMoveInfos) || [];
    }
    if (dronesWithNoCommand) {
        waitingForCommandJobs = await getJobsDroneWaitingForCommand(dronesWithNoCommand) || [];
    }

    await Promise.all([
        ...readyJobs,
        ...moveJobs,
        ...waitingForCommandJobs,
    ]);

    // TODO improve response?
    res.send('query datastore and require turf');
};

const getDroneInfosForCommand = async (command) => {
    if (!isCommandValid(command)) {
        console.error(`Command is not valid for: ${command}`);
        return null;
    }
    const query = datastore
        .createQuery('DroneInfo')
        .filter('command.name', '=', command);

    const dronesQueryResults = await datastore.runQuery(query);
    if (!dronesQueryResults) {
        console.error(`No result found for: ${command}`);
    }
    // entities found.
    return dronesQueryResults[0];
};

const getDroneInfosWithNoCommand = async () => {
    const query = datastore
        .createQuery('DroneInfo');

    const dronesQueryResults = await datastore.runQuery(query);
    if (!dronesQueryResults) {
        console.error(`No result found for: ${command}`);
    }

    const allDrones = dronesQueryResults[0];
    return allDrones.filter(d => d.command === undefined);
};

const getJobsDroneWaitingForCommand = async (droneInfos) => {
    console.log('drone waiting for a command:');
    return droneInfos.map(async (droneInfo = {}) => {
        console.log('---------------');
        console.log(`-- droneInfo before update : ${JSON.stringify(droneInfo)}`);
        const droneInfoKey = droneInfo[datastore.KEY];
        const teamId = droneInfoKey.name;

        const data = JSON.stringify({ teamId, droneInfo, event: 'WAITING_FOR_COMMAND' });
        publishInTopic(data, topicName);
    });
};

const getJobsDroneReady = async (droneInfos) => {
    console.log('drone ready info:');
    return droneInfos.map(async (droneInfo = {}) => {
        console.log(`-- droneInfo before update : ${JSON.stringify(droneInfo)}`);
        const droneInfoKey = droneInfo[datastore.KEY];
        const teamId = droneInfoKey.name;

        const teamTopicUrl = get(droneInfo, 'command.topicUrl');
        if (!teamTopicUrl) {
            console.error(`No topic url found for team ${teamId}`);
            droneInfo.command = { name: 'NO_TOPIC_URL_FOUND' };
        } else {
            const data = JSON.stringify({ teamId, droneInfo, event: 'WAITING_FOR_COMMAND' });
            publishInTopic(data, topicName);
        }

        upsertDrone(droneInfo);
    });
};

const getJobsDroneMove = async (droneInfos, teamId) => {
    console.log('drone move info:');
    return droneInfos.map(async (droneInfo = {}) => {
        console.log('---------------');
        console.log(`-- droneInfo before update : ${JSON.stringify(droneInfo)}`);
        const droneInfoKey = droneInfo[datastore.KEY];
        const teamId = droneInfoKey.name;

        // Set default location
        droneInfo = {
            ...droneInfo,
            location: {
                ...droneInfo.location,
                latitude: get(droneInfo, 'location.latitude') || DEFAULT_LATITUDE,
                longitude: get(droneInfo, 'location.longitude') || DEFAULT_LONGITUDE,
            },
        };

        if (
            droneInfo.command &&
            (!droneInfo.command.location || !droneInfo.command.location.latitude || !droneInfo.command.location.longitude)
        ) {
            const data = JSON.stringify({ teamId, droneInfo, event: 'MOVE_LOCATION_ERROR' });
            publishInTopic(data, topicName);
        } else {
            await moveDrone(droneInfo, teamId);
        }
        upsertDrone(droneInfo);
    });
};

const removeParcelFromDrone = (droneInfo, deliveredParcel) => {
    droneInfo.parcels = droneInfo.parcels.filter(parcel => parcel.parcelId !== deliveredParcel.parcelId);
};

const updateDroneScore = (droneInfo, deliveredParcel) => {
    droneInfo.score = droneInfo.score || 0;
    droneInfo.score = droneInfo.score + deliveredParcel.score;
};

const publishInTopic = (message, topicName) => {
    console.log(`will send to topic ${topicName} : ${message}`)
    const dataBuffer = Buffer.from(message);
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
};

const droneAsReachItsDestination = (distanceToDestination) => {
    return distanceToDestination < DISTANCE_PER_TICK;
};

const searchIfALocationForADelivery = (droneInfo) => {
    console.log('isALocationForADelivery');
    if (droneInfo.parcels) {
        for (i = 0; i < droneInfo.parcels.length; i++) {
            const parcel = droneInfo.parcels[i];
            if (areCloseToEAchOther(droneInfo.location, parcel.location.delivery)) {
                console.log('return true');
                return parcel;
            }
        }
    }
    return undefined;
};

const upsertDrone = (droneInfo) => {
    console.log(`-- droneInfo after update : ${JSON.stringify(droneInfo)}`);
    const droneInfoKey = droneInfo[datastore.KEY];
    console.log(`-- droneInfoKey : ${JSON.stringify(droneInfoKey)}`);
    const droneInfoEntity = {
        key: droneInfoKey,
        data: {
            command: droneInfo.command,
            location: droneInfo.location,
            parcels: droneInfo.parcels,
            topic: droneInfo.topic,
            score: droneInfo.score
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
};

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
                return areCloseToEAchOther(droneLocation, p.location.pickup);
                // const parcelPickupLocationPoint = turf.point([p.location.pickup.latitude, p.location.pickup.longitude]);
                // const distance = turf.distance(droneLocationPoint, parcelPickupLocationPoint, {});
                // console.log(`distance (${distance}) < DISTANCE_PER_TICK (${DISTANCE_PER_TICK}) = ${distance < DISTANCE_PER_TICK}`);
                // return distance < DISTANCE_PER_TICK;
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
};

const areCloseToEAchOther = (itemALocation, itemBLocation) => {
    const itemATurfLocation = turf.point([itemALocation.latitude, itemALocation.longitude]);
    const itemBTurfLocation = turf.point([itemBLocation.latitude, itemBLocation.longitude]);
    const distance = turf.distance(itemATurfLocation, itemBTurfLocation, {});
    console.log(itemALocation);
    console.log(itemBLocation);
    console.log(`distance = ${distance}`);
    return distance < DISTANCE_PER_TICK;
};

const isCommandValid = (command = []) => some(COMMANDS, (entry) => entry === command);

const moveDrone = async function (droneInfo, teamId) {
    const currentLocation = turf.point([droneInfo.location.latitude, droneInfo.location.longitude]);
    const dest = turf.point([droneInfo.command.location.latitude, droneInfo.command.location.longitude]);
    const distance = turf.distance(currentLocation, dest, {});

    if (droneAsReachItsDestination(distance)) {
        console.log('drone has arrived at destination');
        droneInfo.location.latitude = droneInfo.command.location.latitude;
        droneInfo.location.longitude = droneInfo.command.location.longitude;
        delete droneInfo.command;

        try {
            const deliveredParcel = searchIfALocationForADelivery(droneInfo);
            if (deliveredParcel.parcelId) {
                console.log('--- this is a location for a delivery');
                removeParcelFromDrone(droneInfo, deliveredParcel);
                updateDroneScore(droneInfo, deliveredParcel);

                const data = JSON.stringify({ teamId, droneInfo, event: 'PARCEL_DELIVERED' });
                publishInTopic(data, topicName);
            } else {
                const parcelsAroundDrone = await checkParcelAround(droneInfo.location, teamId);
                if (parcelsAroundDrone && parcelsAroundDrone.length > 0) {
                    console.log("Parcel around drone detected !");
                    droneInfo.parcels = droneInfo.parcels || [];
                    droneInfo.parcels = [...droneInfo.parcels, ...parcelsAroundDrone];
                    const data = JSON.stringify({ teamId, droneInfo, event: 'PARCEL_GRABBED' });

                    // TODO : supprimer le paquet de la base de données

                    publishInTopic(data, topicName);
                } else {
                    const data = JSON.stringify({ teamId, droneInfo, event: 'DESTINATION_REACHED' });

                    publishInTopic(data, topicName);
                }
            }

        } catch (err) {
            console.log(`error: ${err}`);
        }

    } else {
        // Continue moving to destination
        const bearing = turf.bearing(currentLocation, dest);
        console.log(`bearing for team ${JSON.stringify(droneInfo[datastore.KEY])}: ${bearing}`);
        const destination = turf.destination(currentLocation, DISTANCE_PER_TICK, bearing, {});
        console.log(`next point is: ${JSON.stringify(destination)}`);
        droneInfo.location.latitude = destination.geometry.coordinates[0];
        droneInfo.location.longitude = destination.geometry.coordinates[1];

        const data = JSON.stringify({
            teamId,
            location: droneInfo.location,
            command: droneInfo.command,
            event: 'MOVING'
        });

        publishInTopic(data, topicName);
    }
};
