class Shelly { 
  constructor(response, deviceIp) {
    this.response = response;
    this.deviceIp = deviceIp;
  }

  getStatus () {
    console.log('Gettin status of ' + this.deviceIp);
  }
  getHostname () {
    console.log('Gettin hostname of ' + this.deviceIp);
  }
  getIp () {
    console.log('Gettin IP of ' + this.deviceIp);
  }
}

module.exports = Shelly;
