const PubSub = require('@google-cloud/pubsub');
const Datastore = require('@google-cloud/datastore');
const { get } = require('lodash');

const pubsub = new PubSub();
const datastore = new Datastore({});

exports.droneEventsDispatcher = async (message, context) => {
    const data = JSON.parse(Buffer.from(message.data, 'base64').toString());
    console.log('event received with data: ', data);

    await publishInTeamTopic(data);
};

const publishInTeamTopic = async (data) => {
    const teamId = data.teamId;
    const teamTopicUrl = get(data.droneInfo, 'command.topicUrl');
    if (teamTopicUrl) {
        console.log(`publish event to team topic ${teamTopicUrl}.`);
        try {
            const dataBuffer = Buffer.from(JSON.stringify(data));

            const messageId = await pubsub.topic(teamTopicUrl).publisher().publish(dataBuffer);

            console.log(`Message ${messageId} published in team topic ${teamTopicUrl}.`);
        } catch (err) {
            console.error(`Cannot push to ${teamTopicUrl}`, err);
            console.error(`publishOnTeamTopic : Oups cannot publish event for teamId ${teamId} and droneInfo ${JSON.stringify(data, null, 2)}`, err);
            await updateDroneInfoEvent(teamId, 'READY_FAILED');
        }
    } else {
        console.log(`team ${teamId} has no topic set.`);
    }
};


const updateDroneInfoEvent = async (teamId, eventName) => {
    try {
        const droneInfoKey = datastore.key(['DroneInfo', teamId]);
        const droneInfoFromDB = await findDroneByKey(droneInfoKey);

        const data = Object.assign(droneInfoFromDB, { command: { name: eventName } });

        const droneInfoEntity = {
            key: droneInfoKey,
            data
        };

        datastore.upsert(droneInfoEntity);
        console.log(`DroneInfo entity with id ${teamId} upserted successfully.`);

    } catch (err) {
        console.error('ERROR:', err);
    }
};

const findDroneByKey = async (droneInfoKey) => {
    const resultFromDB = await datastore.get(droneInfoKey);
    return resultFromDB[0];
};