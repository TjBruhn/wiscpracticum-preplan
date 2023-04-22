import { getAttachments } from "./GetAttachments.js";

export async function deleteImage(
  layer,
  graphic,
  attachmentId,
  reloadImages = true
) {
  // Delete image to layer as attachment
  layer
    .deleteAttachments(graphic, [attachmentId])
    .then((result) => {
      console.log("attachment deleted: ", result);
      // Update preplan with image removed.
      if (reloadImages) {
        getAttachments(layer, graphic);
      }
      // If the image is being replaced this prevents reloading images at this step. Images will be reloaded after the new image is added.
    })
    .catch(function (err) {
      console.log("attachment delete failed: ", err);
    });
}

export function addImage(layer, graphic) {
  // Get the file from the form
  var file = document.getElementById("imgUploadForm")[0].files[0];

  // Get the image name from the form
  var imageName = document.getElementById("imgUploadForm")[1].value;

  // TODO: consider adding cleanup to file name to eliminate spaces and ensure it has a file extension. It works without this so it may be unnecessary. This change would also require logic in get attachments to convert back to a label appropriate format

  // Construct new FormData object and apply new file name
  var formData = new FormData();

  // Append the file to the new FormData with a new name
  formData.append("file", file, imageName);

  // Add image to layer as attachment
  layer
    .addAttachment(graphic, formData)
    .then((result) => {
      console.log("attachment added: ", result);
      // Update preplan with new image
      getAttachments(layer, graphic);
    })
    .catch(function (err) {
      console.log("attachment adding failed: ", err);
    });
}
