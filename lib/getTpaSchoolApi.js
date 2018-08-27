const axios = require("axios");
const URL = require("../data/public_url");

const TPASchoolException = {
    CANNOT_FIND_ID: 0,
    DATA_FAILED: 1,
    UNKNOWN_ERROR: 2
};


function findSchoolId( msg ){
    const schools = require("../data/TpaSchool");
    for ( let i in schools){
        for ( let j in schools[i]){
            if (msg.includes( schools[i][j].SchoolName)){
                return schools[i][j].Id;
            }
        }
    }
    throw TPASchoolException.CANNOT_FIND_ID;
}

async function getTpaSchoolRawData( msg ) {
    let schoolId = null;
    try{
        schoolId = findSchoolId(msg);
    }catch(CANNOT_FIND_ID){
        console.log("cant find school ID");
        throw CANNOT_FIND_ID;
    }

    let res = null;
    try{
        res = await axios.get(URL.TPASCHOOL_URL + "?id=" + schoolId, {'headers' : {'accept-language' : 'en-US'} });
    }catch(err){
        console.log(err);
        throw TPASchoolException.DATA_FAILED;
    }
    const result = res.data.result;

    if(result)
        return result;

    throw TPASchoolException.UNKNOWN_ERROR;
}


module.exports = {
   getTpaSchoolRawData,
   findSchoolId,
   TPASchoolException
};