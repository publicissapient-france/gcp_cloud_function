const Datastore = require('@google-cloud/datastore');
const PubSub = require(`@google-cloud/pubsub`);
const turf = require('@turf/turf');
const { get, some } = require('lodash');

const datastore = new Datastore({});
const pubsub = new PubSub();

const topicName = 'projects/jbc-atl-sal-func-techevent/topics/drone-events';
const DISTANCE_PER_TICK = 0.3;
const DEFAULT_LATITUDE = 48.8753487;
const DEFAULT_LONGITUDE = 2.3088396;
const COMMANDS = ['MOVE', 'READY'];

exports.droneStateUpdater = async (req, res) => {

    const droneReadyInfos = await getDroneInfosForCommand('READY');
    const droneMoveInfos = await getDroneInfosForCommand('MOVE');
    const dronesWithNoCommand = await getDroneInfosWithNoCommand();

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

    res.send(`drone state updated: ${JSON.stringify(process.env)}`);
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
    return droneInfos.map(async (droneInfo = {}) => {
        const teamId = getTeamId(droneInfo);
        console.log(`[${teamId}][getJobsDroneReady] droneInfo before update : ${JSON.stringify(droneInfo)}`);

        const data = JSON.stringify({ teamId, droneInfo, event: 'WAITING_FOR_COMMAND' });
        publishInTopic(data, topicName, teamId);
    });
};

const getJobsDroneReady = async (droneInfos) => {
    return droneInfos.map(async (droneInfo = {}) => {
        const teamId = getTeamId(droneInfo);
        console.log(`[${teamId}][getJobsDroneReady] droneInfo before update : ${JSON.stringify(droneInfo)}`);

        const teamTopicUrl = get(droneInfo, 'command.topicUrl');
        if (!teamTopicUrl) {
            console.error(`[${teamId}][getJobsDroneReady] No topic url found for team ${teamId}`);
            droneInfo.command = { name: 'NO_TOPIC_URL_FOUND' };
        } else {
            delete droneInfo.command;
            droneInfo.topicUrl = teamTopicUrl;
            const data = JSON.stringify({ teamId, droneInfo, event: 'WAITING_FOR_COMMAND' });
            publishInTopic(data, topicName, teamId);
        }

        upsertDrone(droneInfo);
    });
};

const getTeamId = (droneInfo) => {
  const droneInfoKey = droneInfo[datastore.KEY];
  return droneInfoKey.name;
}

