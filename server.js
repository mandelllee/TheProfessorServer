// var GoogleSpreadsheet = require('google-spreadsheet');
var express = require('express');
var async = require('async');
var moment = require('moment');


var creds = {
    "type": "service_account",
    "project_id": "quadroponic",
    "private_key_id": "d458c90017cfc50c69f68a62bdc01fe650346437",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCQkVSolhI45auQ\nU4bM1heRZ/fMbhwkePdPUTCxCiTkzNkSOICuvGQfOV/LAYeVn72JHK+hB50COYYg\na+RJ+XBnks/UxKpTd16KdVTEc6CEAs71orxwhYzlGyDcU03zRGPhBKo3FMqtAK+t\nJ+0eSUXdogkdhjjj4IABCNh0Aq0hi15D0b4kMUn9euQ5Z4kLsfASh2eArCw14Rv0\nDiTo2VxJDCEXFRejJHV04/P+gOyF5J0U9VcDFkiWRjY1Jv+PH9Sy15BTAMfJEQal\n99gU2zQIgFIHzk7dmwVmS0lvYGMujZtT6SVkHGFbpqzUq1Tahr8/IHtJJt1JWP3e\nH1Y0bWVrAgMBAAECggEAI55bAGpxNOmJWrbpqIA7ME0wZYLfljDjpfw4Bfac3m6G\nMRIQynyKIpNNQcQvtrKzzRtvPjqU+Z5YqJZMmdlGU459fEu0N3papbyA1SIz8zKJ\n8UVWLlcJPs1vTDmOJBi+jwtKMOYDhZp8rin/Jw4gk5m/qzGNxL9kalzWj8a1B2Vh\n4RXyKPGT3r+ttqkwxFr9xP2xR7qY8go3fv7uL5DIiO/D/OYX9HdAJP9b58jXjCyw\nv6UeLf+y25dGzxwyYsbaVFZAbLTrN7ETGS6TVHM5KMep2FrBJSSYvF0QKuFlS/5s\n3NTgILl1EO+SY9oLQDz6lu9SoJO9VjjEpq7RZmhkMQKBgQDlWvuaMY1Timjq87Ix\nFSUzWTrSGEmRinTCWLIpBgObMUTeqtQi+ovNxFvPdPaH8G6qnmxVBHd4Nc6Lm/h/\nYLBQWfNlhylCGfICb6ltNe+V/7GAxRDUu8LcYV+925wNdY6WtCChLQEQFlhDWKS2\nQ5e+oTXbyFTqSlDO3zYyPcieEwKBgQChXMQkUHBcGjKshBzRbiywjEgHdQnzrn8U\n089SRLxq3ZaSbd6dEgIwDH6t4ZFhIJg5tQTtlpYMfew0joL2+nYYR/MbEcUZxQ8W\nD1+MQnYEGsYOUMMAmC9sp4qOSgkLdGop+RAtwIXYmN1JQwG8FwyCk4R28wt4WQDw\nrljtmGimSQKBgGQ2Q7bUrdZxpHP8NMCDZ7Su6SeBGyvvXiLIlFeeXBcECP5tj7EU\n3d7zS9YyWcF9ySzdeaIQCI9Km0uew44MVh1VoCadTual5XsxBMtGBL/6b7k+4aLB\nw1t9ZFLVULMEyV+JprQlsNAxozER2y4UDIprb9fvCUMxY2twVgLPwgdnAoGAEpJx\nxNg5RnCBepeuFXC/1gYfWDRhU9m2qLgEOazNnuMoLGxW3e8vr0YQ4oR+zhYJT0MF\ncS8O0BtCL35jlneXVg4Z7fiqnd+vb9OPJL6VhL1sJEOpXg0mEDRsXxooVlgsy+3t\nrcZl4VsexQrgTTy95N2DtokcvdpIoGsAs0ACc3kCgYBP1VkosgnrU8bDJh7A/m42\nhJvbIyUBqAGPLSHbyKH/ZpPQbtkt41N79Y2EJr+b4W2u6PodT7IQVIpI1c/eLVBY\nWf1dIYdo6gWvNidsvMpJR3Ed7gL/vCpI87Q4aMhbBHs9Mj/BdU85iOGsOwKimRv2\n2TI2Cg3pjItFlMaKIMluDg==\n-----END PRIVATE KEY-----\n",
    "client_email": "apiworker@quadroponic.iam.gserviceaccount.com",
    "client_id": "110964243476068743286",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/apiworker%40quadroponic.iam.gserviceaccount.com"
};
//var creds = require('./google-generated-creds.json');
var row_limit = 100 * 10;
var provisionDevice = function(request, response) {
    var query = request.query;

    var responseText = "";


    try {
        var doc = new GoogleSpreadsheet('1kAXJa40VPameiitzwAIrNPWsr5kDdviN59xv5x8yYJM');
        var sheet;
        var worksheets;
        var now_date = new Date();
        var nodes_sheet = null;
        var sensors_sheet = null;

        async.series([
            function setAuth(step) {
                //console.log( "authenticating..." );
                doc.useServiceAccountAuth(creds, step);
            },
            function getInfoAndWorksheets(step) {
                console.log("getting worksheets...");
                doc.getInfo(function(err, info) {
                    //console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);

                    worksheets = info.worksheets;
                    //console.log("we have " + worksheets.length + " worksheets");
                    for (var n = 0; n < worksheets.length; n++) {
                        var worksheet = worksheets[n];

                        //console.log(" [" + n + "] " + worksheet.title + " (" + worksheet.rowCount + " rows)");

                        if (worksheet.title == "nodes") {
                            console.log("Found nodes sheet");
                            nodes_sheet = worksheet;
                        }
                        if (worksheet.title == "sensors") {
                            console.log("Found sensors sheet");
                            sensors_sheet = worksheet;
                        }
                    }
                    if (sensors_sheet == null || nodes_sheet == null) {
                        // create the sheet if we did not find it
                        console.log("missing core worksheets");

                    } else {
                        step();
                    }
                });
            },
            function addNode(step) {

                var url = require('url');
                var url_parts = url.parse(request.url, false);


                console.log("searching for nodeid=" + query.nodeid);
                nodes_sheet.getRows({

                    query: "nodeid=" + query.nodeid

                }, function(err, rows) {

                    console.log(rows);
                    console.log(rows.length);

                    if (rows.length == 0) {
                        nodes_sheet.addRow({
                            "nodeid": query.nodeid,
                            "type": query.type,
                            "hardware": query.hardware,
                            "platform": query.platform,
                            "boardname": query.boardname,

                            //"date": current_date_string,
                            "boardid": query.boardid,
                            "name": query.boardname,

                            "core_version": query.core_version,
                        }, function(err) {
                            responseText = "provisioned device";
                            if (err != null) console.log("error: " + err);
                            response.end(responseText);
                        });

                    } else {
                        responseText = "nodeid already exists  [" + query.nodeid + "]";
                        //return;
                        response.end(responseText);
                    }

                });
            },
            function allDone(step) {
                request.send('id: ' + request.query.id);
            }
        ]);


    } catch (err) {
        console.log(err);
        response.end('error ' + err);
    }
    // if( responseText.length == 0 ) responseText = "done";
    // response.end(responseText);

};





