module.exports.add = (a, b) => {
    if (isNaN(a) || isNaN(b)) {
        throw new Error('Value passed is not a number');
    }
    return a + b;
};

module.exports.square = (a) => {
    if (isNaN(a)) {
        throw new Error('Value passed is not a number');
    }
    return a * a;
};

module.exports.asyncAdd = (a, b, callback) => {
    setTimeout(() => {
        callback(this.add(a,b));
    }, 1000);
};