//*******************************************************************
//*******************************************************************
//                  URBAN SERVICE BOUNDARY RENDERER
//*******************************************************************
//*******************************************************************
const usBoundRndr = {
  type: "simple",
  symbol: {
    type: "simple-fill",
    // color: [144, 238, 144, 0.95],
    color: null,
    outline: { width: 1.5, color: "darkslategray" },
  },
};

//*******************************************************************
//*******************************************************************
//                            TIME RENDERER
//*******************************************************************
//*******************************************************************

// adjusts layer title based on how the user chooses to display change
function layerTitle(changeMode) {
  if (changeMode == "n") {
    return "Actual Values";
  } else if (changeMode == "A") {
    return "Annual Change";
  } else if (changeMode == "T") {
    return "Total Change";
  }
}

// function to return symbol
function createHexSymbol(color) {
  return {
    type: "simple-fill",
    color: color,
    style: "solid",
    outline: null,
    // outline: {
    //   width: 0.2,
    //   color: [255, 255, 255, 0.5],
    // },
  };
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// TO DO - Need to refine the min and max cutoff decimals because they are losing small values in between
// and also showing 2 colors when using the gain/loss filter
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// values to be used in making the class breaks for various user choices
const classBreakNums = {
  resunits: {
    numMin: [0.0, 1.51, 4.1, 10.1, 24.1, 56.1],
    numMax: [1.5, 4.0, 10.0, 24.0, 56.0, 128.0],
    numLabel: [
      "0 to 1.5 units",
      "1.5 to 4 units",
      "4.1 to 10 units",
      "10.1 to 24 units",
      "24.1 to 56 units",
      "56.1 to 128 units",
    ],
    annualChgMin: [-127, -26.9, -9.9, -0.49, 0.6, 4.1, 10.1, 20.1, 40.1],
    annualChgMax: [-27, -10.0, -0.5, 0.5, 4.0, 10.0, 20.0, 40.0, 74.0],
    annualChgLabel: [
      "-127 to -27 units",
      "-26.9 to -10 units",
      "-9.9 to -0.5 units",
      "small to no change",
      "+0.6 to 4 units",
      "+4.1 to 10 units",
      "+10.1 to 20 units",
      "+20.1 to 40 units",
      "+40.1 to 74 units",
    ],
    totalChgMin: [-126, -27.9, -9.9, -0.49, 0.6, 1.6, 12.1, 24.1, 45.1],
    totalChgMax: [-28, -10.0, -0.5, 0.5, 1.5, 12.0, 24.0, 45.0, 79.0],
    totalChgLabel: [
      "-126 to -28 units",
      "-27.9 to -10 units",
      "-9.9 to -0.5 units",
      "small to no change",
      "+0.6 to 1.5 units",
      "+1.6 to 12 units",
      "+12.1 to 24 units",
      "+24.1 to 45 units",
      "+45.1 to 79 units",
    ],
    colors: [
      // '#b35116', // orange 4 (darkest orange)
      "#f36f20", // [0] orange 3
      "#f89960", // [1] orange 2
      "#fcb990", // [2] orange 1
      "#ffd8bf", // [3] neutral/no change
      "#f0c8d4", // [4] purple 1
      "#d5a6cc", // [5] purple 2
      "#b983c3", // [6] purple 3
      "#8e499b", // [7] purple 4
      "#73377e", // [8] purple 5 (darkest purple)
    ], // Orange and Purple 2
  }, // END classBreakNums: resunits
  homestead: {
    numMin: [0, 0.7, 1.6, 3.1, 5.1, 10.1],
    numMax: [0.6, 1.5, 3.0, 5.0, 10.0, 20.0],
    numLabel: [
      "0 to 0.6 units",
      ".7 to 1.5 units",
      "1.6 to 3 units",
      "3.1 to 5 units",
      "5.1 to 10 units",
      "10.1 to 20 units",
    ],
    annualChgMin: [-5.0, -2.4, -1.0, -0.4, 0.6, 1.1, 2.1, 3.1, 5.1],
    annualChgMax: [-2.5, -1.1, -0.5, 0.5, 1.0, 2.0, 3.0, 5.0, 8.0],
    annualChgLabel: [
      "-5 to -2.5",
      "-2.4 to -1.1",
      "-1 to -0.5",
      "small to no change",
      ".6 to 1",
      "1.1 to 2",
      "2.1 to 3",
      "3.1 to 5",
      "5.1 to 8",
    ],
    totalChgMin: [-13.0, -5.9, -2, 9, -0.4, 0.6, 1.1, 2.1, 5.1, 8.1],
    totalChgMax: [-6.0, -3.0, -0.5, 0.5, 1.0, 2.0, 5.0, 8.0, 13],
    totalChgLabel: [
      "-13 to -6",
      "-5.9 to -3",
      "-2.9 to -0.5",
      "small to no change",
      ".6 to 1",
      "1.1 to 2",
      "2.1 to 5",
      "5.1 to 8",
      "8.1 to 13",
    ],
    colors: [
      "#b35116", // [0] orange 4 (darkest orange)
      "#f36f20", // [1] orange 3
      "#f89960", // [2] orange 1
      // '#fcb990', //  orange 1
      "#ffd8bf", // [3] neutral/no change
      "#b8d9d5", // [4] green 1
      "#56d6d4", // [5] green 2
      "#00bab5", // [6] green 3
      "#009b98", // [7] green 4
      "#00807d", // [8] green 5 (darkest green)
    ], // Esri Orange and Green 1
  }, // END classBreakNums: homestead
  nonressf: {
    numMin: [0, 3001, 10001, 20001, 21001, 50001, 100001],
    numMax: [3000, 10000, 20000, 50000, 50000, 100000, 268000],
    numLabel: [
      "0 to 3,000 sq ft",
      "3,001 to 10,000 sq ft",
      "10,001 to 20,000 sq ft",
      "20,001 to 50,000 sq ft",
      "50,001 to 100,000 sq ft",
      "100,000 to 268,000 sq ft",
    ],
    annualChgMin: [-186000, -49999, -9999, -499, 501, 1501, 5001, 20001, 50001],
    annualChgMax: [-50000, -10000, -500, 500, 1500, 5000, 20000, 50000, 177000],
    annualChgLabel: [
      "-186,000 to -50,000 sq ft",
      "-49,999 to -10,000 sq ft",
      "-9,999 to -500 sq ft",
      "small to no change",
      "501 to 1,500 sq ft",
      "1,501 to 5,000 sq ft",
      "5,001 to 20,000 sq ft",
      "20,001 to 50,000 sq ft",
      "50,001 to 177,000 sq ft",
    ],
    totalChgMin: [-186000, -49999, -9999, -499, 501, 1501, 5001, 20001, 50001],
    totalChgMax: [-50000, -10000, -500, 500, 1500, 5000, 20000, 50000, 177000],
    totalChgLabel: [
      "-186,000 to -50,000 sq ft",
      "-49,999 to -10,000 sq ft",
      "-9,999 to -500 sq ft",
      "small to no change",
      "501 to 1,500 sq ft",
      "1,501 to 5,000 sq ft",
      "5,001 to 20,000 sq ft",
      "20,001 to 50,000 sq ft",
      "50,001 to 177,000 sq ft",
    ],
    colors: [
      // '#963413', // red 4 (darkest red)
      "#da4d1e", // [0] red 3
      "#e97e5a", // [1] red 2
      "#f4a78d", // [2] red 1
      "#ffd0bf", // [3] neutral/no change
      "#e9beca", // [4] purple 1
      "#d3abd5", // [5] purple 2
      "#b983c3", // [6] purple 3
      "#8e499b", // [7] purple 4
      "#73377e", // [8] purple 5 (darkest purpled)
    ], // ESRI Red and Purple 4
  }, // END classBreakNums: nonressf
  pyr_market: {
    numMin: [0, 25001, 50001, 100001, 250001, 500001, 1000001, 10000001, 20000001],
    numMax: [25000, 50000, 100000, 250000, 500000, 1000000, 10000000, 20000000, 58000000],
    numLabel: [
      "$0 to $25,000",
      "$25,001 to $50,000",
      "$50,001 to $100,000",
      "$100,001 to $250,000",
      "$250,001 to $500,000",
      "$500,001 to $1,000,000",
      "$1,000,001 to $10,000,000",
      "$10,000,001 to $20,000,000",
      "$20,000,001 to $58,000,000",
    ],
    annualChgMin: [-57000000, -999999, -99999, -49999, -999, 1001, 25001, 50001, 100001, 1000001],
    annualChgMax: [-1000000, -100000, -50000, -1000, 1000, 25000, 50000, 100000, 1000000, 57000000],
    annualChgLabel: [
      "-$19,000,000 to -$1,000,000",
      "-$999,999 to -$100,000",
      "-$99,999 to -$50,000",
      "-$49,999 to -$1,000",
      "small to no change",
      "$1,000 to $25,000",
      "$25,001 to $50,000",
      "$50,001 to $100,000",
      "$100,001 to $1,000,000",
      "$1,000,001 to $57,000,000",
    ],
    totalChgMin: [-57000000, -999999, -99999, -49999, -999, 1001, 25001, 50001, 100001, 1000001],
    totalChgMax: [-1000000, -100000, -50000, -1000, 1000, 25000, 50000, 100000, 1000000, 57000000],
    totalChgLabel: [
      "-$57,000,000 to -$1,000,000",
      "-$999,999 to -$100,000",
      "-$99,999 to -$50,000",
      "-$49,999 to -$1,000",
      "small to no change",
      "$1,000 to $25,000",
      "$25,001 to $50,000",
      "$50,001 to $100,000",
      "$100,001 to $1,000,000",
      "$1,000,001 to $57,000,000",
    ],
    colors: [
      "#806c44", // [0] brown 4 (darkest brown)
      "#97845f", // [1] brown 3
      "#ad9d79", // [2] brown 2
      "#c4b594", // [3] brown 1
      "#cbcaae", // [4] neutral/no change
      "#d2dec8", // [5] blue 1
      "#b5d0cd", // [6] blue 2
      "#8fb6bc", // [7] blue 3
      "#6a9baa", // [8] blue 4
      "#448199", // [9] blue 5 (darkest blue)
    ], // Blue and Brown 3
  }, // END classBreakNums: pyr_market
  pyr_taxes: {
    numMin: [0, 3001, 10001, 25001, 75001, 250001],
    numMax: [3000, 10000, 25000, 75000, 250000, 1150000],
    numLabel: [
      "$0 to $3,000",
      "$3,001 to $10,000",
      "$10,001 to $25,000",
      "$25,001 to $75,000",
      "$75,001 to $250,000",
      "$250,001 to $1,115,000",
    ],
    annualChgMin: [-1125000, -99999, -49999, -4999, -99, 101, 2501, 5001, 25001, 100001],
    annualChgMax: [-100000, -50000, -5000, -100, 100, 2500, 5000, 25000, 100000, 1125000],
    annualChgLabel: [
      "-$1,125,000 to - $100,000",
      "-$999,999 to - $50,000",
      "-$49,999 to - $5,000",
      "-$4,999 to - $100",
      "small to change",
      "$101 to $2,500",
      "$2,501 to $5,000",
      "$5,001 to $25,000",
      "$25,001 to $100,000",
      "$100,001 to $1,125,000",
    ],
    totalChgMin: [-365000, -99999, -49999, -4999, -99, 101, 2501, 5001, 25001, 100001],
    totalChgMax: [-100000, -50000, -5000, -100, 100, 2500, 5000, 25000, 100000, 1125000],
    totalChgLabel: [
      "-$365,000 to - $100,000",
      "-$999,999 to - $50,000",
      "-$49,999 to - $5,000",
      "-$4,999 to - $100",
      "small to change",
      "$101 to $2,500",
      "$2,501 to $5,000",
      "$5,001 to $25,000",
      "$25,001 to $100,000",
      "$100,001 to $1,125,000",
    ],
    colors: [
      "#a11506", // [0] orange 4 (darkest orange)
      "#d04814", // [1] orange 3
      "#ef6a1d", // [2] orange 2
      "#ffa143", // [3] orange 1
      "#ffffcc", // [4] neutral/no change
      "#d9f0a3", // [5] green 1
      "#addd8e", // [6] green 2
      "#78c679", // [7] green 3
      "#31a354", // [8] green 4
      "#006837", // [9] green 5 (darkest green)
    ], // Green 4 & Orange 1
  }, // END classBreakNums: pyr_taxes
}; // END classBreakNums

// updates the class breaks & legend based on user choices
function ClassBreakInfo(fieldPrefix, changeMode) {
  let classProperties = [];
  let i = 0;
  switch (changeMode) {
    case "n":
      switch (fieldPrefix) {
        case "resunits":
          while (i < classBreakNums.resunits.numLabel.length) {
            classProperties.push({
              minValue: classBreakNums.resunits.numMin[i],
              maxValue: classBreakNums.resunits.numMax[i],
              label: `${classBreakNums.resunits.numLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.resunits.colors[i + 3]),
            });
            i++;
          }
          break;
        case "homestead":
          while (i < classBreakNums.homestead.numLabel.length) {
            classProperties.push({
              minValue: classBreakNums.homestead.numMin[i],
              maxValue: classBreakNums.homestead.numMax[i],
              label: `${classBreakNums.homestead.numLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.homestead.colors[i + 3]),
            });
            i++;
          }
          break;
        case "nonressf":
          while (i < classBreakNums.nonressf.numLabel.length) {
            classProperties.push({
              minValue: classBreakNums.nonressf.numMin[i],
              maxValue: classBreakNums.nonressf.numMax[i],
              label: `${classBreakNums.nonressf.numLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.nonressf.colors[i + 3]),
            });
            i++;
          }
          break;
        case "pyr_market":
          while (i < classBreakNums.pyr_market.numLabel.length) {
            classProperties.push({
              minValue: classBreakNums.pyr_market.numMin[i],
              maxValue: classBreakNums.pyr_market.numMax[i],
              label: `${classBreakNums.pyr_market.numLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.pyr_market.colors[i + 1]),
            });
            i++;
          }
          break;
        case "pyr_taxes":
          while (i < classBreakNums.pyr_taxes.numLabel.length) {
            classProperties.push({
              minValue: classBreakNums.pyr_taxes.numMin[i],
              maxValue: classBreakNums.pyr_taxes.numMax[i],
              label: `${classBreakNums.pyr_taxes.numLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.pyr_taxes.colors[i + 4]),
            });
            i++;
          }
          break;
      } // END fieldPrefix SWITCH
      return classProperties; // END CASE "n" SWITCH
    case "A":
      switch (fieldPrefix) {
        case "resunits":
          while (i < classBreakNums.resunits.annualChgLabel.length) {
            classProperties.push({
              minValue: classBreakNums.resunits.annualChgMin[i],
              maxValue: classBreakNums.resunits.annualChgMax[i],
              label: `${classBreakNums.resunits.annualChgLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.resunits.colors[i]),
            });
            i++;
          }
          break;
        case "homestead":
          while (i < classBreakNums.homestead.annualChgLabel.length) {
            classProperties.push({
              minValue: classBreakNums.homestead.annualChgMin[i],
              maxValue: classBreakNums.homestead.annualChgMax[i],
              label: `${classBreakNums.homestead.annualChgLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.homestead.colors[i]),
            });
            i++;
          }
          break;
        case "nonressf":
          while (i < classBreakNums.nonressf.annualChgLabel.length) {
            classProperties.push({
              minValue: classBreakNums.nonressf.annualChgMin[i],
              maxValue: classBreakNums.nonressf.annualChgMax[i],
              label: `${classBreakNums.nonressf.annualChgLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.nonressf.colors[i]),
            });
            i++;
          }
          break;
        case "pyr_market":
          while (i < classBreakNums.pyr_market.annualChgLabel.length) {
            classProperties.push({
              minValue: classBreakNums.pyr_market.annualChgMin[i],
              maxValue: classBreakNums.pyr_market.annualChgMax[i],
              label: `${classBreakNums.pyr_market.annualChgLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.pyr_market.colors[i]),
            });
            i++;
          }
          break;
        case "pyr_taxes":
          while (i < classBreakNums.pyr_taxes.annualChgLabel.length) {
            classProperties.push({
              minValue: classBreakNums.pyr_taxes.annualChgMin[i],
              maxValue: classBreakNums.pyr_taxes.annualChgMax[i],
              label: `${classBreakNums.pyr_taxes.annualChgLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.pyr_taxes.colors[i]),
            });
            i++;
          }
          break;
      } // END fieldPrefix SWITCH
      return classProperties; // END CASE "A" SWITCH
    case "T":
      switch (fieldPrefix) {
        case "resunits":
          while (i < classBreakNums.resunits.totalChgLabel.length) {
            classProperties.push({
              minValue: classBreakNums.resunits.totalChgMin[i],
              maxValue: classBreakNums.resunits.totalChgMax[i],
              label: `${classBreakNums.resunits.totalChgLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.resunits.colors[i]),
            });
            i++;
          }
          break;
        case "homestead":
          while (i < classBreakNums.homestead.totalChgLabel.length) {
            classProperties.push({
              minValue: classBreakNums.homestead.totalChgMin[i],
              maxValue: classBreakNums.homestead.totalChgMax[i],
              label: `${classBreakNums.homestead.totalChgLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.homestead.colors[i]),
            });
            i++;
          }
          break;
        case "nonressf":
          while (i < classBreakNums.nonressf.totalChgLabel.length) {
            classProperties.push({
              minValue: classBreakNums.nonressf.totalChgMin[i],
              maxValue: classBreakNums.nonressf.totalChgMax[i],
              label: `${classBreakNums.nonressf.totalChgLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.nonressf.colors[i]),
            });
            i++;
          }
          break;
        case "pyr_market":
          while (i < classBreakNums.pyr_market.totalChgLabel.length) {
            classProperties.push({
              minValue: classBreakNums.pyr_market.totalChgMin[i],
              maxValue: classBreakNums.pyr_market.totalChgMax[i],
              label: `${classBreakNums.pyr_market.totalChgLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.pyr_market.colors[i]),
            });
            i++;
          }
          break;
        case "pyr_taxes":
          while (i < classBreakNums.pyr_taxes.totalChgLabel.length) {
            classProperties.push({
              minValue: classBreakNums.pyr_taxes.totalChgMin[i],
              maxValue: classBreakNums.pyr_taxes.totalChgMax[i],
              label: `${classBreakNums.pyr_taxes.totalChgLabel[i]}`,
              symbol: createHexSymbol(classBreakNums.pyr_taxes.colors[i]),
            });
            i++;
          }
          break;
      } // END fieldPrefix SWITCH
      return classProperties; // END CASE "T" SWITCH
  } // END changeMode SWITCH
} // END ClassBreakInfo()

function timeRenderer(fieldPrefix, changeMode) {
  return {
    type: "class-breaks",
    defaultSymbol: null, // don't want anything displayed for empty values
    defaultLabel: null,
    field: `${fieldPrefix}_${sliderValue.innerHTML}_${changeMode}`,
    legendOptions: {
      title: `${sliderValue.innerHTML}: ${layerTitle(changeMode)}`,
    },
    classBreakInfos: ClassBreakInfo(fieldPrefix, changeMode),
  };
} // END timeRenderer()

//*******************************************************************
//*******************************************************************
//                        HOTSPOT RENDERER
//*******************************************************************
//*******************************************************************
function createHotSymbol(hotColor) {
  return {
    type: "simple-fill",
    color: hotColor,
    style: "solid",
    outline: { width: 0.05, color: "darkslategray" },
  };
}

const hotspotRenderer = {
  type: "unique-value",
  field: "pattern",
  defaultSymbol: null,
  legendOptions: {
    title: "Classification",
  },
  uniqueValueInfos: [
    { value: "Persistent Hot Spot", symbol: createHotSymbol("#990000") },
    { value: "Intensifying Hot Spot", symbol: createHotSymbol("#d7301f") },
    { value: "Consecutive Hot Spot", symbol: createHotSymbol("#ef6548") },
    { value: "New Hot Spot", symbol: createHotSymbol("#fc8d59") },
    { value: "Diminishing Hot Spot", symbol: createHotSymbol("#fdbb84") },
    { value: "Sporadic Hot Spot", symbol: createHotSymbol("#fdd49e") },
    { value: "Oscillating Hot Spot", symbol: createHotSymbol("#fee8c8") },
    { value: "Historical Hot Spot", symbol: createHotSymbol("#fff7ec") },
    { value: "Historical Cold Spot", symbol: createHotSymbol("#fff7fb") },
    { value: "Oscillating Cold Spot", symbol: createHotSymbol("#ece7f2") },
    { value: "Sporadic Cold Spot", symbol: createHotSymbol("#d0d1e6") },
    { value: "Diminishing Cold Spot", symbol: createHotSymbol("#a6bddb") },
    { value: "New Cold Spot", symbol: createHotSymbol("#74a9cf") },
    { value: "Consecutive Cold Spot", symbol: createHotSymbol("#3690c0") },
    { value: "Intensifying Cold Spot", symbol: createHotSymbol("#0570b0") },
    { value: "Persistent Cold Spot", symbol: createHotSymbol("#034e7b") },
  ],
};


//*******************************************************************
//*******************************************************************
//              CLUSTERING PROPERTIES FOR POINT LAYERS
//*******************************************************************
//*******************************************************************

const minMaxNums = {
  resunits: {
    actual:[20, 3000],
    annualChg: [3, 50],
    totalChg: [3, 100]
    },
  homestead: {
    actual:[20, 1500],
    annualChg: [0, 20],
    totalChg: [0, 250]
    },
  nonressf: {
    actual:[10000, 250000],
    annualChg: [0, 5000],
    totalChg: [0, 50000]
    },
  pyr_market: {
    actual:[500000, 500000000],
    annualChg: [0,30000000],
    totalChg: [0,50000000]
    }, 
  pyr_taxes: {
    actual:[100000, 5000000],
    annualChg: [0, 250000],
    totalChg: [0, 2000000]
    }
}

function AttributeMinMax (fieldPrefix, changeMode, minOrMax) {
  let minMaxValue
  switch(fieldPrefix) {
    case "resunits":
      switch(changeMode){
        case "n": minMaxValue = minMaxNums.resunits.actual[minOrMax];
          break;
        case "A": minMaxValue = minMaxNums.resunits.annualChg[minOrMax];
          break;
        case "T": minMaxValue = minMaxNums.resunits.totalChg[minOrMax];
          break;
      } // end "resunits" changeMode switch
      return minMaxValue
    case "homestead":
      switch(changeMode){
        case "n": minMaxValue = minMaxNums.homestead.actual[minOrMax];
          break;
        case "A": minMaxValue = minMaxNums.homestead.annualChg[minOrMax];
          break;
        case "T": minMaxValue = minMaxNums.homestead.totalChg[minOrMax];
          break;
      } // end "resunits" changeMode switch
      return minMaxValue
    case "nonressf":
      switch(changeMode){
        case "n": minMaxValue = minMaxNums.nonressf.actual[minOrMax];
          break;
        case "A": minMaxValue = minMaxNums.nonressf.annualChg[minOrMax];
          break;
        case "T": minMaxValue = minMaxNums.nonressf.totalChg[minOrMax];
          break;
      } // end "resunits" changeMode switch
      return minMaxValue
    case "pyr_market":
      switch(changeMode){
        case "n": minMaxValue = minMaxNums.pyr_market.actual[minOrMax];
          break;
        case "A": minMaxValue = minMaxNums.pyr_market.annualChg[minOrMax];
          break;
        case "T": minMaxValue = minMaxNums.pyr_market.totalChg[minOrMax];
          break;
      } // end "resunits" changeMode switch
      return minMaxValue
    case "pyr_taxes":
      switch(changeMode){
        case "n": minMaxValue = minMaxNums.pyr_taxes.actual[minOrMax];
          break;
        case "A": minMaxValue = minMaxNums.pyr_taxes.annualChg[minOrMax];
          break;
        case "T": minMaxValue = minMaxNums.pyr_taxes.totalChg[minOrMax];
          break;
      } // end "resunits" changeMode switch
      return minMaxValue;
  } // end fieldPrefix switch
} // end AttributeMinMax()

function ClusterPopUpTitle(fieldPrefix, changeMode) {
  let popUpTitle
  switch(changeMode){
    case "n":
      switch(fieldPrefix){
        case 'resunits': 
          popUpTitle = "Residential Unit Count for Selected Cluster";
          break;
        case 'homestead': 
          popUpTitle = "Homestead Count for Selected Cluster";
          break;
        case 'nonressf': 
          popUpTitle =  "Nonresidential Square Feet for Selected Cluster";
          break;
        case 'pyr_market': 
          popUpTitle = "Market Valuation for Selected Cluster";
          break;
        case 'pyr_taxes': 
          popUpTitle = "Property Taxes for Selected Cluster";
          break;
      } // end resunits switch
      return popUpTitle
      case "A":
        switch(fieldPrefix){
          case 'resunits': 
            popUpTitle = "Annual Net Change in Residential Unit Count for Selected Cluster";
            break;
          case 'homestead': 
            popUpTitle = "Annual Net Change in Homestead Count for Selected Cluster";
            break;
          case 'nonressf': 
            popUpTitle =  "Annual Net Change in Nonresidential Square Feet for Selected Cluster";
            break;
          case 'pyr_market': 
            popUpTitle = "Annual Net Change in Market Valuation for Selected Cluster";
            break;
          case 'pyr_taxes': 
            popUpTitle = "Annual Net Change in Property Taxes for Selected Cluster";
            break;
        } // end fieldPrefix switch
        return popUpTitle
    case "T":
      switch(fieldPrefix){
        case 'resunits': 
          popUpTitle = "Cumulative Change in Residential Unit Count for Selected Cluster";
          break;
        case 'homestead': 
          popUpTitle = "Cumulative Change in Homestead Count for Selected Cluster";
          break;
        case 'nonressf': 
          popUpTitle =  "Cumulative Change in Nonresidential Square Feet for Selected Cluster";
          break;
        case 'pyr_market': 
          popUpTitle = "Cumulative Change in Market Valuation for Selected Cluster";
          break;
        case 'pyr_taxes': 
          popUpTitle = "Cumulative Change in Property Taxes for Selected Cluster";
          break;
      } // end resunits switch
      return popUpTitle
  } // end changeMode switch
} //end ClusterPopUpTitle()

function ClusterProperties(fieldPrefix, changeMode) {
  return { 
    type: "cluster",  
    maxScale: 7000,
    fields: [
      {
      name: `${fieldPrefix}_sum`,
      alias: `Cluster Sum (average is in '[ ]')`,
      onStatisticField: `${fieldPrefix}_${sliderValue.innerHTML}_${changeMode}`,
      statisticType: "sum"
      },
      {
      name: `${fieldPrefix}_avg`,
      alias: "Cluster Average",
      onStatisticField: `${fieldPrefix}_${sliderValue.innerHTML}_${changeMode}`,
      statisticType: "avg"
      },
    ],
    renderer: {
      type: "simple",
      field:`${fieldPrefix}_sum`,
      symbol: {
        type: "picture-marker",
        url: `resunits.svg`,
        // url: `${fieldPrefix}.svg`,
      },
      visualVariables: [
        {
          type: "size",
          field: `${fieldPrefix}_sum`,
          minDataValue: AttributeMinMax(fieldPrefix, changeMode, 0),
          maxDataValue: AttributeMinMax(fieldPrefix, changeMode, 1),
          minSize: 8,
          maxSize: 40,
        },
      ]    
    },
    labelingInfo: [
      {
        labelExpressionInfo: {
          expression: `
            var valueSum = $feature.${fieldPrefix}_sum
            var letterCountSum = Count(Text(Round(valueSum)));
  
           Decode(letterCountSum,
              4, Text(valueSum / Pow(10, 3), "##.0k"),
              5, Text(valueSum / Pow(10, 3), "##k"),
              6, Text(valueSum / Pow(10, 3), "##k"),
              7, Text(valueSum / Pow(10, 6), "##.#m"),
              8, Text(valueSum / Pow(10, 6), "##.#m"),
              9, Text(valueSum / Pow(10, 6), "##.#m"),
              10, Text(valueSum / Pow(10, 9), "##.##b"),
              Text(valueSum, "#,###")
            )
          `
        },
        symbol: {
          type: "text",
          color: "white",
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "12px"
          },
          haloColor: "gray",
          haloSize: 1
        },
        labelPlacement: "center-center"
      },
      {
        labelExpressionInfo: {
          expression: `
            var valueAvg = $feature.${fieldPrefix}_avg
            var letterCountAvg = Count(Text(Round(valueAvg)));

          Decode(letterCountAvg,
              4, Text(valueAvg / Pow(10, 3), "[##.0k]"),
              5, Text(valueAvg / Pow(10, 3), "[##k]"),
              6, Text(valueAvg / Pow(10, 3), "[##k]"),
              7, Text(valueAvg / Pow(10, 6), "[##.#m]"),
              8, Text(valueAvg / Pow(10, 6), "[##.#m]"),
              9, Text(valueAvg / Pow(10, 6), "[##.#m]"),
              10, Text(valueAvg / Pow(10, 9), "[##.##b]"),
              Text(valueAvg, "[#,###]")
            )
          `
        },
        symbol: {
          type: "text",
          color: "white",
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "10px"
          },
          haloColor: "gray",
          haloSize: .75,
          yoffset: "-11px"
        },
        labelPlacement: "center-center"
      }
    ],
    clusterRadius: "120px",
    popupTemplate: {
      title: ClusterPopUpTitle(fieldPrefix, changeMode),
      // title: "Cluster Summary",
      content: [
        {
        type: "text",
        text: "This cluster represents <b>{cluster_count}</b> one-acre bins.", 
        },
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: `${fieldPrefix}_sum`,
              label: "total of bin values",
              format: {
                places: 0,
                digitSeparator: true
              }
            },
            {
              fieldName: `${fieldPrefix}_avg`,
              label: "average value per bin",
              format: {
                places: 1,
                digitSeparator: true
              }
            }
          ]
        }
      ]
    }
  }
};

