
import { assert, expect } from 'chai'
import { exec, fork } from 'child_process'
import { resolve } from 'path'
import * as pmx from '../src'

interface IPCMessage {
  type?: string
  data?: any
}

const launch = (fixture) => {
  return fork(resolve(__dirname, fixture), [], {
    execArgv: [ '-r', 'ts-node/register' ]
  })
}

describe('Entrypoint', function () {
  this.timeout(20000)

  describe('Empty class', () => {
    it('should fail cause no onStart method', () => {
      try {
        const entrypoint = new pmx.Entrypoint()
      } catch (err) {
        expect(err.message).to.equal('Entrypoint onStart() not specified')
      }
    })
  })

  describe('Basic class', () => {
    it('should instantiate a basic entrypoint', (done) => {
      const child = launch('fixtures/entrypointChild')
      let hasConfig = false

      child.on('message', (res: IPCMessage | string) => {
        if (typeof res === 'string') {
          if (res === 'ready') {
            assert(hasConfig === true, 'should have both the good config and is ready sent')
            child.kill('SIGINT')
          }
          return
        }

        if (res.type && res.type === 'axm:option:configuration' && res.data && res.data.metrics && res.data.metrics.eventLoop === false) {
          hasConfig = true
        }
      })

      let exited = 0

      child.on('exit', (code, signal) => {
        if (!exited) {
          exited = 1
          expect(code).to.equal(null)
          expect(signal).to.equal('SIGINT')
          done()
        }
      })
    })
  })
})
