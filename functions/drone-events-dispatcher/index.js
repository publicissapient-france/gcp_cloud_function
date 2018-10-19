const PubSub = require('@google-cloud/pubsub');
const Datastore = require('@google-cloud/datastore');
const { get } = require('lodash');
const fetch = require('node-fetch');

const pubsub = new PubSub();
const datastore = new Datastore({});

exports.droneEventsDispatcher = async (message, context) => {
    const data = JSON.parse(Buffer.from(message.data, 'base64').toString());
    console.log('event received with data: ', data);

    await publishInTeamTopic(data);
    console.log('end -- ');
};

const publishInTeamTopic = async (data) => {
    const teamId = data.teamId;
    const teamTopicUrl = get(data.droneInfo, 'topicUrl');
    if (teamTopicUrl.startsWith("projects")) {
      console.log(`[${teamId}][publishInTeamTopic] will publish event to team topic ${teamTopicUrl}.`);
      try {
        const dataBuffer = Buffer.from(JSON.stringify(data));

        const messageId = await pubsub.topic(teamTopicUrl).publisher().publish(dataBuffer);

        console.log(`[${teamId}][publishInTeamTopic] Message ${messageId} published in team topic ${teamTopicUrl}.`);
      } catch (err) {
        console.error(`[${teamId}][publishInTeamTopic] Oups cannot publish event to ${teamTopicUrl} and data: ${JSON.stringify(data, null, 2)}`, err);
        await updateDroneInfoEvent(teamId, 'READY_FAILED');
      }
    } else if (teamTopicUrl.startsWith("http")) {
      console.log(`[${teamId}][publishInTeamTopic] will post event to team url ${teamTopicUrl}.`);
      try {
        await fetch(teamTopicUrl, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error(`[${teamId}][publishInTeamTopic] Oups cannot post event to ${teamTopicUrl} and data: ${JSON.stringify(data, null, 2)}`, err);
      }
    } else {
        console.log(`[${teamId}][publishInTeamTopic] has no topic set.`);
    }
};


const updateDroneInfoEvent = async (teamId, eventName) => {
    console.log(`[${teamId}][updateDroneInfoEvent]`);
    try {
        const droneInfoKey = datastore.key(['DroneInfo', teamId]);
        const droneInfoFromDB = await findDroneByKey(droneInfoKey);

        const data = {
            ...droneInfoFromDB,
            command: { name: eventName },
        };

        if (eventName === 'READY_FAILED' && data.topicUrl) {
            delete data.topicUrl;
        }

        const droneInfoEntity = {
            key: droneInfoKey,
            data: droneInfoFromDB
        };

        datastore.upsert(droneInfoEntity);
        console.log(`[${teamId}][updateDroneInfoEvent] DroneInfo entity with id ${teamId} upserted successfully.`);

    } catch (err) {
        console.error(`[${teamId}][updateDroneInfoEvent] error:  ${err}`);
    }
};

const findDroneByKey = async (droneInfoKey) => {
    const resultFromDB = await datastore.get(droneInfoKey);
    return resultFromDB[0];
};