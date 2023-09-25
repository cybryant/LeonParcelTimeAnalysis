require(["esri/layers/FeatureLayer"], (FeatureLayer) => {
  //********************
  // HEXBIN LAYERS
  //********************

  const colors = [
    "#ffaa00",
    "#f28e00",
    "#e67500",
    "#b45a00",
    "#315b61",
    "#008c74",
    "#00b294",
    "#00d9b4",
    "#00ffd4"
  ];

  // properties common to all the hexbin layers
  let commonProps_HexLyr = {
    labelsVisible: false,
    visible: true
    // renderer:
  };

  // resunits hexbins
  const resunitsHexLyr = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/resunits_hexbins/FeatureServer",
    title: "Residential Units",
    ...commonProps_HexLyr
  });

  // homestead hexbins
  const homesteadHexLyr = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/homestead_hexbins/FeatureServer",
    title: "Homsteaded Units",
    ...commonProps_HexLyr
  });

  // nonressf hexbins
  const nonressfHexLyr = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/nonressf_hexbins/FeatureServer",
    title: "Nonresidential Square Feet",
    ...commonProps_HexLyr
  });

  // pyr_market hexbins
  const pyr_marketHexLyr = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/pyr_market_hexbins/FeatureServer",
    title: "Prior Year Market",
    ...commonProps_HexLyr
  });

  // pyr_taxes hexbins
  const pyr_taxesHexLyr = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/pyr_taxes_hexbins/FeatureServer",
    title: "Prior Year Taxes",
    ...commonProps_HexLyr
  });

  //********************
  // POINT LAYERS
  //********************
  // resunits points

  // homestead points

  // nonressf points

  // pyr_market points

  // pyr_taxes points

  //********************
  // USA BOUNDARY LAYER
  //********************
  // USA boundary renderer
  const usBoundRndr = {
    type: "simple",
    symbol: {
      type: "simple-fill",
      color: null,
      outline: { width: 1.5, color: "darkslategray" }
    }
  };

  const urbServArea = new FeatureLayer({
    portalItem: {
      id: "23dd4294859a4169a911aa2f949187f5"
    },
    title: "Urban Service Area",
    labelsVisible: false,
    legendEnabled: false,
    visible: true,
    renderer: usBoundRndr,
    popupEnabled: false,
    listMode: "hide"
  });

  // // streets boundary renderer
  // const streetsRndr = {
  //   type: "simple",
  //   symbol: {
  //     type: "simple-line",
  //     color: "black",
  //     width: 1,
  //     style: "short-dot"
  //   }
  // };

  //********************
  // HOTSPOT LAYERS
  //********************

  // hotspot renderer
  let commonProperties = {
    type: "simple-fill",
    outline: { width: 0.05, color: "darkslategray" }
  };

  // let hotSpotFldName = `pattern_${htsptCat}`;

  const hotspotRenderer = {
    type: "unique-value",
    // field: hotSpotFldName,
    field: "pattern",
    defaultSymbol: { type: "simple-fill", color: null, outline: null },
    uniqueValueInfos: [
      {
        value: "Persistent Hot Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#990000"
        }
      },
      {
        value: "Intensifying Hot Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#d7301f"
        }
      },
      {
        value: "Consecutive Hot Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#ef6548"
        }
      },
      {
        value: "New Hot Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#fc8d59"
        }
      },
      {
        value: "Diminishing Hot Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#fdbb84"
        }
      },
      {
        value: "Sporadic Hot Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#fdd49e"
        }
      },
      {
        value: "Oscillating Hot Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#fee8c8"
        }
      },
      {
        value: "Historical Hot Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#fff7ec"
        }
      },
      {
        value: "Historical Cold Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#fff7fb"
        }
      },
      {
        value: "Oscillating Cold Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#ece7f2"
        }
      },
      {
        value: "Sporadic Cold Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#d0d1e6"
        }
      },
      {
        value: "Diminishing Cold Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#a6bddb"
        }
      },
      {
        value: "New Cold Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#74a9cf"
        }
      },
      {
        value: "Consecutive Cold Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#3690c0"
        }
      },
      {
        value: "Intensifying Cold Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#0570b0"
        }
      },
      {
        value: "Persistent Cold Spot",
        // label: "",
        symbol: {
          ...commonProperties,
          color: "#034e7b"
        }
      }
    ]
  };

  // resunuts hotspot layer
  const resunitsLayer = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/resUnits_EmergingHotSpotAnalysis/FeatureServer",
    title: "Residential Units Hotspot / Coldspot Analysis",
    labelsVisible: false,
    visible: true,
    renderer: hotspotRenderer
  });

  // nonresidential SF hotspot layer
  const nonResSFLayer = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/nonResSF_STCube_EmergingHotSpotAnalysis/FeatureServer",
    title: "Nonresidential SF Hotspot / Coldspot Analysis",
    labelsVisible: false,
    visible: true,
    renderer: hotspotRenderer
  });

  // homesteads hotspot layer
  const homesteadLayer = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/homestead_STCube_EmergingHotSpotAnalysis/FeatureServer",
    title: "Homestead Hotspot / Coldspot Analysis",
    labelsVisible: false,
    visible: true,
    renderer: hotspotRenderer
  });

  // valuation hotspot layer
  const PYR_MARKETLayer = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/PYR_MARKET_STCube_EmergingHotSpotAnalysis/FeatureServer",
    title: "Valuation Hotspot / Coldspot Analysis",
    labelsVisible: false,
    visible: true,
    renderer: hotspotRenderer
  });

  // taxes hotspot layer
  const PYR_TAXESLayer = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/PYR_TAXES_STCube_EmergingHotSpotAnalysis/FeatureServer",
    title: "Property Taxes Hotspot / Coldspot Analysis",
    labelsVisible: false,
    visible: true,
    renderer: hotspotRenderer
  });

  // streets layer
  const streets = new FeatureLayer({
    portalItem: {
      id: "3a5c0cceee864a20bdd2ca491865c5d5"
    },
    // url: "https://intervector.leoncountyfl.gov/intervector/rest/services/MapServices/TLC_OverlayStreetCenterline_D_WM/MapServer/0",
    title: "Streets",
    // labelsVisible: true,
    // legendEnabled: true,
    // definitionExpression: "FUNC_CLASS > 2",
    // visible: true,
    renderer: streetsRndr,
    popupEnabled: false
  });
});

const colors = [
  "#ffaa00",
  "#f28e00",
  "#e67500",
  "#b45a00",
  "#315b61",
  "#008c74",
  "#00b294",
  "#00d9b4",
  "#00ffd4"
];

module.exports = { colors };
