jQuery(document).ready(function($) {


    $.getScript("http://d3js.org/d3.v3.js");

    var renderGraph = function() {

        var y_axis_label = "Height (cm)";
        var x_axis_label = "Age (weeks)";

        var svg = d3.select("#ph-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }

    var pages = [];

    var addPage = function(title, currentCondtions, content, selected) {

        var pageNum = pages.length;


        var leftPage = $("<li><div><a href=\"#" + pageNum + "\"><h2>" + title + "</div> "  + currentCondtions +  "</li>");
        var rightPage = $("<li><div><h2>" + title + "</h2>" + content + "</div></li>");

        if (selected === true) {
            leftPage.addClass("is-selected");
            rightPage.addClass("is-selected");
        }
        //leftPage.append( getLoremP( Math.random() * 4) );
        rightPage.append('<div style="color:white;">' + '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ' + '</div>');

        pages.push({
            pagenum: pageNum,
            title: title,
            content: content,

            leftpage: leftPage,
            rightpage: rightPage
        });


        // $("#left-page-list").append('<li'++selected_text'><a><h2>'+title+'</h2></a></li>');
        //    $("#right-page-list").append('<li><div><h2>'+title+'</h2>'+content+'</div></li>');
        // console.log( leftPage );
        // console.log( rightPage );
        $("#left-page-list").append(leftPage);
        $("#right-page-list").append(rightPage);

    }

    var getLoremP = function(num) {
            if (num === undefined) num = 1;
            var html = "";
            for (var n = 0; n < num; n++) {
                var lorem_p = '<p><img src="img/logo.png" style="float:' + (Math.random() > .5 ? "right" : "left") + ';" />Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quasi cum quisquam, libero molestiae cupiditate, omnis? Provident excepturi, nobis cupiditate, nulla dolorem dignissimos error necessitatibus, sint praesentium dolores, harum! Aliquam sequi impedit corrupti, numquam maiores ipsa commodi excepturi eligendi cupiditate adipisci atque sint iste aspernatur, hic sed modi at voluptatum nihil incidunt, fugiat repellendus beatae debitis, soluta blanditiis culpa! Magnam quisquam tempore exercitationem molestias cupiditate quam aut eum perferendis deleniti doloribus et quos dolore excepturi, rem incidunt consectetur quia accusantium placeat quae officiis in ab. Veniam sapiente aut est asperiores nihil reprehenderit incidunt cupiditate, voluptatibus nemo iste. Quos, ullam. Cupiditate, sed.</p>';
                html += lorem_p;
            }
            return html;
        }
        // $("#right-page-list").append('<li class="is-selected"><div><h2>Baby Cam</h2><div id="baby-room-temp-display"></div><img src="http://admin:OrlandoNakazawa!@10.5.1.8/video.cgi" style="width:100%" /></div></li>');

    // $("#left-page-list").append('<li class="is-selected"><a href="#0"><h2>Baby Cam</h2></a></li>');

    //addPage( "Test 1", "Test 1 content" );


    // addPage( "The Morning", getLoremP(7) );
    // addPage( "The Afternoon", getLoremP(5) );
    // addPage( "The Evening", getLoremP(3) );

    var showPlottedData = function() {

        var d3 = Plotly.d3;

        var gd3 = d3.select('#charts');


        var gd = gd3.node();

        Plotly.plot(gd, [{
            type: 'bar',
            x: [1, 2, 3, 4],
            y: [5, 10, 2, 8],
            marker: {
                color: '#C8A2C8',
                line: {
                    width: 2.5
                }
            }
        }], {
            title: 'Auto-Resize',
            font: {
                size: 16
            }
        });

        window.onresize = function() {
            Plotly.Plots.resize(gd);
        };

    }

    addPage("Overview", '<div> </div>', '<div id="start-content"><h1>This is a basic dashboard utility to display sensor data.</h1></div>', true);
    //addPage("Sensors", '<div id="charts"></div>', false);

    addPage("Node:piru", '<div class=current-data id="piru-current-data"></div>', '<div id="piru-charts"></div>', false);
    addPage("Node:piruGreenhouseEnvironment", '<div class=current-data id="piruGreenhouseEnvironment-current-data"></div>', '<div id="piruGreenhouseEnvironment-charts"></div>', false);
    addPage("Node:EastVillage", '<div class=current-data id="EastVillage-current-data"></div>', '<div id="EastVillage-charts"></div>', false);
    addPage("Node:potato", '<div class=current-data id="potato-current-data"> </div>', '<div id="potato-charts"></div>', false);
    addPage("Node:pepper", '<div class=current-data id="pepper-current-data"> </div>', '<div id="pepper-charts"></div>', false);
    addPage("Node:aqua", '<div class=current-data id="aqua-current-data"> </div>', '<div id="aqua-charts"></div>', false);
    addPage("Node:tempo", '<div class=current-data id="tempo-current-data"> </div>', '<div id="tempo-charts"></div>', false);
    addPage("Node:ford", '<div class=current-data id="ford-current-data"> </div>', '<div id="ford-charts"></div>', false);

    addPage("Settings", '<div> </div>', '<div id="settings"></div>', false);

    //setTimeout( showPlottedData, 2000 );

    var cmd = "http://api-quadroponic.rhcloud.com/v1/report/";

    var renderAllNodes = function() {
        renderSensorCharts( "potato", [
            { title: "Soil Moisture (Mint)", report: "soil", field:"soil_1", chart:"soil_chart_potato", error_margin: 20 }
        ]);
        //plotData(cmd + 'soil/potato', "soil_chart_potato", "soil_1", "Soil Moisture (Mint)");


        renderSensorCharts( "pepper", [
            { title: "Soil Moisture (Succulent)", report: "soil", field:"soil_3", chart:"soil_chart_pepper", error_margin: 20 },
            { title: "Soil Moisture (Dome)", report: "soil", field:"soil_1", chart:"soil_chart_pepper1", error_margin: 20 },
            { title: "Humidity (Aquarium Room)", report: "environment", field:"air_humidity", chart:"humidity_chart_pepper", error_margin: 5 },
            { title: "Air Temp (Aquarium Room)", report: "environment", field:"air_temp_f_dht", chart:"humidity_chart_pepper", error_margin: 5 }
        ]);

        // plotData(cmd + 'soil/pepper', "soil_chart_pepper3", "soil_3", "Soil Moisture (Succulent)");
        // plotData(cmd + 'soil/pepper', "soil_chart_pepper1", "soil_1", "Soil Moisture (Dome)");
        
        // plotData(cmd + 'environment/pepper', "humidity_chart_pepper", "air_humidity", "Humidity (Aquarium Room)", 5);
        // plotData(cmd + 'environment/pepper', "temp_chart_pepper", "air_temp_f_dht", "Temp(F) (Aquarium Room)", 5);

        renderSensorCharts( "aqua", [
            { title: "Aquarium pH", report: "water", field:"ph", chart:"ph_cart_aqua", error_margin: .02 },
            { title: "Aquarium Temp (f)", report: "water", field:"temp", chart:"temp_cart_aqua", error_margin: .5 },
            { title: "Aquarium Flow (LPH)", report: "water", field:"water_flow_lph", chart:"flow_cart_aqua", error_margin: .5 }
        ]);
        // plotData(cmd + 'water/aqua', "ph_cart_aqua", "ph", "Aquarium pH", .02);
        // plotData(cmd + 'water/aqua', "temp_cart_aqua", "temp", "Aquarium Temp (f)", .5);
        // plotData(cmd + 'water/aqua', "flow_cart_aqua", "water_flow_lph", "Aquarium Flow (LPH)", .5);


        // plotData(cmd + 'soil/ford', "soil_chart_ford", "soil_1", "Soil Moisture (Basil)", 2);
        // plotData(cmd + 'environment/ford', "humidity_chart_ford", "air_humidity", "Humidity(Basil)", 2);
        // plotData(cmd + 'environment/ford', "temp_chart_ford", "air_temp_f", "Temp(F) (Basil)", 2);
        renderSensorCharts( "ford", [
            { title: "Soil Moisture (Basil)", report: "soil", field:"soil_1", chart:"soil_chart_ford", error_margin: 2 },
            { title: "Humidity(Basil)", report: "environment", field:"air_humidity", chart:"humidity_chart_ford", error_margin: 2 },
            { title: "Temp (F) (window)", report: "environment", field:"air_temp_f_dht", chart:"temp_chart_ford", error_margin: 2 }
        ]);

        // plotData(cmd + 'environment/tempo', "lux_chart_tempo", "light_lux", "LUX (window)", 500);
        // plotData(cmd + 'environment/tempo', "humidity_chart_tempo", "air_humidity", "Humidity (window)", 5);
        // plotData(cmd + 'environment/tempo', "temp_chart_tempo", "air_temp_f", "Temp (F) (window)", 2);
        renderSensorCharts( "tempo", [
            { title: "LUX (window)", report: "environment", field:"light_lux", chart:"lux_chart_tempo", error_margin: 500 },
            { title: "Humidity (window)", report: "environment", field:"air_humidity", chart:"humidity_chart_tempo", error_margin: 5 },
            { title: "Temp (F) (window)", report: "environment", field:"air_temp_f", chart:"temp_chart_tempo", error_margin: 2 }
        ]);

        renderSensorCharts( "piru", [
            { title: "LUX (Corral)", report: "environment", field:"light_lux", chart:"lux_chart_piru", error_margin: 500 },
            { title: "Humidity (Corral)", report: "environment", field:"air_humidity", chart:"humidity_chart_piru", error_margin: 5 },
            { title: "Temp (F) (Corral)", report: "environment", field:"air_temp_f_dht", chart:"temp_chart_piru", error_margin: 2 },
            { title: "Temp (F) (Inside Box)", report: "environment", field:"air_temp_f", chart:"temp_inside_box_chart_piru", error_margin: 2 },
            { title: "Reservior pH", report: "water", field:"ph", chart:"ph_cart_piru", error_margin: .02 },
            { title: "Reservior Temp (f)", report: "water", field:"temp", chart:"temp_cart_piru", error_margin: .5 },
            { title: "EC", report: "water", field:"EC", chart:"ec_chart_piru", error_margin: .02},
            { title: "TDS", report: "water", field:"TDS", chart:"tds_chart_piru", error_margin: 2},
            { title: "Salinity", report: "water", field:"Salinity", chart:"salinity_chart_piru", error_margin: 1}
        ]);
        renderSensorCharts( "piruGreenhouseEnvironment", [
            { title: "LUX", report: "environment", field:"light_lux", chart:"lux_chart_piruGreenhouseEnvironment", error_margin: 500 },
            { title: "Humidity", report: "environment", field:"air_humidity", chart:"humidity_chart_piruGreenhouseEnvironment", error_margin: 5 },
            { title: "Temp (F)", report: "environment", field:"air_temp_f_dht", chart:"temp_chart_piruGreenhouseEnvironment", error_margin: 2 },
            { title: "Temp (F) -  BMP", report: "environment", field:"air_temp_f", chart:"temp_chart2_piruGreenhouseEnvironment", error_margin: 2 },
            { title: "Air Pressure", report: "environment", field:"air_pressure", chart:"pressure_chart_piruGreenhouseEnvironment", error_margin: 2 },
        ]);

        renderSensorCharts( "EastVillage", [
            { title: "LUX ", report: "environment", field:"light_lux", chart:"lux_chart_EastVillage", error_margin: 500 },
            { title: "Humidity", report: "environment", field:"air_humidity", chart:"humidity_chart_EastVillage", error_margin: 5 },
            { title: "Temp (F)", report: "environment", field:"air_temp_f_dht", chart:"temp_chart_EastVillage", error_margin: 2 },
        ]);
    };

    renderAllNodes();

 // var aquariumHost = "aqua.local";

    // var updateTankStatus = function() {
    //     $.getJSON("http://" + aquariumHost + "/sensors.json", function(data) {
    //         var status = data.sensors;

    //         var d = new Date();
    //         var day = d.getDate();
    //         var month = d.getMonth() + 1;
    //         var year = d.getFullYear();
    //         if (day < 10) {
    //             day = "0" + day;
    //         }
    //         if (month < 10) {
    //             month = "0" + month;
    //         }
    //         var date_string = month + "/" + day;
    //         var time_string = (d.getHours() > 12) ? ((d.getHours() - 12) + ":" + d.getMinutes() + "pm") : d.getHours() + ":" + d.getMinutes() + "am";

    //         $("#tank-lastupdate-display").html(date_string + " - " + time_string);

    //         $("#tank-temp-display").html(status.probes.avg.temp_c + "&deg;c");
    //         $("#tank-ph-display").html("pH " + status.ph + "");
    //         //$("#tank-flow-display").html( "~" + status.flow + " lph");

    //         setTimeout(updateTankStatus, 10 * 1000);
    //     });
    // }
    // updateTankStatus();




    //store DOM elements
    var imageWrapper = $('.cd-images-list'),
        imagesList = imageWrapper.children('li'),
        contentWrapper = $('.cd-content-block'),
        contentList = contentWrapper.children('ul').eq(0).children('li'),
        blockNavigation = $('.block-navigation'),
        blockNavigationNext = blockNavigation.find('.cd-next'),
        blockNavigationPrev = blockNavigation.find('.cd-prev'),
        //used to check if the animation is running
        animating = false;

    //on mobile - open a single project content when selecting a project image
    imageWrapper.on('click', 'a', function(event) {
        event.preventDefault();
        var device = MQ();

        (device == 'mobile') && updateblock(imagesList.index($(this).parent('li')), 'mobile');
    });

    //on mobile - close visible project when clicking the .cd-close btn
    contentWrapper.on('click', '.cd-close', function() {
        var closeBtn = $(this);
        if (!animating) {
            animating = true;

            closeBtn.removeClass('is-scaled-up').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                contentWrapper.removeClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                    animating = false;
                });

                $('.cd-image-block').removeClass('content-block-is-visible');
                closeBtn.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
            });
        }
    });

    //on desktop - update visible project when clicking the .block-navigation
    blockNavigation.on('click', 'button', function() {
        var direction = $(this),
            indexVisibleblock = imagesList.index(imageWrapper.children('li.is-selected'));

        if (!direction.hasClass('inactive')) {
            var index = (direction.hasClass('cd-next')) ? (indexVisibleblock + 1) : (indexVisibleblock - 1);
            updateblock(index);
        }
    });

    //on desktop - update visible project on keydown
    $(document).on('keydown', function(event) {
        var device = MQ();
        if (event.which == '39' && !blockNavigationNext.hasClass('inactive') && device == 'desktop') {
            //go to next project
            updateblock(imagesList.index(imageWrapper.children('li.is-selected')) + 1);
        } else if (event.which == '37' && !blockNavigationPrev.hasClass('inactive') && device == 'desktop') {
            //go to previous project
            updateblock(imagesList.index(imageWrapper.children('li.is-selected')) - 1);
        }
    });

    function updateblock(n, device) {
        if (!animating) {
            animating = true;
            var imageItem = imagesList.eq(n),
                contentItem = contentList.eq(n);

            classUpdate($([imageItem, contentItem]));

            if (device == 'mobile') {
                contentItem.scrollTop(0);
                $('.cd-image-block').addClass('content-block-is-visible');
                contentWrapper.addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                    contentWrapper.find('.cd-close').addClass('is-scaled-up');
                    animating = false;
                });
            } else {
                contentList.addClass('overflow-hidden');
                contentItem.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                    contentItem.siblings().scrollTop(0);
                    contentList.removeClass('overflow-hidden');
                    animating = false;
                });
            }

            //if browser doesn't support transition
            if ($('.no-csstransitions').length > 0) animating = false;

            updateblockNavigation(n);
        }
    }

    function classUpdate(items) {
        items.each(function() {
            var item = $(this);
            item.addClass('is-selected').removeClass('move-left').siblings().removeClass('is-selected').end().prevAll().addClass('move-left').end().nextAll().removeClass('move-left');
        });
    }

    function updateblockNavigation(n) {
        (n == 0) ? blockNavigationPrev.addClass('inactive'): blockNavigationPrev.removeClass('inactive');
        (n + 1 >= imagesList.length) ? blockNavigationNext.addClass('inactive'): blockNavigationNext.removeClass('inactive');
    }

    function MQ() {
        return window.getComputedStyle(imageWrapper.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "").split(', ');
    }

    $(document).ready(
            function() {
                setInterval(function() {
                renderAllNodes();
                }, 5*60*1000);
            });
 

});