var get_current_month_string = function() {
    var now_date = new Date();
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    return month[now_date.getMonth()] + " " + now_date.getFullYear()
};


// app.listen(8080, ipaddress, function() {
//     console.log('%s: Node server started on %s:%d ...',
//         Date(Date.now()), ipaddress, port);
// });


var restify = require('restify');
var rest_server = restify.createServer();
rest_server.use(restify.queryParser());
rest_server.use(restify.bodyParser());

var nowDate = new Date();

var get_current_date_string = function() {
    var now_date = new Date();

    return now_date.getMonth() + "/" + now_date.getDate() + "/" + now_date.getFullYear() + " " + now_date.getHours() + ":" + now_date.getMinutes() + ":" + now_date.getSeconds();
}

var getNowTimestamp = function() {
    return Date.now();
}

var recordData = function(request, response, next) {

    // var query = request.query;
    //
    // try {
    //     var doc = new GoogleSpreadsheet('1Yr3d8pXQllWeyCImAO6XK0u_NgsKmbjGjc9SEn9wM3I');
    //     var sheet;
    //     var worksheets;
    //     var current_month_sheet = null;
    //     var active_worksheet = null;
    //
    //     var current_month_string = get_current_month_string();
    //     var worksheet_name = query.boardname;
    //
    //     //console.log("current_month_string=" + current_month_string);
    //
    //
    //     var current_date_string = get_current_date_string();
    //
    //     async.series([
    //         function setAuth(step) {
    //             //var creds = require('./google-generated-creds.json');
    //             doc.useServiceAccountAuth(creds, step);
    //         },
    //         function getInfoAndWorksheets(step) {
    //             doc.getInfo(function(err, info) {
    //                 //console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
    //
    //                 worksheets = info.worksheets;
    //                 //console.log("we have " + worksheets.length + " worksheets");
    //                 for (var n = 0; n < worksheets.length; n++) {
    //                     var worksheet = worksheets[n];
    //
    //                     //console.log(" [" + n + "] " + worksheet.title + " (" + worksheet.rowCount + " rows)");
    //
    //                     if (worksheet.title == worksheet_name) {
    //                         active_worksheet = worksheet;
    //                     }
    //                     // if (worksheet.title == current_month_string) {
    //                     //     console.log("Found this month's sheet");
    //                     //     current_month_sheet = worksheet;
    //                     // }
    //                 }
    //                 if (active_worksheet == null) {
    //                     // create the sheet if we did not find it
    //                     console.log("creating worksheet [" + worksheet_name + "]");
    //
    //                     doc.addWorksheet({
    //                         title: worksheet_name,
    //                         rowCount: 50,
    //                         colCount: 7,
    //                         headers: [
    //                             "date", "boardid", "boardname", "type", "propertyname", "value", "core_version", "id", "description"
    //                         ]
    //                     }, function(err, sheet) {
    //                         active_worksheet = sheet;
    //                         step();
    //                     });
    //
    //                 } else {
    //                     step();
    //                 }
    //             });
    //         },
    //
    //         function addRow(step) {
    //             //var url = require('url');
    //             //var url_parts = url.parse(request.url, true);
    //
    //             var boardid = query.boardid;
    //             var module = "Testing Module";
    //             var section = "n/a";
    //             var description = "Test Script";
    //             var category = "?";
    //             var status = "";
    //             var notes = "";
    //             var model = "";
    //
    //             console.log("recording data for board[" + boardid + "] " + query.propertyname + "=" + query.value);
    //
    //             active_worksheet.addRow({
    //                 "id": query.id,
    //                 "description": query.description,
    //                 "type": query.type,
    //                 "propertyname": query.propertyname,
    //                 "value": query.value,
    //
    //                 "date": current_date_string,
    //                 "boardid": query.boardid,
    //                 "boardname": query.boardname,
    //
    //                 "core_version": query.core_version,
    //             }, function(err) {
    //                 if (err != null) console.log("error: " + err);
    //             });
    //         },
    //         function allDone(step) {
    //             res.send('id: ' + query.id);
    //         }
    //     ]);
    //
    // } catch (err) {
    //     console.log(err);
    //     response.end('error' + err);
    // }
    //
    response.end("recorded");

}



