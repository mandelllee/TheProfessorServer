var GoogleSpreadsheet = require('google-spreadsheet');
var express = require('express');
var async = require('async');


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

    var query = request.query;

    try {
        var doc = new GoogleSpreadsheet('1Yr3d8pXQllWeyCImAO6XK0u_NgsKmbjGjc9SEn9wM3I');
        var sheet;
        var worksheets;
        var current_month_sheet = null;
        var active_worksheet = null;

        var current_month_string = get_current_month_string();
        var worksheet_name = query.boardname;

        //console.log("current_month_string=" + current_month_string);


        var current_date_string = get_current_date_string();

        async.series([
            function setAuth(step) {
                //var creds = require('./google-generated-creds.json');
                doc.useServiceAccountAuth(creds, step);
            },
            function getInfoAndWorksheets(step) {
                doc.getInfo(function(err, info) {
                    //console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);

                    worksheets = info.worksheets;
                    //console.log("we have " + worksheets.length + " worksheets");
                    for (var n = 0; n < worksheets.length; n++) {
                        var worksheet = worksheets[n];

                        //console.log(" [" + n + "] " + worksheet.title + " (" + worksheet.rowCount + " rows)");

                        if (worksheet.title == worksheet_name) {
                            active_worksheet = worksheet;
                        }
                        // if (worksheet.title == current_month_string) {
                        //     console.log("Found this month's sheet");
                        //     current_month_sheet = worksheet;
                        // }
                    }
                    if (active_worksheet == null) {
                        // create the sheet if we did not find it
                        console.log("creating worksheet [" + worksheet_name + "]");

                        doc.addWorksheet({
                            title: worksheet_name,
                            rowCount: 50,
                            colCount: 7,
                            headers: [
                                "date", "boardid", "boardname", "type", "propertyname", "value", "core_version", "id", "description"
                            ]
                        }, function(err, sheet) {
                            active_worksheet = sheet;
                            step();
                        });

                    } else {
                        step();
                    }
                });
            },

            function addRow(step) {
                //var url = require('url');
                //var url_parts = url.parse(request.url, true);

                var boardid = query.boardid;
                var module = "Testing Module";
                var section = "n/a";
                var description = "Test Script";
                var category = "?";
                var status = "";
                var notes = "";
                var model = "";

                console.log("recording data for board[" + boardid + "] " + query.propertyname + "=" + query.value);

                active_worksheet.addRow({
                    "id": query.id,
                    "description": query.description,
                    "type": query.type,
                    "propertyname": query.propertyname,
                    "value": query.value,

                    "date": current_date_string,
                    "boardid": query.boardid,
                    "boardname": query.boardname,

                    "core_version": query.core_version,
                }, function(err) {
                    if (err != null) console.log("error: " + err);
                });
            },
            function allDone(step) {
                res.send('id: ' + query.id);
            }
        ]);

    } catch (err) {
        console.log(err);
        response.end('error' + err);
    }

    response.end("recorded");

}



var handleRecordConfigJSON = function(request, response) {

    console.log("handleRecordConfigJSON");

    //var json = JSON.stringify( request.body );
    var json = (request.body);

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
    var r = mongo_db.collection('ConfigData').insert(json, callback);

};


var handleRecordSensorJSON = function(request, response) {

    console.log("handleRecordSensorJSON");

    //var json = JSON.stringify( request.body );
    var json = (request.body);
    json.timestamp = getNowTimestamp();

    console.log(request);
    //console.log( "hostname: " + json.hostname );

    recordSensorJSON(json, function(err, doc) {

        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Cache-Control', 'no-cache, no-store');

        response.end("done");
    });

}

var recordSensorJSON = function(json, callback) {

    console.log(json);


    var r = mongo_db.collection('SensorData').insert(json, callback);


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
var handleAquaReport = function(request, response) {

    console.log("Water report for [" + request.params.nodename + "]");

    mongo_db.collection('SensorData').aggregate([{
            $match: { hostname: request.params.nodename }
        }, {
            $project: {
                hostname: "$hostname",
                //now:"$now",
                //timestamp: "$timestamp",
                date: { $add: [new Date(0), "$timestamp"] },

                //p: { $concat: new Date( "$timestamp").toTimeString() },
                //d:  ISODate("$date"),

                //cal: "$sensors.soil.calibration",
                ph: "$sensors.ph",
                temp: "$sensors.probes.avg.temp_c",
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
        { $sort: { date: -1 } }, { $limit: row_limit }
    ], function(err, result) {
        response.setHeader('Content-Type', 'application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(result);
    });

};
var handleEnvironmentReport = function(request, response) {

    console.log("Environment Report for [" + request.params.nodename + "]");
    mongo_db.collection('SensorData').aggregate([{
            $match: { hostname: request.params.nodename }
        }, {
            $project: {
                hostname: "$hostname",
                //now:"$now",
                //timestamp: "$timestamp",
                date: { $add: [new Date(0), "$timestamp"] },

                light_lux: "$sensors.tsl2561.lux",

                air_temp_f: "$sensors.bmp085.temp_f",
                air_pressure: "$sensors.bmp085.pressure",
                
                air_humidity: "$sensors.dht11.dht_humidity",
                air_temp_f_dht: "$sensors.dht11.dht_temp_f",
                
                _id: 0
            }

        },
        { $sort: { date: -1 } }, { $limit: row_limit }
    ], function(err, result) {

        response.setHeader('Content-Type', 'application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(result);
    });
};


var handleSoilReport = function(request, response) {

    console.log("Soil Report for [" + request.params.nodename + "]");

    mongo_db.collection('SensorData').aggregate([{
            $match: { hostname: request.params.nodename }
        }, {
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
        },
        { $sort: { date: -1 } }, { $limit: row_limit }
    ], function(err, result) {
        response.setHeader('Content-Type', 'application/json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.json(result);
    });


}

rest_server.get(/\/static\/?.*/, restify.serveStatic({
    directory: __dirname
}));


var serveStatic = require('serve-static-restify');

rest_server.pre(serveStatic('dashboard/', {'index': ['index.html']}));

// rest_server.get(/\/dashboard\/?.*/, restify.serveStatic({
//     directory: __dirname,
//     index: 'index.html'
// }));


rest_server.get('/v1/record', recordData);
rest_server.get('/v1/provision', provisionDevice);
rest_server.get('/', handleHealthRequest);
rest_server.get('/index.html', handleHealthRequest);

rest_server.get('/now', handleNowTimeRequest);

rest_server.post('/v1/record/sensordata', handleRecordSensorJSON);
rest_server.post('/v1/record/nodeconfig', handleRecordConfigJSON);


rest_server.get("v1/report/water/:nodename", handleAquaReport)
rest_server.get("v1/report/soil/:nodename", handleSoilReport)
rest_server.get("v1/report/environment/:nodename", handleEnvironmentReport)

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
    if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
        connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
            process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
            process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
            process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
            process.env.OPENSHIFT_APP_NAME;
    }




    //var mongo_url = 'mongodb://' + mongo_host + ':' + mongo_port + "/api";
    console.log("Connecting mongo [" + connection_string + "]");

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
        adr = '10.5.1.25';
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