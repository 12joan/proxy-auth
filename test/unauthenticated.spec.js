import assert from 'assert'
import fetch from 'node-fetch'
import WebSocket from 'ws'

describe('when unauthenticated', () => {
  it('should return 403', async () => {
    const response = await fetch('http://localhost:3000/')
    assert.equal(response.status, 403)
  })

  it('should fail to connect to /websocket', async () => {
    const ws = new WebSocket('ws://localhost:3000/websocket')
    await new Promise((resolve, reject) => {
      ws.on('open', reject)
      ws.on('error', resolve)
    })
    ws.close()
  })
})
