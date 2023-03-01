import { addImages } from "./AddImages.js";

export function getAttachments(buildings, graphic) {
  let clickedId = graphic.attributes.OBJECTID;

  //create an attachment query object with the clicked feature's objectid
  let attachmentQuery = {
    objectIds: clickedId,
  };
  //query the buildings layer with the attachment query object
  buildings.queryAttachments(attachmentQuery).then(function (attachments) {
    //create a dictionary to be used to connect attachments to HTML id
    let prePlanMap = {
      "1.jpg": "#ePanelImg",
      "2.jpg": "#riserImg",
      "3.jpg": "#facpImg",
      "4.jpg": "#hazImg",
    };

    //overwrite images
    Object.keys(prePlanMap).forEach(function (item) {
      let buttonId = prePlanMap[item] + "Btn";
      $(prePlanMap[item]).html("No image available");

      $(buttonId)
        .off()
        .on("click", function () {
          addImages(buildings, graphic, item);
        });
    });

    //clear the specialImg div
    $("#specialImg").html("");
    //add click function to button
    $("#specialImgBtn")
      .off()
      .on("click", function () {
        addImages(buildings, graphic, clickedId, "specialImg.jpg");
        //TODO: figure out unique naming
      });

    //get the attachments array
    let attachment = attachments[clickedId];
    if (attachment) {
      //iterate through the attachments
      attachment.forEach(function (item) {
        let itemName = item.name;
        let url = item.url;
        let itemId = prePlanMap[itemName];

        //check to see if the photo is named as expected
        if (Object.keys(prePlanMap).includes(itemName)) {
          /*
          add the attachment to their respective HTML ids as thumbnails
          create thumbnails by wrapping the img in <a> and pass the url to both
          */
          $(itemId).html(
            '<a target="blank" href="' +
              url +
              '"><img src="' +
              url +
              '" alt="' +
              itemName +
              '"/></a>'
          );
        } else {
          //if not named as expected add to GIS extras
          $("#specialImg").append(
            '<a target="blank" href="' +
              url +
              '"><img src="' +
              url +
              '" alt="' +
              itemName +
              '"/></a>'
          );
        }
      });
    }
  });
  //END Attachments Query
}
