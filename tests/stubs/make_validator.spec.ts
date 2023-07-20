/*
 * @adonisjs/core
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { join } from 'node:path'
import { test } from '@japa/runner'
import { fileURLToPath } from 'node:url'
import { AppFactory } from '@adonisjs/application/factories'

import { stubsRoot } from '../../stubs/index.js'

const BASE_URL = new URL('./tmp/', import.meta.url)
const BASE_PATH = fileURLToPath(BASE_URL)

test.group('Make validator', () => {
  test('prepare validator stub', async ({ assert }) => {
    const app = new AppFactory().create(BASE_URL, () => {})
    await app.init()

    const stub = await app.stubs.build('make/validator/main.stub', {
      source: stubsRoot,
    })
    const { contents, destination } = await stub.prepare({
      entity: app.generators.createEntity('posts'),
    })

    assert.equal(destination, join(BASE_PATH, 'app/validators/post_validator.ts'))
    assert.match(contents, new RegExp("import vine from '@vinejs/vine'"))
  })
})
