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
  "esri/layers/support/FeatureEffect",
  "esri/renderers/visualVariables/ColorVariable",
  "esri/renderers/ClassBreaksRenderer",
  "esri/layers/GeoJSONLayer"
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
  FeatureEffect,
  ColorVariable,
  ClassBreaksRenderer,
  GeoJSONLayer
) => {
  /*********************************************/
  /*             SETUP MAP & VIEW              */
  /*********************************************/

  //   const colorVisVar = {
  //     type: "color",
  //     field: "PYR_TAXES_09",
  //     stops: [
  //       { value: 100, color: "#fff380" },
  //       { value: 1000, color: "#e56717" },
  //       { value: 10000, color: "#C11B17" },
  //       { value: 50000, color: "#8C001A" },
  //       { value: 100000, color: "#2B1B17	" }
  //     ],
  //     legendOptions: {
  //       title: "Population per square kilometer"
  //     }
  //   };

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

  /*****************************************************************
   * Set each unique value directly in the renderer's constructor.
   * At least one field must be used (in this case the "COL_DEG" field).
   * The label property of each unique value will be used to indicate
   * the field value and symbol in the legend.
   *****************************************************************/

  const renderer = {
    type: "class-breaks", // autocasts as new ClassBreaksRenderer()
    field: "PYR_TAXES_09",
    // normalizationField: "EDUCBASECY",
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

  const hexLayer = new GeoJSONLayer({
    url: "hex09.geojson",
    title: "1-Acre Hexagrams",
    labelsVisible: false,
    visible: true,
    // legendEnabled: false,
    renderer: renderer
  });

  const boundRenderer = {
    type: "simple",
    symbol: {
      type: "simple-fill",
      // color: [144, 238, 144, 0.95],
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
    renderer: boundRenderer,
    popupEnabled: false
  });

  // create the map object from portal basemap & add layers
  const map = new Map({
    basemap: "gray-vector",
    layers: [hexLayer, urbServArea]
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

  /*********************************************/
  /*             SLIDER WIDGET                 */
  /*********************************************/

  // get reference to the DOM elements
  const sliderValue = document.getElementById("sliderValue");
  const playButton = document.getElementById("playButton");
  const sliderContainer = document.getElementById("sliderContainer");

  //create the slider widget
  const slider = new Slider({
    container: "slider",
    min: 2009,
    max: 2022,
    values: [2009],
    step: 1,
    visibleElements: {
      rangeLabels: true
    }
  });

  // When user drags the slider:
  //  - stops the animation
  //  - set the visualized year to the slider one
  //  - updates the charts based on the year value from the slider
  function inputHandler(event) {
    stopAnimation();
    setYear(event.value);
    updateChart(event.value);
  }

  slider.on("thumb-drag", inputHandler);

  // Toggle animation on/off when user
  // clicks on the play button
  playButton.addEventListener("click", () => {
    if (playButton.classList.contains("toggled")) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });

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

  let screenWidth = screen.width;
  console.log(screenWidth);

  if (screenWidth > 728) {
    legendExpand.visible = false;
  }
  if (screenWidth < 728) {
    legendFull.visible = false;
  }
});
