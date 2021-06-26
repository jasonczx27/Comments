class requestVM {
    constructor() {
        this.status = "ok";
        this.issuccess = true;
        this.data = null;
        this.datatype = undefined
        this.statuscode = 200;
        this.errortype = "ok"
        this.message = "the request was successful"
    }
    requestFailed(code, message) {
        this.status = "error";
        this.issuccess = false;
        this.data = null;
        this.datatype = undefined
        this.statuscode = code;
        this.message = message;
        this.errortype = !code ? "Unknown Error" : parseInt(code) == 404 ? "Not Found" : parseInt(code) >= 500 && parseInt(code) < 600 ? "Server issue" : "Request issue"
        return this;
    }

    requestDisauthorized(message) {
        this.status = "error";
        this.issuccess = false;
        this.data = null;
        this.datatype = undefined
        this.statuscode = 401;
        this.message = message ?? "Could not authorize you to access this request"
        this.errortype = "Unauthorized request"
        return this;
    }
    requestSuccess(data) {
        this.data = data;
        this.datatype = data ? data.constructor.name : undefined
        this.issuccess = true;
        return this;
    }
}
module.exports = requestVM;