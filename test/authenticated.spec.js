import assert from 'assert'
import fetch from 'node-fetch'
import WebSocket from 'ws'

describe('when authenticated', () => {
  const headers = {
    'X-Proxy-Auth': 'MY_TEST_TOKEN',
  }

  it('should fetch /', async () => {
    const response = await fetch('http://localhost:3000/', { headers })
    assert.equal(response.status, 200)
    const body = await response.text()
    assert.equal(body, 'You requested /')
  })

  it('should fetch /hello', async () => {
    const response = await fetch('http://localhost:3000/hello', { headers })
    assert.equal(response.status, 200)
    const body = await response.text()
    assert.equal(body, 'You requested /hello')
  })

  it('should pass through headers except X-Proxy-Auth', async () => {
    const response = await fetch('http://localhost:3000/headers', {
      headers: {
        ...headers,
        'X-Test-Header': 'test',
      },
    })

    assert.equal(response.status, 200)

    const receivedHeaders = await response.json()
    assert.equal(receivedHeaders['x-test-header'], 'test')
    assert.equal(receivedHeaders['x-proxy-auth'], undefined)
  })

  it('should connect to /websocket', async () => {
    const ws = new WebSocket('ws://localhost:3000/websocket', { headers })
    await new Promise((resolve, reject) => {
      ws.on('open', resolve)
      ws.on('error', reject)
    })
    ws.close()
  })
})
