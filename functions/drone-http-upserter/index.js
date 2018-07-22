const Datastore = require('@google-cloud/datastore');

// creates datastore client
const datastore = new Datastore({});

exports.droneHttpUpserter = (req, res) => {
    try {
        console.log(JSON.stringify(req.body));
        if (req.body.teamId === undefined) {
            res.status(400).send('No body with a teamId to upsert defined!');
        } else {
            // Everything is ok
            const jsonMsg = req.body;
            console.log('teamId=', jsonMsg.teamId);

            const droneInfoKey = datastore.key(['DroneInfo', jsonMsg.teamId]);

            const droneInfoEntity = {
                key: droneInfoKey,
                data: {
                    command: jsonMsg.command,
                    location: jsonMsg.location
                },
            };

            datastore
                .upsert(droneInfoEntity)
                .then(() => {
                    console.log(`DroneInfo entity with id ${jsonMsg.teamId} upserted successfully.`);
                    res.status(200).end();
                })
                .catch(err => {
                    console.error('ERROR:', err);
                    res.status(500).end();
                });
        }



    } catch (err) {
        console.error('ERROR:', err);
        res.status(500).end();
    }
};
