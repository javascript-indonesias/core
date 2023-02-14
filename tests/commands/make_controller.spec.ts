/*
 * @adonisjs/core
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { AceFactory } from '../../test_factories/ace.js'
import { StubsFactory } from '../../test_factories/stubs.js'
import MakeControllerCommand from '../../commands/make/controller.js'

test.group('Make controller', () => {
  test('create controller', async ({ assert, fs }) => {
    const ace = await new AceFactory().make(fs.baseUrl, {
      importer: (filePath) => import(filePath),
    })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeControllerCommand, ['user'])
    await command.exec()

    const { contents } = await new StubsFactory().prepare('make/controller/main.stub', {
      entity: ace.app.generators.createEntity('user'),
    })

    await assert.fileEquals('app/controllers/users_controller.ts', contents)

    assert.deepEqual(ace.ui.logger.getLogs(), [
      {
        message: 'green(DONE:)    create app/controllers/users_controller.ts',
        stream: 'stdout',
      },
    ])
  })

  test('skip when controller already exists', async ({ assert, fs }) => {
    const ace = await new AceFactory().make(fs.baseUrl, {
      importer: (filePath) => import(filePath),
    })
    await ace.app.init()
    ace.ui.switchMode('raw')

    await fs.create('app/controllers/users_controller.ts', `export default class {}`)

    const command = await ace.create(MakeControllerCommand, ['user'])
    await command.exec()

    await assert.fileEquals('app/controllers/users_controller.ts', `export default class {}`)

    assert.deepEqual(ace.ui.logger.getLogs(), [
      {
        message:
          'cyan(SKIPPED:) create app/controllers/users_controller.ts dim((File already exists))',
        stream: 'stdout',
      },
    ])
  })

  test('create resource controller', async ({ assert, fs }) => {
    const ace = await new AceFactory().make(fs.baseUrl, {
      importer: (filePath) => import(filePath),
    })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeControllerCommand, ['user', '--resource'])
    await command.exec()

    const { contents } = await new StubsFactory().prepare('make/controller/resource.stub', {
      entity: ace.app.generators.createEntity('user'),
    })

    await assert.fileEquals('app/controllers/users_controller.ts', contents)

    assert.deepEqual(ace.ui.logger.getLogs(), [
      {
        message: 'green(DONE:)    create app/controllers/users_controller.ts',
        stream: 'stdout',
      },
    ])
  })

  test('create api controller', async ({ assert, fs }) => {
    const ace = await new AceFactory().make(fs.baseUrl, {
      importer: (filePath) => import(filePath),
    })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeControllerCommand, ['user', '--api'])
    await command.exec()

    const { contents } = await new StubsFactory().prepare('make/controller/api.stub', {
      entity: ace.app.generators.createEntity('user'),
    })

    await assert.fileEquals('app/controllers/users_controller.ts', contents)

    assert.deepEqual(ace.ui.logger.getLogs(), [
      {
        message: 'green(DONE:)    create app/controllers/users_controller.ts',
        stream: 'stdout',
      },
    ])
  })

  test('create api controller when both api and resource flags are used', async ({
    assert,
    fs,
  }) => {
    const ace = await new AceFactory().make(fs.baseUrl, {
      importer: (filePath) => import(filePath),
    })
    await ace.app.init()
    ace.ui.switchMode('raw')

    const command = await ace.create(MakeControllerCommand, ['user', '--api', '--resource'])
    await command.exec()

    const { contents } = await new StubsFactory().prepare('make/controller/api.stub', {
      entity: ace.app.generators.createEntity('user'),
    })

    await assert.fileEquals('app/controllers/users_controller.ts', contents)

    assert.deepEqual(ace.ui.logger.getLogs(), [
      {
        message:
          '[ yellow(warn) ] --api and --resource flags cannot be used together. Ignoring --resource',
        stream: 'stdout',
      },
      {
        message: 'green(DONE:)    create app/controllers/users_controller.ts',
        stream: 'stdout',
      },
    ])
  })
})