var handleRecordConfigJSON = function(request, response) {

    console.log("handleRecordConfigJSON");

    //var json = JSON.stringify( request.body );
    var json = (request.body);

    //add iso date for human readability
    var currentDateTime =  new Date();
    json.dateTime = currentDateTime;
 
    json.timestamp = getNowTimestamp();

    console.log(request);
    //console.log( "hostname: " + json.hostname );

    recordConfigJSON(json, function(err, doc) {

        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Cache-Control', 'no-cache, no-store');

        response.end("done");
    }, function() {

        console.log("record config response sent");

    });

}
var recordConfigJSON = function(json, callback) {

    console.log(json);
    var r = mongo_db.collection('ConfigData').insertOne(json, callback);

};


var handleRecordSensorJSON = function(request, response) {

    console.log("handleRecordSensorJSON");

    //var json = JSON.stringify( request.body );
    var json = (request.body);
    json.timestamp = getNowTimestamp();
    var currentDateTime =  new Date();
    var currentDateString = moment(currentDateTime).format("dddd, MMMM Do YYYY");
    var currentTimeString = moment(currentDateTime).format("h:mm:ss A");
    json.dateTime = currentDateTime;
    json.dateString = currentDateString;
    json.timeString = currentTimeString;


    //console.log(request);
    //console.log( "hostname: " + json.hostname );

    recordSensorJSON(json, function(err, doc) {

        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Cache-Control', 'no-cache, no-store');

        response.end("done");
    });

}

