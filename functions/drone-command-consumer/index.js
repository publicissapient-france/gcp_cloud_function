const Datastore = require('@google-cloud/datastore');

// creates datastore client
const datastore = new Datastore({});

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event The Cloud Functions event.
 * @param {!Function} The callback function.
 */
exports.droneCommandConsumer = async (event, context) => {
    try {
        // The Cloud Pub/Sub Message object.
        const pubsubMessage = event.data;

        const message = Buffer.from(pubsubMessage, 'base64').toString();

        console.log("message received " + message);

        const jsonMsg = JSON.parse(message);
        console.log(`jsonMsg.command = ${JSON.stringify(jsonMsg.command)}`);

        const droneInfoKey = datastore.key(['DroneInfo', jsonMsg.teamId]);
        const droneInfoFromDB = await findDroneByKey(droneInfoKey);
        console.log(`receiveid drone: ${JSON.stringify(droneInfoFromDB)}`);

        droneInfoFromDB.command = jsonMsg.command;
        await updateDrone(droneInfoFromDB);

    } catch (err) {
        console.log('error', err)
    }

};

const findDroneByKey = async (droneInfoKey) => {
    const resultFromDB = await datastore.get(droneInfoKey);
    return resultFromDB[0];
};

const updateDrone = async (droneInfo) => {
    const droneInfoKey = droneInfo[datastore.KEY];

    const droneInfoEntity = {
        key: droneInfoKey,
        data: droneInfo,
    };
    console.log(`will update drone with this: ${JSON.stringify(droneInfoEntity)}`);
    await datastore.upsert(droneInfoEntity);
}
