const Datastore = require('@google-cloud/datastore');
const uuidv4 = require('uuid/v4');

// creates datastore client
const datastore = new Datastore({});


exports.parcelHttpUpserter = async (req, res) => {
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
            const parcelFromBody = req.body;
            console.log(JSON.stringify(req.body));

            if (parcelFromBody.parcelId === undefined) {
                parcelFromBody.parcelId = uuidv4();
            }
            console.log('parcelId=', parcelFromBody.parcelId);

            const parcelKey = datastore.key(['Parcel', parcelFromBody.parcelId]);

            const parcelEntity = {
                key: parcelKey,
                data: {
                    teamId: parcelFromBody.teamId,
                    score: parcelFromBody.score,
                    location: parcelFromBody.location,
                    status: parcelFromBody.status,
                },
            };

            await datastore.upsert(parcelEntity)
            console.log(`Parcel entity with id ${parcelFromBody.parcelId} upserted successfully.`);
            if (res.status === 204) {
                res.end();
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
