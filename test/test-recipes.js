const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');


const expect = chai.expect;

chai.use(chaiHttp);


describe('recipes', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  //GET test case
  it('should list recipe name and ingredients on GET', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(1);
        const expectedKeys = ['id', 'name', 'ingredients'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  //POST test case
  it('should add a recipe on POST', function() {
    const newItem = {name: 'coffee', ingredients: ['beans', 'hot water']};
    return chai.request(app)
      .post('/recipes')
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'name', 'ingredients');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
  });

  //PUT test case
  it('should update recipes on PUT', function() {
    const updateData = {
      name: 'strawberry milk',
      ingredients: ['milk', 'strawberry syrup']
    };

    return chai.request(app)

      .get('/recipes')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/recipes/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });

  //DELETE test case
  it('should delete recipe on DELETE', function() {
    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});




