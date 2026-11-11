// Tee SuperTest-kirjastolla testit blogilistan 
// osoitteeseen /api/blogs tapahtuvalle HTTP GET ‑pyynnölle.
//  Testaa, että sovellus palauttaa oikean
//  määrän JSON-muotoisia blogeja.

// Kun testi on valmis, refaktoroi operaatio käyttämään
//  promisejen sijaan async/awaitia.

// Huomaa, että joudut tekemään koodiin materiaalin 
// tapaan hieman muutoksia (mm. testausympäristön määrittely)
// , jotta saat järkevästi tehtyä omaa tietokantaa käyttäviä 
// API-tason testejä.

// HUOM: Testien kehitysvaiheessa yleensä ei kannata 
// suorittaa joka kerta kaikkia testejä, vaan keskittyä
//  yhteen testiin kerrallaan. Katso lisää täältä.

const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')


const api = supertest(app)

const initialBlogs = [
      {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
      },
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
      }
    ]


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test('test returns correct amount of blogs', async () => {
  const response = await api.get('/api/blogs')


  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
      }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const all_blogs = response.body.map(e => e.title)
  assert(all_blogs.includes('Type wars'))


  assert.strictEqual(response.body.length, initialBlogs.length + 1)
})

test('the identifying parameter is id', async()=>{
    const response = await api.get('/api/blogs')
    assert(response.body[0].id)
})

after(async () => {
  await mongoose.connection.close()
})