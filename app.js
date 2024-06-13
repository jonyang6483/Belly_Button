//Set variable for url link
const url= "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// creating variables for the relevant datasets.
let samples;
let metadata;
let names;

// Promise Pending
d3.json(url).then(function(data) {
  console.log("data is", data)

    // assigning Samples, Metadata, and Names.
    samples = data.samples;
    metadata = data.metadata;
    names = data.names;
    
    console.log("Samples: ",samples);
    console.log("metadata: ",metadata);

    let selected_id = samples[0];

    let sample_values = selected_id.sample_values.slice(0,10);
    sample_values.reverse();
    let otu_ids = selected_id.otu_ids.slice(0,10);
    otu_ids.reverse();
    let otu_labels = selected_id.otu_labels.slice(0,10);
    otu_labels.reverse();

    otu_ids = otu_ids.map(id => `OTU ${id} `);

    // Default plots with the first id.
    function init() {

      // Bar chart
      let trace = [{
          x: sample_values,
          y: otu_ids,
          hovertext: otu_labels,
          type: "bar",
          orientation: "h"
      }];
  
      Plotly.newPlot("bar", trace);

      // Bubble Chart
      sample_values = selected_id.sample_values;
      otu_ids = selected_id.otu_ids;
      otu_labels = selected_id.otu_labels;

      let trace2 = [{
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
              opacity: 0.75,
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth",
              sizeref: 1.32
          }
      }];

      // Adding a title for the Bubble X-axis
      let layout = {
          xaxis: {
              title: "OTU ID"
          }
      }

       // Plotting the Bubble chart
       Plotly.newPlot("bubble", trace2, layout);

       // Metadata table
       let table = d3.select("#sample-metadata");

       // Creating rows in the Metadata Info table with ids for updating.
       let row0 = table.append("tr").attr("id","id");
       let row1 = table.append("tr").attr("id","ethnicity");
       let row2 = table.append("tr").attr("id","gender");
       let row3 = table.append("tr").attr("id","age");
       let row4 = table.append("tr").attr("id","location");
       let row5 = table.append("tr").attr("id","bbtype");
       let row6 = table.append("tr").attr("id","wfreq");

       // inserting the initial values for the first id in the dataset.
       row0.text(`id: ${metadata[0].id}`);
       row1.text(`ethnicity: ${metadata[0].ethnicity}`);
       row2.text(`gender: ${metadata[0].gender}`);
       row3.text(`age: ${metadata[0].age}`);
       row4.text(`location: ${metadata[0].location}`);
       row5.text(`bbtype: ${metadata[0].bbtype}`);
       row6.text(`wfreq: ${metadata[0].wfreq}`);

  };
       
  // Adding the ids to the dropdown
  let dropdown = d3.select("select");

  for (let i = 0; i < names.length; i++) {
    dropdown.append("option").text(names[i]);
  };

  init();

});

//------------------------------------------------------------------------------------------------------------------------------
// Function for changing the ID and the visualizations.

function optionChanged(id) {

  for (let i=0; i<samples.length; i++) {
      if (String(samples[i].id) == id) {
          selected_id = samples[i];
      }
  };

  // Updating the Bar Chart

  updateBarChart(selected_id);

  // Updating the Bubble Chart

  updateBubbleChart(selected_id);

  // Updating the Metadata Info

  updateMetadata(id);

};

//------------------------------------------------------------------------------------------------------------------------------
// Function to Update Bar Chart.

function updateBarChart(selected_id) {

  // Setting the variables.
  sample_values = selected_id.sample_values.slice(0,10);
  sample_values.reverse();
  otu_ids = selected_id.otu_ids.slice(0,10);
  otu_ids.reverse();
  otu_labels = selected_id.otu_labels.slice(0,10);
  otu_labels.reverse();

  otu_ids = otu_ids.map(id => `OTU ${id} `);

  // Restyling the Plot.
  Plotly.restyle("bar", "x",[sample_values]);
  Plotly.restyle("bar", "y",[otu_ids]);
  Plotly.restyle("bar", "hovertext",[otu_labels]);
};

//------------------------------------------------------------------------------------------------------------------------------
// Function to Update Bubble Chart.

function updateBubbleChart(selected_id) {

  // Setting the variables.
  sample_values = selected_id.sample_values;
  otu_ids = selected_id.otu_ids;
  otu_labels = selected_id.otu_labels;

  // Restyling the Plot.
  Plotly.restyle("bubble", "x", [otu_ids]);
  Plotly.restyle("bubble", "y", [sample_values]);
  Plotly.restyle("bubble", "text", [otu_labels]);
  Plotly.restyle("bubble", "marker.size", [sample_values]);
  Plotly.restyle("bubble", "marker.color", [otu_ids]);
};

//------------------------------------------------------------------------------------------------------------------------------
// Function to Update the Metadata Info.

function updateMetadata(id) {
    
  // Loop through the metadata to find the specific id.
  for (let j=0; j<metadata.length; j++) {
      if (metadata[j].id == id) {
          selected_metadata = metadata[j];
      }
  };

  // Update Metadata Info
  d3.select("#id").text(`id: ${selected_metadata.id}`);
  d3.select("#ethnicity").text(`ethnicity: ${selected_metadata.ethnicity}`);
  d3.select("#gender").text(`gender: ${selected_metadata.gender}`);
  d3.select("#age").text(`age: ${selected_metadata.age}`);
  d3.select("#location").text(`location: ${selected_metadata.location}`);
  d3.select("#bbtype").text(`bbtype: ${selected_metadata.bbtype}`);
  d3.select("#wfreq").text(`wfreq: ${selected_metadata.wfreq}`);

};

//------------------------------------------------------------------------------------------------------------------------------