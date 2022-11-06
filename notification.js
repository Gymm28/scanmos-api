const lineNotify = require("./lineNotifyTest");

var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://Gym:ihSrWe0Fn1W0bLDV@cluster0.ul1p5ag.mongodb.net/?retryWrites=true&w=majority";

const findPatrolLocations = async () => {
  const d = new Date();
  let currentHour = d.getHours();

  // locations that need to be checked at current hour
  const patrolLocations = [];

  // connect to your cluster
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // specify the DB's name
  const db = client.db("ScanmosTestDB");
  // execute find query
  var query = { active: true };
  const items = await db.collection("locations").find(query).toArray();

  // add all location that need to be checked at current hour
  let indexHour = 0;
  for (const item of items) {
    for (const hour of item.alertHours) {
      if (currentHour == indexHour && hour) {
        patrolLocations.push(item);
        break;
      }
      indexHour++;
    }
    indexHour = 0;
  }

  // console.log(patrolLocations);
  // close connection
  client.close();
  return patrolLocations;
};

const findASequenceForEachPatrolLocations = async (patrolLocations) => {
  // delay 30 mins
  var now = new Date();

  millisecondsOfHalfAnHour = 1000 * 60 * 30;
  let nowMinusDelay = now.getTime() - millisecondsOfHalfAnHour;

  // locations that need to be checked at current hour
  const alertLocations = [];

  // connect to your cluster
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // specify the DB's name
  const db = client.db("ScanmosTestDB");

  // find a non late sequence
  var nonLateSequenceExist = false;

  for (const location of patrolLocations) {
    var query = {
      active: true,
      clientId: location.clientId,
      locationCardId: location.locationId,
    };
    // execute find query
    const items = await db.collection("sequences").find(query).toArray();

    console.log(
      "clientId = " + location.clientId + " locationId = " + location.locationId
    );
    // find sequence in sequence with the right clientId and the right locationCardId that isn't late
    for (const item of items) {
      // if it was created in the past 30 minutes from now
      if (
        item.createdAt.getTime() >= nowMinusDelay &&
        item.createdAt.getTime() <= now
      ) {
        console.log("sequence found created at " + item.createdAt + "\n");
        nonLateSequenceExist = true;
        break;
      }
    }

    if (!nonLateSequenceExist) {
      console.log("ALERT!!! ALERT!!! NO SEQUENCE FOUND!!!" + "\n");
      lineNotify.lineNotify(
        "ALERT!!! No sequence found for location " + location.locationName + "!"
      );
      alertLocations.push(location);
    }

    nonLateSequenceExist = false;
  }
  // close connection
  client.close();
  return alertLocations;
};

const insertLateSequences = async (alertLocations) => {
  const d = new Date();
  let currentHour = d.getHours();

  const alertLocationExist = (await alertLocations.length) != 0;
  if (!alertLocationExist) {
    console.log("no alertLocation");
    return "no alertLocation";
  }

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ScanmosTestDB");

    let myobj = {};
    let alertLocationIndex = 0;
    console.log("alertLocations.length = " + alertLocations.length + "\n");
    for (const alertLocation of alertLocations) {
      myobj = {
        clientId: alertLocation.clientId,
        staffCardId: "none",
        locationCardId: alertLocation.locationId,
        photo: "none",
        isLate: true,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      };
      dbo.collection("sequences").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log(currentHour + " " + alertLocation.locationId + " inserted");

        alertLocationIndex++;
        // console.log("alertLocationIndex = " + alertLocationIndex);
        if (alertLocationIndex === alertLocation.length) {
          db.close();
        }
      });
    }
  });
};

const notify = async () => {
  const patrolLocation = await findPatrolLocations();
  const alertLocation = await findASequenceForEachPatrolLocations(
    patrolLocation
  );
  await insertLateSequences(alertLocation);
  console.log(alertLocation);

  hourInMillisecond = 1000 * 60 * 60;
  setTimeout(notify, hourInMillisecond);
};

// notify();

var now = new Date();
let currentHour = now.getHours();
var millisTillNextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour + 1, 0, 0, 0) - now;
console.log("notify begin on hour = " + (currentHour + 1));
if (millisTillNextHour < 0) {
     millisTillNextHour += 86400000; // it's after that hour, try that hour tomorrow.
}
setTimeout(notify, millisTillNextHour);