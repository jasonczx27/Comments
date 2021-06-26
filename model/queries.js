const https = require("https")
const reqVM = require("./general/viewmodel")

const domain = 'https://jsonplaceholder.typicode.com'


//get all posts or one
async function GetPosts(id) {
    var requestVM = new reqVM()
    try {
        var reqopt = `${domain}/posts${id ? "/" + id : ""}`
        return new Promise(
            (resolve, reject) => {
                https.get(reqopt, res => {
                    let arr = [];
                    res.on("data", data => {
                        arr.push(data)
                        // console.log(JSON.stringify(data.toJSON()))
                    })
                    res.on("end", () => {
                        if (arr.length > 0) {
                            var resdata = JSON.parse(Buffer.concat(arr))
                            if (resdata.constructor.name !== "Array") {
                                var newarr = []
                                newarr.push(resdata)
                                resdata = newarr
                            }
                            requestVM.requestSuccess(resdata)
                            resolve(requestVM)
                            return;
                        }
                    })
                }).on("error", err => {
                    reject(requestVM.requestFailed(err.statuscode ?? 500, err))
                })
            }
        )
    }
    catch (e) {
        console.log(e)
        requestVM.requestFailed(500, e)
        return requestVM
    }
}
//get comments
async function GetComments() {
    var requestVM = new reqVM()
    try {
        var reqopt = `${domain}/comments`
        return new Promise(
            (resolve, reject) => {
                https.get(reqopt, res => {
                    let arr = [];
                    res.on("data", data => {
                        arr.push(data)
                        // console.log(JSON.stringify(data.toJSON()))
                    })
                    res.on("end", () => {
                        var resdata = JSON.parse(Buffer.concat(arr))
                        if (resdata.constructor.name !== "Array") {
                            resdata = [...resdata]
                        }
                        // console.log(JSON.parse(arr))
                        requestVM.requestSuccess(resdata)
                        resolve(requestVM)
                        return;

                    })
                }).on("error", err => {
                    reject(requestVM.requestFailed(err.statuscode ?? 402, err))
                    return;
                })
            }
        )
    }
    catch (e) {
        console.log(e)
        requestVM.requestFailed(500, e)
        return requestVM
    }
}



module.exports = {
    //liaise : function
    getpost: GetPosts,
    getcomm: GetComments
}