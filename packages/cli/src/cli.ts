import { parse as parsePath, resolve } from 'path'
import { promises as fs } from 'fs'
import { Snapshots, getSnapshotPath } from 'ik-typing-machine'
import cac from 'cac'
import { version } from '../package.json'
import { loadFromGit } from './git'
import { playInTerminal } from './terminal'

const cli = cac('typemachine')

cli.version(version)
  .option('-r, --root <path>', 'root path')
  .option('--git', 'Read from Git history')
  .help()

cli.command('play <file>').action(play)

cli
  .command('')
  .action(() => {
    cli.outputHelp()
  })
cli.parse()

export interface CliOptions {
  git?: string
  root?: string
}

async function play(file: string, options: CliOptions) {
  const { root = process.cwd(), git } = options
  const absolute = resolve(root, file)

  const snaps = git ? await loadFromGit(absolute, root) : await loadFromFile(absolute)
  const { ext } = parsePath(file)

  console.log({ file, options, absolute, snaps: snaps.length, ext })
  await playInTerminal(snaps, ext.slice(1))
}

async function loadFromFile(file: string) {
  return Snapshots.fromString(await fs.readFile(getSnapshotPath(file), 'utf-8'))
}
