const request = require('supertest');
const {
    ObjectID
} = require('mongodb');

const _ = require('lodash');
const {
    app
} = require('./../conectar');
const {
    modelo,
    usuarios
} = require('./../db/modelo');
const {
    agregar,
    info,
    Tokens,
    agregarUsuarios
} = require('./datos');

jest.setTimeout(300000);
//limpia la base de datos antes de iniciar el test
beforeEach(agregarUsuarios);
beforeEach(agregar);


describe('Post', () => {


    test('Ingresar un nuevo texto en la base de datos', (done) => {
        request(app)
            .post('/todo')
            .send({
                nombre: info.text
            })
            .set('x-auth', Tokens[0].tokens[0].token)
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
            .set('x-auth', Tokens[0].tokens[0].token)
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
            .set('x-auth', Tokens[0].tokens[0].token)
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
            .set('x-auth', Tokens[0].tokens[0].token)
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
            .set('x-auth', Tokens[0].tokens[0].token)
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
            .set('x-auth', Tokens[0].tokens[0].token)
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
            .set('x-auth', Tokens[0].tokens[0].token)
            .expect(404)
            .end(done);

    });
});

// describe('Metodos en modelos', () => {
//     it('should ', (done) => {

//         modelo.buscarTiposSimilares('Eduardo').then((result) => {
//             console.log(result);
//             done()
//         }).catch((err) => {
//             done(err);
//         });
//     });
// });

describe('Obtener /usuarios/me', () => {
    it('Devoler el usuario si este esta autenticado', (done) => {

        request(app)
            .get('/usuarios/me')
            .set('x-auth', Tokens[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                console.log(res.body[0]._id);
                expect(res.body[0]._id).toBe(_.toString(Tokens[0]._id))
            })
            .end(done);
    });
    it('Devolver un 401 por un header invalido o nulo', (done) => {
        request(app) //llamas a la aplicacion web 
            .get('/usuarios/me')
            .set('x-auth', null)
            .expect(401)
            .expect(res => {
                expect(res.req.data).toBeUndefined();
            })
            .end(done);
    });
});

describe('Crear usuarios /usuarios POST', () => {
    it('Crear un usuario correcto', (done) => {
        let email = 'hola@example.com';
        let password = 'contraseña';
        request(app)
            .post('/usuarios')
            .send({
                email,
                password
            })
            .expect(200)
            .expect(res => {
                console.log(res.body);
                expect(res.headers['x-auth']).toExist();
                expect(res.body.email).toBe(email);

            })
            .end(err => {
                usuarios.find({
                        email
                    }) //buscas en la base de datos por email
                    .then((result) => {
                        expect(result).not.toBeUndefined();
                        expect(result.password).not.toBe(password);
                        done();
                    }).catch((err) => {
                        return done(err);
                    });
            })
    });

    it('No crear un usuario Nuevo', (done) => {
        let email = 'holaexample.com';
        let password = 'contraseña';
        request(app)
            .post('/usuarios')
            .send({
                email,
                password
            })
            .expect(404)
            .expect(res => {
                expect(res.body.name).toBe('ValidationError');
            })
            .end(done);
    });
    it('No crear un usuario Nuevo por password invalido', (done) => {
        let email = 'holaexample.com';
        let password = 'coña';
        request(app)
            .post('/usuarios')
            .send({
                email,
                password
            })
            .expect(404)
            .expect(res => {
                expect(res.body.name).toBe('ValidationError');
            })
            .end(done);
    });
});

describe('Ingresar a tu cuenta', () => {
    it('Ingresar correctamente', (done) => {
        request(app)
            .post('/usuarios/login')
            .send({
                email: Tokens[0].email,
                password: Tokens[0].password
            })
            .expect(200)
            .expect(res => {
                expect(res.body.email).toBe(Tokens[0].email);
            })
            .end((err, res) => {

                usuarios.findById(Tokens[0]._id)
                    .then((result) => {
                        expect(result.tokens[0].access).toBe('auth');
                        expect(res.headers['x-auth']).toBe(result.tokens[0].token);
                        done();
                    }).catch((err) => {
                        done(err)
                    });
            });
    });
    it('No ingresar a la cuenta por contraseña incorrecta', (done) => {
        request(app)
            .post('/usuarios/loging')
            .send({
                email: Tokens[0].email,
                password: 'hohohoSantaHack'
            })
            .expect(404)
            .end(done);
    });
});

describe('Desconectarte METODO', () => {
    it('Salir correctamente', (done) => {
        request(app)
            .delete('/usuarios/salir/')
            .set('x-auth', Tokens[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                console.log(Tokens[0].tokens[0].token);
                usuarios.findById(Tokens[0]._id)
                    .then((result) => {
                        console.log(result);
                        expect(result.tokens.length).toBe(0);
                        done()
                    }).catch((err) => {
                        done(err);
                    });
            })
    });
    it('No cerrar sesion por id invalida (HEADER)', (done) => {
        request(app)
            .delete('/usuarios/salir')
            .set('x-auth', 111)
            .expect(401)
            .end(done);
    });
});