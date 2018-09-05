const Datastore = require('@google-cloud/datastore');

// creates datastore client
const datastore = new Datastore({});

exports.droneHttpUpserter = async (req, res) => {
    try {
        console.log(JSON.stringify(req.body));
        if (req.body.teamId === undefined) {
            res.status(400).send('No body with a teamId to upsert defined!');
        } else {
            const jsonMsg = req.body;
            const teamId = jsonMsg.teamId;
            delete jsonMsg.teamId;

            console.log('teamId=', teamId);

            const droneInfoKey = datastore.key(['DroneInfo', teamId]);

            const droneInfoFromDB = await findDroneByKey(droneInfoKey);

            const data = Object.assign(droneInfoFromDB || {}, jsonMsg);

            const droneInfoEntity = {
                key: droneInfoKey,
                data
            };

            datastore
                .upsert(droneInfoEntity)
                .then(() => {
                    console.log(`DroneInfo entity with id ${teamId} upserted successfully.`);
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

const findDroneByKey = async (droneInfoKey) => {
    const resultFromDB = await datastore.get(droneInfoKey);
    return resultFromDB[0];
};