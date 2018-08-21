const PubSub = require('@google-cloud/pubsub');

exports.consoleConsumer = (pubSubMessage, context) => {

    console.log(decodeBase64(pubSubMessage.data));

};

decodeBase64 = (data) => {
    return Buffer.from(data, 'base64').toString();
}