import { getAttachments } from "./GetAttachments.js";

export async function deleteImage(
  layer,
  graphic,
  attachmentId,
  reloadImages = true
) {
  //delete image to layer as attachment
  layer
    .deleteAttachments(graphic, [attachmentId])
    .then((result) => {
      console.log("attachment deleted: ", result);
      //update preplan with image removed
      if (reloadImages) {
        getAttachments(layer, graphic);
      }
    })
    .catch(function (err) {
      console.log("attachment delete failed: ", err);
    });
}

export function addImage(layer, graphic) {
  //get the file from the form
  var file = document.getElementById("imgUploadForm")[0].files[0];

  // get the image name from the form
  var imageName = document.getElementById("imgUploadForm")[1].value;

  // TODO: consider adding cleanup to file name to eliminate spaces and ensure it has a file extension. It works without this so it may be unnecessary. This change would also require logic in get attachments to convert back to a label appropriate format

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
}
