const Datastore = require('@google-cloud/datastore');

const datastore = new Datastore({});

exports.droneStateList = async (req, res) => {
    console.log('read from datastore');

    // Enable CORS
    res.set('Access-Control-Allow-Origin', "*");
    res.set('Access-Control-Allow-Methods', 'GET, POST');

    try {
        let data = {};

        // get DroneInfo
        const droneInfoQuery = datastore.createQuery('DroneInfo');
        const droneInfoResults = await datastore.runQuery(droneInfoQuery);
        // console.log(`DroneInfos from datastore: ${JSON.stringify(results, null, 2)}`);
        data.drones = droneInfoResults[0] || [];
        data.drones = data.drones.map((droneInfo) => {
            if (droneInfo) {
                console.log(`Drone info key ${JSON.stringify(droneInfo[datastore.KEY], null, 2)}`);
                const teamName = droneInfo[datastore.KEY].name;
                return {
                    teamId: teamName,
                    data: droneInfo,
                };
            }
            return {};
        });

        // get Parcel
        const parcelQuery = datastore.createQuery('Parcel');
        const parcelResults = await datastore.runQuery(parcelQuery);
        data.parcels = parcelResults[0] || [];

        console.log(`Parsed data from DroneInfo and Parcel: ${JSON.stringify(data, null, 2)}`);

        res.send(data);
        
    } catch (err) {
        console.error('ERROR:', err);
        res.status(500).send(new Error('Error when trying to get data from DroneInfo'));
    }
};
