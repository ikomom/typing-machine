import { relative, resolve } from 'path'
import { Snapshots } from 'ik-typing-machine'
import type { Snapshot } from 'ik-typing-machine'
import Git from 'simple-git'

/**
 * load form git history
 * @param path
 * @param cwd
 */
export async function loadFromGit(path: string, cwd = process.cwd()) {
  const git = Git(cwd)
  const root = (await git.raw(['rev-parse', '--show-toplevel'])).trim()
  const full = resolve(process.cwd(), path)
  const file = relative(root, full)
  console.log({ full, file, root })
  const items = await git.log({ file: full })
  // console.log({ items })

  const snaps = await Promise.all(items.all.map(async (arr): Promise<Snapshot> => {
    let content = ''
    try {
      content = await git.show(`${arr.hash}:${file}`)// :${file}
      console.log(arr.hash)
    }
    catch (e) {
      // console.log(e)
    }
    return {
      content,
    }
  }))
  // console.log({ snaps })

  return new Snapshots(...snaps)
}
