const Datastore = require('@google-cloud/datastore');

// creates datastore client
const datastore = new Datastore({});

/**
 * Triggered from a message on a drone-events Topic
 * 
 * gcloud command to deploy:
 * gcloud beta functions deploy droneEventConsumer --trigger-resource drone-events --trigger-event google.pubsub.topic.publish
 *
 * @param {!Object} event The Cloud Functions event.
 * @param {!Function} The callback function.
 */
exports.droneEventConsumer = (event, callback) => {
    // The Cloud Pub/Sub Message object.
    const pubsubMessage = event.data;

    const message = Buffer.from(pubsubMessage.data, 'base64').toString();

    console.log("event received " + message);

    callback();
};
