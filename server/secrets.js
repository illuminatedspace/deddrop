'use strict'

const router = require('express').Router()

const db = require('APP/db')
const Secret = db.model('secrets')

//this is: /api/secrets

  //returns all secrets
  router.get('/', (req, res, next) => {
    Secret.findAll()
    .then(secrets => res.send(secrets))
    .catch(next)
  })

//returns nearby secrets
//put route for payload with location
  router.put('/nearby', (req, res, next) => {
    let longitude = req.body.longitude
    let latitude = req.body.latitude
    let longitudeMin = +longitude - 0.0008
    let longitudeMax = +longitude + 0.0008
    let latitudeMin = +latitude - 0.0008
    let latitudeMax = +latitude + 0.0008
    console.log('~~~~~body', req.body)
    Secret.findAll({
      where: {
        longitude: {
          between: [longitudeMin, longitudeMax]
        },
        latitude: {
          between: [latitudeMin, latitudeMax]
        },
      }
    })
    .then(nearby => res.send(nearby))
    .catch(next)
  })

//returns acessible secrets
  router.put('/here', (req, res, next) => {
    let longitude = req.body.longitude
    let latitude = req.body.latitude
    Secret.findAll({
      where: {
        longitude: {
          gte: longitude - 0.0003,
          lte: longitude + 0.0003,
        },
        latitude: {
          gte: latitude - 0.0003,
          lte: latitude + 0.0003,
        },
      }
    })
    .then(nearby => res.send(nearby))
    .catch(next)
  })

  //makes a new secret
  router.post('/drop', (req, res, next) => {
    let text = req.body.secret,
        latitude = req.body.latitude,
        longitude = req.body.longitude
    console.log('IN POST ROUTE', req.body)
    Secret.create({
      text: text,
      latitude: latitude,
      longitude: longitude,
    })
    .then(secret => res.send(secret))
    .catch(next)
  })


module.exports = router
