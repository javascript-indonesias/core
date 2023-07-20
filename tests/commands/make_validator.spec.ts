/*
 * @adonisjs/core
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { AceFactory } from '../../factories/core/ace.js'
import { StubsFactory } from '../../factories/stubs.js'
import MakeValidator from '../../commands/make/validator.js'

test.group('Make validator', () => {
  test('create validator file', async ({ assert, fs }) => {
    const ace = await new AceFactory().make(fs.baseUrl, {
      importer: (filePath) => import(filePath),
    })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeValidator, ['invoice'])
    await command.exec()

    const { contents } = await new StubsFactory().prepare('make/validator/main.stub', {
      entity: ace.app.generators.createEntity('invoice'),
    })

    await assert.fileEquals('app/validators/invoice_validator.ts', contents)

    assert.deepEqual(ace.ui.logger.getLogs(), [
      {
        message: 'green(DONE:)    create app/validators/invoice_validator.ts',
        stream: 'stdout',
      },
    ])
  })
})
