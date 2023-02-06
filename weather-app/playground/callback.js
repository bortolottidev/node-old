var getUser = (id, callback) => {
    var user = {
        id
        , name: 'Daniele'
    };
    setTimeout(() => callback(user), 2000);
};

getUser(31, (user) => {
    console.log(user);
});