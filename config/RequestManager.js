import axios from "axios";

class RequestManager {
  async buildRequest() {
    let token = "";
    const request = axios.create();

    request.defaults.headers.common["X-CSRFTOKEN"] =
      "lh6ayuKhLE1ZBsvJNwz63oWy9m5D3LVIH0TkZzDQpEcuxkmMz038WDfNM0hLB6c9";
    request.defaults.headers.common["Content-Type"] =
      "application/x-www-form-urlencoded";
    request.defaults.headers.common["Accept"] = "application/json";
    request.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

    return request;
  }
}

export default new RequestManager().buildRequest;
