import { getAttributes } from "./GetAttributes.js";

export function editAttribute(layer, graphic, attrName) {
  let attrValue = graphic.attributes[attrName];
  let valueID = "#textEdit";

  console.log("edit attribute called: " + attrName + " " + attrValue);

  //change the text in the label field to reflect the item being edited
  let editBoxLabel = "Edit " + attrName;
  $(".edit label").html(editBoxLabel);

  //insert form entry variation based on attrName
  //lists for form variations
  const yesNo = ["Sprinklers", "Detectors", "Electricity", "Water", "Gas"];

  //establish lists of attrNames that recieve a specific form type
  if (attrName === "POCNumber") {
    $("#formVariant").html(
      `<input type="tel" id="textEdit" name="textEdit"
       pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
       required><span class="validity"></span><br/><small>Format: 123-456-7890</small>`
    );

    //TODO: inactivate submit button until Valid entry is supplied
  } else if (yesNo.includes(attrName)) {
    $("#formVariant").html(
      `<input type="radio" name="yes_no" value="Yes" >Yes</input><input type="radio" name="yes_no" value="No">No</input>`
    );
    valueID = 'input[name="yes_no"]:checked';
    //set the checked radio to the current value
    $('input[name="yes_no"]').val([attrValue]);

    // } else if (){

    // } else if (){
  } else {
    $("#formVariant").html(
      `<textarea id="textEdit" name="textEdit" rows="" cols=""></textarea>`
    );
  }
  //populate text edit box with the current value
  $("#textEdit").val(attrValue);

  //disply the pop up edit window
  $(".edit").css("display", "block");

  $("#editSubmit")
    .off()
    .on("click", function () {
      let newAttrValue = $(valueID).val();

      console.log(
        "submitting id:" +
          attrName +
          " with new value: " +
          newAttrValue +
          " valueID: " +
          valueID
      );
      //update graphic with new value
      graphic.attributes[attrName] = newAttrValue;
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
          //$("#" + item).html($("#textEdit").val());
          getAttributes(layer, graphic);
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
