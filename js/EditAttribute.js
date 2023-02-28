export function editAttribute(layer, graphic, item, content) {
  console.log("edit attribute called: " + item + " " + content);
  //change the text in the label field to reflect the item being edited
  let editBoxLabel = "Edit " + item;
  $(".edit label").html(editBoxLabel);

  //disply the pop up edit window
  $(".edit").css("display", "block");

  //populate text edit box with the current value
  $("#textEdit").val(content);

  $("#editSubmit")
    .off()
    .on("click", function () {
      console.log(
        "submitting id:" + item + " with content: " + $("#textEdit").val()
      );
      graphic.attributes[item] = $("#textEdit").val();
      console.log("with edits: ", graphic.attributes);
      layer
        .applyEdits({
          updateFeatures: [graphic],
        })
        .then((editsResult) => {
          console.log("apply edits results: ", editsResult);
        })
        .then(() => {
          //update form with value supplied
          $("#" + item).html($("#textEdit").val());
        })
        .catch((error) => {
          console.log("error = ", error);
        });
      //close popup window
      $(".edit").css("display", "none");
    });
  $("#editCancel").on("click", function () {
    $(".edit").css("display", "none");
  });
}
