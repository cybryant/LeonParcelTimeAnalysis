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

  // const hexLayer = new GeoJSONLayer({
  //   url: "hex11.geojson",
  //   title: "1-Acre Hexagrams",
  //   labelsVisible: false,
  //   visible: true
  //   // renderer: taxRenderer
  // });

  const hexLayer = new FeatureLayer({
    url: "https://services7.arcgis.com/YOV9eUE0MKHovUid/arcgis/rest/services/hex_11gdb/FeatureServer/0",
    title: "1-Acre Hexagrams",
    labelsVisible: false,
    visible: true
  });

  // USA boundary renderer
  const usBoundRndr = {
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
    renderer: usBoundRndr,
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

  // ### TO DO ### update hardcoding to be variable recognizing 2009 to last year ###
  //create the slider widget
  const slider = new Slider({
    container: "slider",
    min: 09,
    max: 22,
    values: [09],
    tickConfigs: [
      {
        mode: "position",
        values: [09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
        labelsVisible: true
      }
    ],
    step: 1,
    visibleElements: {
      rangeLabels: true
    }
    // draggableSegmentsEnabled: false //didn't do anything
  });

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
  sliderValue.innerHTML = "2009";

  let renderYear;

  //Sets the current visualized year based on slider value
  function setYear(value) {
    renderYear = Math.floor(value);
    sliderValue.innerHTML = `${renderYear}`;
    slider.viewModel.setValue(0, value);
    console.log("slider internal html is" + sliderValue.innerHTML);
    console.log("value is" + renderYear);
    // let displayYear = "11";
    // hexLayer.renderer = taxRenderer(displayYear);
    hexLayer.renderer = taxRenderer(renderFldPrefix, Math.floor(value));
    // return renderYear;
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
    let checked = 0;

    //Reference the Table.
    let checkBoxes = document.getElementById("checkBoxDiv");

    //Reference all the CheckBoxes in Table.
    let chks = checkBoxes.getElementsByTagName("INPUT");

    //Loop and count the number of checked CheckBoxes.
    for (var i = 0; i < chks.length; i++) {
      if (chks[i].checked) {
        checked++;
      }
    }

    if (checked == 1) {
      for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked) {
          renderFldPrefix = chks[i].id;
          console.log(renderFldPrefix);
          hexLayer.renderer = taxRenderer(
            renderFldPrefix,
            sliderValue.innerHTML
          );
          console.log(sliderValue.innerHTML);
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

  //**************************/
  // RENDERERS
  //**************************/

  //*******************************
  //PRIOR YEAR TAXES RENDERER
  //*******************************
  // color class variables
  //*******************************
  const negative = {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: "#fffcd4",
    style: "solid",
    outline: {
      width: 0.2,
      color: [255, 255, 255, 0.5]
    }
  };

  const zeroTO25 = {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: "#b1cdc2",
    style: "solid",
    outline: {
      width: 0.2,
      color: [255, 255, 255, 0.5]
    }
  };

  const over25 = {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: "#38627a",
    style: "solid",
    outline: {
      width: 0.2,
      color: [255, 255, 255, 0.5]
    }
  };

  const over50 = {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: "#0d2644",
    style: "solid",
    outline: {
      width: 0.2,
      color: [255, 255, 255, 0.5]
    }
  };

  // taxRenderer
  //*******************************
  // set initial render state
  renderFldPrefix = "PYR_TAXES";

  function taxRenderer(fieldPrefix, dispYear) {
    console.log(`${fieldPrefix}_${dispYear}_BYPC`);
    return {
      type: "class-breaks", // autocasts as new ClassBreaksRenderer()
      // field: "PYR_TAXES_11",
      field: `${fieldPrefix}_${dispYear}_BYPC`,
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
          // minValue: 0,
          maxValue: 0,
          symbol: negative,
          label: "negative"
        },
        {
          minValue: 0.00001,
          maxValue: 24.9,
          symbol: zeroTO25,
          label: "< 25%"
        },
        {
          minValue: 25,
          maxValue: 49.999,
          symbol: over25,
          label: "> 25%"
        },
        {
          minValue: 50,
          maxValue: 1000,
          symbol: over50,
          label: "> 50%"
        }
      ]
    };
  }

  // set initial renderer display year
  setYear(09);
});