var recordSensorJSON = function(json, callback) {

    console.log(json);


    var r = mongo_db.collection('SensorData').insertOne(json, callback);


};

var handleNowTimeRequest = function(request, response) {
    var nowString = Math.floor(Date.now() / 1000);

    response.writeHead(200);
    response.end("" + nowString + "");
    //response.end('{"now":"'+nowString+'"}');
};

var handleHealthRequest = function(request, response) {
    response.writeHead(200);
    response.end("node");
};
var handleAquaReport  = function(request, response) {

    // console.log("Water report for [" + request.params.nodename + "]");

    mongo_db.collection('SensorData').aggregate([{
            $match: { hostname: request.params.nodename }
        },
        { $sort: { timestamp: -1 } }, { $limit: row_limit }, {
            $project: {
                hostname: "$hostname",
                //now:"$now",
                //timestamp: "$timestamp",
                date: { $add: [new Date(0), "$timestamp"] },

                //p: { $concat: new Date( "$timestamp").toTimeString() },
                //d:  ISODate("$date"),

                //cal: "$sensors.soil.calibration",
                ph: "$sensors.ph",
                pH1:"$sensors.ph1",
                pH2:"$sensors.ph2",
                pH3:"$sensors.ph3",
                pH4:"$sensors.ph4",
                waterTemp:"$sensors.waterTemp",
                flow_lpm:"$sensors.flow.lpm",
                flow_lph:"$sensors.flow.lph",
                EC:"$sensors.EC.ec",
                TDS:"$sensors.EC.tds",
                Salinity:"$sensors.EC.salinity",

                //temp_f:{$multiply: [ new Number("$sensors.probes.avg.temp_c").valueOf(), 2 ]},
                //             soil_1_cal:"$sensors.soil.calibration.wet.1",
                // 
                //             soil_2:"$sensors.soil.sensors.2",
                //             soil_3:"$sensors.soil.sensors.3",
                //             //cal:"$sensors.soil.calibration",
                _id: 0
            }
        }
    ], function(err, result) {
        response.setHeader('Content-Type', 'application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(result);
     });

};
var handleEnvironmentReport = function(request, response) {

    // console.log("Environment Report for [" + request.params.nodename + "]");
    mongo_db.collection('SensorData').aggregate([{
            $match: { hostname: request.params.nodename }
        },
        { $sort: { timestamp: -1 } }, { $limit: row_limit }, {
            $project: {
                hostname: "$hostname",
                //now:"$now",
                //timestamp: "$timestamp",
                date: { $add: [new Date(0), "$timestamp"] },

                light_lux: "$environment.light.lux",
                light_rgb_red: "$environment.light-rgb.red",
                light_rgb_green: "$environment.light-rgb.green",
                light_rgb_blue: "$environment.light-rgb.blue",

                air_temp_f: "$sensors.bmp085.temp_f",
                air_pressure: "$sensors.bmp085.pressure",
                
                air_humidity: "$sensors.dht11.dht_humidity",
                air_temp_f_dht: "$sensors.dht11.dht_temp_f",

                air_1_humidity: "$environment.air-1.humidity",
                air_1_temp: "$environment.air-1.temp",
                air_2_humidity: "$environment.air-2.humidity",
                air_2_temp: "$environment.air-2.temp",

                co2: "$sensors.MH-Z16.co2",

                co2_k30: "$environment.co2.k30",
                co2_mg811: "$environment.co2.mg811",

                other_analog1: "$other.analog1",
                other_analog2: "$other.analog2",
                other_analog3: "$other.analog3",

                other_gpio1: "$other.gpio1",
                other_gpio2: "$other.gpio2",

                other_i2c_1: "$other.i2c_1",
                other_i2c_2: "$other.i2c_2",

                other_battery: "$other.battery",

                _id: 0
            }

        }
    ], function(err, result) {

        response.setHeader('Content-Type', 'application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(result);
    });
};


var handleSoilReport = function(request, response) {

    // console.log("Soil Report for [" + request.params.nodename + "]");

    mongo_db.collection('SensorData').aggregate([{
            $match: { hostname: request.params.nodename }
        },
        { $sort: { timestamp: -1 } }, { $limit: row_limit }, {
            $project: {
                hostname: "$hostname",
                //now:"$now",
                //timestamp: "$timestamp",
                date: { $add: [new Date(0), "$timestamp"] },
                //cal: "$sensors.soil.calibration",
                soil_1: "$sensors.soil.sensors.1",
                //soil_1_cal:"$sensors.soil.calibration.wet.1",

                soil_2: "$sensors.soil.sensors.2",
                soil_3: "$sensors.soil.sensors.3",
                //cal:"$sensors.soil.calibration",
                _id: 0
            }
        }
    ], function(err, result) {
        response.setHeader('Content-Type', 'application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(result);
    });


};

var handleChartReport  = function(request, response) {

    // console.log("Chart report for [" + request.params.nodename + "]");

    mongo_db.collection('SensorData').aggregate([{
        $match: { hostname: request.params.nodename,
            "dateTime":
            {
                $gte: (new Date((new Date()).getTime() - (24 * 60 * 60 * 1000)))
            }}
    },
        { $sort: { timestamp: -1 } },  {
            $project: {
                hostname: "$hostname",
                //now:"$now",
                //timestamp: "$timestamp",
                date: { $add: [new Date(0), "$timestamp"] },
                pH: "$sensors.ph",
                pH1:"$sensors.ph1",
                pH2:"$sensors.ph2",
                pH3:"$sensors.ph3",
                pH4:"$sensors.ph4",
                waterTemp:"$sensors.waterTemp",
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
                EC: "$sensors.EC.ec",
                TDS: "$sensors.EC.tds",
                Salinity: "$sensors.EC.salinity",
                specificGravity: "$sensors.EC.specificGravity",
                co2: "$sensors.MH-Z16.co2",
                _id: 0
            }
        }
    ], function(err, result) {
        response.setHeader('Content-Type', 'application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(result);
    });

};

var handleChart2Report  = function(request, response) {

    // console.log("Chart report for [" + request.params.nodename + "]");

    mongo_db.collection('SensorData').aggregate([{
        $match: { hostname: request.params.nodename,
            "dateTime":
            {
                $gte: (new Date((new Date()).getTime() - (request.params.days * 24 * 60 * 60 * 1000)))
            }}
    },
        { $sort: { timestamp: 1 } },  {
            $project: {
                hostname: "$hostname",
                //now:"$now",
                //timestamp: "$timestamp",
                date: { $add: [new Date(0), "$timestamp"] },
                pH: "$sensors.ph",
                pH1:"$sensors.ph1",
                pH2:"$sensors.ph2",
                pH3:"$sensors.ph3",
                pH4:"$sensors.ph4",
                waterTemp:"$sensors.waterTemp",
                lux: "$environment.light.lux",
                waterTemperature_c: "$sensors.probes.avg.temp_c",
                bmpTemperature_f: "$sensors.bmp085.temp_f",
                bmpAltitude: "$sensors.bmp085.altitude",
                bmpPressure: "$sensors.bmp085.pressure",
                dhtTemperature_f: "$environment.air.temp.f",
                dhtHumidity: "$environment.air.humidity",
                soil1: "$sensors.soil.sensors.1",
                soil2: "$sensors.soil.sensors.2",
                soil3: "$sensors.soil.sensors.3",
                soil4: "$sensors.soil.sensors.4",
                EC: "$sensors.EC.ec",
                TDS: "$sensors.EC.tds",
                Salinity: "$sensors.EC.salinity",
                specificGravity: "$sensors.EC.specificGravity",
                co2: "$sensors.MH-Z16.co2",
                _id: 0
            }
        }
    ], function(err, result) {
        response.setHeader('Content-Type', 'application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        var jsonResult = {};
        jsonResult.y = [];
        jsonResult.x = [];
        jsonResult.y_max = [];
        jsonResult.y_min = [];
        var field = request.params.sensor;
        var dateString = "";
        result.forEach(function (item) {
            jsonResult.y.push(item[field]);
            dateString = moment(item.date).format("YYYY-MM-DD HH:mm:ss");
            jsonResult.x.push(dateString);
            jsonResult.y_max.push(90);
            jsonResult.y_min.push(60);
        });
        console.log(result);
        response.json(jsonResult);
    });

};


var handleCurrentConditionsReport = function (request, response) {
	console.log("HandleCurrentConditionReport");
	mongo_db.collection('SensorData').aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$match: {
			hostname: request.params.nodename
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
                pH1:"$sensors.ph1",
                pH2:"$sensors.ph2",
                pH3:"$sensors.ph3",
                pH4:"$sensors.ph4",
                waterTemp:"$sensors.waterTemp",
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
				EC: "$sensors.EC.ec",
				TDS: "$sensors.EC.tds",
				Salinity: "$sensors.EC.salinity",
                specificGravity: "$sensors.EC.specificGravity",
                co2: "$sensors.MH-Z16.co2",
                date: "$dateString",
                time: "$timeString"
			}
		},

	]

	// Created with 3T MongoChef, the GUI for MongoDB - https://3t.io/mongochef

, function (err, result) {
        response.setHeader('Content-Type', 'application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(result);

	//console.log(result);
});

}


var serveStatic = require('serve-static-restify');

rest_server.pre(serveStatic('www/', {'index': ['index.html']}));



rest_server.get('/v1/record', recordData);
rest_server.get('/v1/provision', provisionDevice);
rest_server.get('/', handleHealthRequest);
rest_server.get('/index.html', handleHealthRequest);

rest_server.get('/now', handleNowTimeRequest);

rest_server.post('/v1/record/sensordata', handleRecordSensorJSON);
rest_server.post('/v1/record/nodeconfig', handleRecordConfigJSON);


rest_server.get("v1/report/water/:nodename", handleAquaReport);
rest_server.get("v1/report/soil/:nodename", handleSoilReport);
rest_server.get("v1/report/environment/:nodename", handleEnvironmentReport);
rest_server.get("v1/report/currentConditions/:nodename", handleCurrentConditionsReport);
rest_server.get("v1/report/chart/:nodename", handleChartReport);
rest_server.get("v1/report/chart2/:location/:nodename/:sensor/:days", handleChart2Report);

rest_server.get('/health', handleHealthRequest);


var handleInfoRequest = function(request, response) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[url.slice(6)]()));
};

