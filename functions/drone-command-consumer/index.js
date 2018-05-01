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
    const droneInfoKey = datastore.key([ 'DroneInfo', jsonMsg.teamId]);
    
    const droneInfoEntity = {
        key: droneInfoKey,
        data: {
            command: jsonMsg.command
        },
    };

    datastore
        .upsert(droneInfoEntity)
        .then(() => {
            console.log(`DroneInfo entity with id ${jsonMsg.teamId} upserted successfully.`);
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

function toDatastore (obj, nonIndexed) {
    nonIndexed = nonIndexed || [];
    const results = [];
    Object.keys(obj).forEach((k) => {
      if (obj[k] === undefined) {
        return;
      }
      results.push({
        name: k,
        value: obj[k],
        excludeFromIndexes: nonIndexed.indexOf(k) !== -1
      });
    });
    return results;
  }
