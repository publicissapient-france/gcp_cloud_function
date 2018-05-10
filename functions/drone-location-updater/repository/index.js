const Datastore = require('@google-cloud/datastore');

// creates datastore client
const datastore = new Datastore({});


exports.upsert = (droneInfo) => {

    console.log('--- in the repository');

    const droneInfoKey = datastore.key(['DroneInfo', droneInfo.teamId]);

    const droneInfoEntity = {
        key: droneInfoKey,
        data: {
            command: droneInfo.command,
            location: droneInfo.location
        },
    };

    datastore
        .upsert(droneInfoEntity)
        .then(() => {
            console.log(`DroneInfo entity with id ${jsonMsg.teamId} upserted successfully.`);
            // Don't forget to call the callback.
            res.status(200).end();
        })
        .catch(err => {
            console.error('ERROR:', err);
            callback(new Error(err));
        });

};
