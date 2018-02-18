const axios = require("axios");
const config = require("../config");

async function uploadImgur(url) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.imgur.com/3/image',
            data: {
                image: url
            },
            headers: {
                'authorization': `Client-ID ${config.imgurClientId}`
            }
        });
        const res = response.data;
        return res.data.link.replace("http://", "https://");
    } catch (error) {
        console.log(error.response)
        return null;
    }
}

module.exports = uploadImgur;