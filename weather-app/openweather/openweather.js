const request = require('request');

const secretKeyApi = process.env.OPEN_WEATHER_API_KEY;
!secretKeyApi && console.warn("OPEN_WEATHER_API_KEY not setup!")

const get = (latitude, longitude, callback) => {
    const url = `https://api.darksky.net/forecast/${secretKeyApi}/${latitude},${longitude}?units=si`;
    request({
        url
        , json: true
    }, (error, response, body) => {
        if(error || response.statusCode !== 200) {
            callback('Unable to fetch weather service.');
            return;
        }
        callback(undefined, { weather: body.currently });
    });
};

module.exports.get = get;
