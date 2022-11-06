var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://Gym:ihSrWe0Fn1W0bLDV@cluster0.ul1p5ag.mongodb.net/?retryWrites=true&w=majority";

const d = new Date();
let currentHour = d.getHours();
console.log("currentHour = " + currentHour + "\n");

// delay 30 mins
var now = new Date(
  d.getFullYear(),
  d.getMonth(),
  d.getDate(),
  d.getHours(),
  d.getMinutes(),
  d.getSeconds(),
  d.getMilliseconds()
);

// console.log("now = " + now.getTime());

millisecondsOfHalfAnHour = 1000 * 60 * 30;
let nowMinusDelay = now.getTime() - millisecondsOfHalfAnHour;
// console.log("nowMinusDelay = " + nowMinusDelay);

const patrolLocations = [];

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("ScanmosTestDB");
  var query = { active: true };
  dbo
    .collection("locations")
    .find(query)
    .toArray(function (err, result) {
      if (err) throw err;
      // console.log(result);

      let indexHour = 0;
      for (const element of result) {
        for (const hour of element.alertHours) {
          if (currentHour == indexHour && hour) {
            // patrolLocations.push(element.locationId);
            patrolLocations.push(element);
            // console.log(element.locationName);
            break;
          }
          indexHour++;
        }
        indexHour = 0;
      }

      // console.log(patrolLocations);

      var patrolLocationIndex = 0;
      var nonLateSequenceExist = false;
      for (const location of patrolLocations) {
        var query = {
          active: true,
          clientId: location.clientId,
          locationCardId: location.locationId,
        };
        // It's async or something, so you have to put db.close within the dbo
        dbo
          .collection("sequences")
          .find(query)
          .toArray(function (err, result) {
            if (err) throw err;
            console.log(
              "clientId = " +
                location.clientId +
                " locationId = " +
                location.locationId
            );

            for (const element of result) {
              // if there is a seq in the past 30 minutes from now
              if (
                element.createdAt.getTime() >= nowMinusDelay &&
                element.createdAt.getTime() <= now
              ) {
                console.log("sequence found created at " + element.createdAt + "\n");
                nonLateSequenceExist = true;
                break;
              }
            }

            if (!nonLateSequenceExist) {
              console.log("ALERT!!! ALERT!!! NO SEQUENCE FOUND!!!" + "\n");

              // insert seq that has isLate = true
              var myobj = { clientId: location.clientId, staffCardId: "none", locationCardId: location.locationId, photo:"none", isLate: true };
              dbo.collection("sequences").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                console.log("res = " + res + "\n");
              });
            }

            nonLateSequenceExist = false;

            patrolLocationIndex++;
            if (patrolLocationIndex === patrolLocations.length) {
              db.close();
            }
          });
      }
      // db.close();
    });
});

// dbo
// .collection("sequences")
// .find(query)
// .toArray(function (err, result) {
//   if (err) throw err;
//   // find sequence that wasn't late, if it exist, there's no problem
//   for (const element of result) {
//     nextElement = false

//     // how can i query something like this???
//     // check if there was a sequence with that location card id in the last 30 mins

//     // compare the locationCardId of the element with each of the patrolLocation
//     // for (const locationCardId of patrolLocations) {
//     //   // if the locationCardId of the element doesn't match any of the patrolLocation then continue to the next one
//     //   if (element.locationCardId === locationCardId) {
//     //     break;
//     //   }
//     //   nextElement = true;
//     // }

//     // if (nextElement) {
//     //   continue;
//     // }

//     if (element.createdAt.getTime() < nowMinusDelay || element.createdAt.getTime() > now) {
//       console.log(element._id)
//       console.log("element.createdAt.getTime() < nowMinusDelay || element.createdAt.getTime() > now");
//       continue;
//     }

//     console.log(element._id)
//     console.log(element.createdAt);
//     // console.log(element.createdAt.getTime());

//     sequenceExist = true;
//   }

//   if (!sequenceExist) {
//     console.log("no sequence exist, there's a trouble here")
//     // add late sequence
//     // line notify
//   }
//   db.close();
// });
