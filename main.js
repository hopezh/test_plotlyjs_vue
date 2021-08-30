import Plotly from "plotly.js-dist";

const lineColors = {
  green: "#44bb66",
  red: "#bb4466",
  blue: "#4466bb",
};

const config = {
  displayModeBar: false,
  responsive: true,
};

const plot1Div = document.getElementById("viz1");
const plot2Div = document.getElementById("viz2");
const plot3Div = document.getElementById("viz3");

Plotly.d3.csv(
  "https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv",
  function (rows) {
    var trace0 = {
      type: "scatter",
      mode: "lines",
      name: "apple high",
      x: unpack(rows, "Date"),
      y: unpack(rows, "AAPL.High"),
      line: {
        color: lineColors.green,
      },
    };

    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: "apple high",
      x: unpack(rows, "Date"),
      y: unpack(rows, "AAPL.Low"),
      line: {
        color: lineColors.red,
      },
    };

    var data1 = [trace0, trace1];

    var rangeSelectorOptions = {
      buttons: [
        {
          count: 1,
          label: "1m",
          step: "month",
          stepmode: "backward",
        },
        {
          count: 6,
          label: "6m",
          step: "month",
          stepmonth: "backward",
        },
        { step: "all" },
      ],
    };

    var layout1 = {
      title: "apple stock price",
      xaxis: {
        autorange: true,
        rangeselector: rangeSelectorOptions,
        type: "date",
        rangeslider: {
          range: ["2015-02-17", "2017-02-16"],
        },
        showspikes: true,
        spikemode: "across",
        spikecolor: lineColors.blue,
        spikethickness: 2,
      },
    };

    Plotly.newPlot(plot1Div, data1, layout1, config);
  }
);

function unpack(rows, key) {
  return rows.map(function (row) {
    return row[key];
  });
}
