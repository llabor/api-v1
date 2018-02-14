var mocha = require('mocha')
var chai = require('chai')
var chaiHttp = require('chai-http')
var server = require('../server')

var should = chai.should()

chai.use(chaiHttp) // Configurar chai con módulo HTTP

describe('Tests de conectividad', () => {
  it('Google funciona', (done) => {
    chai.request('http://www.google.es')
        .get('/')
        .end((err, res) => {
          //console.log(res)
          res.should.have.status(200)
          done()
        })
  })
})

describe('Tests de API usuarios', () => {
  it('Raíz OK', (done) => {
    chai.request('http://localhost:3000')
        .get('/apitechu/v1')
        .end((err, res) => {
          //console.log(res)
          res.should.have.status(200)
          res.body.mensaje.should.be.eql("Bienvenido a mi API")
          done()
        })
  })
  it('Lista de usuarios', (done) => {
    chai.request('http://localhost:3000')
        .get('/apitechu/v1/usuarios')
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          for (var i = 0; i < res.body.length; i++) {
            res.body[i].should.have.property('email')
            res.body[i].should.have.property('password')
          }
          done()
        })
  })
})
