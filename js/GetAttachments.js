import { addImages } from "./AddImages.js";

export function getAttachments(buildings, graphic) {
  let clickedId = graphic.attributes.OBJECTID;

  // Create an attachment query object with the clicked feature's objectid
  let attachmentQuery = {
    objectIds: clickedId,
  };

  // Query the buildings layer with the attachment query object
  buildings.queryAttachments(attachmentQuery).then(function (attachments) {
    // Create a dictionary to be used to connect attachments to HTML id
    let prePlanMap = {
      "1.jpg": "#ePanelImg",
      "2.jpg": "#riserImg",
      "3.jpg": "#facpImg",
      "4.jpg": "#hazImg",
      "N.JPG": "#imgN",
      "E.JPG": "#imgE",
      "S.JPG": "#imgS",
      "W.JPG": "#imgW",
    };

    // Overwrite images
    Object.keys(prePlanMap).forEach(function (item) {
      let buttonId = prePlanMap[item] + "Btn";
      $(prePlanMap[item]).html("No image available");

      $(buttonId)
        .off()
        .on("click", function () {
          addImages(buildings, graphic, item, prePlanMap);
        });
    });

    // Clear the specialImg div
    $("#specialImg").html("");
    // Add click function to button
    $("#specialImgBtn")
      .off()
      .on("click", function () {
        addImages(buildings, graphic, "needName", prePlanMap);
      });

    // Get the attachments array
    let attachment = attachments[clickedId];
    if (attachment) {
      // Iterate through the attachments
      attachment.forEach(function (item) {
        let itemName = item.name;
        let url = item.url;
        let itemHTMLId = prePlanMap[itemName];
        let attachmentId = item.id;

        /*
          This html string creates thumbnails by wrapping the img in <a> and pass the url to both.
          write the attachmentID to the <data> element's value to be used to delete the image
          TODO: consider change from data element to data attribute
        */
        let aString =
          '<a target="blank" href="' +
          url +
          '"><data value="' +
          attachmentId +
          '"></data><img src="' +
          url +
          '" alt="' +
          itemName +
          '"/></a>';

        // Check to see if the photo is named as expected
        if (Object.keys(prePlanMap).includes(itemName)) {
          // Add the attachment to their respective HTML ids
          $(itemHTMLId).html(aString);
        } else if (Object.keys(prePlanMap).includes(itemName.slice(-5))) {
          // Remove the campus and building from the itemName
          itemHTMLId = prePlanMap[itemName.slice(-5)];
          // Add the attachment to their respective HTML ids
          $(itemHTMLId).html(aString);
        } else {
          // If not named as expected add to Additional Images
          // Set display value for the edit buttons based on edit mode
          let displayValue;
          switch ($("#editMode").attr("value")) {
            case "off":
              displayValue = "none";
              break;
            case "on":
              displayValue = "inline";
              break;
            default:
              break;
          }

          // Set variables for composing the special image aString that will be appended
          let specialImgBtnIdtxt = "specialImgBtn" + attachmentId;
          let specialImgIdtxt = "specialImg" + attachmentId;

          // Compose an HTML string to append image in acontainer with an edit button
          let specialImgaString =
            `<div class="imageContainer"><p>` +
            itemName +
            `</p><span id="` +
            specialImgIdtxt +
            `">` +
            aString +
            `</span><button type="button" class="editBtn" style="display:` +
            displayValue +
            `" id="` +
            specialImgBtnIdtxt +
            `">Edit Image</button></div>`;

          // Append the HTML string
          $("#specialImg").append(specialImgaString);

          // Extend variables with # to make them useable in jquery calls
          let specialImgBtnId = "#" + specialImgBtnIdtxt;
          let specialImgId = "#" + specialImgIdtxt;

          // Bind add images function to new buttons
          $(specialImgBtnId)
            .off()
            .on("click", function () {
              addImages(
                buildings,
                graphic,
                itemName,
                prePlanMap,
                attachmentId,
                specialImgId
              );
            });
        }
      });
    }
  });
  // END Attachments Query
}
