const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = chai.expect;

describe('Projects API Tests', function() {
  this.timeout(10000); // Setting a higher level timeout for all the tests

  it('should complete the request within 5 seconds', (done) => {
    const request = chai.request('http://localhost:3000/api').get('/projects');
    const startTime = Date.now();

    request.end((err, res) => {
      const responseTime = Date.now() - startTime;
      expect(responseTime).to.be.below(5000); // Expect the response within 5000ms
      expect(err).to.be.null;
      done();
    });
  });

  it('GET/POST/PUT/DELETE should return correct content type', (done) => {
    chai.request('http://localhost:3000/api')
      .get('/projects')
      .end((err, res) => {
        expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
        done();
      });
  });

  it('should be able to upload/download files', (done) => {
    chai.request('http://localhost:3000/api')
        .get('/download-project?id=64a37a7cefb987204819c3fb')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
  });

  it('should complete the request within 10 seconds or fail', (done) => {
    chai.request('http://localhost:3000/api')
      .get('/projects') // An endpoint that might take too long
      .end((err, res) => {
        expect(err).to.be.null;
        done();
      });
  });
});


describe('Contractor API Tests', function() {
    this.timeout(10000); // Setting a higher level timeout for all the tests
  
    it('should complete the request within 5 seconds', (done) => {
      const request = chai.request('http://localhost:3000/api').get('/contractors');
      const startTime = Date.now();
  
      request.end((err, res) => {
        const responseTime = Date.now() - startTime;
        expect(responseTime).to.be.below(5000); // Expect the response within 5000ms
        expect(err).to.be.null;
        done();
      });
    });

    it('GET/POST/PUT/DELETE should return correct content type', (done) => {
        chai.request('http://localhost:3000/api')
            .get('/contractors')
            .end((err, res) => {
              expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
              done();
            });
      });

  
    it('should be able to upload/download files', (done) => {
      chai.request('http://localhost:3000/api')
          .get('/download-contractors?id=64a38055efb98720481d3d09')
          .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
    });
  
    
  
    it('should complete the request within 10 seconds or fail', (done) => {
      chai.request('http://localhost:3000/api')
          .get('/contractors')
          .end((err, res) => {
            expect(err).to.be.null;
            done();
          });
    });
  });