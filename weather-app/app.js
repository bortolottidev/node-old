const geocode = require('./geocode/geocode');
const weather = require('./openweather/openweather');
const yargs = require('yargs');

const argv = yargs.options({
        a: {
            demand: true
            , alias: 'address'
            , describe: 'Address to fetch weather for'
            , string: true
        }
    })
    .help()
    .alias('h', 'help')
    .argv;

// geocode.geocodeAddress(argv.a,
//     (errorMessage, results) => {
//         if (errorMessage) {
//             console.log(errorMessage);
//             return;
//         }
//         console.log(JSON.stringify(results, undefined, 4));
//         console.log(results.latitude);
//     });

geocode.geocodeAddressPromise(argv.a)
    .then(geoAddress => {
        // console.log(JSON.stringify(results, undefined, 4));
        // console.log(results.latitude); 

        weather.get(
            geoAddress.latitude
            , geoAddress.longitude
            , (error, weather) => {
                if (error) {
                    console.log(error);
                    return;
                }
                // console.log(JSON.stringify(weather, undefined, 4));
                console.log(`
Temperatura: ${weather.weather.temperature}
Percepita: ${weather.weather.apparentTemperature}
Vento: ${weather.weather.windSpeed}
Probabilità precipitazioni: ${weather.weather.precipProbability}\n`);
            });
    })
    .catch(error => console.log(error));