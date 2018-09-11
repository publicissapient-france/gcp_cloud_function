// Imports the Google Cloud client library
const PubSub = require(`@google-cloud/pubsub`);

// Creates a client
const pubsub = new PubSub();

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.onDroneEvent = (event, context) => {
    const pubsubMessage = event.data;
    console.log('receive', Buffer.from(pubsubMessage, 'base64').toString());

    if (event.event === 'INIT') {
        sendCommand({
            name: 'READY',
            topicUrl: 'projects/tchampion-drone-challenge/topics/tchampion-drone-msg'
        });
    }
};

function sendCommand(command) {
    return sendServerJSON({
        "team": "yellow-277",
        "command": command
    });
}

function sendServerJSON(data) {
    const json = JSON.stringify(data);

    console.log('send', json);

    return sendServer(json);
}

function sendServer(data) {
    return send('projects/jbc-atl-sal-func-techevent/topics/drone-command', data);
}

function send(topic, data) {
    const dataBuffer = Buffer.from(data);

    return pubsub
        .topic(topic)
        .publisher()
        .publish(dataBuffer)
        .then(messageId => {
            console.log(`Message ${messageId} published.`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}