//*******************************
//URBAN SERVICE BOUNDARY RENDERER
//*******************************
const usBoundRndr = {
  type: "simple",
  symbol: {
    type: "simple-fill",
    // color: [144, 238, 144, 0.95],
    color: null,
    outline: { width: 1.5, color: "darkslategray" }
  }
};

//*******************************
//PRIOR YEAR TAXES RENDERER
//*******************************
// color class variables
//*******************************
const less1000 = {
  type: "simple-fill", // autocasts as new SimpleFillSymbol()
  color: "#fffcd4",
  style: "solid",
  outline: {
    width: 0.2,
    color: [255, 255, 255, 0.5]
  }
};

const less5000 = {
  type: "simple-fill", // autocasts as new SimpleFillSymbol()
  color: "#b1cdc2",
  style: "solid",
  outline: {
    width: 0.2,
    color: [255, 255, 255, 0.5]
  }
};

const less20000 = {
  type: "simple-fill", // autocasts as new SimpleFillSymbol()
  color: "#38627a",
  style: "solid",
  outline: {
    width: 0.2,
    color: [255, 255, 255, 0.5]
  }
};

const more20000 = {
  type: "simple-fill", // autocasts as new SimpleFillSymbol()
  color: "#0d2644",
  style: "solid",
  outline: {
    width: 0.2,
    color: [255, 255, 255, 0.5]
  }
};

// let displayYear = "11";

// taxRenderer(displayYear);

// taxRenderer variable
//*******************************
function taxRenderer(dispYear) {
  return {
    type: "class-breaks", // autocasts as new ClassBreaksRenderer()
    // field: "PYR_TAXES_11",
    field: `PYR_TAXES_${dispYear}`,
    legendOptions: {
      title: "Prior Year Taxes"
    },
    defaultSymbol: {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "black",
      style: "backward-diagonal",
      outline: {
        width: 0.5,
        color: [50, 50, 50, 0.6]
      }
    },
    defaultLabel: "no data",
    classBreakInfos: [
      {
        minValue: 0,
        maxValue: 999,
        symbol: less1000,
        label: "< $1,000"
      },
      {
        minValue: 1000,
        maxValue: 4999,
        symbol: less5000,
        label: "< $5,000"
      },
      {
        minValue: 5000,
        maxValue: 19999,
        symbol: less20000,
        label: "< $20,000"
      },
      {
        minValue: 20000,
        maxValue: 500000,
        symbol: more20000,
        label: "> $20,000"
      }
    ]
  };
}
