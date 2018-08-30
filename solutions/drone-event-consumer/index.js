const atob = require('atob');

exports.droneEventConsumer = (message, context, callback) => {
    const data = atob(message.data);
    console.log('event received with data: ', data);

    callback();
};

