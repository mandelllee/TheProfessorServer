    db.getCollection('SensorData').aggregate([
        {
          $match: { hostname:"tempo"}  
        },
        { $project : { 
            //hostname:"$hostname",
            //now:"$now",
            //timestamp: "$timestamp",
            date: {$add: [new Date(0), "$timestamp"]},
            
            //cal: "$sensors.soil.calibration",
            //now: "$now",
            
            temp_f: "$sensors.bmp085.temp_f",
            _id: 0
           }
        },        
        { $sort : { 
            timestamp: -1 
        } }
    ])
    