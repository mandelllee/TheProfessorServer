    db.getCollection('SensorData').aggregate([
        {
          $match: { hostname:"pepper" }  
        },
        { $project : { 
            hostname:"$hostname",
            //now:"$now",
            //timestamp: "$timestamp",
            date: {$add: [new Date(0), "$timestamp"]},
            //cal: "$sensors.soil.calibration",
            soil_1:"$sensors.soil.sensors.1",
            //soil_1_cal:"$sensors.soil.calibration.wet.1",

            soil_2:"$sensors.soil.sensors.2",
            soil_3:"$sensors.soil.sensors.3",
            //cal:"$sensors.soil.calibration",
            _id: 0
           }
        },        
        { $sort : { date : -1 } }
//         ,{ $limit: 10 }
    ])
    