const Datastore = require('@google-cloud/datastore');

// creates datastore client
const datastore = new Datastore({});

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event The Cloud Functions event.
 * @param {!Function} The callback function.
 */
exports.droneCommandConsumer = (event, callback) => {
    try {
        // The Cloud Pub/Sub Message object.
        const pubsubMessage = event.data;

        const message = Buffer.from(pubsubMessage.data, 'base64').toString();

        console.log("message received " + message);

        const jsonMsg = JSON.parse(message);
        const droneInfoKey = datastore.key(['DroneInfo', jsonMsg.teamId]);

        console.log(`jsonMsg.command = ${JSON.stringify(jsonMsg.command)}`);

        getDroneInfoByKey(droneInfoKey)
            .then((droneInfo) => updateDroneInfo(droneInfoKey, droneInfo, jsonMsg.command))
            .then(() => {
                console.log(`DroneInfo entity with key ${JSON.stringify(droneInfoKey)} upserted successfully.`);
                // Don't forget to call the callback.
                callback();
            })
            .catch(err => {
                console.error('ERROR:', err);
                callback(new Error(err));
            });

    } catch (err) {
        console.error('ERROR:', err);
        callback(new Error(err));
    }
};

getDroneInfoByKey = (key) => {
    console.log("getDroneInfoByKey");
    const query = datastore
        .createQuery('DroneInfo')
        .filter('__key__', '>', key);

    return datastore.runQuery(query)
        .then(results => {
            if (results[0] && results[0].length == 1) {
                console.log("getDroneInfoByKey return result");
                return results[0][0];
            } else {
                return undefined;
            }
        });
}

updateDroneInfo = (key, droneInfo = {}, command) => {
    console.log(`updateDroneInfo key = ${JSON.stringify(key)}`);
    console.log(`updateDroneInfo droneInfo = ${JSON.stringify(droneInfo)}`);
    console.log(`updateDroneInfo command = ${JSON.stringify(command)}`);

    droneInfo['command'] = command;
    console.log(`updateDroneInfo droneInfo bis = ${JSON.stringify(droneInfo)}`);

    const droneInfoEntity = {
        key: key,
        data: droneInfo,
    };

    console.log(`updateDroneInfo droneInfoEntity = ${JSON.stringify(droneInfoEntity)}`);

    return datastore
        .upsert(droneInfoEntity);
}
