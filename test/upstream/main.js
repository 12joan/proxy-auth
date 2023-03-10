import express from 'express'
import { WebSocketServer } from 'ws'

const app = express()
const server = app.listen(3000)
const wss = new WebSocketServer({ server })

app.get('/headers', (req, res) => {
  res.json(req.headers)
})

app.get('*', (req, res) => {
  res.send(`You requested ${req.path}`)
})
