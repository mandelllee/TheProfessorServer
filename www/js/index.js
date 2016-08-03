/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



var hostObject = function( data )
{



    return this;
}

var zeroconf;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');

        // if (StatusBar.isVisible) {
        //     StatusBar.hide();
        // }

        
        app.startZeroconf();
        
        app.startBluetooth();


    },
    display: function(message) {
        var display = document.getElementById("message"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label

        display.appendChild(lineBreak);          // add a line break
        display.appendChild(label);              // add the message node
    },
    nodes: {},
    renderNodesList: function(){

        $("#nodes").html("");

        // $("#nodes").append( "<li>Node 1</li>" );
        // $("#nodes").append( "<li>Node 2</li>" );
        // $("#nodes").append( "<li>Node 3</li>" );

        for( var nid in app.nodes ){
            var node = app.nodes[nid];
            var ip = node.addresses[0];
            var row = $( "<li>" + node.name + " " + ip +"</li>" ).css({"height":"3.0em","border":"1px solid black","margin":".1em","padding":".5em"})
           $("#nodes").append( row );
         
        }
    },
    startZeroconf: function(){
        var nodename = "_rootgrid-node";
        var appname = "_rootgrid-app";


        zeroconf = cordova.plugins.zeroconf;
        app.display("startZeroconf");
        
        try {
            zeroconf.register(appname+'._tcp.local.', 'GBSX Dashboard', 8942, {
                'version' : '1.0.0'
            });
        } catch(err){
             app.display("error: " + err.message );
        }
        try {
            
            app.display("watching for: "+nodename+"._tcp.local." );
            zeroconf.watch(nodename+'._tcp.local.', function(result) {
                var action = result.action;
                var service = result.service;
                if (action == 'added') {
                    var name = service.name;
                    if( nodes[ name ] === undefined ) {
                        //alert("new node");
                        //service.ip = 
                        app.nodes[name] = service;
                        app.renderNodesList();                        
                    } else {

                    }
                    //app.display('service added');
                    for( var k in service ){
                        var o = service[k];
                        if( typeof( o )=="object" ){
                            app.display( " " + k + ":" );
                            for( var kk in o ){
                                app.display( "  [" + kk + "]:" + o[kk] );
                            }
                        } else {
                            app.display( " " + k + ":" + o );
                        }
                    }
                } else {
                    app.display('service removed' + service);
                    var name = service.name;
                    if( nodes[ name ] === undefined ) {
                        alert("service removed");
                        app.nodes[name] = undefined;
                        app.renderNodesList();

                    } else {

                    }

                    for( var k in service ){

                        var o = service[k];
                        app.display( " " + k + ": " + o );             
                    }
                }
            });
        } catch(err){
            app.display("error: " + err.message );
        }

    },
    startBluetooth: function(){
        app.display("starting bluetooth...");
        var listPorts = function() {
            // list the available BT ports:
            bluetoothSerial.list(
                function(results) {
                    app.display(JSON.stringify(results));
                },
                function(error) {
                    app.display(JSON.stringify(error));
                }
            );
        };

        // if isEnabled returns failure, this function is called:
        var notEnabled = function() {
            app.display("Bluetooth is not enabled.")
        };

         // check if Bluetooth is on:
        bluetoothSerial.isEnabled(
            listPorts,
            notEnabled
        );

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();