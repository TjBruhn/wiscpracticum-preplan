import { editAttribute } from "./EditAttribute.js";

export function getAttributes(buildings, graphic) {
  let attributes = graphic.attributes;

  async function writeData() {
    //Iterates through attributes attributes and writes data to cooresponding Id
    Object.keys(attributes).forEach(function (attrName) {
      let attrValue = attributes[attrName];

      //display UNIX time stamp as date
      if (attrName === "EditDate") {
        let isoTime = new Date(attrValue).toISOString();
        let localTime = new Date(isoTime).toString();
        attrValue = localTime;
      }

      //check for data, add it if it exists, or note that it doesn't
      if (attrValue) {
        $("#" + attrName).html(attrValue);
      } else {
        $("#" + attrName).html("No Data");
      }

      //concat a string for the button ids
      let buttonId = attrName + "Btn";

      // add function to edit buttons
      $("#" + buttonId)
        .off()
        .on("click", function () {
          editAttribute(buildings, graphic, attrName);
        });
    });
    //show the restore button and the info content
    $("#viewDiv").css("display", "none");
    $("#restore").css("display", "block");
    $(".info").css("display", "block");
  }

  writeData().then(() => {
    //resize the map Div
    //match the map height to the height of the content
    let contentHeight = $("#content").innerHeight();
    $("#viewDiv").height(contentHeight);
    $("#viewDiv").css("display", "flex");
  });
}
