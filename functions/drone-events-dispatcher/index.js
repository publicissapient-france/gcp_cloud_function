// const PubSub = require(`@google-cloud/pubsub`);
//
// const pubsub = new PubSub();

exports.droneEventDispatcher = (data, context, callback) => {
    const message = Buffer.from(data, 'base64').toString();

    console.log("event received " + message);

    callback();
};

// const publishInTeamTopic = (teamId, droneInfo, dataBuffer) => {
//     if (droneInfo && droneInfo.topic && droneInfo.topic.url) {
//         console.log(`publish event to team topic ${droneInfo.topic.url}.`);
//         try {
//             pubsub
//                 .topic(droneInfo.topic.url)
//                 .publisher()
//                 .publish(dataBuffer)
//                 .then(messageId => {
//                     console.log(`Message ${messageId} published in team topic ${droneInfo.topic.url}.`);
//                 })
//                 .catch(err => {
//                     console.error('ERROR:', err);
//                 });
//         } catch (err) {
//             console.error(`publishOnTeamTopic : Oups cannot publish event for teamId ${teamId} and droneInfo ${JSON.stringify(droneInfo, null, 2)}`, err);
//         }
//     } else {
//         console.log(`team ${teamId} has no topic set.`);
//     }
// };
