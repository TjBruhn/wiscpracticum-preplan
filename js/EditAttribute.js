export function editAttribute(layer, graphic, item, content) {
  console.log("edit attribute called: " + item + " " + content);
  $(".edit").css("display", "block");
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
          console.log("aply edits results: ", editsResult);
        })
        .catch((error) => {
          console.log("error = ", error);
        });
      // $(".edit").css("display", "none");
    });
  $("#editCancel").on("click", function () {
    $(".edit").css("display", "none");
  });
}
