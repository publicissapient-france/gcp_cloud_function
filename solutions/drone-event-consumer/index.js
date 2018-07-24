const PubSub = require('@google-cloud/pubsub');

exports.droneEventConsumer = (req, res) => {
  // init pubsub
  const pubsubClient = new PubSub();

  const topicName = 'projects/jbc-atl-sal-func-techevent/topics/drone-command';
  const topic = pubsubClient.topic(topicName);
  const publisher = topic.publisher();

  // message
  const teamId = 'blue';
  const name = 'READY';
  // const command = 'MOVE';
  const message = {
    teamId,
    command: {
      name,
      // location : {
      //   latitude : 45.3534,
      //   longitude : 2.3535
      // }
    }
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
