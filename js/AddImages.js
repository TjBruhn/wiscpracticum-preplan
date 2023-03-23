import { getAttachments } from "./GetAttachments.js";

export function addImages(layer, graphic, imageName) {
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

  //change form label to include name of field
  let imgLabel = labelMap[imageName];
  if (imgLabel) {
    let imgLabelText = "Add " + imgLabel + " Image";
    $("#imgUploadForm>label").html(imgLabelText);
  } else {
    let imgLabelText = "Add an Additional Image";
    $("#imgUploadForm>label").html(imgLabelText);
  }

  // open add images popup
  $(".addImages").css("display", "block");

  // action for submit image button
  $("#imageSubmit")
    .off()
    .on("click", function () {
      //get the file from the form
      var file = document.getElementById("imgUploadForm")[0].files[0];

      //construct new FormData object and apply new file name
      var formData = new FormData();

      //append the file to the new FormData with a new name
      formData.append("file", file, imageName);

      //add image to layer as attachment
      layer
        .addAttachment(graphic, formData)
        .then((result) => {
          console.log("attachment added: ", result);
          //update preplan with new image
          getAttachments(layer, graphic);
        })
        .catch(function (err) {
          console.log("attachment adding failed: ", err);
        });

      //close popup window
      $(".addImages").css("display", "none");

      //enable other edit buttons on submit
      $(".editBtn").prop("disabled", false);

      //reset the file input in the image upload form
      $("#imgfile").val("");
    });
  //Cancel button closes popup
  $("#imageCancel").on("click", function () {
    //close popup window
    $(".addImages").css("display", "none");

    //enable other edit buttons on cancel
    $(".editBtn").prop("disabled", false);

    //reset the file input in the image upload form
    $("#imgfile").val("");
  });
}
