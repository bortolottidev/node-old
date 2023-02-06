const request = require('supertest');

var app = require('./server.js').app;

describe('Server', () => {
    it('Should return Hello world response', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .expect('Hello world!')
            .end(done);
    });

    it('Should return 404', (done) => {
        request(app)
            .get('/random')
            .expect(404)
            .end(done);
    });
});