rest_server.get('/info/gen', handleInfoRequest);
rest_server.get('/info/poll', handleInfoRequest);

var deliverFile = function() {
    // fs.readFile('./static' + url, function(err, data) {
    //         if (err) {
    //             res.writeHead(404);
    //             res.end('Not found');
    //         } else {
    //             var ext = path.extname(url).slice(1);
    //             res.setHeader('Content-Type', contentTypes[ext]);
    //             if (ext === 'html') {
    //                 res.setHeader('Cache-Control', 'no-cache, no-store');
    //             }
    //             res.end(data);
    //         }
    //     });
};
var connection_string = "";

var handleServerReady = function() {

    var logo = "\n"
    logo += "      _                 __   _     _  __ _     \n";
    logo += "     | |               / _| | |   (_)/ _| |    \n";
    logo += "     | |     ___  __ _| |_  | |    _| |_| |_   \n";
    logo += "     | |    / _ \\/ _` |  _| | |   | |  _| __|  \n";
    logo += "     | |___|  __/ (_| | |   | |___| | | | |_   \n";
    logo += "     \\_____/\\___|\\__,_|_|   \\_____/_|_|  \\__|  \n";
    logo += "\n      API\n";

    console.log(logo);
    console.log('%s listening at %s', rest_server.name, rest_server.url);
    console.log(`Application worker ${process.pid} started...`);


    // default to a 'localhost' configuration:
    connection_string = '127.0.0.1:27017/api';
    // if OPENSHIFT env variables are present, use the available connection info:
    console.log("OPENSHIFT mongo password: " + process.env.OPENSHIFT_MONGODB_DB_PASSWORD);
    if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
        connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
            process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
            process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
            process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
            process.env.OPENSHIFT_APP_NAME;
    } else {
        connection_string = 'admin:cb6QQZ72SGla@127.0.0.1:55451/api';
    }




    //var mongo_url = 'mongodb://' + mongo_host + ':' + mongo_port + "/api";

    MongoClient.connect("mongodb://" + connection_string, function(err, db) {

        //console.log( err.message );
        assert.equal(null, err);

        mongo_db = db;

        db.collection('SystemStatus').insertOne({ 'msg': "system ready", "date": get_current_date_string() });
        console.log("Started up mongo connection.");

        // recordSensorJSON( {
        //     "hostname":"aqua",
        //     "core_version":"0.0-tree",
        //     "now":"1469060512",
        //     "sensors": {
        //       "uid": "000000",
        //       "ph": "6.90",
        //       "probes": {
        //         "avg": { "temp_c": "26.81" }
        //       }
        //     }
        // });

        checkLastUpdate();

    });

};
var mongo_db;
var mongo_host = process.env.OPENSHIFT_MONGODB_DB_HOST || "localhost";
var mongo_port = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;



