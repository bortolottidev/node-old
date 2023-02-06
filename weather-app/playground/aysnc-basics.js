console.log('Starting weather-app');

const f = function () { console.log('Inside of callback'); }

setTimeout(f, 2000);
setTimeout(() => console.log('0 sec setTimeout'), 0);

console.log('Finishing weather-app');