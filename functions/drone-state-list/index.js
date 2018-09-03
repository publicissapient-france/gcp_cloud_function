const Datastore = require('@google-cloud/datastore');

const datastore = new Datastore({});

exports.droneStateList = (req, res) => {
    console.log('read from datastore');

    const query = datastore
        .createQuery('DroneInfo');

    // Enable CORS
    res.set('Access-Control-Allow-Origin', "*");
    res.set('Access-Control-Allow-Methods', 'GET, POST');

    datastore
        .runQuery(query)
        .then(results => {
            let data = {};
            // console.log(`DroneInfos from datastore: ${JSON.stringify(results, null, 2)}`);
            const droneInfos = results[0];
            droneInfos.map((droneInfo) => {
                console.log(`Drone info key ${JSON.stringify(droneInfo[datastore.KEY], null, 2)}`)
                const teamName = droneInfo[datastore.KEY].name;
                data[teamName] = {
                    team: teamName,
                    data: droneInfo,
                };
            });
            console.log(`Parsed data from DroneInfo: ${JSON.stringify(data, null, 2)}`);

            res.send(data);
        })
        .catch(err => {
            console.error('ERROR:', err);
            res.status(500).send(new Error('Error when trying to get data from DroneInfo'));
        });
}
