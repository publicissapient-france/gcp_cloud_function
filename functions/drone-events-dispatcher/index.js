const PubSub = require(`@google-cloud/pubsub`);
const { get } = require('lodash');

const pubsub = new PubSub();

exports.droneEventsDispatcher = (message, context, callback) => {
    const data = JSON.parse(Buffer.from(message.data, 'base64').toString());
    console.log('event received with data: ', data);

    publishInTeamTopic(data, message.data);
    callback();
};

const publishInTeamTopic = (data) => {
    const teamId = data.teamId;
    const teamTopicUrl =  get(data, 'droneInfo.topic.url');
    if (teamTopicUrl) {
        console.log(`publish event to team topic ${teamTopicUrl}.`);
        try {
            const dataBuffer = Buffer.from(JSON.stringify(data));
            pubsub
                .topic(teamTopicUrl)
                .publisher()
                .publish(dataBuffer)
                .then(messageId => {
                    console.log(`Message ${messageId} published in team topic ${teamTopicUrl}.`);
                })
                .catch(err => {
                    console.error('ERROR:', err);
                });
        } catch (err) {
            console.error(`publishOnTeamTopic : Oups cannot publish event for teamId ${teamId} and droneInfo ${JSON.stringify(data, null, 2)}`, err);
        }
    } else {
        console.log(`team ${teamId} has no topic set.`);
    }
};
