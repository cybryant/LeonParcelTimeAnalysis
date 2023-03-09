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
  "esri/renderers/ClassBreaksRenderer"
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
  ClassBreaksRenderer
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
        label: "$5,000"
      },
      {
        minValue: 5000,
        maxValue: 19999,
        symbol: less20000,
        label: "$20,000%"
      },
      {
        minValue: 20000,
        maxValue: 500000,
        symbol: more20000,
        label: "> $20,000"
      }
    ]
  };

  const hexLayer = new FeatureLayer({
    portalItem: {
      id: "73aed7ea54be4a14ae96568569c25f5b"
    },
    title: "hexbin",
    // labelsVisible: false,
    // legendEnabled: false,
    visible: true,
    renderer: renderer
  });

  // create the map object from portal basemap & add layers
  const map = new Map({
    basemap: {
      portalItem: {
        id: "4f2e99ba65e34bb8af49733d9778fb8e"
      }
    },
    layers: [hexLayer]
  });

  //set the mapView parameters
  const view = new MapView({
    map: map,
    container: "viewDiv",
    // center: [-84.28073, 30.43826], //this is the true center but it's offset due to more northward growth
    center: [-84.28073, 30.47],
    // scale: 250000,
    zoom: 11,
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

  // Set up view elements
  view.ui.add(
    new Legend({
      view: view
      // id: "legendBox"
    }),
    "top-right"
  );
});
