export function addImages(layer, graphic, imageName) {
  //TODO: figure out unique naming for special images
  //  coordinate with line 283 in main.js

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
        })
        .catch(function (err) {
          console.log("attachment adding failed: ", err);
        });

      //update preplan with new image
      //TODO: figure out how to reload preplan at this point

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
