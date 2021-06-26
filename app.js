const app = require('express')();
// var http = require('http').Server(express);
const port = process.env.PORT || 8000;

const reqVM = require("./model/general/viewmodel")

const cors = require('cors');

const server = require('http').createServer(app);
server.listen(port, () => {
    console.log("listening at PPPPORRT", port)
})
app.use(cors())

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const api = require("./controller/api")

app.get("/posts", async function (req, res) {
    const { postid = null } = req.query;
    //testing
    var requestVM = new reqVM()
    console.time("getbestposts")
    try {

        // console.log(req.get("host"))
        // console.log("starting")
        const ipaddr = req.headers['cf-connecting-ip'] ?? req.headers['x-forwarded-for'] ?? req.socket.remoteAddress;
        console.log("captured request from ", ipaddr)
        // console.log(ipaddr)
        // console.log("ip retrieved")
        if (!req.get("host").includes("localost:" + port) && !req.get("Postman-Token")) {

            requestVM.requestDisauthorized("un-autorized access detected")
            res.status(requestVM.statuscode).json(requestVM)
        }
        const request = await api.BestPosts(postid);
        if (request && request.issuccess) {
            requestVM.requestSuccess(request.data);
            res.status(requestVM.statuscode).json(requestVM)
        }
        else {
            requestVM.requestFailed(request.statuscode ?? 500, request.message ?? "the request wasn't successful");
            res.status(requestVM.statuscode).json(requestVM)
        }


    }
    catch (e) {
        console.log("app handled, ", e.message ?? e)
        requestVM.requestFailed(e.statuscode ?? 500, e.message ?? e);
        res.status(requestVM.statuscode).json(requestVM)

    }

    console.timeEnd("getbestposts")


})