const getJobsDroneMove = async (droneInfos) => {
    return droneInfos.map(async (droneInfo = {}) => {
        const teamId = getTeamId(droneInfo);
        console.log(`[${teamId}][getJobsDroneMove] droneInfo before update : ${JSON.stringify(droneInfo)}`);

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
            publishInTopic(data, topicName, teamId);
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

const publishInTopic = (message, topicName, teamId = "unknownTeam") => {
    console.log(`[${teamId}][publishInTopic] will send to topic ${topicName} : ${message}`)
    const dataBuffer = Buffer.from(message);
    pubsub
        .topic(topicName)
        .publisher()
        .publish(dataBuffer)
        .then(messageId => {
            console.log(`[${teamId}][publishInTopic] Message ${messageId} published.`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
};

const droneAsReachItsDestination = (distanceToDestination) => {
    return distanceToDestination < DISTANCE_PER_TICK;
};

const searchIfALocationForADelivery = (droneInfo) => {
    const teamId = getTeamId(droneInfo);
    console.log(`[${teamId}][searchIfALocationForADelivery]`);
    if (droneInfo.parcels) {
        for (let i = 0; i < droneInfo.parcels.length; i++) {
            const parcel = droneInfo.parcels[i];
            if (areCloseToEAchOther(droneInfo.location, parcel.location.delivery)) {
                console.log(`[${teamId}][searchIfALocationForADelivery] => true`);
                return parcel;
            }
        }
    }
    return undefined;
};

const upsertDrone = (droneInfo) => {
    const teamId = getTeamId(droneInfo);
    console.log(`[${teamId}][upsertDrone]`);
    const droneInfoKey = droneInfo[datastore.KEY];
    const droneInfoEntity = {
        key: droneInfoKey,
        data: droneInfo,
    };

    datastore
        .upsert(droneInfoEntity)
        .then(() => {
            console.log(`[${teamId}][upsertDrone] DroneInfo entity upserted successfully.`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
};

const checkParcelAround = async (droneLocation, teamId) => {
    console.log(`[${teamId}][checkParcelAround] checking parcels around location ${JSON.stringify(droneLocation)}`);
    let parcelsResult = [];

    const droneLocationPoint = turf.point([droneLocation.latitude, droneLocation.longitude]);

    const query = datastore
        .createQuery('Parcel')
        .filter('teamId', '=', teamId)
        .filter('status', '=', 'AVAILABLE');

    try {
        const results = await datastore.runQuery(query);
        const parcels = results[0];
        console.log(`[${teamId}][checkParcelAround] parcels before filter=${JSON.stringify(parcels)}`);
        parcelsResult = parcels
            .filter(p => {
                return areCloseToEAchOther(droneLocation, p.location.pickup);
            })
            .map(p => {
                p.parcelId = p[datastore.KEY].name;
                return p;
            });

        console.log(`[${teamId}][checkParcelAround] parcelsResult=${JSON.stringify(parcelsResult)}`);
    } catch (err) {
        console.error(`[${teamId}][checkParcelAround] checkParcelAround : Oups cannot get data for teamId ${teamId}`, err);
    }

    return parcelsResult;
};

const areCloseToEAchOther = (itemALocation, itemBLocation) => {
    const itemATurfLocation = turf.point([itemALocation.latitude, itemALocation.longitude]);
    const itemBTurfLocation = turf.point([itemBLocation.latitude, itemBLocation.longitude]);
    const distance = turf.distance(itemATurfLocation, itemBTurfLocation, {});
    return distance < DISTANCE_PER_TICK;
};

const isCommandValid = (command = []) => some(COMMANDS, (entry) => entry === command);

const moveDrone = async function (droneInfo, teamId) {
    const currentLocation = turf.point([droneInfo.location.latitude, droneInfo.location.longitude]);
    const dest = turf.point([droneInfo.command.location.latitude, droneInfo.command.location.longitude]);
    const distance = turf.distance(currentLocation, dest, {});

    if (droneAsReachItsDestination(distance)) {
        console.log(`[${teamId}][moveDrone] drone has arrived at destination`);
        droneInfo.location.latitude = droneInfo.command.location.latitude;
        droneInfo.location.longitude = droneInfo.command.location.longitude;
        delete droneInfo.command;

        try {
            const deliveredParcel = searchIfALocationForADelivery(droneInfo);
            console.log(`[${teamId}][moveDrone] deliveredParcel=${deliveredParcel}`);
            if (deliveredParcel && deliveredParcel.parcelId) {
                removeParcelFromDrone(droneInfo, deliveredParcel);
                updateDroneScore(droneInfo, deliveredParcel);

                deleteParcel(deliveredParcel.parcelId);

                const data = JSON.stringify({ teamId, droneInfo, event: 'PARCEL_DELIVERED' });
                publishInTopic(data, topicName, teamId);
            } else {
                console.log(`[${teamId}][moveDrone] will checkParcelAround`);
                const parcelsAroundDrone = await checkParcelAround(droneInfo.location, teamId);
                console.log(`[${teamId}][moveDrone] parcelsAroundDrone:${parcelsAroundDrone}`);
                if (parcelsAroundDrone && parcelsAroundDrone.length > 0) {
                    console.log(`[${teamId}][moveDrone] Parcel around drone detected !`);
                    droneInfo.parcels = droneInfo.parcels || [];
                    droneInfo.parcels = [...droneInfo.parcels, ...parcelsAroundDrone];
                    const data = JSON.stringify({ teamId, droneInfo, event: 'PARCEL_GRABBED' });

                    updateParcelStatus(parcelsAroundDrone, 'GRABBED');

                    publishInTopic(data, topicName, teamId);
                } else {
                    const data = JSON.stringify({ teamId, droneInfo, event: 'DESTINATION_REACHED' });

                    publishInTopic(data, topicName, teamId);
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

        publishInTopic(data, topicName, teamId);
    }
};

const deleteParcel = async (parcelId) => {
    console.log(`deleteParcel will delete parcel with Id ${parcelId}}`)
    const parcelKey = datastore.key(['Parcel', parcelId]);
    await datastore.delete(parcelKey);
};

const updateParcelStatus = async (parcels, status) => {
    parcels = parcels.map(async (parcel) => {
        parcel.status = status;
        const parcelKey = parcel[datastore.KEY];
        const parcelEntity = {
            key: parcelKey,
            data: parcel
        };

        try {
            await datastore.upsert(parcelEntity);
        } catch (err) {
            console.error(`Cannot update parcel with status ${status}`, err);
        }
    });
    await Promise.all(parcels);
};