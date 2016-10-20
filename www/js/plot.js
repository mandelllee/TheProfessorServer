var renderSensorCharts = function( hostname, array_of_charts ){

    var cmd = "http://api-quadroponic.rhcloud.com/v1/report/";

    var chart_container_id = hostname +"-charts";
    var base = document.getElementById(chart_container_id);
    //clear any content before adding new. There has got to be a better way of doing this.
    while(base.hasChildNodes()) {
        base.removeChild(base.firstChild);
    }

    for( var n=0; n<array_of_charts.length; n++ ){

        var chart_row = array_of_charts[n];

        var url = cmd + chart_row.report+'/'+hostname;

        var elementid = chart_row.chart;
        var field = chart_row.field;
        var title = chart_row.title;
        var error_margin = chart_row.error_margin;
        plotData(url, elementid, field, title, error_margin,chart_container_id);
        }
        displayCurrentConditions(hostname);
    };

var displayCurrentConditions = function(hostname) {
    var cmd_local = "http://api-quadroponic.rhcloud.com/v1/report/";
    var current_conditions_url = cmd_local + "currentConditions" +'/'+hostname;
 
    var jqxhr = $.getJSON( current_conditions_url, function(data) {
      console.log( "success: " + data);
        var current_conditions_container_id = hostname +"-current-data";
        var base = document.getElementById(current_conditions_container_id);
        //clear any content before adding new. There has got to be a better way of doing this.
        while(base.hasChildNodes()) {
            base.removeChild(base.firstChild);
        }
        var dataArray = data[0];
        var element = document.createElement("div");
        element.appendChild(document.createTextNode("Current Condtions"));
           base.appendChild(element);
        for (var key in dataArray) {
              console.log("key: %o, value: %o", key, dataArray[key]);
              element = document.createElement("div");
                var divContent = document.createTextNode(key + ": " + dataArray[key]);
                element.appendChild(divContent);
         base.appendChild(element);
       }
            })
      .done(function() {
        console.log( "second success" );
      })
      .fail(function() {
        console.log( "error" );
      })
      .always(function() {
        console.log( "complete" );
      });
   //$.get(url, function (result){
    //    alert(result);
   // });
};

var plotData = function(url, elementid, field, title, error_margin,chart_container_id) {
    	var host = '';
        if (error_margin === undefined) error_margin = 20;
        if (chart_container_id === undefined) chart_container_id = 'charts';


    	Plotly.d3.json(host + url, function(rows) {

    	    var trace = {
    	        type: 'scatter', // set the chart type
    	        mode: 'lines', // connect points with lines
    	        x: rows.map(function(row) { // set the x-data
    	            return new Date(row['date']);
    	        }),
    	        y: rows.map(function(row) { // set the x-data

    	            switch (field) {
    	                case ("temp"):
    	                    return row[field] * 1.8 + 32;
    	                    break;
    	                default:
    	                    return row[field];
    	            }

    	        }),
    	        error_y: {
    	            array: rows.map(function(row) { // set the height of the error bars
    	                return error_margin;
    	            }),
    	            color: "#a9a9a9",
    	            thickness: 0.5, // set the thickness of the error bars
    	            width: 0
    	        },
    	        line: { // set the width of the line.
    	            width: 5,
    	            color: "#004200"
    	        }
    	    };

    	    var layout = {
    	        yaxis: {
    	            title: title
    	        }, // set the y axis title
    	        xaxis: {
    	            showgrid: false,
    	            tickangle: -45,
    	            _tickformat: "%a %I:%M%p %e-%b",
    	            tickformat: "%e-%b \n%I:%M%p",
    	            categoryorder: "category decending"
    	        },
    	        wide_margin: { // update the left, bottom, right, top margin
    	            l: 160,
    	            b: 100,
    	            r: 160,
    	            t: 20
    	        },
    	        margin: { // update the left, bottom, right, top margin
    	            l: 50,
    	            b: 100,
    	            r: 5,
    	            t: 20
    	        }
    	    };

    	    var base = document.getElementById(chart_container_id);
    	    var element = document.createElement("div");
    	    var hr = document.createElement("hr");
    	    element.id = elementid;


    	    if (base.children.length > 0) {
   	        base.appendChild(hr);
    	    } 
    	    base.appendChild(element);

    	    Plotly.plot(element, [trace], layout, {
    	        showLink: false
    	    });
    	    charts.push(element);

    	    // $(window).on("resize", function() {
	            
	        //     Plotly.Plots.resize(element);
	        // });

    	});
    	};
var charts = [];

var resizeId;
$(window).resize(function() {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});
 
 
function doneResizing(){
	//alert("done resizing");
    //whatever we want to do
    for( var n=0; n<charts.length; n++){
    	var element=charts[n];
    	Plotly.Plots.resize(element);
    } 
}
    	