function PopUpTitle(fieldPrefix, changeMode) {
  let popUpTitle
  switch(changeMode){
    case "n":
      switch(fieldPrefix){
        case 'resunits': 
          popUpTitle = "Annual Residential Unit Count for Selected Hexagram";
          break;
        case 'homestead': 
          popUpTitle = "Annual Homestead Count for Selected Hexagram";
          break;
        case 'nonressf': 
          popUpTitle =  "Annual Nonresidential Square Feet Count for Selected Hexagram";
          break;
        case 'pyr_market': 
          popUpTitle = "Annual Market Valuation for Selected Hexagram";
          break;
        case 'pyr_taxes': 
          popUpTitle = "Annual Property Taxes for Selected Hexagram";
          break;
      } // end fieldPrefix switch
      return popUpTitle
    case "A":
      switch(fieldPrefix){
        case 'resunits': 
          popUpTitle = "Annual Change in Residential Unit Count for Selected Hexagram";
          break;
        case 'homestead': 
          popUpTitle = "Annual Change in Homestead Count for Selected Hexagram";
          break;
        case 'nonressf': 
          popUpTitle =  "Annual Change in Nonresidential Square Feet for Selected Hexagram";
          break;
        case 'pyr_market': 
          popUpTitle = "Annual Change in Market Valuation for Selected Hexagram";
          break;
        case 'pyr_taxes': 
          popUpTitle = "Annual Change in Property Taxes for Selected Hexagram";
          break;
      } // end fieldPrefix switch
      return popUpTitle
    case "T":
      switch(fieldPrefix){
        case 'resunits': 
          popUpTitle = "Cumulative Change in Residential Unit Count for Selected Hexagram";
          break;
        case 'homestead': 
          popUpTitle = "Cumulative Change in Homestead Count for Selected Hexagram";
          break;
        case 'nonressf': 
          popUpTitle =  "Cumulative Change in Nonresidential Square Feet for Selected Hexagram";
          break;
        case 'pyr_market': 
          popUpTitle = "Cumulative Change in Market Valuation for Selected Hexagram";
          break;
        case 'pyr_taxes': 
          popUpTitle = "Cumulative Change in Property Taxes for Selected Hexagram";
          break;
      } // end fieldPrefix switch
      return popUpTitle
  } // end changeMode switch
} //end PopUpTitle()

function TimeLyrPopupTemplate(fieldPrefix, changeMode) {
  let yearsText = ['2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022']
  let fieldInfoData = []
  let i = 0
  while (i < yearsText.length) {
    fieldInfoData.push ({
      fieldName: `${fieldPrefix}_${yearsText[i]}_${changeMode}`,
      label: `${yearsText[i]}`
      })
      i ++
    }
  return {
    title: PopUpTitle(fieldPrefix, changeMode),
    content: [      
      {
        type: "fields", 
        fieldInfos: fieldInfoData
      }
    ]
  }
} // end TimeLyrPopupTemplate()

function PtsLyrLabels (fieldPrefix, changeMode){
  return{
      labelExpressionInfo: { expression: `$feature.${fieldPrefix}_${sliderValue.innerHTML}_${changeMode}` },
      symbol: {
        type: "text",
        font: {
          weight: "bold",
          family: "Noto Sans",
          size: "12px"
        },
        color: "white",
        haloSize: 1,
        haloColor: "gray"
      },
      labelPlacement: "center-center",
      minScale: 6999
  };
}

const ptsLyrRenderer = {
  type: "simple",  // autocasts as new SimpleRenderer()
  symbol: {
    type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
    size: .5,
    color: "gray",
    outline: null
  }
};