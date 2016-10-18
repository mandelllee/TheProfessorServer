	db.SensorData.aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			hostname:  "fillmore"
			}
		},

		// Stage 2
		{
			$sort: {
			timestamp:-1
			}
		},

		// Stage 3
		{
			$limit: 1
		},

		// Stage 4
		{
			$project: {
				_id: 0,
				pH: "$sensors.ph",
				lux: "$sensors.tsl2561.lux",
				waterTemperature_c: "$sensors.probes.avg.temp_c",
				bmpTemperature_f: "$sensors.bmp085.temp_f",
				bmpAltitude: "$sensors.bmp085.altitude",
				bmpPressure: "$sensors.bmp085.pressure",
				dhtTemperature_f: "$sensors.dht11.dht_temp_f",
				dhtHumidity: "$sensors.dht11.dht_humidity",
				soil1: "$sensors.soil.sensors.1",
				soil2: "$sensors.soil.sensors.2",
				soil3: "$sensors.soil.sensors.3",
				soil4: "$sensors.soil.sensors.4",
				ec: "$sensors.EC.ec",
				tds: "$sensors.EC.tds",
				salinity: "$sensors.EC.salinity",
				specificGravity: "$sensors.EC.specificGravity"
			}
		},

	]

	// Created with 3T MongoChef, the GUI for MongoDB - https://3t.io/mongochef
	);