var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;



// //provide a sensible default for local development
// mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;
// //take advantage of openshift env vars when available:
// if(process.env.OPENSHIFT_MONGODB_DB_URL){
//   mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
// }





//Setup ip adress and port
var ipaddress;

function initIPAdress() {
    var adr = process.env.NODE_IP;
    if (typeof adr === "undefined") {
        //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
        //  allows us to run/test the app locally.
        console.warn('No OPENSHIFT_NODEJS_IP var, using localhost');
        adr = '192.168.0.9';
    }
    ipaddress = adr;
}
initIPAdress();

var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
rest_server.listen(port, ipaddress, handleServerReady);



// var app = express();
// app.get('/', function(request, response) {
//     response.send("api");
//     response.end();
// });

// app.get('/v1/record', function(request, response) {
//     response.send("stub");
//     response.end();
// });
// app.get('/v1/provision', function(request, response) {
//     response.send("stub");
//     response.end();
// });

// app.listen(port, ipaddress, function() {
//     console.log(`Application worker ${process.pid} started...`);
// });


var nodes = {
    'EcoAquaponics1':"",
    'piruWestGR1':"",
    'piruWestGR2':"",
    'piruNorthGR3a':"",
    'piruNorthGR3b':"",
    'piruNorthGR3c':"",
    'piruNorthUrbanGR1':"",
    'piruNorthUrbanGR2':"",
    'FarmOne':"",
    "PiruGreenhouse":"",
    "piruDryingRoom":"",
    "ICE":"",
    'EastVillage':""
};


