// javascript by Trever J. Bruhn 2022

import { getAttachments } from "./GetAttachments.js";
import { getAttributes } from "./GetAttributes.js";

// map for Preplan for PHG Fire
require([
  "esri/config",
  "esri/Map",
  "esri/Basemap",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/layers/support/LabelClass",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/widgets/Home",
  "esri/widgets/Compass",
  "esri/widgets/BasemapToggle",
  "esri/widgets/ScaleBar",
  "esri/widgets/Print",
  "esri/widgets/Print/TemplateOptions",
  "esri/widgets/Expand",
], function (
  esriConfig,
  Map,
  Basemap,
  MapView,
  FeatureLayer,
  LabelClass,
  Graphic,
  GraphicsLayer,
  Home,
  Compass,
  BasemapToggle,
  ScaleBar,
  Print,
  TemplateOptions,
  Expand
) {
  const apiKey =
    "AAPK2024d301c0de469680da8927e664d764u3ZUFrZkR27ebf6AI7HUT-U2U7goZdmTVEYIyppDXDATVQPat8VZN7Mqzt-q_Czo";

  esriConfig.apiKey = apiKey;

  //define osm basemap and set a thumbnail
  const osmStandardRelief = Basemap.fromId("osm-standard-relief");
  //thumbnail required for basemapToggle could change to custom version if interested
  osmStandardRelief.thumbnailUrl =
    "https://www.arcgis.com/sharing/rest/content/items/5b93370c7fc24ca3b8740abd2a55456a/info/thumbnail/thumbnail1607563948959.jpeg";

  const map = new Map({
    basemap: osmStandardRelief,
    //"arcgis-topographic", // Basemap layer service
  });

  const view = new MapView({
    map: map,
    center: [-123.03276566452028, 44.00988602105596], // LCC center Longitude, latitude
    //center: [-122.96644, 43.98075], // district center Longitude, latitude
    zoom: 15, // Zoom level use 13 for district
    container: "viewDiv", // Div element
    constraints: {
      rotationEnabled: false,
    },
  });

  /*================================ 
  ADD MAP WIDGETS 
  ==================================*/

  //Add basemap toggle
  const toggle = new BasemapToggle({
    viewModel: {
      view: view,
      nextBasemap: "hybrid",
    },
  });
  // Add the toggle button to the bottom left corner of the view
  view.ui.add(toggle, "bottom-left");

  //console.log(toggle.getThumbnailUrl("osm-standard-relief"));

  //Add Home Button
  const homeBtn = new Home({
    view: view,
  });
  // Add the home button to the top left corner of the view
  view.ui.add(homeBtn, "top-left");

  //add compass
  const compass = new Compass({
    view: view,
  });
  // adds the compass to the top left corner of the view
  view.ui.add(compass, "top-right");

  //Add scalebar
  const scaleBar = new ScaleBar({
    view: view,
  });
  //adds the scale bar to the bottom right corner of the view
  view.ui.add(scaleBar, "bottom-right");

  //Create print widget with the associated actions and add it to the top-right corner of the view.
  let templateOptions = new TemplateOptions({
    forceFeatureAttributes: false,
  });

  //add print information
  let printMap = new Print({
    view: view,
    templateOptions: templateOptions,
    // specify your own print service
    printServiceUrl:
      "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
  });
  //configure expansion menu for print widget
  let printExpand = new Expand({
    expandIconClass: "esri-icon-printer",
    expandTooltip: "Expand Print/Export",
    view: view,
    expanded: false,
    content: printMap,
    mode: "floating",
    group: "top-left",
  });

  //adds the print button to the topleft corner of the view
  view.ui.add(printExpand, {
    position: "top-left",
  });

  //END: ==== ADD MAP WIDGETS =============

  /*================================ 
  Add layers 
  ==================================*/

  //define Building Label class
  const buildingsLabelClass = new LabelClass({
    labelExpressionInfo: { expression: "$feature.Name" },
    symbol: {
      type: "text",
      color: "black",
      haloSize: 1,
      haloColor: "white",
    },
    maxScale: 0, // labels viewable all the way to ground
    minScale: 12000, //labels disapper at smaller scales - further zoomed out
  });

  //building symbology -- other color complements light blue:(19, 134, 191), orange:(191, 106, 0)
  const buildingsRenderer = {
    type: "unique-value",
    legendOptions: {
      title: "PrePlan Status",
    },
    field: "Status",
    defaultSymbol: {
      type: "simple-fill",
      color: "rgba(0, 127, 191, 0.5)",
      outline: null,
    },
    uniqueValueInfos: [
      {
        value: "Completed",
        label: "Preplan Complete",
        symbol: {
          type: "simple-fill",
          color: "rgba(0, 76, 115, 0.5)",
          outline: null,
        },
      },
      {
        value: "Need",
        label: "Preplan Needed",
        symbol: {
          type: "simple-fill",
          color: "rgba(115, 64, 0, 0.5)",
          outline: null,
        },
      },
    ],
  };

  //add buildings/preplan features
  const buildings = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/PHG_PrePlans/FeatureServer/0",
    outFields: ["*"],
    labelingInfo: buildingsLabelClass,
    labelsVisible: true,
    renderer: buildingsRenderer,
  });
  map.add(buildings);

  //add graphics layer for selected building
  const selectedBuildingGraphic = new GraphicsLayer({});
  map.add(selectedBuildingGraphic);

  //END: ==== add Layers =============

  /*================================ 
  Select building and launch preplan 
  ==================================*/

  // Listen to the click event on the view
  view.on("click", async (event) => {
    view.hitTest(event).then(function (response) {
      //clear the graphics layer
      selectedBuildingGraphic.graphics.removeAll();

      //turn edit mode off and hide button this prevents unintended editing of "completed" preplans and forces initiating editing for each building
      $("#editMode")
        .attr("value", "off")
        .html("Edit Mode")
        .css("display", "none");

      // only get the graphics returned from Buildings Layer
      const graphicHits = response.results?.filter(
        (hitResult) =>
          hitResult.type === "graphic" && hitResult.graphic.layer === buildings
      );
      if (graphicHits?.length > 0) {
        // do something with the buildings Layer features returned from hittest
        graphicHits.forEach((graphicHit) => {
          //add a graphic of the selected
          let selectedBuilding = new Graphic({
            geometry: graphicHit.graphic.geometry,
            symbol: {
              type: "simple-fill",
              color: null,
              outline: {
                width: 2,
                color: "red",
              },
            },
          });
          selectedBuildingGraphic.graphics.add(selectedBuilding);

          //zoom to and center on selected
          let goToTarget = {
            target: graphicHit.graphic,
            scale: 2000, //1:2000
          };
          let opts = {
            animate: true,
            duration: 500,
          };
          view.goTo(goToTarget, opts);

          let graphic = graphicHit.graphic;

          console.log("clicked item: ", graphic);

          //==== get the attachments ====
          getAttachments(buildings, graphic);

          //==== Get the attributes ====
          getAttributes(buildings, graphic);

          //show the editmode button
          //conditional to not show on "Completed" or "NeedsRevisit" added to protect existing data during user testing
          //TODO: remove conditional after user testing
          if (
            graphic.attributes.Status !== "Completed" &&
            graphic.attributes.Status !== "NeedsRevisit"
          ) {
            $("#editMode").css("display", "block");
          }
        }); //END graphic.hits forEach
      } //END if graphic
    }); //END hittest
  }); //END view.on

  //END: Select building and launch preplan ======

  //TODO: DELETE: utility event listener used in development
  // view.on("click", function (event) {
  //   console.log(
  //     "[" + event.mapPoint.longitude + ", " + event.mapPoint.latitude + "]"
  //   );
  // });

  //restore map view to full width
  $("#restore").on("click", () => {
    $("#viewDiv").height("85vh");
    //hide the button
    $("#restore").css("display", "none");
    //hide all content
    $(".info").css("display", "none");
    //clear the graphics layer
    selectedBuildingGraphic.graphics.removeAll();
    //hide edit editMode buttons
    $(".editBtn").css("display", "none");
    //turn edit mode off and hide button
    $("#editMode")
      .attr("value", "off")
      .html("Edit Mode")
      .css("display", "none");
  });

  //Toggle on edit mode
  $("#editMode").on("click", () => {
    if ($("#editMode").attr("value") == "off") {
      $(".editBtn").css("display", "inline");
      $("#editMode").attr("value", "on").html("Edit Mode=On");

      //resize the map Div
      //match the map height to the height of the content
      let contentHeight = $("#content").innerHeight();
      $("#viewDiv").height(contentHeight);
    } else if ($("#editMode").attr("value") == "on") {
      $(".editBtn").css("display", "none");
      $("#editMode").attr("value", "off").html("Edit Mode");
    }
  });
});
