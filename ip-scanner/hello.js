const http = require('http');
const moment = require('moment');
const request = require('request');
const url = require('url');
const rp = require('request-promise');
const netList = require('network-list');
const log = require('./update-log');
const Shelly = require('./Shelly');

function serverCallback(req, res) {
  const urlQuery = url.parse(req.url, true).query;
  const beginTime = moment('10:00', 'HH:mm');
  const endTime = moment('18:00', 'HH:mm');

  var message = `Hello ${process.argv[2] || 'user'}! \n`
    + `Welcome to our page. \n`
    + `Now, it's ${moment().format('HH:mm')}.\n`
    + `Our business hours is from ${beginTime.format('HH:mm')} to ${endTime.format('HH:mm')}.\n`;

  const beginDiff = beginTime.diff(moment(), 'minutes');
  const endDiff = moment().diff(endTime, 'minutes');

  if (beginDiff > 0) {
    message += `Please come back in ${beginDiff} minutes.\n`;
  } else if (endDiff > 0) {
    message += 'Please come back tomorrow.\n';
  }

  if (shellyIP) {
    rp('http://' + shellyIP + '/status')
      .then(statusData => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(statusData);
      })
      .catch(() => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(message);
      });
  } else {
    // build response
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(message);
  }
}

const port = 8080;
let shellyIP;

http.createServer(serverCallback)
  .listen(port);

console.log('Running on port ' + port);
const subnet = '192.168.1';
log.info('-------------------------------------------- \n');
log.info(`Scanning for devices on subnet: ${subnet} \n`);
netList.scanEach({
  ip: subnet
  , timeout: 20000
}, async (err, device) => {
  if (err) {
    console.log('Error', err);
    return;
  }
  const response = await scanIp(device.ip)
    .catch(err => undefined);
  if (!response) {
    return;
  }
  console.log(response, device);
  const s = new Shelly(response, device.ip);
  log.info(`Found a Shelly with hostname ${s.getHostname()} and IP ${s.getIp()} \n`);
  log.info(s.getStatus());
  log.info('\n');
  shellyIP = s.getIp();
});

function scanIp(ip) {
  return new Promise((resolve, reject) => {
    request('http://' + ip + '/settings', function(error, header, body) {
      if (error || header.statusCode !== 200 || !body) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}