function updateLocationInfo() {
    "use strict";
    mongo_db.collection("Locations", function (err, collection) {
        collection.find({}).toArray(function (err, locations) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log("Locations from database: ");
                locations.forEach(function (location, index) {
                    console.log(index + ": " + location.location + " ID: " + location._id);
                    location.sensors.forEach (function (sensor, index) {
                        console.log("  " + index + ": " + sensor.hostname)
                        findInfo2(sensor, location);
                    })
                })
                gatherEmailBody();
            }
        })
    })
    }

function findInfo2 (sensor, location){
    var jsonQuery = {hostname: sensor.hostname} ;
    var jsonProjection = {
        "timestamp": 1,
        "dateTime": 1,
        "dateString": 1,
        "timeString": 1
    } ;
    var jsort = {"timestamp":-1} ;
    mongo_db.collection("SensorData", function(err, collection) {
        collection.find( jsonQuery, jsonProjection).sort(jsort).limit(1).toArray( function(err, items) {
            if (err) {
                console.log(err);
                return
            }
            if(items[0])  {
                var lastUpdate = items[0]["dateTime"];
                var currentTime = new Date();
                var window = 1000*60*60*(2+3);  //the three is added becase everything is in east coast time
                var cutoffTime = currentTime - window;
                if (cutoffTime < lastUpdate) {
                    sensor.lastUpdate = "is current";
                    console.log (sensor.lastUpdate);
                } else {
                    sensor.lastUpdate = "Last update: " + items[0]["dateString"]+ ", " + items[0]["timeString"];
                    console.log (sensor.lastUpdate);
                }
                console.log("Update location: " + location);
                console.log("Sensor: " + sensor);
                updateSensorData(location)
                // } else {
                //     if (hostName !== undefined) {
                //         console.log(hostname + " -> No records found");
                //     }
            }
        });
    });
}

