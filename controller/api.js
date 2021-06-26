const https = require("https")
const { resolve } = require("path")
const reqVM = require("../model/general/viewmodel")
const q = require("../model/queries")

//#region Alts
// GET / posts
// GET / posts / 1
// GET / posts / 1 / comments
// GET / comments ? postId = 1
//#endregion Alts    


//get all posts or one
function BestPosts(id) {
    var requestVM = new reqVM()
    try {
        return new Promise((resolve, reject) => {
            var post = q.getpost(id ?? null)
            post.then(posts => {
                if (posts.issuccess) {
                    q.getcomm().then(comms => {
                        if (comms.issuccess && comms.data?.length) {
                            let commentarray = comms.data;
                            posts.data.map(x => {
                                var count = 0;
                                commentarray.map((comm, i, arr) => {
                                    if (comm.postId.toString() === x.id.toString()) {
                                        // commentarray.splice(i + 1, 1)
                                        //hope to remove the elem from array when it matches but cant
                                        count++
                                    }
                                })
                                x.post_id = x.id
                                delete x.id;
                                x.post_title = x.title;
                                delete x.title;
                                x.post_body = x.body;
                                delete x.body;
                                delete x.userId
                                delete x.rtsid
                                x.total_number_of_comments = count;
                            })
                            //on success
                            console.time("   sortingused")
                            posts.data.sort((cur, pre) => cur.count > pre.count ? 1 : -1)
                            console.timeEnd("   sortingused")
                            requestVM.requestSuccess(posts.data)
                            resolve(requestVM)
                        }
                        else {
                            requestVM.requestFailed(comms.statuscode ?? 404, comms.message ?? "couldn't get comments")
                            reject(requestVM)
                        }
                    })
                }
                else {
                    requestVM.requestFailed(posts.statuscode ?? 404, posts.message ?? "couldn't get posts")
                    reject(requestVM)
                }
            })
        })
    }
    catch (e) {
        console.log("bestposts exception handled, ", e.message ?? e)
        requestVM.requestFailed(e.statuscode ?? 500, e.message ?? e)
        return requestVM
    }
}
function FilterComments(param) {
    var requestVM = new reqVM()
    try {
        return new Promise((resolve, reject) => {
            var comms = q.getcomm()
            comms.then(comments => {
                if (comments.issuccess && comments.data?.length) {
                    if (Object.keys(param).length < 1) {
                        //if no parameters applied, simply just want to retrieve comments
                        resolve(requestVM.requestSuccess(comments.data))
                    }
                    else {
                        console.time("   querytime")
                        const arr = comments.data.filter(x => {
                            var flag = true
                            Object.keys(param).forEach(query => {


                                //if the passed in query is not valid or, just doesn't match any
                                if (!x[query]) {
                                    requestVM.requestFailed(400, `You entered invalid search parameter: ${query}`)
                                    reject(requestVM)
                                    return
                                }
                                if (!new RegExp(param[query].toString()).test(x[query])) {

                                    flag = false
                                    return
                                }

                            });
                            return flag ? x : null
                            // return x
                        })
                        resolve(requestVM.requestSuccess(arr))
                        console.timeEnd("   querytime")

                    }
                }
                else {
                    requestVM.requestFailed(comments.statuscode ?? 404, comments.message ?? "couldn't get posts")
                    reject(requestVM)
                    return;

                }
            })
        })
    }
    catch (e) {
        console.log("bestposts exception handled, ", e.message ?? e)
        requestVM.requestFailed(e.statuscode ?? 500, e.message ?? e)
        return requestVM
    }


}

module.exports = {
    //liaise : function
    BestPosts,
    FilterComments
}