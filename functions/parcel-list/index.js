const Datastore = require('@google-cloud/datastore');


const datastore = new Datastore({});


/**
 * 
 * gcloud command to deploy:
 * gcloud beta functions deploy parcelList --trigger-http
 */
exports.parcelList = (req, res) => {
    console.log('parcelList');
    console.log(`teamId = ${req.query.teamId}`);

    res.send('should return a list of available Parcels for a given team');
};