function updateSensorData(location) {
    "use strict";
    mongo_db.collection("Locations", function (err, collection) {
        console.log("Update location: " + location);
        var query = {_id: location._id};
        collection.updateOne(query, location, function (err, res) {
            if (err) {
                console.log("Error: " + err);
            } else {
                console.log("Result: " + res);
            }
        })
    })

}


function findInfo (hostName){
    var jsonQuery = {hostname: hostName} ;
    var jsonProjection = {
        "timestamp": 1,
        "dateTime": 1,
        "dateString": 1,
        "timeString": 1
    } ;
    var jsort = {"timestamp":-1} ;
    mongo_db.collection("SensorData", function(err, collection) {
        collection.find( jsonQuery, jsonProjection).sort(jsort).limit(1).toArray( function(err, items) {
            if (err) {
                console.log(err);
                return
            }
            if(items[0])  {
                var lastUpdate = items[0]["dateTime"];
                var currentTime = new Date();
                var window = 1000*60*60*(2+3);  //the three is added becase everything is in east coast time
                var cutoffTime = currentTime - window;
                if (cutoffTime < lastUpdate) {
                    nodes[hostName] = "<br/>" + hostName + " is current";
                } else {
                    nodes[hostName] = "<br/>Last update for  " + hostName + ": " + items[0]["dateString"]+ ", " + items[0]["timeString"];
                }
                // } else {
                //     if (hostName !== undefined) {
                //         console.log(hostname + " -> No records found");
                //     }
            }
        });
    });
}


function checkLastUpdate() {
    console.log("In last update: " + nodes);

    for (var key in nodes) {
        console.log(key + " -> " + nodes[key])
        findInfo(key);
    }
    // nodes.map(function(nodeName) {
    //     console.log(nodeName);
    //     findInfo(nodeName);
    // });
    updateLocationInfo();
}

var cron = require('node-cron');

new cron.schedule('*/10 * * * *', function() {
    console.log("In cron job");
    updateLocationInfo();
}, true)

// new cron.schedule("*/30 * * * * *", function () {
new cron.schedule("00 10 * * *", function () {
    emailSensorInformation();

})

let emailBody = "";

let gatherEmailBody = function () {
    "use strict";
    mongo_db.collection("Locations", function (err, collection) {
        collection.find({}).toArray(function (err, locations) {
            if (err) {
                console.log ("Error: " + err);
            } else {
                locations.forEach(function (location) {
                    emailBody += "<p>" + location.location + "</p>";
                    location.sensors.forEach(function (sensor) {
                        emailBody += "<p style='margin-left: 40px'>" + sensor.hostname + "-> " + sensor.lastUpdate + "</p>";
                    })
                })
            }
        })
    })

}
let emailSensorInformation = function () {
    // for (var node in nodes) {
    //     body += nodes[node];
    // }
    var mailOptions = {
        from: '"Lee Mandell" <lm@leafliftsystems.com.com>', // sender address
        to: 'bk@leafliftsystems.com,lm@leafliftsystems.com', // list of receivers
        // to: 'lm@leafliftsystems.com', // list of receivers
        subject: 'The Professor update', // Subject line
        text: emailBody, // plaintext body
        html: '<b>' + emailBody + '</b>' // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};


var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://lm%40leafliftsystems.com:6!Notlob@smtp.gmail.com');
