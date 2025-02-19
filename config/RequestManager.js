import axios from "axios";
class RequestManager {
  async buildRequest() {
    let token = "";
    const request = axios.create();
    request.defaults.headers.common[
      "X-CSRFTOKEN"
    ] = `Hd0vUjI84LLtJJERbgEgl5v0G6EHIL6kFfSc5dKykAXCnaszEZfFbqY3AAeDqjXz`;
    request.defaults.headers.common["Content-Type"] =
      "application/x-www-form-urlencoded";
    request.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    return request;
  }
}
export default new RequestManager().buildRequest;
