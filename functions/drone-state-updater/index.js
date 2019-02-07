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
        console.log(`[${teamId}][getJobsDroneWaitingForCommand] droneInfo before update : ${JSON.stringify(droneInfo)}`);

        const data = { teamId, droneInfo, event: 'WAITING_FOR_COMMAND' };
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
            const data = { teamId, droneInfo, event: 'WAITING_FOR_COMMAND' };
            publishInTopic(data, topicName, teamId);
        }

        await upsertDrone(droneInfo);
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
            const data = { teamId, droneInfo, event: 'MOVE_LOCATION_ERROR' };
            publishInTopic(data, topicName, teamId);
        } else {
            await moveDrone(droneInfo, teamId);
        }
        await upsertDrone(droneInfo);
    });
};

const removeParcelFromDrone = (droneInfo, deliveredParcel) => {
    droneInfo.parcels = droneInfo.parcels.filter(parcel => parcel.parcelId !== deliveredParcel.parcelId);
};

const updateDroneScore = (droneInfo, deliveredParcel) => {
    droneInfo.score = droneInfo.score || 0;
    droneInfo.score = droneInfo.score + deliveredParcel.score;
};

const publishInTopic = async (message, topicName, teamId = "unknownTeam") => {
    const availableParcelsForTeam = await getAllAvailableParcelsForTeam(teamId);
    console.log(`[${teamId}][publishInTopic] availableParcelsForTeam ${JSON.stringify(availableParcelsForTeam)}`);
    message.availableParcelsForTeam = availableParcelsForTeam;
    const data = JSON.stringify(message);
    console.log(`[${teamId}][publishInTopic] will send to topic ${topicName} : ${data}`);
    const dataBuffer = Buffer.from(data);
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

const droneHasReachItsDestination = (distanceToDestination, droneInfo) => {
    return distanceToDestination < getDistancePerTickForDrone(droneInfo);
};

const getDistancePerTickForDrone = (droneInfo) => {
  droneInfo.distancePerTick = droneInfo.distancePerTick || DISTANCE_PER_TICK;
  const teamId = getTeamId(droneInfo);
  // for each parcel carried by the drone there is a negative impact on the drone speed
  const handicap = droneInfo.parcels && droneInfo.parcels.length > 0
    ? droneInfo.parcels
        .map((parcel) => parcel.score/10000)
        .reduce((acc, score) => acc + score, 0)
    : 0;
  const distancePerTickWithHandicap = droneInfo.distancePerTick - handicap;
  console.log(`[${teamId}][getDistancePerTickForDrone] distancePerTick=${droneInfo.distancePerTick} | distancePerTickWithHandicap=${distancePerTickWithHandicap} (with handicap for each parcel carried)`);
  return distancePerTickWithHandicap;
};


const searchIfALocationForADelivery = (droneInfo) => {
    const teamId = getTeamId(droneInfo);
    console.log(`[${teamId}][searchIfALocationForADelivery]`);
    if (droneInfo.parcels) {
        for (let i = 0; i < droneInfo.parcels.length; i++) {
            const parcel = droneInfo.parcels[i];
            if (areCloseToEAchOther(droneInfo.location, parcel.location.delivery, getDistancePerTickForDrone(droneInfo))) {
                console.log(`[${teamId}][searchIfALocationForADelivery] => true`);
                return parcel;
            }
        }
    }
    return undefined;
};

const upsertDrone = async (droneInfo) => {
    const teamId = getTeamId(droneInfo);
    console.log(`[${teamId}][upsertDrone]`);
    const droneInfoKey = droneInfo[datastore.KEY];
    const droneInfoEntity = {
        key: droneInfoKey,
        data: droneInfo,
    };

    try {
        await datastore.upsert(droneInfoEntity);
        console.log(`[${teamId}][upsertDrone] DroneInfo entity upserted successfully.`);
    } catch (err) {
        console.error(`[${teamId}][upsertDrone] error`, err);
    }
};

const getAllAvailableParcelsForTeam = async (teamId) => {
    console.log(`[${teamId}][getAllAvailableParcelsForTeam] start`);
    let parcelsResult = [];

    const queryTeam = datastore
        .createQuery('Parcel')
        .filter('teamId', '=', teamId)
        .filter('status', '=', 'AVAILABLE');

    const queryAll = datastore
        .createQuery('Parcel')
        .filter('teamId', '=', 'all')
        .filter('status', '=', 'AVAILABLE');

    try {
        const resultsTeam = datastore.runQuery(queryTeam);
        const resultsAll = datastore.runQuery(queryAll);
        const results = await Promise.all([resultsTeam, resultsAll]);
        parcelsResult = [...results[0][0], ...results[1][0]];
        console.log(`[${teamId}][getAllAvailableParcelsForTeam] parcelsResult= ${JSON.stringify(parcelsResult)}`);
    } catch (err) {
        console.error(`[${teamId}][getAllAvailableParcelsForTeam] error`, err);
    }
    return parcelsResult;
}

const checkParcelAround = async (droneInfo, teamId) => {
    const droneLocation = droneInfo.location;
    console.log(`[${teamId}][checkParcelAround] checking parcels around location ${JSON.stringify(droneLocation)}`);
    let parcelsResult = [];
    try {
        const parcels = await getAllAvailableParcelsForTeam(teamId);
        console.log(`[${teamId}][checkParcelAround] parcels before filter=${JSON.stringify(parcels)}`);
        parcelsResult = parcels
            .filter(p => {
                return areCloseToEAchOther(droneLocation, p.location.pickup, getDistancePerTickForDrone(droneInfo));
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

const areCloseToEAchOther = (itemALocation, itemBLocation, distancePerTick) => {
    const itemATurfLocation = turf.point([itemALocation.latitude, itemALocation.longitude]);
    const itemBTurfLocation = turf.point([itemBLocation.latitude, itemBLocation.longitude]);
    const distance = turf.distance(itemATurfLocation, itemBTurfLocation, {});
    return distance < distancePerTick;
};

const isCommandValid = (command = []) => some(COMMANDS, (entry) => entry === command);

const moveDrone = async function (droneInfo, teamId) {
    const currentLocation = turf.point([droneInfo.location.latitude, droneInfo.location.longitude]);
    const dest = turf.point([droneInfo.command.location.latitude, droneInfo.command.location.longitude]);
    const distance = turf.distance(currentLocation, dest, {});

    if (droneHasReachItsDestination(distance, droneInfo)) {
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

                // const data = { teamId, droneInfo, event: 'PARCEL_DELIVERED' };
                const data = { teamId, droneInfo, event: 'WAITING_FOR_COMMAND' };
                publishInTopic(data, topicName, teamId);
            } else {
                const parcelsAroundDrone = await checkParcelAround(droneInfo, teamId);
                if (parcelsAroundDrone && parcelsAroundDrone.length > 0) {
                    console.log(`[${teamId}][moveDrone] Parcel around drone detected !`);

                    // handle speedboost parcels
                    const speedBoostParcels = parcelsAroundDrone.filter(parcel => parcel.type === "SPEED_BOOST");
                    speedBoostParcels.forEach(parcel => {
                        droneInfo.distancePerTick = droneInfo.distancePerTick + parcel.score;
                        deleteParcel(parcel.parcelId);
                    });

                    // Handle classic parcels:
                    const classicParcels = parcelsAroundDrone.filter(parcel => parcel.type === "CLASSIC");
                    droneInfo.parcels = droneInfo.parcels || [];
                    droneInfo.parcels = [...droneInfo.parcels, ...classicParcels];
                    // const data = { teamId, droneInfo, event: 'PARCEL_GRABBED' };
                    const data = { teamId, droneInfo, event: 'WAITING_FOR_COMMAND' };
                    await updateParcelStatus(parcelsAroundDrone, 'GRABBED');

                    publishInTopic(data, topicName, teamId);
                } else {
                    // const data = { teamId, droneInfo, event: 'DESTINATION_REACHED' };
                    const data = { teamId, droneInfo, event: 'WAITING_FOR_COMMAND' };

                    publishInTopic(data, topicName, teamId);
                }
            }

        } catch (err) {
            console.error(`[${teamId}][moveDrone] error: ${err}`);
        }

    } else {
        // Continue moving to destination
        const bearing = turf.bearing(currentLocation, dest);
        console.log(`[${teamId}][moveDrone] bearing for team: ${bearing}`);
        const destination = turf.destination(currentLocation, getDistancePerTickForDrone(droneInfo), bearing, {});
        console.log(`[${teamId}][moveDrone] next point is: ${JSON.stringify(destination)}`);
        droneInfo.location.latitude = destination.geometry.coordinates[0];
        droneInfo.location.longitude = destination.geometry.coordinates[1];
        const data = { teamId, droneInfo, event: 'MOVING' };

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