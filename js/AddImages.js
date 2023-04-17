import { deleteImage, addImage } from "./ImageUtils.js";

export function addImages(
  layer,
  graphic,
  imageName,
  prePlanMap,
  attachmentId = "",
  specialImgId = ""
) {
  //disable other edit buttons while pop up is open
  $(".editBtn").prop("disabled", true);

  function closePopup() {
    //close popup window
    $(".addImages").css("display", "none");

    //enable other edit buttons on submit
    $(".editBtn").prop("disabled", false);

    //reset the file input in the image upload form
    $("#imgfile").val("");

    //clear the current image
    $("#currentImg").html("");

    //hide the Name dialog
    // $("#imgNameDialog").css("display", "none");

    //remove the readonly on the image name input
    $("#imgfileName").prop("readonly", false);
  }

  //TODO: figure out unique naming for special images
  //  coordinate with line 43 in GetAttachments.js
  switch (imageName) {
    case "needName":
      // don't populate the value of the name field in the form
      $("#imgfileName").val("add name");
      break;
    default:
      // populate the form with the name value and make read only to prevent undesired change
      $("#imgfileName").val(imageName).prop("readonly", true);
  }

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

  //if no attachmentId argument is supplied get the attachmentId of the current image from the data element
  switch (attachmentId) {
    case "":
      let dataElement = prePlanMap[imageName] + " a data";
      attachmentId = Number($(dataElement).val());
      break;
    default:
      break;
  }

  let currentImageAppend;
  if (specialImgId) {
    //if specialImgId argument is supplied get the image using the specialImageId and displays the image name dialog
    currentImageAppend = $(specialImgId).html();
    $("#imgNameDialog").css("display", "block");
  } else if (!specialImgId && imageName !== "needName") {
    //if no specialImgId argument is supplied get the image from the associated element in the prePlanMap
    currentImageAppend = $(prePlanMap[imageName]).html();
  } else if (!specialImgId && imageName === "needName") {
    // thise serves the add additional image function and doesn't add an image but displays the image name dialog
    $("#imgNameDialog").css("display", "block");
  }

  //change text to be add or replace depending on presence of an image
  let editAction = "Replace";
  switch (currentImageAppend) {
    case "No image available":
      //there is no image so we only add and remove the delete
      editAction = "Add";
      $("#imageDelete").css("display", "none");
      break;

    case undefined: //catches the additional images category
      editAction = "Add";
      $("#imageDelete").css("display", "none");
      break;

    default:
      $("#imageDelete").css("display", "inline-block");
      //add current image to popup dialog
      $("#currentImg").html(currentImageAppend);
      //append the hr
      $("#currentImg").append("<hr />");
      break;
  }

  //change form label to include name of field
  //set default values
  let imgLabel = labelMap[imageName];
  let imgLabelText = editAction + " " + imgLabel + " Image";
  if (imgLabel) {
    // if it is not a special Image, use the map to get the category text and then use default values
    $("#addImgLabel").html(imgLabelText);
  } else if (specialImgId) {
    // if it is a special image, use the image's attachment id in the replacement text
    imgLabelText = editAction + " Image #" + attachmentId;
    $("#addImgLabel").html(imgLabelText);
  } else {
    // text for the general additional image add button
    imgLabelText = "Add Additional Image";
    $("#addImgLabel").html(imgLabelText);
  }

  // open add images popup
  $(".addImages").css("display", "block");

  // action for delete image button
  $("#imageDelete")
    .off()
    .on("click", function () {
      if (confirm("Are you sure you want to delete this?") === true) {
        deleteImage(layer, graphic, attachmentId, true);
        closePopup();
      }
    });

  // action for submit image button
  $("#imageSubmit")
    .off()
    .on("click", function () {
      //if replacing delete the current image before adding the new one
      switch (editAction) {
        case "Replace":
          if (
            confirm("Replacing deletes the current image. Are you sure?") ===
            true
          ) {
            deleteImage(layer, graphic, attachmentId, false).then(
              // if success add the image to the server
              addImage(layer, graphic)
            );
          }

          break;
        default: //add the image to the server
          addImage(layer, graphic);
      }

      closePopup();
    });

  //Cancel button closes popup
  $("#imageCancel").on("click", () => closePopup());
}
