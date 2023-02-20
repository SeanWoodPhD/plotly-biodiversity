function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/js/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged() {
  // Fetch new data each time a new sample is selected
  var newSample = d3.select("#selDataset").property("value");
  console.log(newSample)
  // console.log(asdf);
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/js/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("static/js/samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var filteredMetaData = metadata.filter(sampleObj => sampleObj.id == sample);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    firstSample = filteredSamples[0];

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    firstMetaData = filteredMetaData[0];

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var otuSampleValues = firstSample.sample_values;

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wfreq = firstMetaData.wfreq;

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 

    // The data is already sorted by sample_values, so we simply need to cut out the
    // top 10 IDs.
    top10IDs = otuIDs.slice(0,10);

    // We want the yticks to be in the format "OTU {ID}" so we map that from the
    // top10IDs variable and then reverse the order so that the highest number
    // shows up at the top of the horizontal bar plot.
    var yticks = top10IDs.map(otuIDs => `OTU ${otuIDs} `).reverse();

    // Deliverable 1: 8. Create the trace for the bar chart.
    var xData = otuSampleValues.slice(0,10).reverse();
    var hoverText = otuLabels.slice(0,10).reverse();
    var barData = [
      {
        x: xData,
        y: yticks,
        text: hoverText,
        type: 'bar',
        orientation: 'h',
        marker: {color: '#77B07B'}
      }
    ];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: '<b>Top 10 Bacteria Cultures Found</b>',
      plot_bgcolor: '#121212',
      paper_bgcolor: '#121212',
      font: {color: 'white'}
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    // Plotly.newPlot('bar', barData, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otuIDs,
        y: otuSampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: otuSampleValues,
          color: otuIDs,
          colorscale: 'Greens',
          line: {color: 'black'}
        }
      }
    ];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacteria Cultures Per Sample</b>',
      xaxis: {title: 'OTU ID'},
      // automargin: true,
      hovermode: 'closest',
      plot_bgcolor: '#121212',
      paper_bgcolor: '#121212',
      font: {color: 'white'}
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    // Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    var plotChoice = d3.select("#plots").property('value');;
    console.log(plotChoice);

    // Determine which plot gets made based on user input.
    if (plotChoice === "bar") {
      plotData = barData;
      plotLayout = barLayout;
    }

    else if (plotChoice === "bubble") {
      plotData = bubbleData;
      plotLayout = bubbleLayout;
    }

    Plotly.newPlot('bubble', plotData, plotLayout);
    
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        type: 'indicator',
        value: wfreq,
        mode: 'gauge+number',
        title: { text: '<b>Belly Button Washing Frequency</b><br># of Scrubs per Week'},
        gauge: {
          axis: {range: [null,10], tickwidth: 1, tickcolor: 'black', dtick: 2},
          bar: {color: 'black'},
          steps: [
            {range: [0, 2], color: "#DE4527"},
            {range: [2, 4], color: "#ECE1B4"},
            {range: [4, 6], color: "#77B07B"},
            {range: [6, 8], color: "#1F533E"},
            {range: [8, 10], color: "#0C2328"}
          ]
        }
      }
    ];
    
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      autosize: true,
      plot_bgcolor: '#121212',
      paper_bgcolor: '#121212',
      font: {color: 'white'}
    };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
