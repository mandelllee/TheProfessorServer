db.loadServerScripts();

    db.getCollection('SensorData').aggregate([
    {
      $match: { hostname:"aqua" }  
    },
    { $project : { 
        hostname:"$hostname",
        //now:"$now",
        //timestamp: "$timestamp",
        date:{$add: [new Date(0), "$timestamp"]},
        core:"$core_version",
        //p: { $concat: new Date( "$timestamp").toTimeString() },
        //d:  ISODate("$date"),
        
        //cal: "$sensors.soil.calibration",
        ph:"$sensors.ph",
        temp:"$sensors.probes.avg.temp_c",
        flow_lpm:"$sensors.flow.lpm",
        flow_lph:"$sensors.flow.lph",
       
        //temp_f:{$multiply: [ new Number("$sensors.probes.avg.temp_c").valueOf(), 2 ]},
//             soil_1_cal:"$sensors.soil.calibration.wet.1",
// 
//             soil_2:"$sensors.soil.sensors.2",
//             soil_3:"$sensors.soil.sensors.3",
//             //cal:"$sensors.soil.calibration",
        _id: 0
       }
    },        
    { $sort : { date : -1 } }
    //,{ $limit: 10 }
])
    
        