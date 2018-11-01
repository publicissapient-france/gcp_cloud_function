const Datastore = require('@google-cloud/datastore');

// creates datastore client
const datastore = new Datastore({});

exports.droneCallBackSetter = async (req, res) => {
    console.log(JSON.stringify(req.body));

    if (req.method === 'POST') {
        try {
            if (req.body.teamId === undefined) {
                res.status(400).send('No body with a teamId to upsert defined!');
            }
            const jsonMsg = req.body;
            const teamId = jsonMsg.teamId;
            const url = jsonMsg.url;

            const droneInfoKey = datastore.key(['DroneInfo', teamId]);

            const droneInfoFromDB = await findDroneByKey(droneInfoKey);

            if (!droneInfoFromDB) {
                res.status(404).send(`teamId ${teamId} not found`);
            } else {
              console.log(`loaded teamId: ${JSON.stringify(droneInfoFromDB)}`);
              const data = Object.assign(droneInfoFromDB, { topicUrl: url});
              const droneInfoEntity = {
                key: droneInfoKey,
                data
              };
              console.log(`droneInfoEntity to upsert: ${JSON.stringify(droneInfoEntity)}`);

              await datastore.upsert(droneInfoEntity);
              console.log(`DroneInfo entity with id ${teamId} upserted successfully.`);
              res.status(200).send("url updated");
            }

        } catch (err) {
            console.error('ERROR:', err);
            res.status(500).end();
        }
    }
};

const findDroneByKey = async (droneInfoKey) => {
    const resultFromDB = await datastore.get(droneInfoKey);
    return resultFromDB[0];
};