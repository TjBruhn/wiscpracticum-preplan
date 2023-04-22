import { getAttributes } from "./GetAttributes.js";

export function editAttribute(layer, graphic, attrName) {
  function closeAttrPopup() {
    // Close popup window
    $(".edit").css("display", "none");
    // Enable other edit buttons on cancel
    $(".editBtn").prop("disabled", false);
  }

  closeAttrPopup();

  // Reactivate submit button disabled in form validation
  $("#editSubmit").prop("disabled", false);

  let attrValue = graphic.attributes[attrName];
  let valueID = "#textEdit";

  // Change the text in the label field to reflect the item being edited
  let editBoxLabel = "Edit: " + attrName;
  $(".edit label").html(editBoxLabel);

  // Help text object
  const helpText = {
    POCName:
      "The point of contact for the facility who should be contacted in an emergency. Should be a 24/7 contact.",
    WaterSupply:
      "Describe the location and access of the nearest water supply. Include estimation of distance. If no supply make note and include strategy for supplying water.",
    Notes: "Any important notes that don't belong in any other category.",
    PanelInfo:
      "Describe the location and access for the electrical panel. Include any details about shuting off the power.",
    Riser:
      "Describe the location and access. Include any details about connecting.",
    FACP: "Describe the location and access. Include any details about using the panel.",
    SpecialHazard:
      "Describe the hazard including any relavent details like location, access, and mitigation strategies.",
  };

  // Insert form entry variation based on attrName

  // Lists for form variations
  const yesNo = ["Sprinklers", "Detectors", "Electricity", "Water", "Gas"];

  function validateSubmit() {
    // Inactivate submit button until Valid entry is supplied
    //  If no current value disable submit button
    if (!attrValue) {
      $("#editSubmit").prop("disabled", true);
    }
    //  When a valid value is entered enable submit button
    $("#textEdit")
      .off()
      .on("keyup", function () {
        if ($("#textEdit")[0].checkValidity()) {
          $("#editSubmit").prop("disabled", false);
        } else {
          $("#editSubmit").prop("disabled", true);
        }
      });
  }

  // Establish lists of attrNames that recieve a specific form type
  if (attrName === "POCNumber") {
    $("#formVariant").html(
      `<input type="tel" id="textEdit" name="textEdit"
       pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
       required>
       <span class="validity"></span>
       <br/>
       <small>Format: 123-456-7890</small>`
    );

    validateSubmit();
  } else if (yesNo.includes(attrName)) {
    $("#formVariant").html(
      `<input type="radio" name="yes_no" value="Yes">Yes</input>
      <input type="radio" name="yes_no" value="No">No</input>`
    );
    valueID = 'input[name="yes_no"]:checked';

    // Set the checked radio to the current value
    $('input[name="yes_no"]').val([attrValue]);
  } else if (attrName === "SqFt") {
    $("#formVariant").html(
      `<input type="text" inputmode="numeric" pattern="[0-9]*" minlength="3" id="textEdit" required></input>
      <span class="validity"></span>`
    );

    validateSubmit();
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
  } else if (helpText[attrName]) {
    // Adds help text to remind users what to include
    $("#formVariant").html(
      `<p class="helpText">` +
        helpText[attrName] +
        `</p> 
      <textarea id="textEdit" name="textEdit" rows="10" cols=""></textarea>`
    );
  } else {
    // Catches categories without help text
    $("#formVariant").html(
      `<textarea id="textEdit" name="textEdit" rows="10" cols=""></textarea>`
    );
  }

  // Populate text edit box with the current value
  $("#textEdit").val(attrValue);

  // Display the pop up edit window
  $(".edit").css("display", "block");

  // Set Submit button function
  $("#editSubmit")
    .off()
    .on("click", function () {
      let newAttrValue = $(valueID).val();

      // console.log(
      //   "submitting id:" +
      //     attrName +
      //     " with new value: " +
      //     newAttrValue +
      //     " valueID: " +
      //     valueID
      // );

      // Update graphic with new value
      graphic.attributes[attrName] = newAttrValue;
      // console.log("with edits: ", graphic.attributes);

      // Post the edits
      layer
        .applyEdits({
          updateFeatures: [graphic],
        })
        .then((editsResult) => {
          console.log("apply edits results: ", editsResult);
        })
        .then(() => {
          // Update form with value supplied
          getAttributes(layer, graphic);
        })
        .catch((error) => {
          console.log("error = ", error);
        });

      // Close popup window
      closeAttrPopup();
    });

  // Set Cancel function
  $("#editCancel").on("click", () => closeAttrPopup());
}
