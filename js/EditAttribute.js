import { getAttributes } from "./GetAttributes.js";

export function editAttribute(layer, graphic, attrName) {
  //close any open popup window
  $(".edit").css("display", "none");

  //disable other edit buttons while pop up is open
  $(".editBtn").prop("disabled", true);

  // reactivate submit button disabled in form validation
  $("#editSubmit").prop("disabled", false);

  let attrValue = graphic.attributes[attrName];
  let valueID = "#textEdit";

  console.log("edit attribute called: " + attrName + " " + attrValue);

  //change the text in the label field to reflect the item being edited
  let editBoxLabel = "Edit: " + attrName;
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

    //inactivate submit button until Valid entry is supplied
    //  if no current value disable submit button
    if (!attrValue) {
      $("#editSubmit").prop("disabled", true);
    }

    //  when a valid value is entered enable submit button
    $("#textEdit")
      .off()
      .on("keyup", function () {
        if ($("#textEdit")[0].checkValidity()) {
          $("#editSubmit").prop("disabled", false);
        } else {
          $("#editSubmit").prop("disabled", true);
        }
      });
  } else if (yesNo.includes(attrName)) {
    $("#formVariant").html(
      `<input type="radio" name="yes_no" value="Yes" >Yes</input><input type="radio" name="yes_no" value="No">No</input>`
    );
    valueID = 'input[name="yes_no"]:checked';
    //set the checked radio to the current value
    $('input[name="yes_no"]').val([attrValue]);
  } else if (attrName === "SqFt") {
    $("#formVariant").html(
      `<input type="text" inputmode="numeric" pattern="[0-9]*" minlength="3" id="textEdit" required></input><span class="validity"></span>`
    );
    //inactivate submit button until Valid entry is supplied
    //  if no current value disable submit button
    if (!attrValue) {
      $("#editSubmit").prop("disabled", true);
    }
    //  when a valid value is entered enable submit button
    $("#textEdit")
      .off()
      .on("keyup", function () {
        if ($("#textEdit")[0].checkValidity()) {
          $("#editSubmit").prop("disabled", false);
        } else {
          $("#editSubmit").prop("disabled", true);
        }
      });
  } else if (attrName === "Campus") {
    $("#formVariant").html(
      `<select id="textEdit">
          <option value="LCC">Lane Community College</option>
          <option value="OakHill">Oak Hill</option>
          <option value="PHill">Pleasant Hill School</option>
          <option value="Station">Station</option>
          <option value="Biz">Business</option>
        </select>`
    );
  } else if (attrName === "PowerProvider") {
    $("#formVariant").html(
      `<select id="textEdit">
            <option value="EWEB">EWEB</option>
            <option value="EPUD">EPUD</option>
            <option value="PacificPwr">Pacific Power</option>
            <option value="LaneElec">Lane Electric</option>
            <option value="Unknown">Unknown</option>
          </select>`
    );
  } else if (attrName === "Status") {
    $("#formVariant").html(
      `<select id="textEdit">
            <option value="Completed">Preplan Completed</option>
            <option value="NeedsRevisit">Needs Revisit</option>
            <option value="SVcomplete">Site visit complete</option>
            <option value="Need">Need</option>
            <option value="Unnecessary">Unnecessary</option>
          </select>`
    );
  } else {
    $("#formVariant").html(
      `<textarea id="textEdit" name="textEdit" rows="10" cols=""></textarea>`
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
      //enable other edit buttons on submit
      $(".editBtn").prop("disabled", false);
    });
  $("#editCancel").on("click", function () {
    //close popup window
    $(".edit").css("display", "none");
    //enable other edit buttons on cancel
    $(".editBtn").prop("disabled", false);
  });
}
