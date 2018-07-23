const Datastore = require('@google-cloud/datastore');
const uuidv4 = require('uuid/v4');

// creates datastore client
const datastore = new Datastore({});


exports.parcelHttpUpserter = (req, res) => {
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
                location: parcelFromBody.location
            },
        };

        datastore
            .upsert(parcelEntity)
            .then(() => {
                console.log(`Parcel entity with id ${parcelFromBody.parcelId} upserted successfully.`);
                res.status(200).end();
            })
            .catch(err => {
                console.error('ERROR:', err);
                res.status(500).end();
            });

    } catch (err) {
        console.error('ERROR:', err);
        res.status(500).end();
    }
};
