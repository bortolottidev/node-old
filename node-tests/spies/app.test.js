const expect = require('expect');
const rewire = require('rewire');
const utils = require('../utils/utils');
const app = rewire('./app');

describe('App', () => {
    var db = {
        saveUser: expect.createSpy()
    };
    app.__set__('db', db);

    it('Should call the spy', () => {
        const spy = expect.createSpy();
        spy('Daniele', 29);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith('Daniele', 29);
    });

    it('Should call saveUser spy with user obj', () => {
        var user = {
            email: 'daniele@example.com'
            , password: '123abc'
        };
        app.handleSignup(user.email, user.password);
        expect(db.saveUser).toHaveBeenCalledWith(user);
    });
});