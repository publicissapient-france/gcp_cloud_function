exports.droneEventDispatcher = (data, context, callback) => {
    const message = Buffer.from(data, 'base64').toString();

    console.log("event received " + message);

    callback();
};

