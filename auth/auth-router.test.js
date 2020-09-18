const supertest = require('supertest')
const server = require('../api/server')

const db = require('../database/dbConfig')
const Users = require('../users/users-model')


describe('auth-router', () => {
    afterAll(async () => {
        await db('users').truncate()
    })

    describe('POST /register', () => {
        it('should get a status code 201', async () => {
            return supertest(server)
            .post('/api/auth/register')
            .send({username: 'Joe', password: 'pass'})
            .expect(201)
        })


        it('should return json object', async () => {
            await supertest(server)
            .post('/api/auth/register')
            .send({username: "Juan", password: "pass"})
            .then(res => {
                expect(res.type).toMatch(/json/i)
            })
        })
        it('should give 400 when passed bad data', async () => {
            await supertest(server)
            .post('/api/auth/register')
            .send({username: "", password: "" })
            .then(res => {
                expect(res.status).toBe(400)
            })
        })
        it('should return the username back in the response upon successful registration', async () => {
            return supertest(server)
            .post('/api/auth/register')
            .send({username: "Jim", password: "pass" })
            .then(res => {
                expect(res.body.data.username).toBe('Jim')
            })
        })
    })
    describe('POST /login', () => {
        it('should receieve status code 200 when passed good data', async () => {
            // await Users.add({username: 'Joe', password: "pass"})
            return supertest(server)
            .post('/api/auth/login')
            .send({username: "Joe", password: "pass" })
            .expect(200)
        })
        it('should receive the token back on the response', async () => {
            return supertest(server)
            .post('/api/auth/login')
            .send({username: 'Joe', password: "pass" })
            .then( res => {
                expect(res.body.token).toBeDefined()
            })
        })
        it('should give an error message when the wrong credentials are passed in', async () => {
            return supertest(server)
            .post('/api/auth/login')
            .send({username: 'Joe', password: "pal" })
            .then(res => {
                expect(res.body.message).toBe('Invalid Credentials')
            })
        })
        it('should give status code 401 when wrong credentials are passed', async () => {
            return supertest(server)
            .post('/api/auth/login')
            .send({username: 'Joe', password: "pal" })
            .then(res => {
                expect(res.status).toBe(401)
            })
        })
    })
})
