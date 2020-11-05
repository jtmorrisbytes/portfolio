
// exampleMessage
const EVENTS = {
    fetch:"fetch",
    requestUserProfile:"requestUserProfile",
    fetchRepositories:"fetchRepositories",
    repositoryResponse:"repositoryResponse",

    setToken:"setToken",
    invalidToken:"invalidToken",
    missingRequestData:"missingRequestData",
    invalidRequestDataType:"invalidRequestDataType"


}
const STATUS = {
    fetchSuccess:"fetchSuccess",
    fetchFailure:"fetchFailure",
}
const TYPES = {
    Object:"Object"
}

let defaultHeaders = new Headers().append('Accept', 'application/json')
const exampleFetchRepoQuery ={
    eventType:EVENTS.fetchRepositories,
    login:"jtmorrisbytes",
    itemsPerPage:8,
    token:"" // this cant be known
}
const exampleFetchSuccessResponse ={
    eventType:EVENTS.fetch,
    status:"",
    data:{}
}
const exampleFetchFailureResponse = {
    eventType:"fetchFailure"
}
const missingRequestDataResponse = {
    eventType:EVENTS.missingRequestData,
}
const invalidRequestDataTypeResponse = {
    eventType:EVENTS.invalidRequestDataType,
    expectedType: "the expected type",
}
const invalidRequestTokenResponse = {
    eventType:EVENTS.invalidToken
}

onmessage= function(MessageEvent){
    const data = MessageEvent.data
    if(!data){
        console.error("Data argument is required")
        // 
        this.postMessage(missingRequestDataResponse)
        return;
    }
    else if(!Array.isArray(data) && typeof data === 'object'){
        console.error("TypeError: MessageEvent.data is required to be an object")
        this.postMessage(Object.assign(invalidRequestDataTypeResponse,{expectedType:TYPES.Object}))
    }
    else {
        if(!data.eventType){
            console.error("eventType argument is required")
        }
        else if (data.eventType == EVENTS.fetchRepositories){
            console.log("someone asked to fetch repository data")
            
            fetchRepositories(data.token,data.login,data.itemsPerPage,this.postMessage)
// throw new Error("Finish implementing fetchrepositories")
        }
    }
    
}
function validateToken(token="") {
    if(!token && token.length == 0 ){
        console.error("Error: Invalid token supplied to fetchRepositories")
        return false
    }
    return true
}
function fetchRepositories(token="",login="",itemsPerPage=8,callback){
    // validate arguments
    if(!validateToken(token)){
        return callback(invalidRequestTokenResponse)
    }
    if(!login && login.length == 0){
        console.error("login not provided")
        return callback("login not provided")
    }
    const headers = new Headers(defaultHeaders)
    headers.append('Authorization', `Bearer ${token}`)
    let query = `{"query": "query { user(login: $login ){ repositories(first:$itemsPerPage, $cursor privacy:PUBLIC) { pageInfo{ startCursor,endCursor,hasNextPage,hasPreviousPage}, totalCount, edges{ cursor, node {  name, description, url, homepageUrl } } } } }"}`;
    query = query.replace("$login", `\\"${login}\\"`)
    query = query.replace("$itemsPerPage", String(itemsPerPage))
    if ( this.cursor && (this.cursor.length > 0 && this.cursor !== "undefined") ) {
        query = query.replace("$cursor", ('after:\\"'+this.cursor + '\\",'))
    }
    else  {
        query = query.replace("$cursor", "")
    }


    return fetch("https://api.github.com/graphql",{
        method:"POST",
        headers:headers,
        body: query
            
    }).then((response)=>handleFetchResponse(response,callback))
        
    .catch((error)=>handleFetchFailure(error,callback))

}
function handleFetchResponse(response,callback) {
    switch(response.status) {
        case 200:
            console.log("FETCH SUCCESS MAKE SURE TO CHECK FOR FURTHER ERRORS")
            response.json().then(callback)
        case 401:
            console.log("NOT AUTHORIZED OR INVALID TOKEN SUPPLIED")
            break;
        case 404:
        console.log("NOT FOUND OR SERVICE REFUSED")
        break;
        default:
            console.log("FETCH RESPONSE",response)
        
    }

}
function handleFetchFailure(error){

}
function fetchUserProfile(token = "", callback){
    if(!validateToken(token)){
        return callback(invalidRequestTokenResponse)
    }
    const headers = new Headers(defaultHeaders)
    
    headers.append("Authorization", `Bearer ${token}`)
    fetch("https://api.github.com/graphql"{
        method:"POST",
        headers:headers,
        body:`{"query":"query{viewer{login,name,email,location,websiteUrl,url}}"}`
    })
    .then((response)=>handleFetchResponse(response,callback))
    .catch(handleFetchFailure)
}