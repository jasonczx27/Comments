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
    //#region COMMMENT
    /**
     * sample request::
     * {localhost:PORT} OR {ip:PORT}/posts
     * {localhost:PORT} OR {ip:PORT}/posts?postid={postid}
     */
    //#endregion COMMENT
    const { postid = null } = req.query;
    //testing
    var requestVM = new reqVM()
    console.time("     getbestposts")
    try {

        const ipaddr = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log(`captured request from ${ipaddr} using ${req.get("User-Agent")}`)

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

    console.timeEnd("     getbestposts")


})

app.get("/comments", async function (req, res) {
    //#region  COMMENT
    /**
     * 
     */
    //#endregion COMMENT
    var requestVM = new reqVM()
    console.time("     getcomments")
    try {


        const ipaddr = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log(`captured request from ${ipaddr} using ${req.get("User-Agent")}`)

        const request = await api.FilterComments(req.query);
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

    console.timeEnd("     getcomments")


})





