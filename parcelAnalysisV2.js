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
  "esri/widgets/LayerList",
  "esri/layers/support/FeatureEffect",
  // "esri/renderers/visualVariables/ColorVariable",
  // "esri/renderers/ClassBreaksRenderer",
  // "esri/renderers/UniqueValueRenderer",
  // "esri/layers/GeoJSONLayer",
  // "esri/renderers/SimpleRenderer",
  "esri/core/reactiveUtils",
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
  LayerList,
  FeatureEffect,
  // ColorVariable,
  // ClassBreaksRenderer,
  // UniqueValueRenderer,
  // GeoJSONLayer,
  // SimpleRenderer,
  reactiveUtils
) => {
  //*******************************************************************
  //*******************************************************************
  //                      CONSTRUCT LAYERS
  //*******************************************************************
  //*******************************************************************

  //****************************************
  // URBAN SERVICE AREA LAYER
  //****************************************
  const urbServArea = new FeatureLayer({
    portalItem: {
      id: "23dd4294859a4169a911aa2f949187f5",
    },
    title: "Urban Service Area",
    labelsVisible: false,
    legendEnabled: false,
    visible: true,
    renderer: usBoundRndr,
    popupEnabled: false,
    listMode: "hide",
  });

  //*****************************
  // TIME LAYERS
  //*****************************

  // properties common to all the hexbin layers
  let commonProps_TimeLyrs = {
    labelsVisible: false,
    visible: true,
    opacity: 0.82,
  };

  const resunitsTimeLyr = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/resunits_hexbins/FeatureServer",
    title: "Residential Units",
    ...commonProps_TimeLyrs,
  });

  const homesteadTimeLyr = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/homestead_hexbins/FeatureServer",
    title: "Homsteaded Units",
    ...commonProps_TimeLyrs,
  });

  const nonressfTimeLyr = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/nonressf_hexbins/FeatureServer",
    title: "Nonresidential Square Feet",
    ...commonProps_TimeLyrs,
  });

  const pyr_marketTimeLyr = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/pyr_market_hexbins/FeatureServer",
    title: "Prior Year Market",
    ...commonProps_TimeLyrs,
  });

  const pyr_taxesTimeLyr = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/pyr_taxes_hexbins/FeatureServer",
    title: "Prior Year Taxes per Acre",
    ...commonProps_TimeLyrs,
  });

  //****************************
  // POINT LAYERS
  // used for cluster display
  //****************************

  // properties common to all the point layers
  // these are just used for clustering labels
  let commonProps_PtsLyr = {
    labelsVisible: true,
    visible: false,
  };

  // resunits points

  // homestead points

  // nonressf points

  // pyr_market points

  // pyr_taxes points

  //*****************************
  // HOTSPOT LAYERS
  //*****************************

  // properties common to all the hotspot layers
  let commonProps_HotSpotLyr = {
    labelsVisible: false,
    visible: true,
    opacity: 0.8,
    renderer: hotspotRenderer,
  };

  const resunitsLayer = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/resUnits_EmergingHotSpotAnalysis/FeatureServer",
    title: "Residential Units Hotspot / Coldspot Analysis",
    ...commonProps_HotSpotLyr,
  });

  const nonResSFLayer = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/nonResSF_STCube_EmergingHotSpotAnalysis/FeatureServer",
    title: "Nonresidential SF Hotspot / Coldspot Analysis",
    ...commonProps_HotSpotLyr,
  });

  const homesteadLayer = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/homestead_STCube_EmergingHotSpotAnalysis/FeatureServer",
    title: "Homestead Hotspot / Coldspot Analysis",
    ...commonProps_HotSpotLyr,
  });

  const PYR_MARKETLayer = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/PYR_MARKET_STCube_EmergingHotSpotAnalysis/FeatureServer",
    title: "Valuation Hotspot / Coldspot Analysis",
    ...commonProps_HotSpotLyr,
  });

  const PYR_TAXESLayer = new FeatureLayer({
    url: "https://services.arcgis.com/ptvDyBs1KkcwzQNJ/arcgis/rest/services/PYR_TAXES_STCube_EmergingHotSpotAnalysis/FeatureServer",
    title: "Property Taxes Hotspot / Coldspot Analysis",
    ...commonProps_HotSpotLyr,
  });

  //*****************************
  // CREATE MAP & SET PARAMETERS
  //*****************************

  // create the map object from portal basemap & add the default layer (i.e. resunitsTime)
  const map = new Map({
    basemap: "gray-vector",
    // basemap: "dark-gray-vector",
    layers: [resunitsTimeLyr, urbServArea],
  });

  //set the mapView parameters
  const view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-84.275, 30.47],
    // center: [-84.23, 30.47],
    scale: 170000,
    constraints: {
      snapToZoom: false,
    },
    // This ensures that when going fullscreen the top left corner of the view extent stays aligned with the top left corner of the view's container
    resizeAlign: "top-left",
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

  //*******************************************************************
  //*******************************************************************
  //                      YEAR SLIDER WIDGET
  //*******************************************************************
  //*******************************************************************

  // ADD NEW YEAR HERE WHEN DATA IS UPDATED EACH NOVEMBER
  years = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];

  // get reference to the DOM elements
  const sliderValue = document.getElementById("sliderValue");
  const sliderContainer = document.getElementById("sliderContainer");

  //create the slider widget
  const slider = new Slider({
    container: "slider",
    min: 2009,
    // min: years[0],
    max: 2022,
    // max: years[-1],
    values: [2009],
    // values: [years[0]],
    tickConfigs: [
      {
        mode: "position",
        // values: [years.slice(1, -1)],
        values: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
        labelsVisible: false,
      },
    ],
    steps: 1,
    visibleElements: {
      rangeLabels: true,
    },
  });

  // makes slider snap to whole numbers
  slider.viewModel.snapOnClickEnabled = true;

  // When user drags the slider,set the visualized year to the slider one
  function inputHandler(event) {
    setYear(event.value);
  }

  // event listener for slider input
  slider.on("thumb-drag", inputHandler);

  //Sets the current visualized year based on slider value
  function setYear(value) {
    // if (map.layers != [hexLayer, urbServArea]) {
    //   map.layers = [hexLayer, urbServArea];
    // }
    let renderYear = Math.floor(value);
    sliderValue.innerHTML = `${renderYear}`;
    slider.viewModel.setValue(0, value);
    setAttribute();
  }

  //*************/
  // BACK BUTTON
  //*************/
  document.getElementById("backBtn").addEventListener("click", moveBack);

  function moveBack() {
    renderYear = Number(sliderValue.innerHTML) - 1;
    if (renderYear >= 2009) {
      // if (renderYear >= years[0]) {
      // hexLayer.renderer = hexRenderer(renderFldPrefix, renderYear, changeMode);
      setAttribute(displayMode, renderYear, changeMode);
      sliderValue.innerHTML = `${renderYear}`;
      slider.viewModel.setValue(0, renderYear);
    }
  }

  //****************/
  // FORWARD BUTTON
  //****************/
  document.getElementById("fwdBtn").addEventListener("click", moveFwd);

  function moveFwd() {
    renderYear = Number(sliderValue.innerHTML) + 1;
    if (renderYear <= 2022) {
      // if (renderYear <= years[-1]) {
      // hexLayer.renderer = hexRenderer(renderFldPrefix, renderYear, changeMode);
      setAttribute(displayMode, renderYear, changeMode);
      sliderValue.innerHTML = `${renderYear}`;
      slider.viewModel.setValue(0, renderYear);
    }
  }

  //*******************************************************************
  //*******************************************************************
  //                      EXPAND WIDGETS
  //*******************************************************************
  //*******************************************************************

  // ********** ADD FUNCTIONALITY TO EXPAND Legend WIDGET ****************
  let legendSmall = new Legend({
    view: view,
    // id: "legendBox"
  });

  let legendExpand = new Expand({
    expandIconClass: "esri-icon-legend",
    expandTooltip: "Legend",
    view: view,
    content: legendSmall,
    mode: "floating",
    expanded: true,
  });

  // let legendFull = new Legend({
  //   view: view
  // });

  //*********************************
  // ADD FUNCTIONALITY TO EXPAND LayerList WIDGET
  //*********************************
  const layerList = new LayerList({
    view: view,
  });

  layersExpand = new Expand({
    expandIconClass: "esri-icon-layer-list",
    expandTooltip: "Layers",
    view: view,
    content: layerList,
    id: "layers",
  });

  //*******************************************************************
  //*******************************************************************
  //                      SET UP VIEW ELEMENTS
  //*******************************************************************
  //*******************************************************************
  view.ui.add(sliderContainer, "manual");
  view.ui.add(gainLossBox, "manual");
  // view.ui.add(legendFull, "top-right");
  view.ui.add(legendExpand, "top-right");
  view.ui.add(layersExpand, "top-left");
  view.ui.add(
    new Fullscreen({
      view: view,
      element: applicationDiv,
    }),
    "top-left"
  );
  view.ui.add(loading, "manual");
  view.ui.add(
    new Home({
      view: view,
    }),
    "top-left"
  );

  // make legend show full on larger screens or as an expandable widget on smaller screens
  // let screenWidth = screen.width;
  // if (screenWidth > 728) {
  //   legendExpand.visible = false;
  // } else {
  //   legendFull.visible = false;
  // }

  //*******************************************************************
  //*******************************************************************
  //         EVENT LISTENERS FOR CONTROL PANEL & GAIN/LOSS BOX
  //*******************************************************************
  //*******************************************************************

  /* This function is used by all control panel inputs to set the layer based on various user selections so the code is written based on button names rather than just referencing the radio button change event itself. */

  // create an identifier to tell the renderer which attribute to display;
  // made global so it is available for gains/losses filter
  let fieldPrefix = "resunits";
  // set an active layer identifier so that it can be use in the gaines/losses filter
  let activeLyr = resunitsTimeLyr;

  // set appropriate renderers based on display mode, attribute, and value change mode selections
  function setAttribute() {
    if (displayMode == "time") {
      // set field prefix, load the appropriate time layer, and update timeRenderer accordingly
      for (var i = 0; i < attributeBtns.length; i++) {
        if (attributeBtns[i].checked) {
          let checkedBtn = attributeBtns[i].id;
          switch (checkedBtn) {
            case "resunits":
              fieldPrefix = "resunits";
              map.layers = [resunitsTimeLyr, urbServArea];
              resunitsTimeLyr.renderer = timeRenderer(fieldPrefix, changeMode);
              activeLyr = resunitsTimeLyr;
              break;
            case "nonressf":
              fieldPrefix = "nonressf";
              map.layers = [nonressfTimeLyr, urbServArea];
              nonressfTimeLyr.renderer = timeRenderer(fieldPrefix, changeMode);
              activeLyr = nonressfTimeLyr;
              break;
            case "homestead":
              fieldPrefix = "homestead";
              map.layers = [homesteadTimeLyr, urbServArea];
              homesteadTimeLyr.renderer = timeRenderer(fieldPrefix, changeMode);
              activeLyr = homesteadTimeLyr;
              break;
            case "pyr_market":
              fieldPrefix = "pyr_market";
              map.layers = [pyr_marketTimeLyr, urbServArea];
              pyr_marketTimeLyr.renderer = timeRenderer(fieldPrefix, changeMode);
              activeLyr = pyr_marketTimeLyr;
              break;
            case "pyr_taxes":
              fieldPrefix = "pyr_taxes";
              map.layers = [pyr_taxesTimeLyr, urbServArea];
              pyr_taxesTimeLyr.renderer = timeRenderer(fieldPrefix, changeMode);
              activeLyr = pyr_taxesTimeLyr;
              break;
          } // END time SWITCH
        } // END time IF
      } // END time FOR
    } else if (displayMode == "hotspot") {
      // load the appropriate hotspot layer
      for (var i = 0; i < attributeBtns.length; i++) {
        if (attributeBtns[i].checked) {
          let checkedBtn = attributeBtns[i].id;
          switch (checkedBtn) {
            case "resunits":
              map.layers = [resunitsLayer, urbServArea];
              break;
            case "nonressf":
              map.layers = [nonResSFLayer, urbServArea];
              break;
            case "homestead":
              map.layers = [homesteadLayer, urbServArea];
              break;
            case "pyr_market":
              map.layers = [PYR_MARKETLayer, urbServArea];
              break;
            case "pyr_taxes":
              map.layers = [PYR_TAXESLayer, urbServArea];
              break;
          } // END hotspot SWITCH
        } // END hotspot IF
      } // END hotspot FOR
    } // END displayMode IF/ELSE
    // set the gain/loss button back to "Show All"
    radiobtn = document.getElementById("all");
    radiobtn.checked = true;
  } // END SetAttribute()

  //*************************/
  // ATTRIBUTE RADIO BUTTONS
  //*************************/
  // reference attribute radio buttons
  let attributeDiv = document.getElementById("attributeDiv");
  let attributeBtns = attributeDiv.getElementsByTagName("INPUT");
  attributeDiv.addEventListener("change", getAttRadioBtns);

  function getAttRadioBtns() {
    // setAttribute(displayMode, displayYear, changeMode);
    setAttribute();
  }

  //*************/
  // TIME BUTTON
  //*************/
  // making this button a constant so we can show it as 'clicked' in original app state
  const timeBtn = document.getElementById("timeBtn");

  timeBtn.addEventListener("click", displayTime);

  function displayTime() {
    displayMode = "time";
    sliderContainer.style.visibility = "visible";
    changeModeBlock.style.visibility = "visible";

    setAttribute();
  }

  // ****************/
  // HOT SPOT BUTTON
  // ****************/
  document.getElementById("hotspotBtn").addEventListener("click", displayHotspot);

  function displayHotspot() {
    displayMode = "hotspot";

    // make the slider  & change mode buttons invisible
    sliderContainer.style.visibility = "hidden";
    changeModeBlock.style.visibility = "hidden";

    setAttribute();
  }

  // *************************/
  // CHANGE MODE RADIO BUTTONS
  // *************************/
  // create a variable to keep track of change mode state and set initial value to "n" for "Actual Values"
  let changeMode = "n";

  let changeModeDiv = document.getElementById("changeModeDiv");
  let changeModeBtns = changeModeDiv.getElementsByTagName("INPUT");
  changeModeDiv.addEventListener("change", setChangeMode);

  function setChangeMode() {
    for (var c = 0; c < changeModeBtns.length; c++)
      if (changeModeBtns[c].checked) {
        changeMode = changeModeBtns[c].id;
      }

    setAttribute();
  } // END SetChangeMode()

  // show the Gains/Losses box if Annual or Total mode is chosen, otherwise hide it
  changeModeDiv.addEventListener("change", DisplayGainLossBox);
  function DisplayGainLossBox() {
    for (var i = 0; i < changeModeBtns.length; i++) {
      if (changeModeBtns[i].checked) {
        let checkedBtn = changeModeBtns[i].id;
        switch (checkedBtn) {
          case "n":
            gainLossBox.style.visibility = "hidden";
            break;
          case "A":
            gainLossBox.style.visibility = "visible";
            break;
          case "T":
            gainLossBox.style.visibility = "visible";
        } // END SWITCH
      }
    }
  } // END DisplayGainLossBox()

  // *************************/
  // GAINS/LOSSES FILTER BOX
  // *************************/

  // create layerview object from active layer in order to filter it on the client side
  // the active layer is set in the SetAttribute() function
  let activeLyrView;

  let gainLossDiv = document.getElementById("gainLossBox");
  let gainLossBtns = gainLossDiv.getElementsByTagName("INPUT");
  gainLossDiv.addEventListener("change", SetGainLossMode);

  function SetGainLossMode() {
    // once layerView loads, assign to the view variable & return it
    let filterField = `${fieldPrefix}_${sliderValue.innerHTML}_${changeMode}`;
    let gainsFilter;
    let lossFilter;
    let sameFilter;
    for (var i = 0; i < gainLossBtns.length; i++) {
      if (gainLossBtns[i].checked) {
        let checkedBtn = gainLossBtns[i].id;
        switch (checkedBtn) {
          case "all": // empty filter parameter to serve as a reset
            let noFilter = {};
            FilterAnnualAndTotal(noFilter, activeLyrView);
            break;
          case "gain":
            switch (fieldPrefix) {
              case "resunits":
                gainsFilter = { where: " " + filterField + " > 0.5" };
                break;
              case "homestead":
                gainsFilter = { where: " " + filterField + " > 0.5" };
                break;
              case "nonressf":
                gainsFilter = { where: " " + filterField + " > 500" };
                break;
              case "pyr_market":
                gainsFilter = { where: " " + filterField + " > 1000" };
                break;
              case "pyr_taxes":
                gainsFilter = { where: " " + filterField + " > 100" };
                break;
            } // END gain >> fieldPrefix SWITCH
            FilterAnnualAndTotal(gainsFilter);

            break;
          case "loss":
            switch (fieldPrefix) {
              case "resunits":
                lossFilter = { where: " " + filterField + " < -0.5" };
                break;
              case "homestead":
                lossFilter = { where: " " + filterField + " < -0.5" };
                break;
              case "nonressf":
                lossFilter = { where: " " + filterField + " < -500" };
                break;
              case "pyr_market":
                lossFilter = { where: " " + filterField + " < -1000" };
                break;
              case "pyr_taxes":
                lossFilter = { where: " " + filterField + " <= -100" };
                break;
            } // END loss >> fieldPrefix SWITCH
            FilterAnnualAndTotal(lossFilter);
            break;
          case "same":
            switch (fieldPrefix) {
              case "resunits":
                sameFilter = {
                  where: " " + filterField + " >= -0.5 and  " + filterField + " <= 0.5",
                };
                break;
              case "homestead":
                sameFilter = {
                  where: " " + filterField + " >= -0.5 and  " + filterField + " <= 0.5",
                };
                break;
              case "nonressf":
                sameFilter = {
                  where: " " + filterField + " >= -500 and  " + filterField + " <= 500",
                };
                break;
              case "pyr_market":
                sameFilter = {
                  where: " " + filterField + " >= -1000 and  " + filterField + " <= 1000",
                };
                break;
              case "pyr_taxes":
                sameFilter = {
                  where: " " + filterField + " >= -100 and  " + filterField + " <= 100",
                };
                break;
            } // END same >> fieldPrefix SWITCH
            FilterAnnualAndTotal(sameFilter);
            break;
        } // END SWITCH
      } //END if
    } // END for
  } // End SetGainLossMode

  function FilterAnnualAndTotal(featureFilter) {
    view.whenLayerView(activeLyr).then((layerView) => {
      activeLyrView = layerView;
      // console.log(activeLyrView);
      activeLyrView.featureEffect = new FeatureEffect({
        filter: featureFilter,
        includedEffect: "opacity(80%)",
        excludedEffect: "opacity(10%)",
      });
    });
  } // END FilterAnnualAndTotal()

  //***********************************/
  //         PLACEHOLDER TABS
  //***********************************/

  document.getElementById("landUseTab").addEventListener("click", landUseMessage);
  function landUseMessage() {
    alert(
      "Land Use Analysis is coming in Phase 2. This phase will examine changes in land use patterns like density, impervious land, and canopy coverage."
    );
    return true;
  }

  document.getElementById("growthTab").addEventListener("click", growthMessage);
  function growthMessage() {
    alert(
      "Growth Scenarios is coming in Phase 3. This phase will use data from Phase 1 and 2 to explore how various development scenarios (i.e. density and housing type) may affect the amount of land needed to accomodate the 2050 projected population. Potential changes in impervious land and canopy coverage may also be examined."
    );
    return true;
  }

  //*******************************************************************
  //*******************************************************************
  //                   SET INITIAL APP STATE
  //*******************************************************************
  //*******************************************************************
  let displayMode = "time";
  setYear(2022);
  gainLossBox.style.visibility = "hidden";

  // NOT WORKING - MAYBE HAVE TO OVERRIDE A DEFAULT??
  // timeBtn.click();
  // set time button to focus state on load
  // timeBtn.classList.remove("button is-primary my-4");
  // timeBtn.classList.add("button is-primary my-4 is-focused");
}); //           ******END MAIN FUNCTION*****

//*******************************************************************
//*******************************************************************
//                  MODAL WINDOW
//*******************************************************************
//*******************************************************************

// Get the modal
var modal = document.getElementById("Modal");

// Get the button that opens the modal
var btn = document.getElementById("infoBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//TEMP WHILE IN PRODUCTION - HIDE MODAL ON OPEN
modal.style.display = "none";
