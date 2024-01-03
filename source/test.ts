// builtin
import { tmpdir } from 'os'
import { join } from 'path'

// external
import { deepEqual } from 'assert-helpers'
import kava from 'kava'
import promiseErrback from 'promise-errback'

// local
import { readTree, writeTree } from './index.js'

// prepare
const tree = {
	'a directory': {
		'another sub file of a directory':
			'content of another sub file of a directory',
		'a sub file of a directory': 'content of a sub file of a directory',
	},
	'a file': 'content of a file',
}

kava.suite('@bevry/fs-tree', function (suite, test) {
	test('it works works', function (done) {
		promiseErrback(done, async function () {
			const directory = join(tmpdir(), `bevry-fs-tree-${Math.random()}`)
			await writeTree(directory, tree)
			const result = await readTree(directory)
			deepEqual(result, tree, 'written and read tree is as expected')
		})
	})
})
