const Datastore = require('@google-cloud/datastore');

const datastore = new Datastore({});

exports.parcelList = async (req, res) => {
    console.log('parcelList');
    if (!req.query.teamId) {
        res.status(500).send('Please provide the teamId in query');
    }

    console.log(`teamId = ${req.query.teamId}`);

    const teamId = req.query.teamId;
    const query = datastore
        .createQuery('Parcel')
        .filter('teamId', teamId);

    try {
        const results = await datastore.runQuery(query);
        const parcels = results[0];

        console.log('parcels:');
        parcels.forEach(parcel => console.log(parcel));
        const parcelsWithParcelId = parcels.map(p => p.parcelId = p[datastore.KEY].name);
        res.status(200).send(parcelsWithParcelId);
    } catch (err) {
        console.error(`Oups cannot get data for teamId ${teamId}`, err);
        res.status(500).send(err);
    }

};

