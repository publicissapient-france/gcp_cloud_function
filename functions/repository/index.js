const Datastore = require('@google-cloud/datastore');

// creates datastore client
const datastore = new Datastore({});


exports.upsert = (droneInfo) => {

    console.log('--- in the repository');

    // const droneInfoKey = datastore.key(['DroneInfo', jsonMsg.teamId]);

    // const droneInfoEntity = {
    //     key: droneInfoKey,
    //     data: {
    //         command: jsonMsg.command,
    //         location: jsonMsg.location
    //     },
    // };

    // datastore
    //     .upsert(droneInfoEntity)
    //     .then(() => {
    //         console.log(`DroneInfo entity with id ${jsonMsg.teamId} upserted successfully.`);
    //         // Don't forget to call the callback.
    //         res.status(200).end();
    //     })
    //     .catch(err => {
    //         console.error('ERROR:', err);
    //         callback(new Error(err));
    //     });

};
