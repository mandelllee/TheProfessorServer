var plotData = function(url, elementid, field, title, error_margin) {
    	var host = '';
    	if (error_margin === undefined) error_margin = 20;


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
    	            tickangle: 0,
    	            tickformat: "%a %I:%M%p %e-%b",
    	            _tickformat: "%a %e-%b",
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

    	    var base = document.getElementById('charts');
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
    	

