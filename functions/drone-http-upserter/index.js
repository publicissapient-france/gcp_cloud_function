const Datastore = require('@google-cloud/datastore');

// creates datastore client
const datastore = new Datastore({});

exports.droneHttpUpserter = async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    console.log(JSON.stringify(req.body));

    const methodCORS = req.get('Access-Control-Request-Method');
    if (req.method === 'OPTIONS') {
        console.log('Response to OPTIONS pre-flight CORS request');
        res.status(204).send('');
    }

    if (req.method === 'POST' || methodCORS === 'POST') {
        try {
            if (req.body.teamId === undefined) {
                res.status(400).send('No body with a teamId to upsert defined!');
            }
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

            await datastore.upsert(droneInfoEntity);
            console.log(`DroneInfo entity with id ${teamId} upserted successfully.`);
            if (res.status === 204) {
                res.send(data).end();
            }
            res.status(200).end();
        } catch (err) {
            console.error('ERROR:', err);
            if (res.status === 204) {
                res.end();
            }
            res.status(500).end();
        }
    }
};

const findDroneByKey = async (droneInfoKey) => {
    const resultFromDB = await datastore.get(droneInfoKey);
    return resultFromDB[0];
};