const request = require('supertest');
const {
    ObjectID
} = require('mongodb');

const _ = require('lodash');
let info = {
    nombre: "Supertest",
    id: new ObjectID('5b4125d0777e4e590a13cd70'),
    text: 'Uhh UHH',
    edad: '50',
    idInvalida: '5b4125d0777e4e590a13cd702www',
    idDistinta: new ObjectID('6b4125d0777e4e590a13cd70')



}
const {
    app
} = require('./../conectar');
const {
    modelo
} = require('./../db/modelo');
jest.setTimeout(300000);
//limpia la base de datos antes de iniciar el test
beforeEach((done) => {
    modelo.deleteMany({})
        .then(() => {
            modelo.insertMany({
                _id: info.id,
                nombre: info.nombre
            }).then(() => {
                done();
            });
        });
});

describe('Post', () => {


    test('Ingresar un nuevo texto en la base de datos', (done) => {
        request(app)
            .post('/todo')
            .send({
                nombre: info.text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.nombre).toBe(info.text); // se espera que la espuesta sea igual a la variable creada 
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                modelo.find().then((result) => {
                    expect(result.length).toBe(2); // se espera que solo exista un unico elemento en el modelo 
                    done();
                }).catch((err) => {
                    done(err);
                });

            })
    });
});


describe('TODO Ids', () => {
    it('Id encontrada', (done) => {
        request(app)
            .get(`/todo/${info.id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.nombre).toBe(info.nombre);
            })
            .end(done);

    });


    it('ID no encontrada.', (done) => {
        request(app)
            .get(`/todo/${info.idInvalida}`)
            .expect(404)
            .expect((res) => {
                console.log(res.body);
                expect(res.body.status).toBe(404)
            })
            .end(done)

    });

    it('ID no valida', (done) => {
        request(app)
            .get(`/todo/${info.idDistinta}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.status).toBe(404)
            })
            .end(done)
    });
});


describe('Eliminar todo', () => {
    it('Eliminar elementos por Id', (done) => {
        request(app)
            .delete(`/todo/${info.id}`)
            .expect(200)
            .expect(res => {
                console.log(res.body);
                expect(res.body.result._id).toBe(info.id.toHexString());

            })
            .end((err, res) => {
                modelo.findById(info.id)
                    .then((result) => {
                        expect(result).toBeNull();
                        done()
                    }).catch((err) => {
                        done(err)
                    });

            })

    });

    it('Eliminar Id no existe ', (done) => {
        request(app)
            .delete(`/todo/${info.idDistinta}`)
            .expect(404)
            .expect(res => {
                console.log(res.body);
                expect(res.body.status).toBe(404)
            })
            .end(done)
    });

    it('Eliminar Id invalida', (done) => {
        request(app)
            .delete(`/todo/${info.idInvalida}`)
            .expect(404)
            .end(done)
    });
});


describe('Update ruta', () => {
    it('Actualizar correctamente', (done) => {

request(app)
.patch(`/todo/${info.id}`)
.send({
    nombre: info.text,
    edad: info.edad
})
.expect(200)
.expect(res => {
    expect(res.body.result.nombre).toBe(info.text);
})
.end(done);

    });

    it('No actualizar Id no encontrado', (done) => {
        request(app)
            .patch(`/todo/${info.idDistinta}`)
            .send({
                nombre: info.text,
                edad: info.edad
            })
            .expect(404)
            .end(done);

    });

    it('No actualizar Id invalida', (done) => {
        request(app)
            .patch(`/todo/${info.idInvalida}`)
            .send({
                nombre: info.text,
                edad: info.edad
            })
            .expect(404)
            .end(done);

    });
});