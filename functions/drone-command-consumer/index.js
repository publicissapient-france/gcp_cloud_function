const Datastore = require('@google-cloud/datastore');

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event The Cloud Functions event.
 * @param {!Function} The callback function.
 */
exports.subscribe = (event, callback) => {
    // creates datastore client
    const datastore = new Datastore({});
    const statusKey = datastore.key('Status')

    // The Cloud Pub/Sub Message object.
    const pubsubMessage = event.data;

    const message = Buffer.from(pubsubMessage.data, 'base64').toString();

    console.log("message to send " + message);

    const status = {
        key: statusKey,
        data: [
            {
                name: 'status',
                value: message
            }
        ],
    };

    datastore
        .save(status)
        .then(() => {
            console.log(`Status ${statusKey.id} created successfully.`);
            // Don't forget to call the callback.
            callback();
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
};
