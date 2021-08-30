// import Plotly from "plotly.js-dist";

const lineColors = {
  green: "#44bb66",
  red: "#bb4466",
  blue: "#4466bb",
};

const config = {
  displayModeBar: false,
  responsive: true,
};

const plot0Div = document.getElementById('header')
const plot1Div = document.getElementById("viz1");
const plot2Div = document.getElementById("viz2");
const plot3Div = document.getElementById("viz3");

// [+] line chart example
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

    Plotly.newPlot(plot0Div, data1, layout1, config);
  }
);

function unpack(rows, key) {
  return rows.map(function (row) {
    return row[key];
  });
}

// [+] 3D plot example
Plotly.d3.csv(
  "https://raw.githubusercontent.com/plotly/datasets/master/api_docs/mt_bruno_elevation.csv",
  function (err, rows) {
    function unpack(rows, key) {
      return rows.map(function (row) {
        return row[key];
      });
    }

    var z_data = [];
    for (i = 0; i < 24; i++) {
      z_data.push(unpack(rows, i));
    }

    var data = [
      {
        z: z_data,
        type: "surface",
      },
    ];

    var layout = {
      title: "Mt Bruno Elevation",
      autosize: true,
      // width: 500,
      // height: 500,
      // margin: {
      //   l: 65,
      //   r: 50,
      //   b: 65,
      //   t: 90,
      // }
    };
    Plotly.newPlot(plot2Div, data, layout);
  }
);

// add animation example to plot3Div
var n = 100;
var x = [],
  y = [],
  z = [];
var dt = 0.015;

for (i = 0; i < n; i++) {
  x[i] = Math.random() * 2 - 1;
  y[i] = Math.random() * 2 - 1;
  z[i] = 30 + Math.random() * 10;
}

Plotly.newPlot(
  plot3Div,
  [
    {
      x: x,
      y: z,
      mode: "markers",
    },
  ],
  {
    xaxis: { range: [-40, 40] },
    yaxis: { range: [0, 60] },
  }
);

function compute() {
  var s = 10,
    b = 8 / 3,
    r = 28;
  var dx, dy, dz;
  var xh, yh, zh;
  for (var i = 0; i < n; i++) {
    dx = s * (y[i] - x[i]);
    dy = x[i] * (r - z[i]) - y[i];
    dz = x[i] * y[i] - b * z[i];

    xh = x[i] + dx * dt * 0.5;
    yh = y[i] + dy * dt * 0.5;
    zh = z[i] + dz * dt * 0.5;

    dx = s * (yh - xh);
    dy = xh * (r - zh) - yh;
    dz = xh * yh - b * zh;

    x[i] += dx * dt;
    y[i] += dy * dt;
    z[i] += dz * dt;
  }
}

function update() {
  compute();

  Plotly.animate(
    plot3Div,
    {
      data: [{ x: x, y: z }],
    },
    {
      transition: {
        duration: 0,
      },
      frame: {
        duration: 0,
        redraw: false,
      },
    }
  );

  requestAnimationFrame(update);
}

requestAnimationFrame(update);

// add animation example
Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/gapminderDataFiveYear.csv', function (err, data) {
// Create a lookup table to sort and regroup the columns of data,
// first by year, then by continent:
var lookup = {};
function getData(year, continent) {
var byYear, trace;
if (!(byYear = lookup[year])) {;
  byYear = lookup[year] = {};
}
// If a container for this year + continent doesn't exist yet,
// then create one:
if (!(trace = byYear[continent])) {
  trace = byYear[continent] = {
    x: [],
    y: [],
    id: [],
    text: [],
    marker: {size: []}
  };
}
return trace;
}

// Go through each row, get the right trace, and append the data:
for (var i = 0; i < data.length; i++) {
var datum = data[i];
var trace = getData(datum.year, datum.continent);
trace.text.push(datum.country);
trace.id.push(datum.country);
trace.x.push(datum.lifeExp);
trace.y.push(datum.gdpPercap);
trace.marker.size.push(datum.pop);
}

// Get the group names:
var years = Object.keys(lookup);
// In this case, every year includes every continent, so we
// can just infer the continents from the *first* year:
var firstYear = lookup[years[0]];
var continents = Object.keys(firstYear);

