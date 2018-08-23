const axios = require("axios");

// taipei school weather data api
const url = "http://weather.tp.edu.tw/Ajax/jsonp/LastEffect.ashx?id=";

const OverviewException = {
    CANNOT_FIND_LOC: 0,
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
    return null;
}

async function getTpaSchoolRawData( schoolId ) {
    console.log(schoolId);
    let res = null;
    try{
        res = await axios.get(url+schoolId, {'headers' : {'accept-language' : 'en-US'} });
    }catch(err){
        console.log(err);
        throw OverviewException.DATA_FAILED;
    }
    const result = res.data.result;
    console.log(result);

    return result;
}


module.exports = {
   getTpaSchoolRawData,
   findSchoolId,
   OverviewException
};