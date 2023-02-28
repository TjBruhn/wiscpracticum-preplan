export function addImages(layer, graphic, item, content) {
  // open add images popup
  $(".addImages").css("display", "block");
  //select and image from explorer is done in the HTML
  //submit image
  $("#imageSubmit")
    .off()
    .on("click", function () {
      //add image to layer as attachment
      const attachmentForm = document.getElementById("imgfile");

      // layer
      //   .addAttachment(graphic, attachmentForm)
      //   .then((result) => {
      //     console.log("attachment added: ", result);
      //   })
      //   .catch(function (err) {
      //     console.log("attachment adding failed: ", err);
      //   });
      //update preplan with new image

      //close popup window
      $(".addImages").css("display", "none");
    });
  //Cancel button closes popup
  $("#imageCancel").on("click", function () {
    $(".addImages").css("display", "none");
  });
}