// Create the main traces, one for each continent:
var traces = [];
for (i = 0; i < continents.length; i++) {
var data = firstYear[continents[i]];
// One small note. We're creating a single trace here, to which
// the frames will pass data for the different years. It's
// subtle, but to avoid data reference problems, we'll slice 
// the arrays to ensure we never write any new data into our
// lookup table:
traces.push({
  name: continents[i],
  x: data.x.slice(),
  y: data.y.slice(),
  id: data.id.slice(),
  text: data.text.slice(),
  mode: 'markers',
  marker: {
    size: data.marker.size.slice(),
    sizemode: 'area',
    sizeref: 200000
  }
});
}

// Create a frame for each year. Frames are effectively just
// traces, except they don't need to contain the *full* trace
// definition (for example, appearance). The frames just need
// the parts the traces that change (here, the data).
var frames = [];
for (i = 0; i < years.length; i++) {
frames.push({
  name: years[i],
  data: continents.map(function (continent) {
    return getData(years[i], continent);
  })
})
}

// Now create slider steps, one for each frame. The slider
// executes a plotly.js API command (here, Plotly.animate).
// In this example, we'll animate to one of the named frames
// created in the above loop.
var sliderSteps = [];
for (i = 0; i < years.length; i++) {
sliderSteps.push({
  method: 'animate',
  label: years[i],
  args: [[years[i]], {
    mode: 'immediate',
    transition: {duration: 300},
    frame: {duration: 300, redraw: false},
  }]
});
}

var layout = {
xaxis: {
  title: 'Life Expectancy',
  range: [30, 85]
},
yaxis: {
  title: 'GDP per Capita',
  type: 'log'
},
hovermode: 'closest',
// We'll use updatemenus (whose functionality includes menus as
// well as buttons) to create a play button and a pause button.
// The play button works by passing `null`, which indicates that
// Plotly should animate all frames. The pause button works by
// passing `[null]`, which indicates we'd like to interrupt any
// currently running animations with a new list of frames. Here
// The new list of frames is empty, so it halts the animation.
updatemenus: [{
  x: 0,
  y: 0,
  yanchor: 'top',
  xanchor: 'left',
  showactive: false,
  direction: 'left',
  type: 'buttons',
  pad: {t: 87, r: 10},
  buttons: [{
    method: 'animate',
    args: [null, {
      mode: 'immediate',
      fromcurrent: true,
      transition: {duration: 300},
      frame: {duration: 500, redraw: false}
    }],
    label: 'Play'
  }, {
    method: 'animate',
    args: [[null], {
      mode: 'immediate',
      transition: {duration: 0},
      frame: {duration: 0, redraw: false}
    }],
    label: 'Pause'
  }]
}],
// Finally, add the slider and use `pad` to position it
// nicely next to the buttons.
sliders: [{
  pad: {l: 130, t: 55},
  currentvalue: {
    visible: true,
    prefix: 'Year:',
    xanchor: 'right',
    font: {size: 20, color: '#666'}
  },
  steps: sliderSteps
}]
};

// Create the plot:
Plotly.plot(plot1Div, {
data: traces,
layout: layout,
config: {showSendToCloud:true},
frames: frames,
});
});



// [+] 3D plot example
// Plotly.d3.csv(
//   "https://raw.githubusercontent.com/plotly/datasets/master/clebsch-cubic.csv",
//   function (err, rows) {
//     function unpack(rows, key) {
//       return rows.map(function (row) {
//         return parseFloat(row[key]);
//       });
//     }

//     var data = [
//       {
//         type: "isosurface",
//         x: unpack(rows, "x"),
//         y: unpack(rows, "y"),
//         z: unpack(rows, "z"),
//         value: unpack(rows, "value"),
//         isomin: -10,
//         isomax: 10,
//         surface: { show: true, count: 4, fill: 1, pattern: "odd" },
//         caps: {
//           x: { show: true },
//           y: { show: true },
//           z: { show: true },
//         },
//       },
//     ];

//     var layout = {
//       margin: { t: 0, l: 0, b: 0 },
//       scene: {
//         camera: {
//           eye: {
//             x: 1.86,
//             y: 0.61,
//             z: 0.98,
//           },
//         },
//       },
//     };

//     Plotly.newPlot(plot1Div, data, layout, { showSendToCloud: true });
//   }
// );
