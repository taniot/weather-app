const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'taniot.dev',
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    image: '/img/me.jpg',
    name: 'taniot.dev',
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    text: 'Contact me for a coffee.',
    name: 'taniot.dev',
  })
})

app.get('/weather', (req, res) => {
  const { address } = req.query

  if (!address) {
    return res.send({
      error: 'You must provide an address.',
    })
  }

  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({
        error,
      })
    }
    forecast(latitude, longitude, (error, forecast) => {
      if (error) {
        return res.send({
          error,
        })
      }
      res.send({
        location,
        forecast,
        address,
      })
    })
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404 - Help',
    text: 'Help article not found',
    name: 'taniot.dev',
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404 - Generic',
    text: 'Page not found',
    name: 'taniot.dev',
  })
})

app.listen(port, () => {
  console.log('Server is up on port '+port+'.')
})
