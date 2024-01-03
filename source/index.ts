// builtin
import { join } from 'path'
import type { WriteFileOptions } from 'fs'

// external
import { isPlainObject } from 'typechecker'
import write from '@bevry/fs-write'
import {
	scanDirectory,
	ResultEncoding,
	Tree,
	Options,
	toTree,
} from 'scandirectory'

/** Read a directory to a tree */
export async function readTree<Encoding extends ResultEncoding = 'utf8'>(
	directory: string,
	opts: Omit<Options<Encoding>, 'directory' | 'includeRoot'> = {
		encoding: 'utf8' as Encoding,
	}
): Promise<Tree<Encoding>> {
	const results = await scanDirectory({ ...opts, directory, includeRoot: true })
	return toTree(results)
}

/** Write a tree to a directory */
export async function writeTree<Encoding extends ResultEncoding = 'utf8'>(
	directory: string,
	tree: Tree<ResultEncoding>,
	opts: WriteFileOptions = {
		encoding: 'utf8' as Encoding,
	}
): Promise<void> {
	for (const basename of Object.keys(tree)) {
		const value = tree[basename]
		const path = join(directory, basename)
		if (isPlainObject(value)) {
			await writeTree(path, value as Tree<ResultEncoding>, opts)
		} else {
			await write(path, value === true ? '' : value, opts)
		}
	}
}
