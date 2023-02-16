export function editAttribute(objectId, content) {
  console.log("edit attribute called: " + objectId + " " + content);
  $(".edit").css("display", "block");
  $("#textEdit").val(content);

  $("#editSubmit")
    .off()
    .on("click", function () {
      console.log(
        "submitting id:" + objectId + " with content: " + $("#textEdit").val()
      );
      $(".edit").css("display", "none");
    });
  $("#editCancel").on("click", function () {
    $(".edit").css("display", "none");
  });
}
