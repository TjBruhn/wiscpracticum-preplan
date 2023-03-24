import { deleteImage, addImage } from "./ImageUtils.js";

export function addImages(layer, graphic, imageName, prePlanMap) {
  //disable other edit buttons while pop up is open
  $(".editBtn").prop("disabled", true);

  //TODO: figure out unique naming for special images
  //  coordinate with line 43 in GetAttachments.js

  //create a dictionary to use imageName to  create dynamic form labels
  let labelMap = {
    "1.jpg": "Panel",
    "2.jpg": "Riser",
    "3.jpg": "FACP",
    "4.jpg": "Special Hazard",
    "N.JPG": "North Face",
    "E.JPG": "East Face",
    "S.JPG": "South Face",
    "W.JPG": "West Face",
  };

  //get the attachmentId of the current image from the data element
  let dataElement = prePlanMap[imageName] + " data";
  let attachmentId = Number($(dataElement).val());

  //add current image to popup dialog
  let imagedialogAppend = $(prePlanMap[imageName]).html();
  $("#currentImg").html(imagedialogAppend);

  //change text to be add or replace depending on presence of an image
  let editAction = "Replace";
  switch (imagedialogAppend) {
    case "No image available":
      editAction = "Add";
      break;
    default:
      break;
  }

  //change form label to include name of field
  let imgLabel = labelMap[imageName];
  if (imgLabel) {
    let imgLabelText = editAction + " " + imgLabel + " Image";
    $("#addImgLabel").html(imgLabelText);
  } else {
    let imgLabelText = "Add an Additional Image";
    $("#addImgLabel").html(imgLabelText);
  }

  // open add images popup
  $(".addImages").css("display", "block");

  // action for submit image button
  $("#imageSubmit")
    .off()
    .on("click", function () {
      //if replacing delete the current image before adding the new one
      switch (editAction) {
        case "Replace":
          deleteImage(layer, graphic, attachmentId, false).then(
            // if success add the image to the server
            addImage(layer, graphic, imageName)
          );
          break;
        default: //add the image to the server
          addImage(layer, graphic, imageName);
      }

      //close popup window
      $(".addImages").css("display", "none");

      //enable other edit buttons on submit
      $(".editBtn").prop("disabled", false);

      //reset the file input in the image upload form
      $("#imgfile").val("");

      //clear the current image
      $("#currentImg").html("");
    });

  //Cancel button closes popup
  $("#imageCancel").on("click", function () {
    //close popup window
    $(".addImages").css("display", "none");

    //enable other edit buttons on cancel
    $(".editBtn").prop("disabled", false);

    //reset the file input in the image upload form
    $("#imgfile").val("");

    //clear the current image
    $("#currentImg").html("");
  });
}
