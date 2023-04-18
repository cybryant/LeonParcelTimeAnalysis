require([
  "esri/Map",
  "esri/layers/FeatureLayer",
  "esri/views/MapView",
  "esri/core/promiseUtils",
  "esri/widgets/Legend",
  "esri/widgets/Home",
  "esri/widgets/Slider",
  "esri/widgets/Zoom",
  "esri/widgets/Fullscreen",
  "esri/widgets/Expand",
  // "esri/layers/support/FeatureEffect",
  // "esri/renderers/visualVariables/ColorVariable",
  // "esri/renderers/ClassBreaksRenderer",
  // "esri/renderers/UniqueValueRenderer",
  // "esri/layers/GeoJSONLayer",
  // "esri/renderers/SimpleRenderer",
  "esri/core/reactiveUtils"
], (
  Map,
  FeatureLayer,
  MapView,
  promiseUtils,
  Legend,
  Home,
  Slider,
  Zoom,
  Fullscreen,
  Expand,
  // FeatureEffect,
  // ColorVariable,
  // ClassBreaksRenderer,
  // UniqueValueRenderer,
  // GeoJSONLayer,
  // SimpleRenderer,
  reactiveUtils
) => {
  /*********************************************/
  /*             SETUP MAP & VIEW              */
  /*********************************************/

  // const hexLayer = new GeoJSONLayer({
  //   url: "hex11.geojson",
  //   title: "1-Acre Hexagrams",
  //   labelsVisible: false,
  //   visible: true
  //   // renderer: taxRenderer
  // });

  const hexLayer = new FeatureLayer({
    // url: "https://services7.arcgis.com/YOV9eUE0MKHovUid/arcgis/rest/services/hexbin_2011_gdb2/FeatureServer/0",
    // url: "https://services7.arcgis.com/YOV9eUE0MKHovUid/arcgis/rest/services/hexbin_2022_gdb/FeatureServer/0", //hex2022GDB
    // url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/testParcelAnalysis/FeatureServer", //hex_2022GDB_noSL
    url: "https://services7.arcgis.com/YOV9eUE0MKHovUid/arcgis/rest/services/hexbin_gdb3/FeatureServer/0", //uploaded via gdb on personal developer account
    title: "1-Acre Hexagrams",
    labelsVisible: false,
    visible: true
  });

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
    popupEnabled: false
  });

  // streets boundary renderer
  const streetsRndr = {
    type: "simple",
    symbol: {
      type: "simple-line",
      color: "black",
      width: 0.5,
      style: "short-dot"
    }
  };

  // streets layer
  const streets = new FeatureLayer({
    // portalItem: {
    //   id: "3a5c0cceee864a20bdd2ca491865c5d5"
    // },
    url: "https://intervector.leoncountyfl.gov/intervector/rest/services/MapServices/TLC_OverlayStreetCenterline_D_WM/MapServer/0",
    title: "Streets",
    labelsVisible: true,
    legendEnabled: true,
    // definitionExpression: "FUNC_CLASS > 2",
    visible: true,
    renderer: streetsRndr,
    popupEnabled: false
  });

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

  // create the map object from portal basemap & add layers
  const map = new Map({
    basemap: "gray-vector",
    layers: [hexLayer, urbServArea, streets]
  });

  //set the mapView parameters
  const view = new MapView({
    map: map,
    container: "viewDiv",
    // center: [-84.28073, 30.43826], //this is the true center but it's offset due to more northward growth
    // center: [-84.28073, 30.47],
    center: [-84.23, 30.47],
    scale: 75000,
    //zoom: 13,
    constraints: {
      snapToZoom: false
      //minScale: 72223.819286,
      //minScale: 100000,
    },
    // This ensures that when going fullscreen the top left corner of the view extent stays aligned with the top left corner of the view's container
    resizeAlign: "top-left"
  });

  let loading = document.getElementById("loading");

  // Display the loading indicator when the view is updating
  // NEEDS WORK SO IT WORKS FOR WHEN LAYERS UPDATE AS WELL
  reactiveUtils.watch(
    () => view.updating,
    (updating) => {
      loading.style.visibility = "visible";
    }
  );

  reactiveUtils.watch(
    () => view.updating,
    (updating = false) => {
      loading.style.visibility = "hidden";
    }
  );

  // Hide the loading indicator when the view stops updating
  // reactiveUtils.whenFalse(view, "updating", function (evt) {
  //   $("#loading").hide();
  // });

  /*********************************************/
  /*             SLIDER WIDGET                 */
  /*********************************************/

  // get reference to the DOM elements
  const sliderValue = document.getElementById("sliderValue");
  const sliderContainer = document.getElementById("sliderContainer");
  // not using play or animation on this version
  // const playButton = document.getElementById("playButton");

  // ### TO DO ### update hardcoding to be variable recognizing 2009 to last year ###
  //create the slider widget
  const slider = new Slider({
    container: "slider",
    min: 2009,
    max: 2022,
    values: [2009],
    tickConfigs: [
      {
        mode: "position",
        values: [
          2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021
        ],
        labelsVisible: false
      }
    ],
    steps: 1,
    visibleElements: {
      rangeLabels: true
    }
  });

  // makes slider snap to whole numbers
  slider.viewModel.snapOnClickEnabled = true;

  // When user drags the slider:
  //  - stops the animation
  //  - set the visualized year to the slider one
  //  - updates the charts based on the year value from the slider
  function inputHandler(event) {
    // stopAnimation();
    setYear(event.value);
    // updateChart(event.value);
  }

  // event listener for slider input
  slider.on("thumb-drag", inputHandler);
  // ### TODO ### add tick-click also

  // Toggle animation on/off when user
  // clicks on the play button
  // playButton.addEventListener("click", () => {
  //   if (playButton.classList.contains("toggled")) {
  //     stopAnimation();
  //   } else {
  //     startAnimation();
  //   }
  // });

  // set initial state of the year displayed in large text
  // sliderValue.innerHTML = "2009";

  // let renderYear;

  //Sets the current visualized year based on slider value

  function setYear(value) {
    if (map.layers != [hexLayer, urbServArea]) {
      map.layers = [hexLayer, urbServArea];
    }
    let renderYear = Math.floor(value);
    sliderValue.innerHTML = `${renderYear}`;
    slider.viewModel.setValue(0, value);
    console.log("slider internal html is" + sliderValue.innerHTML);
    console.log("value is" + renderYear);
    hexLayer.renderer = hexRenderer(
      renderFldPrefix,
      Math.floor(value),
      renderChngMode
    );
    // return renderYear;
  }

  //*************************/
  // back button
  //*************************/
  document.getElementById("backBtn").addEventListener("click", moveBack);

  function moveBack() {
    renderYear = Number(sliderValue.innerHTML) - 1;
    if (renderYear >= 2009) {
      hexLayer.renderer = hexRenderer(
        renderFldPrefix,
        renderYear,
        renderChngMode
      );
      sliderValue.innerHTML = `${renderYear}`;
      slider.viewModel.setValue(0, renderYear);
    }
  }

  //*************************/
  // forward button
  //*************************/
  document.getElementById("fwdBtn").addEventListener("click", moveFwd);

  function moveFwd() {
    renderYear = Number(sliderValue.innerHTML) + 1;
    if (renderYear <= 2022) {
      hexLayer.renderer = hexRenderer(
        renderFldPrefix,
        renderYear,
        renderChngMode
      );
      sliderValue.innerHTML = `${renderYear}`;
      slider.viewModel.setValue(0, renderYear);
    }
  }

  //*********************************
  // ADD FUNCTIONALITY TO EXPAND Legend WIDGET
  //*********************************
  let legendSmall = new Legend({
    view: view
    // id: "legendBox"
  });

  let legendExpand = new Expand({
    expandIconClass: "esri-icon-legend",
    expandTooltip: "Legend",
    view: view,
    content: legendSmall,
    mode: "floating"
  });

  let legendFull = new Legend({
    view: view
    // id: "legendBox"
  });

  // Set up view elements
  view.ui.add(sliderContainer, "manual");
  view.ui.add(legendFull, "top-right");
  view.ui.add(legendExpand, "top-right");
  view.ui.add(
    new Fullscreen({
      view: view,
      element: applicationDiv
    }),
    "top-left"
  );
  view.ui.add(loading, "manual");

  // make legend show full on larger screens or as an expandable widget on smaller screens
  let screenWidth = screen.width;

  if (screenWidth > 728) {
    legendExpand.visible = false;
  } else {
    legendFull.visible = false;
  }

  ///////////////////////////////////////
  // VARIABLE CHECK BOXES EVENT LISTENER
  //////////////////////////////////////

  document
    .getElementById("displayBtn")
    .addEventListener("click", ValidateCheckBoxes);

  function ValidateCheckBoxes() {
    sliderContainer.style.visibility = "visible";

    let checked = 0;

    //Reference the div holding the variable checkboxes (currenlty radio, but may go back so leaving code)
    let checkBoxes = document.getElementById("checkBoxDiv");
    //Reference all the CheckBoxes in div.
    let chks = checkBoxes.getElementsByTagName("INPUT");
    // let chks = checkBoxes.getElementByName("variablePanel");
    //Loop and count the number of checked CheckBoxes.
    for (var i = 0; i < chks.length; i++) {
      if (chks[i].checked) {
        checked++;
      }
    }

    let changeModeDiv = document.getElementById("changeModeDiv");
    let changeModeBtns = changeModeDiv.getElementsByTagName("INPUT");

    for (var c = 0; c < changeModeBtns.length; c++)
      if (changeModeBtns[c].checked) {
        renderChngMode = changeModeBtns[c].id;
        console.log(renderChngMode);
      }

    if (checked == 1) {
      for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked) {
          renderFldPrefix = chks[i].id;
          // console.log(renderFldPrefix);
          hexLayer.renderer = hexRenderer(
            renderFldPrefix,
            sliderValue.innerHTML,
            renderChngMode
          );
          console.log(sliderValue.innerHTML + "_" + renderChngMode);
        }
      }
      // return true;
    } else if (checked == 2) {
      alert(checked + "boxes are checked.");
      return true;
    } else {
      alert(`${checked} boxes are chosen. Check just 1 or 2 boxes.`);
      return false;
    }
  }

  //*****************************/
  // EVENT LISTENER FOR HOT SPOT BUTTON
  //****************************/

  document.getElementById("hotSpotBtn").addEventListener("click", showHotSpots);

  function showHotSpots() {
    // make the slider invisible

    sliderContainer.style.visibility = "hidden";

    let checked = 0;

    //Reference the div
    let checkBoxes2 = document.getElementById("checkBoxDiv");

    //Reference all the CheckBoxes in Div.
    let chks = checkBoxes2.getElementsByTagName("INPUT");

    // have to spell out the map.layers definitions here because the string manipulation (used in ValidateCheckboxes() above) doesn't work for layers since they are objects rather than strings.
    for (var i = 0; i < chks.length; i++) {
      if (chks[i].checked) {
        let checkedBtn = chks[i].id;
        if (checkedBtn == "resunits") {
          map.layers = [resunitsLayer, urbServArea];
        } else if (checkedBtn == "nonResSF") {
          map.layers = [nonResSFLayer, urbServArea];
        } else if (checkedBtn == "homestead") {
          map.layers = [homesteadLayer, urbServArea];
        } else if (checkedBtn == "PYR_MARKET") {
          map.layers = [PYR_MARKETLayer, urbServArea];
        } else if (checkedBtn == "PYR_TAXES") {
          map.layers = [PYR_TAXESLayer, urbServArea];
        }
      }
    }
  }

  //**************************/
  // UNIQUE VALUE RENDERER
  //**************************/
  function hexRenderer(fieldPrefix, dispYear, chngMode) {
    if (map.layers != [hexLayer, urbServArea]) {
      map.layers = [hexLayer, urbServArea];
    }
    fieldName = `${fieldPrefix}_${dispYear}_${chngMode}cat`;
    let commonProperties2 = {
      type: "simple-fill",
      outline: { width: 0.05, color: "darkslategray" }
    };

    const colors = [
      "#804521",
      "#aa8363",
      "#d5c0a4",
      "#eadfc5",
      "#dbdfd0",
      "#b6c0b9",
      "#6d838c",
      "#24455f"
    ];

    return {
      type: "unique-value",
      field: fieldName,
      legendOptions: {
        title: `${dispYear} ${chngMode}`
      },
      defaultSymbol: { type: "simple-fill", color: null, outline: null },
      uniqueValueInfos: [
        {
          value: "over100",
          label: "100+%",
          symbol: {
            ...commonProperties2,
            color: colors[7]
          }
        },
        {
          value: "seventy5to100",
          label: "75-100%",
          symbol: {
            ...commonProperties2,
            color: colors[6]
          }
        },
        {
          value: "fiftyTo75",
          label: "50-75%",
          symbol: {
            ...commonProperties2,
            color: colors[5]
          }
        },
        {
          value: "twenty5to50",
          label: "25-50%",
          symbol: {
            ...commonProperties2,
            color: colors[4]
          }
        },
        {
          value: "zeroTo25",
          label: "0-25%",
          symbol: {
            ...commonProperties2,
            color: colors[3]
          }
        },
        {
          value: "neg0to25",
          label: "-25-0%",
          symbol: {
            ...commonProperties2,
            color: colors[2]
          }
        },
        {
          value: "neg25to50",
          label: "-25 to -50%",
          symbol: {
            ...commonProperties2,
            type: "simple-fill",
            color: colors[1]
          }
        },
        {
          value: "neg50plus",
          label: "below -50%",
          symbol: {
            ...commonProperties2,
            color: colors[0]
          }
        }
      ]
      // visualVariables: [
      //   {
      //     type: "opacity",
      //     field: "POPULATION",
      //     normalizationField: "SQ_KM",
      //     // features with 30 ppl/sq km or below are assigned the first opacity value
      //     stops: [
      //       { value: 100, opacity: 0.15 },
      //       { value: 1000, opacity: 0.9 }
      //     ]
      //   }
      // ]
    };
  }

  //***********************************/
  //EVENT LISTENER FOR PLACEHOLDER TABS
  //***********************************/

  document
    .getElementById("landUseTab")
    .addEventListener("click", landUseMessage);
  function landUseMessage() {
    alert("Land Use Analysis coming in Phase 2");
    return true;
  }

  document.getElementById("growthTab").addEventListener("click", growthMessage);
  function growthMessage() {
    alert("Growth Scenarios coming in Phase 3");
    return true;
  }

  // set initial render state
  let renderFldPrefix = "resunits";

  // set initial render state
  let renderChngMode = "APC";

  // set initial renderer display year
  setYear(2010);
});
