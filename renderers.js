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

// color ramp for all hexbin layers
const colors = [
  "#00ffd4", // increasing (0)
  "#00d9b4", // increasing (1)
  "#00b294", // increasing (2)
  "#008c74", // increasing (3)
  "#315b61", // increasing (4)
  "#fffacd", // no change (5)
  "#e67500", // decreasing (6)
  "#ffaa00", // decreasing (7)
  "#f28e00", // decreasing (8)
  "#b45a00", // not used but darker brown in decreasing ramp if needed
];

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
    outline: {
      width: 0.2,
      color: [255, 255, 255, 0.5],
    },
  };
}

// values to be used in making the class breaks for various user choices
const classBreakNums = {
  resunits: {
    numMin: [0, 3, 6, 11, 16, 31],
    numMax: [2, 5, 10, 15, 30, 67],
    numLabel: [
      "0 to 2 units",
      "3 to 5 units",
      "6 to 10 units",
      "11 to 15 units",
      "16 to 30 units",
      "31 to 67 units",
    ],
    annualChgMin: [-15, -5, -0.4, 0.5, 6, 11, 16],
    annualChgMax: [-6, -0.5, 0.4, 5, 10, 15, 23],
    annualChgLabel: [
      "- 6 to -15 units",
      "- .5 to -5 units",
      "no change",
      "+ .5 to 5 units",
      "+ 6 to 10 units",
      "+ 11 to 15 units",
      "+ 16 to 23 units",
    ],
    totalChgMin: [-13, -5, -0.4, 0.5, 6, 11, 16, 26],
    totalChgMax: [-6, -0.5, 0.4, 5, 10, 15, 25, 56],
    totalChgLabel: [
      "- 6 to -13 units",
      "- .5 to -5 units",
      "no change",
      "+ .5 to 5 units",
      "+ 6 to 10 units",
      "+ 11 to 26 units",
      "+ 16 to 25 units",
      "+ 26 to 56 units",
    ],
    colors: [
      "#00ffd4",
      "#00d9b4",
      "#00b294",
      "#008c74",
      "#315b61",
      "#fffacd",
      "#e67500",
      "#ffaa00",
    ],
  }, // END classBreakNums: resunits
  homestead: {
    numMin: [0, 3, 6, 11, 16, 31],
    numMax: [2, 5, 10, 15, 30, 67],
    numLabel: [
      "0 to 2 units",
      "3 to 5 units",
      "6 to 10 units",
      "11 to 15 units",
      "16 to 30 units",
      "31 to 6000 units",
    ],
    annualChgMin: [-15, -5, -0.4, 0.5, 6, 11, 16],
    annualChgMax: [-6, -0.5, 0.4, 5, 10, 15, 23],
    annualChgLabel: [
      "-15 - -6",
      "-5 to -.5",
      "no change",
      ".5 to 5",
      "6 to 10",
      "11 to 15",
      "16 to 23",
    ],
    totalChgMin: [-13, -5, -0.4, 0.5, 6, 11, 16, 26],
    totalChgMax: [-6, -0.5, 0.4, 5, 10, 15, 25, 56],
    totalChgLabel: [
      "-13 to -6",
      "-5 to -.5",
      "no change",
      ".5 to 5",
      "6 to 10",
      "11 to 26",
      "16 to 25",
      "26 to 56",
    ],
    colors: [
      "#00ffd4",
      "#00d9b4",
      "#00b294",
      "#008c74",
      "#315b61",
      "#fffacd",
      "#e67500",
      "#ffaa00",
    ],
  }, // END classBreakNums: homestead
  nonressf: {
    numMin: [0, 2501, 6001, 11001, 21001, 50001],
    numMax: [2500, 6000, 11000, 21000, 50000, 253000],
    numLabel: ["0 to 2", "3 to 5", "6 to 10", "11 to 15", "16 to 30", "31 to 6000"],
    annualChgMin: [-15, -5, -0.4, 0.5, 6, 11, 16],
    annualChgMax: [-6, -0.5, 0.4, 5, 10, 15, 23],
    annualChgLabel: [
      "-15 - -6",
      "-5 to -.5",
      "no change",
      ".5 to 5",
      "6 to 10",
      "11 to 15",
      "16 to 23",
    ],
    totalChgMin: [-13, -5, -0.49, 0.5, 6, 11, 16, 26],
    totalChgMax: [-6, -0.5, 0.49, 5, 10, 15, 25, 56],
    totalChgLabel: [
      "-13 to -6",
      "-5 to -.5",
      "no change",
      ".5 to 5",
      "6 to 10",
      "11 to 26",
      "16 to 25",
      "26 to 56",
    ],
    colors: [
      "#00ffd4",
      "#00d9b4",
      "#00b294",
      "#008c74",
      "#315b61",
      "#fffacd",
      "#e67500",
      "#ffaa00",
    ],
  }, // END classBreakNums: nonressf
  pyr_market: {
    numMin: [0, 3, 6, 11, 16, 31],
    numMax: [2, 5, 10, 15, 30, 67],
    numLabel: ["0 to 2", "3 to 5", "6 to 10", "11 to 15", "16 to 30", "31 to 6000"],
    annualChgMin: [-15, -5, -0.4, 0.5, 6, 11, 16],
    annualChgMax: [-6, -0.5, 0.4, 5, 10, 15, 23],
    annualChgLabel: [
      "-15 - -6",
      "-5 to -.5",
      "no change",
      ".5 to 5",
      "6 to 10",
      "11 to 15",
      "16 to 23",
    ],
    totalChgMin: [-13, -5, -0.4, 0.5, 6, 11, 16, 26],
    totalChgMax: [-6, -0.5, 0.4, 5, 10, 15, 25, 56],
    totalChgLabel: [
      "-13 to -6",
      "-5 to -.5",
      "no change",
      ".5 to 5",
      "6 to 10",
      "11 to 26",
      "16 to 25",
      "26 to 56",
    ],
    colors: [
      "#00ffd4",
      "#00d9b4",
      "#00b294",
      "#008c74",
      "#315b61",
      "#fffacd",
      "#e67500",
      "#ffaa00",
    ],
  }, // END classBreakNums: pyr_market
  pyr_taxes: {
    numMin: [0, 3, 6, 11, 16, 31],
    numMax: [2, 5, 10, 15, 30, 67],
    numLabel: ["0 to 2", "3 to 5", "6 to 10", "11 to 15", "16 to 30", "31 to 6000"],
    annualChgMin: [-15, -5, -0.4, 0.5, 6, 11, 16],
    annualChgMax: [-6, -0.5, 0.4, 5, 10, 15, 23],
    annualChgLabel: [
      "-15 - -6",
      "-5 to -.5",
      "no change",
      ".5 to 5",
      "6 to 10",
      "11 to 15",
      "16 to 23",
    ],
    totalChgMin: [-13, -5, -0.4, 0.5, 6, 11, 16, 26],
    totalChgMax: [-6, -0.5, 0.4, 5, 10, 15, 25, 56],
    totalChgLabel: [
      "-13 to -6",
      "-5 to -.5",
      "no change",
      ".5 to 5",
      "6 to 10",
      "11 to 26",
      "16 to 25",
      "26 to 56",
    ],
    colors: [
      "#00ffd4",
      "#00d9b4",
      "#00b294",
      "#008c74",
      "#315b61",
      "#fffacd",
      "#e67500",
      "#ffaa00",
    ],
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
              symbol: createHexSymbol(classBreakNums.resunits.colors[i]),
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
              symbol: createHexSymbol(classBreakNums.homestead.colors[i]),
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
              symbol: createHexSymbol(classBreakNums.nonressf.colors[i]),
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
              symbol: createHexSymbol(classBreakNums.pyr_market.colors[i]),
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
              symbol: createHexSymbol(classBreakNums.pyr_taxes.colors[i]),
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
    field: `${fieldPrefix}_${sliderValue.innerHTML}}_${changeMode}`,
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
