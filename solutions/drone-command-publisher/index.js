const PubSub = require('@google-cloud/pubsub');

exports.droneCommandPublisher = (req, res) => {
    // init pubsub
    const pubsubClient = new PubSub();

    const topicName = 'projects/jbc-atl-sal-func-techevent/topics/drone-command';
    const topic = pubsubClient.topic(topicName);
    const publisher = topic.publisher();

    // message
    const teamId = 'blue';
    const message = {
        teamId,
        command: {
            // name: 'MOVE',
            // location: {
            //     //   latitude : 45.3534,
            //     //   longitude : 2.3535
            //     // Xebia
            //     latitude: 48.8753487,
            //     longitude: 2.3088396,
            // },
            name: 'READY',
            topic: {
                url: 'projects/modulom-moludom/topics/drone-events'
            },
        },
    };
    const dataToPublish = Buffer.from(JSON.stringify(message));

    publisher
        .publish(dataToPublish)
        .then(messageId => {
            console.log(`Message ${messageId} has been published in topic`);
            res.send(message);
        })
        .catch(err => {
            console.error('ERROR:', err);
            res.status(500).send(new Error('Error when trying to publish event in Drone Command topic'));
        });
};
