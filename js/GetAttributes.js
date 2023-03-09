import { editAttribute } from "./EditAttribute.js";

export function getAttributes(buildings, graphic) {
  let attributes = graphic.attributes;

  //Iterates through attributes attributes and writes data to cooresponding Id
  Object.keys(attributes).forEach(function (attrName) {
    //check for data add it if it exists or note that it doesn't
    if (attributes[attrName]) {
      $("#" + attrName).html(attributes[attrName]);
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
}
