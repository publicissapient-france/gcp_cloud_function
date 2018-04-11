const PubSub = require('@google-cloud/pubsub');

const pubsub = new PubSub();
const topic = pubsub.topic('my-topic');
const publisher = topic.publisher();


/**
 * Background Cloud Function to be triggered by Pub/Sub.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
exports.parcelConsumer = (event, callback) => {
    const pubsubMessage = event.data;
    const rawData = pubsubMessage.data ? Buffer.from(pubsubMessage.data, 'base64').toString() : 'World';

    console.log(`rawData = ${rawData}`);
  
  	const json = JSON.parse(rawData);
  
    console.log(`json.status = ${json.status}`);
  
    const dataToPublish = Buffer.from(JSON.stringify(json));

    publisher.publish(dataToPublish);

    callback();
  };
