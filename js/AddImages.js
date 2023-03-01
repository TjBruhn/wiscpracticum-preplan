import { getAttachments } from "./GetAttachments.js";

export function addImages(layer, graphic, imageName) {
  //TODO: figure out unique naming for special images
  //  coordinate with line 36 in GetAttachments.js

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

      //reset the file input
      $("#imgfile").val("");
    });
  //Cancel button closes popup
  $("#imageCancel").on("click", function () {
    $(".addImages").css("display", "none");

    //reset the file input
    $("#imgfile").val("");
  });
}
