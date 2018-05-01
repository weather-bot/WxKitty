const axios = require("axios");

async function getForeignAirData(loc){
    let results = [];
    for (let i = 0;i<loc.length;i++){
        try{
            const geo = [ loc[i].geometry.location.lat ,loc[i].geometry.location.lat ];
            const url = "https://api.breezometer.com/baqi/"+ geo[0]+","+geo[1]+"?key=4d92ed8a496d4ad6b7a85cf9a1f67292&debug=true";
            const res = await axios.get(url);
            const data = res.data;
            const ret = { "ChineseName" : loc[i].formatted_address ,
                            "EnglishName" : data.country_name, 
                            "time" : data.datetime ,
                            "aqi": data.country_aqi ,
                            "description": data.country_description , 
                            "CO" : data.pollutants.co.concentration,
                            "NO2": data.pollutants.no2.concentration,
                            "SO2" : data.pollutants.so2.concentration ,
                            "PM25" : data.pollutants.pm25.concentration ,
                            "PM10" : data.pollutants.pm10.concentration
                        };
            results.push(ret);
        }catch(err){
            console.log("getForeignAirData breezometer api fail : " + err);
            return null ;
        }
    }
    return results;
}

module.exports = getForeignAirData;