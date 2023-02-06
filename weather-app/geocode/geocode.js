const request = require('request');

const geocodeAddress = (address, callback) => {

    const encodedAddress = encodeURIComponent(address);

    print = (item) => JSON.stringify(item, null, 4);

    request({
        url: `https://geocode.xyz/${encodedAddress}?json=1`
    }, (error, response, body) => {
        var obj = JSON.parse(body);
        if (error) {
            callback('Unable to connect to Geocode servers.');
            return;
        } else if (obj.standard.confidence <= 0.5) {
            callback(`Confidence: ${obj.standard.confidence}, try with another address`);
            return;
        } else if (response.statusCode !== 200) {
            callback('Something gone wrong with Geocode');
            return;
        }
        callback(undefined, {
            // console.log(JSON.stringify(JSON.parse(body), undefined, 4));
            // console.log(`Address: ${print(obj.standard)}`);
            address: obj.standard
            , latitude: obj.latt
            , longitude: obj.longt
            // console.log(`Latitude: ${print(obj.latt)}`);
            // console.log(`Longitude: ${print(obj.longt)}`);
        });
    });

};

const geocodeAddressPromise = (address) => {

    const encodedAddress = encodeURIComponent(address);

    return new Promise((resolve, reject) => {
        request({
            url: `https://geocode.xyz/${encodedAddress}?json=1`
        }, (error, response, body) => {
            var obj = JSON.parse(body);
            if (error) {
                reject('Unable to connect to Geocode servers.');
            } else if (obj.standard.confidence <= 0.5) {
                reject(`Confidence: ${obj.standard.confidence}, try with another address`);
            } else if (response.statusCode !== 200) {
                reject('Something gone wrong with Geocode');
            }
            resolve({
                address: obj.standard
                , latitude: obj.latt
                , longitude: obj.longt
            });
        });
    });

};

module.exports = {
    geocodeAddress
    , geocodeAddressPromise
};
