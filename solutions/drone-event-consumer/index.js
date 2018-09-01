exports.droneEventConsumer = (message, context, callback) => {
    const data = JSON.parse(Buffer.from(message.data, 'base64').toString());

    console.log('event received with data: ', data);

    callback();
};

