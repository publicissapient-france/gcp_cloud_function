const Datastore = require('@google-cloud/datastore');

const datastore = new Datastore({});

exports.parcelList = (req, res) => {
    console.log('parcelList');
    console.log(`teamId = ${req.query.teamId}`);

    const teamId = req.query.teamId;
    const query = datastore
        .createQuery('Parcel')
        .filter('teamId', teamId);

    datastore.runQuery(query)
        .then(results => {
            const parcels = results[0];

            console.log('parcels:');
            parcels.forEach(parcel => console.log(parcel));
            const parcelsWithParcelId = parcels.map(p => p.parcelId = p[datastore.KEY].name);
            res.status(200).send(parcelsWithParcelId);
        })
        .catch(err => {
            console.error(`Oups cannot get data for teamId ${teamId}`, err);
            res.status(500).send(err);
        });
};

