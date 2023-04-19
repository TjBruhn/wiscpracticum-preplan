import { getAttachments } from "./GetAttachments.js";
import { getAttributes } from "./GetAttributes.js";

// Map for Preplan for PHG Fire
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
  "esri/widgets/Locate",
  "esri/widgets/Legend",
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
  Locate,
  Legend,
  BasemapToggle,
  ScaleBar,
  Print,
  TemplateOptions,
  Expand
) {
  const apiKey =
    "AAPK2024d301c0de469680da8927e664d764u3ZUFrZkR27ebf6AI7HUT-U2U7goZdmTVEYIyppDXDATVQPat8VZN7Mqzt-q_Czo";

  esriConfig.apiKey = apiKey;

  // Define osm basemap and set a thumbnail
  const osmStandardRelief = Basemap.fromId("osm-standard-relief");
  // Thumbnail required for basemapToggle could change to custom version if interested
  osmStandardRelief.thumbnailUrl =
    "https://www.arcgis.com/sharing/rest/content/items/5b93370c7fc24ca3b8740abd2a55456a/info/thumbnail/thumbnail1607563948959.jpeg";

  const map = new Map({
    basemap: osmStandardRelief,
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

  // Add basemap toggle
  const toggle = new BasemapToggle({
    viewModel: {
      view: view,
      nextBasemap: "hybrid",
    },
  });
  // Add the toggle button to the bottom left corner of the view
  view.ui.add(toggle, "bottom-left");

  // Add Home Button
  const homeBtn = new Home({
    view: view,
  });
  // Add the home button to the top left corner of the view
  view.ui.add(homeBtn, "top-left");

  // Add compass
  const compass = new Compass({
    view: view,
  });
  // Adds the compass to the corner of the view
  view.ui.add(compass, "top-right");

  // Add locate button
  const locateBtn = new Locate({
    view: view,
  });
  // Add the locate widget to the corner of the view
  view.ui.add(locateBtn, "top-right");

  // Add legend
  let legend = new Legend({
    view: view,
  });
  // Configure expansion menu for print widget
  let legendExpand = new Expand({
    view: view,
    expanded: false,
    content: legend,
    mode: "floating",
    group: "top-right",
  });
  // Add legend to corner of view
  view.ui.add(legendExpand, "top-right");

  // Add scalebar
  const scaleBar = new ScaleBar({
    view: view,
  });
  // Adds the scale bar to the bottom right corner of the view
  view.ui.add(scaleBar, "bottom-right");

  // Create print widget with the associated actions and add it to the top-right corner of the view.
  let templateOptions = new TemplateOptions({
    forceFeatureAttributes: false,
  });

  // Add print information
  let printMap = new Print({
    view: view,
    templateOptions: templateOptions,
    // Specify your own print service
    printServiceUrl:
      "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
  });
  // Configure expansion menu for print widget
  let printExpand = new Expand({
    expandIconClass: "esri-icon-printer",
    expandTooltip: "Expand Print/Export",
    view: view,
    expanded: false,
    content: printMap,
    mode: "floating",
    group: "top-left",
  });

  // Adds the print button to the topleft corner of the view
  view.ui.add(printExpand, "top-left");

  //END: ==== ADD MAP WIDGETS =============

  /*================================ 
  Add layers 
  ==================================*/

  // Define Building Label class
  const buildingsLabelClass = new LabelClass({
    labelExpressionInfo: { expression: "$feature.Name" },
    symbol: {
      type: "text",
      color: "black",
      haloSize: 1,
      haloColor: "white",
    },
    maxScale: 0, // Labels viewable all the way to ground
    minScale: 12000, // Labels disapper at smaller scales - further zoomed out
  });

  // Building symbology -- other color complements light blue:(19, 134, 191), orange:(191, 106, 0)
  const buildingsRenderer = {
    type: "unique-value",
    legendOptions: {
      title: "PrePlan Status",
    },
    field: "Status",
    // defaultSymbol: {
    //   type: "simple-fill",
    //   color: "rgba(0, 127, 191, 0.5)",
    //   outline: null,
    // },
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
        value: "NeedsRevisit",
        label: "Needs Revisit",
        symbol: {
          type: "simple-fill",
          color: "rgba(0, 127, 191, 0.5)",
          outline: null,
        },
      },
      {
        value: "SVcomplete",
        label: "Site Visit Complete",
        symbol: {
          type: "simple-fill",
          color: "rgba(170, 68, 153, 0.65)",
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
      {
        value: "Unnecessary",
        label: "Unnecessary",
        symbol: {
          type: "simple-fill",
          color: "rgba(115, 64, 0, 0.2)",
          outline: null,
        },
      },
    ],
  };

  // Add buildings/preplan features
  const buildings = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/PHG_PrePlans/FeatureServer",
    outFields: ["*"],
    labelingInfo: buildingsLabelClass,
    labelsVisible: true,
    renderer: buildingsRenderer,
  });
  map.add(buildings);

  // Add graphics layer for selected building
  const selectedBuildingGraphic = new GraphicsLayer({});
  map.add(selectedBuildingGraphic);

  //END: ==== add Layers =============

  /*================================ 
  Select building and launch preplan 
  ==================================*/

  // Listen to the click event on the view
  view.on("click", async (event) => {
    view.hitTest(event).then(function (response) {
      // Clear the graphics layer
      selectedBuildingGraphic.graphics.removeAll();

      // Turn edit mode off and hide button this prevents unintended editing of "completed" preplans and forces initiating editing for each building
      $(".editHide").show();
      $(".editBtn").css("display", "none");
      $("#editMode")
        .attr("value", "off")
        .html("Edit Mode")
        .css("display", "none");

      // Only get the graphics returned from Buildings Layer
      const graphicHits = response.results?.filter(
        (hitResult) =>
          hitResult.type === "graphic" && hitResult.graphic.layer === buildings
      );
      if (graphicHits?.length > 0) {
        // Do something with the buildings Layer features returned from hittest
        graphicHits.forEach((graphicHit) => {
          // Add a graphic of the selected
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

          // Dynamically set gototarget scale based on feature size
          function scale() {
            let height =
              graphicHit.graphic.geometry.extent.ymax -
              graphicHit.graphic.geometry.extent.ymin;

            let width = graphicHit.graphic.geometry.extent.width;

            // Choose larger dimension
            let largerDimension = height > width ? height : width;

            // Compute scale - multiplier based on trial and error
            let computedScale = Math.round(largerDimension * 14);

            //select between computed or minimum of 600
            if (computedScale > 600) {
              return computedScale;
            } else {
              return 600;
            }
          }

          // Zoom to and center on selected
          let goToTarget = {
            target: graphicHit.graphic,
            scale: scale(), // 2000 means 1:2000
          };
          let opts = {
            animate: true,
            duration: 500,
          };
          view.goTo(goToTarget, opts);

          let graphic = graphicHit.graphic;

          console.log("clicked item: ", graphic.attributes);

          // Get the attachments
          getAttachments(buildings, graphic);

          // Get the attributes
          getAttributes(buildings, graphic);

          // Show the editmode button
          // Conditional to not show on "Completed" or "NeedsRevisit" added to protect existing data during user testing
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

  // Restore map view to full width
  $("#restore").on("click", () => {
    // Passing empty value reverts to style sheet
    $("#viewDiv").height("");
    // Hide the button
    $("#restore").css("display", "none");
    // Hide all content
    $(".info").css("display", "none");
    // Clear the graphics layer
    selectedBuildingGraphic.graphics.removeAll();
    // Hide edit editMode buttons
    $(".editBtn").css("display", "none");
    $(".editHide").show();
    // Turn edit mode off and hide button
    $("#editMode")
      .attr("value", "off")
      .html("Edit Mode")
      .css("display", "none");
  });

  // Toggle on edit mode
  $("#editMode").on("click", () => {
    if ($("#editMode").attr("value") == "off") {
      $(".editBtn").css("display", "inline");
      $(".editHide").hide();
      $("#editMode").attr("value", "on").html("Edit Mode=On");
    } else if ($("#editMode").attr("value") == "on") {
      $(".editBtn").css("display", "none");
      $(".editHide").show();
      $("#editMode").attr("value", "off").html("Edit Mode");
    }
    // Resize the map Div
    // Match the map height to the height of the content
    $("#viewDiv").hide();
    let contentHeight = $("#content").innerHeight();
    $("#viewDiv").height(contentHeight);
    $("#viewDiv").show();
  });
});
