export const apiUrl = "https://ufoodapi.herokuapp.com/";
//export const apiUrl = "http://localhost:3000/"; //Local google auth

/**
 * @param {array<Parameter>} params Array containing the param for the request
 * @return {string} parameter as string
 */
export const searchParamToString = (params) => {
  let query = "";
  let firstParam = true;
  if (params.length !== 0) {
    for (let i = 0; i < params.length; i++) {
      if (params[i].toString() !== "") {
        if (firstParam) {
          query = "?";
          firstParam = false;
        } else {
          query += "&";
        }

        query += params[i].toString();
      }
    }
  }
  return query;
};
