
/**
 * Method which get from server activity metadata with feedback and previous submission, if exists.
 *
 * */
export const  fetchStateOfActivityMetadata = async (slug, modeOfActivity, entryId) => {
  // If mode of activity is not specified = new activity
  if(!modeOfActivity){
    console.log("Nove cvičeni");

    const headers = {}
    headers["Content-Type"] = "application/json";
    let response = await fetch(`/api/get-activity/${slug}/`, {
      method: "GET",
      headers,
    });
    response = await response.json();
    return response;
  }

  // Else get activity with selected mode.
  console.log(`Cvičeni mód ${modeOfActivity}`);
  const headers = {}
  headers["Content-Type"] = "application/json";
  let response = await fetch(`/api/get-activity/${slug}/${modeOfActivity}/${entryId}`, {
    method: "GET",
    headers,
  });
  response = await response.json();
  return response;

}


/**
 * Send data of activity (feedback, user data) to server.
 * */
export const fetchPostActivityData = async (data) => {
  const headers = {};
  headers["Content-Type"] = "application/json";
  let response = await fetch(`/api/save-activity`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return await response.json();
}