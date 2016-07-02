var express = require('express');
var app = express();

app.get('/', function(request, response) {
  response.send("welcome");
    response.end();

});

app.get('/v1/record', function(request, response) {



    try {

        var GoogleSpreadsheet = require('google-spreadsheet');
        var async = require('async');



        var doc = new GoogleSpreadsheet('1Yr3d8pXQllWeyCImAO6XK0u_NgsKmbjGjc9SEn9wM3I');
        var sheet;
        var worksheets;

        var current_month_sheet = null;

        var now_date = new Date();

        var get_current_month_string = function() {

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
        }
        var current_month_string = get_current_month_string();

        console.log("current_month_string=" + current_month_string);

        var get_current_date_string = function() {

            return now_date.getMonth() + "/" + now_date.getDay() + "/" + now_date.getFullYear() + " " + now_date.getHours() + ":" + now_date.getMinutes() + ":" + now_date.getSeconds();
        }
        var current_date_string = get_current_date_string();

        async.series([
            function setAuth(step) {
                //var creds = require('./google-generated-creds.json');
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
                doc.useServiceAccountAuth(creds, step);
            },
            function getInfoAndWorksheets(step) {
                doc.getInfo(function(err, info) {
                    console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);

                    worksheets = info.worksheets;
                    console.log("we have " + worksheets.length + " worksheets");
                    for (var n = 0; n < worksheets.length; n++) {
                        var worksheet = worksheets[n];

                        console.log(" [" + n + "] " + worksheet.title + " (" + worksheet.rowCount + " rows)");

                        if (worksheet.title == current_month_string) {
                            console.log("Found this month's sheet");
                            current_month_sheet = worksheet;

                        }
                    }

                    if (current_month_sheet == null) {
                        // create the sheet if we did not find it
                        console.log("creating worksheet [" + current_month_string + "]");

                        doc.addWorksheet({
                            title: current_month_string,
                            rowCount: 50,
                            colCount: 7,
                            headers: [
                                "date", "boardid", "boardname", "type", "propertyname", "value", "core_version", "id"
                            ]
                        }, function(err, sheet) {
                            current_month_sheet = sheet;

                            step();

                        });

                    } else {
                        step();
                    }
                });
            },
            // function workingWithRows(step) {
            //   // google provides some query options 
            //   sheet.getRows({
            //     offset: 1,
            //     limit: 20,
            //     orderby: 'col2'
            //   }, function( err, rows ){
            //     console.log('Read '+rows.length+' rows');

            //     // the row is an object with keys set by the column headers 
            //     rows[0].colname = 'new val';
            //     rows[0].save(); // this is async 

            //     // deleting a row 
            //     rows[0].del();  // this is async 

            //     step();
            //   });
            // },
            // function workingWithCells(step) {
            //   sheet.getCells({
            //     'min-row': 1,
            //     'max-row': 5,
            //     'return-empty': true
            //   }, function(err, cells) {
            //     var cell = cells[0];
            //     console.log('Cell R'+cell.row+'C'+cell.col+' = '+cells.value);

            //     // cells have a value, numericValue, and formula 
            //     cell.value == '1'
            //     cell.numericValue == 1;
            //     cell.formula == '=ROW()';

            //     // updating `value` is "smart" and generally handles things for you 
            //     cell.value = 123;
            //     cell.value = '=A1+B2'
            //     cell.save(); //async 

            //     // bulk updates make it easy to update many cells at once 
            //     cells[0].value = 1;
            //     cells[1].value = 2;
            //     cells[2].formula = '=A1+B1';
            //     sheet.bulkUpdateCells(cells); //async 

            //     step();
            //   });
            // },
            // function managingSheets(step) {
            //     doc.addWorksheet({
            //         title: 'my new sheet',
            //         rowCount: 50,
            //         colCount: 9,
            //         headers: [
            //             "date", "learner", "module", "section", "description", "category", "status", "notes", "model"
            //         ]
            //     }, function(err, sheet) {

            //         sheet.getRows({
            //             offset: 1,
            //             limit: 1
            //         }, function(err, rows) {

            //             console.log('Read ' + rows.length + ' rows');
            //             step();
            //         });
            //     });
            // },
            function addRow(step) {

              
                var url = require('url');
                var url_parts = url.parse(request.url, true);
                var query = url_parts.query;


                var boardid = query.boardid;
                var module = "Testing Module";
                var section = "n/a";
                var description = "Test Script";
                var category = "?";
                var status = "";
                var notes = "";
                var model = "";
                current_month_sheet.addRow({
                    "id": query.id,
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

                res.send('id: ' + req.query.id);


            }
        ]);


    } catch (err) {
        console.log(err);
        response.end('error' + err);
    }

    response.end("recorded");

});


app.listen(env.NODE_PORT || 3000);



// } else if (url == '/health') {
//     res.writeHead(200);
//     res.end();
// } else if (url == '/info/gen' || url == '/info/poll') {
//     res.setHeader('Content-Type', 'application/json');
//     res.setHeader('Cache-Control', 'no-cache, no-store');
//     res.end(JSON.stringify(sysInfo[url.slice(6)]()));
// } else {
//     fs.readFile('./static' + url, function(err, data) {
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
// }
// server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function() {
//     console.log(`Application worker ${process.pid} started...`);
// });