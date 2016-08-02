    db.getCollection('SensorData').aggregate([
        {
          $match: { hostname:"tempo" }  
        },
        { $project : { 
            hostname:"$hostname",
            //now:"$now",
            //timestamp: "$timestamp",
            date: {$add: [new Date(0), "$timestamp"]},
            //cal: "$sensors.soil.calibration",
            
            
            light_lux: "$sensors.tsl2561.lux",
            
            air_temp_f: "$sensors.bmp085.temp_f",
            air_pressure: "$sensors.bmp085.pressure",
            air_humidity:  "$sensors.dht11.dht_humidity",
            
            
            //soil_1:"$sensors.soil.sensors.1",
            //soil_1_cal:"$sensors.soil.calibration.wet.1",

            //soil_2:"$sensors.soil.sensors.2",
            //soil_3:"$sensors.soil.sensors.3",
            //cal:"$sensors.soil.calibration",
            _id: 0
           }
        },        
        { $sort : { date : -1 } }
//         ,{ $limit: 10 }
    ])
    