const Datastore = require('@google-cloud/datastore');

const datastore = new Datastore({});

exports.droneStateList = (req, res) => {
  let data = [];
  
  console.log('read from datastore');
  
  const query = datastore
    .createQuery('DroneInfo');
  
  datastore
    .runQuery(query)
    .then(results => {
      data = results;
      console.log(`DroneInfo from datastore: ${JSON.stringify(results, null, 2)}`);
      res.send(data);
    })
    .catch(err => {
      console.error('ERROR:', err);
      res.status(500).send(new Error('Error when trying to get data from DroneInfo'));
    });
}
