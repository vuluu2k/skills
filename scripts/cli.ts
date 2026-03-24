import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import * as p from '@clack/prompts'
import prompts from 'prompts'
import { collections, manual, submodules, vendors } from '../meta.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function exec(cmd: string, cwd = root): string {
  return execSync(cmd, { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
}

function execSafe(cmd: string, cwd = root): string | null {
  try {
    return exec(cmd, cwd)
  }
  catch {
    return null
  }
}

function getGitSha(dir: string): string | null {
  return execSafe('git rev-parse HEAD', dir)
}

function submoduleExists(path: string): boolean {
  const gitmodules = join(root, '.gitmodules')
  if (!existsSync(gitmodules))
    return false
  const content = readFileSync(gitmodules, 'utf-8')
  return content.includes(`path = ${path}`)
}

const RE_SUBMODULE_PATH = /path\s*=\s*(.+)/g

function getExistingSubmodulePaths(): string[] {
  const gitmodules = join(root, '.gitmodules')
  if (!existsSync(gitmodules))
    return []
  const content = readFileSync(gitmodules, 'utf-8')
  const matches = content.matchAll(RE_SUBMODULE_PATH)
  return Array.from(matches, match => match[1].trim())
}

function removeSubmodule(submodulePath: string): void {
  execSafe(`git submodule deinit -f ${submodulePath}`)
  const gitModulesPath = join(root, '.git', 'modules', submodulePath)
  if (existsSync(gitModulesPath)) {
    rmSync(gitModulesPath, { recursive: true })
  }
  exec(`git rm -f ${submodulePath}`)
}

interface Project {
  name: string
  url: string
  type: 'source' | 'vendor'
  path: string
}

interface VendorConfig {
  source: string
  skills: Record<string, string>
}

async function initSubmodules(skipPrompt = false) {
  const allProjects: Project[] = [
    ...Object.entries(submodules).map(([name, url]) => ({
      name,
      url,
      type: 'source' as const,
      path: `sources/${name}`,
    })),
    ...Object.entries(vendors).map(([name, config]) => ({
      name,
      url: (config as VendorConfig).source,
      type: 'vendor' as const,
      path: `vendor/${name}`,
    })),
  ]

  const spinner = p.spinner()

  const existingSubmodulePaths = getExistingSubmodulePaths()
  const expectedPaths = new Set(allProjects.map(p => p.path))
  const extraSubmodules = existingSubmodulePaths.filter(path => !expectedPaths.has(path))

  if (extraSubmodules.length > 0) {
    p.log.warn(`Found ${extraSubmodules.length} submodule(s) not in meta.ts:`)
    for (const path of extraSubmodules) {
      p.log.message(`  - ${path}`)
    }

    const shouldRemove = skipPrompt
      ? true
      : await p.confirm({
        message: 'Remove these extra submodules?',
        initialValue: true,
      })

    if (p.isCancel(shouldRemove)) {
      p.cancel('Cancelled')
      return
    }

    if (shouldRemove) {
      for (const submodulePath of extraSubmodules) {
        spinner.start(`Removing submodule: ${submodulePath}`)
        try {
          removeSubmodule(submodulePath)
          spinner.stop(`Removed: ${submodulePath}`)
        }
        catch (e) {
          spinner.stop(`Failed to remove ${submodulePath}: ${e}`)
        }
      }
    }
  }

  const newProjects = allProjects.filter(p => !submoduleExists(p.path))

  if (newProjects.length === 0) {
    p.log.info('All submodules already initialized')
    return
  }

  const selected = skipPrompt
    ? newProjects
    : await p.multiselect({
      message: 'Select projects to initialize',
      options: newProjects.map(project => ({
        value: project,
        label: `${project.name} (${project.type})`,
        hint: project.url,
      })),
      initialValues: newProjects,
    })

  if (p.isCancel(selected)) {
    p.cancel('Cancelled')
    return
  }

  for (const project of selected as Project[]) {
    spinner.start(`Adding submodule: ${project.name}`)

    const parentDir = join(root, dirname(project.path))
    if (!existsSync(parentDir)) {
      mkdirSync(parentDir, { recursive: true })
    }

    try {
      exec(`git submodule add ${project.url} ${project.path}`)
      spinner.stop(`Added: ${project.name}`)
    }
    catch (e) {
      spinner.stop(`Failed to add ${project.name}: ${e}`)
    }
  }

  p.log.success('Submodules initialized')
}

async function syncSubmodules() {
  const spinner = p.spinner()

  spinner.start('Updating submodules...')
  try {
    exec('git submodule update --remote --merge')
    spinner.stop('Submodules updated')
  }
  catch (e) {
    spinner.stop(`Failed to update submodules: ${e}`)
    return
  }

  for (const [vendorName, config] of Object.entries(vendors)) {
    const vendorConfig = config as VendorConfig
    const vendorPath = join(root, 'vendor', vendorName)
    const vendorSkillsPath = join(vendorPath, 'skills')

    if (!existsSync(vendorPath)) {
      p.log.warn(`Vendor submodule not found: ${vendorName}. Run init first.`)
      continue
    }

    if (!existsSync(vendorSkillsPath)) {
      p.log.warn(`No skills directory in vendor/${vendorName}/skills/`)
      continue
    }

    for (const [sourceSkillName, outputSkillName] of Object.entries(vendorConfig.skills)) {
      const sourceSkillPath = join(vendorSkillsPath, sourceSkillName)
      const outputPath = join(root, 'skills', outputSkillName)

      if (!existsSync(sourceSkillPath)) {
        p.log.warn(`Skill not found: vendor/${vendorName}/skills/${sourceSkillName}`)
        continue
      }

      spinner.start(`Syncing skill: ${sourceSkillName} → ${outputSkillName}`)

      if (existsSync(outputPath)) {
        rmSync(outputPath, { recursive: true })
      }
      mkdirSync(outputPath, { recursive: true })

      const files = readdirSync(sourceSkillPath, { recursive: true, withFileTypes: true })
      for (const file of files) {
        if (file.isFile()) {
          const fullPath = join(file.parentPath, file.name)
          const relativePath = fullPath.replace(sourceSkillPath, '')
          const destPath = join(outputPath, relativePath)
          const destDir = dirname(destPath)
          if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true })
          }
          cpSync(fullPath, destPath)
        }
      }

      const licenseNames = ['LICENSE', 'LICENSE.md', 'LICENSE.txt']
      for (const licenseName of licenseNames) {
        const licensePath = join(vendorPath, licenseName)
        if (existsSync(licensePath)) {
          cpSync(licensePath, join(outputPath, 'LICENSE.md'))
          break
        }
      }

      const sha = getGitSha(vendorPath)
      const syncPath = join(outputPath, 'SYNC.md')
      const date = new Date().toISOString().split('T')[0]
      writeFileSync(syncPath, `# Sync Info\n\n- **Source:** \`vendor/${vendorName}/skills/${sourceSkillName}\`\n- **Git SHA:** \`${sha}\`\n- **Synced:** ${date}\n`)

      spinner.stop(`Synced: ${sourceSkillName} → ${outputSkillName}`)
    }
  }

  p.log.success('All skills synced')
}

async function checkUpdates() {
  const spinner = p.spinner()
  spinner.start('Fetching remote changes...')

  try {
    exec('git submodule foreach git fetch')
    spinner.stop('Fetched remote changes')
  }
  catch {
    spinner.stop('No submodules to fetch (or not a git repo)')
    return
  }

  const updates: { name: string, type: string, behind: number }[] = []

  for (const name of Object.keys(submodules)) {
    const path = join(root, 'sources', name)
    if (!existsSync(path))
      continue
    const behind = execSafe('git rev-list HEAD..@{u} --count', path)
    const count = behind ? Number.parseInt(behind) : 0
    if (count > 0)
      updates.push({ name, type: 'source', behind: count })
  }

  for (const [name, config] of Object.entries(vendors)) {
    const vendorConfig = config as VendorConfig
    const path = join(root, 'vendor', name)
    if (!existsSync(path))
      continue
    const behind = execSafe('git rev-list HEAD..@{u} --count', path)
    const count = behind ? Number.parseInt(behind) : 0
    if (count > 0) {
      const skillNames = Object.values(vendorConfig.skills).join(', ')
      updates.push({ name: `${name} (${skillNames})`, type: 'vendor', behind: count })
    }
  }

  if (updates.length === 0) {
    p.log.success('All submodules are up to date')
  }
  else {
    p.log.info('Updates available:')
    for (const update of updates) {
      p.log.message(`  ${update.name} (${update.type}): ${update.behind} commits behind`)
    }
  }
}

function getExpectedSkillNames(): Set<string> {
  const expected = new Set<string>()
  for (const name of Object.keys(submodules))
    expected.add(name)
  for (const config of Object.values(vendors)) {
    const vendorConfig = config as VendorConfig
    for (const outputName of Object.values(vendorConfig.skills))
      expected.add(outputName)
  }
  for (const name of manual)
    expected.add(name)
  return expected
}

function getExistingSkillNames(): string[] {
  const skillsDir = join(root, 'skills')
  if (!existsSync(skillsDir))
    return []
  return readdirSync(skillsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
}

async function cleanup(skipPrompt = false) {
  const spinner = p.spinner()
  let hasChanges = false

  const existingSkills = getExistingSkillNames()
  const expectedSkills = getExpectedSkillNames()
  const extraSkills = existingSkills.filter(name => !expectedSkills.has(name))

  if (extraSkills.length > 0) {
    p.log.warn(`Found ${extraSkills.length} skill(s) not in meta.ts:`)
    for (const name of extraSkills) {
      p.log.message(`  - skills/${name}`)
    }

    const shouldRemove = skipPrompt
      ? true
      : await p.confirm({
        message: 'Remove these extra skills?',
        initialValue: false,
      })

    if (p.isCancel(shouldRemove)) {
      p.cancel('Cancelled')
      return
    }

    if (shouldRemove) {
      hasChanges = true
      for (const skillName of extraSkills) {
        spinner.start(`Removing skill: ${skillName}`)
        try {
          rmSync(join(root, 'skills', skillName), { recursive: true })
          spinner.stop(`Removed: skills/${skillName}`)
        }
        catch (e) {
          spinner.stop(`Failed to remove skills/${skillName}: ${e}`)
        }
      }
    }
  }

  if (!hasChanges && extraSkills.length === 0) {
    p.log.success('Everything is clean')
  }
  else if (hasChanges) {
    p.log.success('Cleanup completed')
  }
}

async function installSkills(targetCollectionNames: string[] = []) {
  const spinner = p.spinner()

  const allCollections: Record<string, string[]> = { ...collections }
  for (const [vendorName, config] of Object.entries(vendors)) {
    const vendorConfig = config as VendorConfig
    allCollections[vendorName] = Object.values(vendorConfig.skills)
  }

  if (Object.keys(allCollections).length === 0) {
    p.log.warn('No collections or vendors defined in meta.ts')
    return
  }

  let selectedCollectionNames: string[] = []

  if (targetCollectionNames.length > 0) {
    const invalid = targetCollectionNames.filter(name => !allCollections[name])
    if (invalid.length > 0) {
      p.log.error(`Collections not found: ${invalid.join(', ')}`)
      return
    }
    selectedCollectionNames = targetCollectionNames
  } else {
    const response = await prompts({
      type: 'autocompleteMultiselect',
      name: 'selected',
      message: 'Search and select collections to install (Space to select, Enter to confirm)',
      choices: Object.keys(allCollections).map(name => ({
        title: name,
        value: name,
        description: `${allCollections[name].length} skills`
      }))
    })

    if (!response.selected || response.selected.length === 0) {
      p.log.warn('No collections selected (or canceled)')
      return
    }

    selectedCollectionNames = response.selected
  }

  const targetProject = await p.text({
    message: 'Enter target project directory path (relative or absolute)',
    initialValue: process.cwd(),
    placeholder: process.cwd(),
    validate: (value) => {
      if (!value) return 'Path is required'
      if (!existsSync(value)) return 'Directory does not exist'
    }
  })

  if (p.isCancel(targetProject)) {
    p.cancel('Cancelled')
    return
  }

  const toolChoice = await p.select({
    message: 'Which AI tool are you installing these skills for?',
    options: [
      { value: 'skills', label: 'Generic (skills/)', hint: 'Default skills directory' },
      { value: '.cursor/skills', label: 'Cursor (.cursor/skills)' },
      { value: '.windsurf/skills', label: 'Windsurf (.windsurf/skills)' },
      { value: '.claude/skills', label: 'Claude Desktop (.claude/skills)' },
      { value: '.claudecode/skills', label: 'Claude Code (.claudecode/skills)' },
      { value: '.agents/skills', label: 'Antigravity (.agents/skills)' },
      { value: '.vscode/skills', label: 'VSCode / Copilot (.vscode/skills)' },
      { value: 'custom', label: 'Custom path...' }
    ]
  })

  if (p.isCancel(toolChoice)) {
    p.cancel('Cancelled')
    return
  }

  let skillsDirName = toolChoice as string

  if (toolChoice === 'custom') {
    const customDir = await p.text({
      message: 'Enter custom skills directory path:',
      initialValue: 'skills',
      placeholder: 'skills'
    })

    if (p.isCancel(customDir)) {
      p.cancel('Cancelled')
      return
    }
    skillsDirName = customDir as string
  }

  const selectedSkills = Array.from(new Set(
    (selectedCollectionNames as string[]).flatMap(name => allCollections[name])
  ))
  const targetDir = join(targetProject as string, skillsDirName)

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true })
  }

  spinner.start(`Installing ${selectedSkills.length} skills to ${targetDir}...`)

  let successCount = 0;
  for (const skill of selectedSkills) {
    const sourcePath = join(root, 'skills', skill)
    if (!existsSync(sourcePath)) {
      p.log.warn(`Skill not found: ${skill}`)
      continue
    }

    const destPath = join(targetDir, skill)
    if (existsSync(destPath)) {
      rmSync(destPath, { recursive: true })
    }

    mkdirSync(destPath, { recursive: true })

    const files = readdirSync(sourcePath, { recursive: true, withFileTypes: true })
    for (const file of files) {
      if (file.isFile()) {
        const fullPath = join(file.parentPath, file.name)
        const relativePath = fullPath.replace(sourcePath, '')
        const dp = join(destPath, relativePath)
        const dd = dirname(dp)
        if (!existsSync(dd)) {
          mkdirSync(dd, { recursive: true })
        }
        cpSync(fullPath, dp)
      }
    }
    successCount++;
  }

  spinner.stop(`Installed ${successCount}/${selectedSkills.length} skills to target project`)
}

async function installSpecificSkills(targetSkillNames: string[] = []) {
  const spinner = p.spinner()

  const allSkills = getExistingSkillNames()

  if (allSkills.length === 0) {
    p.log.warn('No skills found in skills directory. Try running init or sync first.')
    return
  }

  let selectedSkills: string[] = []

  if (targetSkillNames.length > 0) {
    const invalid = targetSkillNames.filter(name => !allSkills.includes(name))
    if (invalid.length > 0) {
      p.log.error(`Skills not found: ${invalid.join(', ')}`)
      return
    }
    selectedSkills = targetSkillNames
  } else {
    const response = await prompts({
      type: 'autocompleteMultiselect',
      name: 'selected',
      message: 'Search and select individual skills to install (Space to select, Enter to confirm)',
      choices: allSkills.map(name => ({
        title: name,
        value: name
      }))
    })

    if (!response.selected || response.selected.length === 0) {
      p.log.warn('No skills selected (or canceled)')
      return
    }

    selectedSkills = response.selected
  }

  const targetProject = await p.text({
    message: 'Enter target project directory path (relative or absolute)',
    initialValue: process.cwd(),
    placeholder: process.cwd(),
    validate: (value) => {
      if (!value) return 'Path is required'
      if (!existsSync(value)) return 'Directory does not exist'
    }
  })

  if (p.isCancel(targetProject)) {
    p.cancel('Cancelled')
    return
  }

  const toolChoice = await p.select({
    message: 'Which AI tool are you installing these skills for?',
    options: [
      { value: 'skills', label: 'Generic (skills/)', hint: 'Default skills directory' },
      { value: '.cursor/skills', label: 'Cursor (.cursor/skills)' },
      { value: '.windsurf/rules', label: 'Windsurf (.windsurf/rules)' },
      { value: '.claude/skills', label: 'Claude Desktop (.claude/skills)' },
      { value: '.claudecode/skills', label: 'Claude Code (.claudecode/skills)' },
      { value: '.agents/skills', label: 'Antigravity (.agents/skills)' },
      { value: '.vscode/skills', label: 'VSCode / Copilot (.vscode/skills)' },
      { value: 'custom', label: 'Custom path...' }
    ]
  })

  if (p.isCancel(toolChoice)) {
    p.cancel('Cancelled')
    return
  }

  let skillsDirName = toolChoice as string

  if (toolChoice === 'custom') {
    const customDir = await p.text({
      message: 'Enter custom skills directory path:',
      initialValue: 'skills',
      placeholder: 'skills'
    })

    if (p.isCancel(customDir)) {
      p.cancel('Cancelled')
      return
    }
    skillsDirName = customDir as string
  }

  const targetDir = join(targetProject as string, skillsDirName)

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true })
  }

  spinner.start(`Installing ${selectedSkills.length} skills to ${targetDir}...`)

  let successCount = 0;
  for (const skill of selectedSkills as string[]) {
    const sourcePath = join(root, 'skills', skill)
    if (!existsSync(sourcePath)) {
      p.log.warn(`Skill not found: ${skill}`)
      continue
    }

    const destPath = join(targetDir, skill)
    if (existsSync(destPath)) {
      rmSync(destPath, { recursive: true })
    }

    mkdirSync(destPath, { recursive: true })

    const files = readdirSync(sourcePath, { recursive: true, withFileTypes: true })
    for (const file of files) {
      if (file.isFile()) {
        const fullPath = join(file.parentPath, file.name)
        const relativePath = fullPath.replace(sourcePath, '')
        const dp = join(destPath, relativePath)
        const dd = dirname(dp)
        if (!existsSync(dd)) {
          mkdirSync(dd, { recursive: true })
        }
        cpSync(fullPath, dp)
      }
    }
    successCount++;
  }

  spinner.stop(`Installed ${successCount}/${selectedSkills.length} skills to target project`)
}

async function findSkills(query?: string) {
  const allSkills = getExistingSkillNames()
  p.intro(`Search results for ${query ? `"${query}"` : 'all'}`)
  
  const allCollections: Record<string, string[]> = { ...collections }
  for (const [vendorName, config] of Object.entries(vendors)) {
    const vendorConfig = config as VendorConfig
    allCollections[vendorName] = Object.values(vendorConfig.skills)
  }

  let q = ''
  if (!query) {
    const userInput = await p.text({
      message: 'Enter keyword to search (leave empty to list all):',
      placeholder: 'e.g. vue'
    })
    
    if (p.isCancel(userInput)) {
      p.cancel('Cancelled')
      return
    }
    q = (userInput as string).toLowerCase()
  } else {
    q = query.toLowerCase()
  }
  
  const matchedCollections = Object.keys(allCollections).filter(c => c.toLowerCase().includes(q))
  if (matchedCollections.length > 0) {
    p.log.success('📚 Collections found:')
    for (const c of matchedCollections) {
      p.log.message(`  - ${c} (${allCollections[c].length} skills) -> \`npx devskill install ${c}\``)
    }
  } else if (q) {
    p.log.warn('No collections found matching query')
  }

  const matchedSkills = allSkills.filter(s => s.toLowerCase().includes(q))
  if (matchedSkills.length > 0) {
    p.log.success('🛠️  Individual Skills found:')
    for (const s of matchedSkills) {
      p.log.message(`  - ${s} -> \`npx devskill add ${s}\``)
    }
  } else if (q) {
    p.log.warn('No individual skills found matching query')
  }
}

async function main() {
  const args = process.argv.slice(2)
  const skipPrompt = args.includes('-y') || args.includes('--yes')
  
  const positionalArgs = args.filter(arg => !arg.startsWith('-'))
  const command = positionalArgs[0]
  const targetNames = positionalArgs.slice(1)
  const targetName = targetNames[0] // for finding

  if (command === 'find') {
    await findSkills(targetName)
    p.outro('Done')
    return
  }

  if (command === 'init') {
    p.intro('Skills Manager - Init')
    await initSubmodules(skipPrompt)
    p.outro('Done')
    return
  }

  if (command === 'sync') {
    p.intro('Skills Manager - Sync')
    await syncSubmodules()
    p.outro('Done')
    return
  }

  if (command === 'check') {
    p.intro('Skills Manager - Check')
    await checkUpdates()
    p.outro('Done')
    return
  }

  if (command === 'cleanup') {
    p.intro('Skills Manager - Cleanup')
    await cleanup(skipPrompt)
    p.outro('Done')
    return
  }

  if (command === 'install') {
    const namesJoined = targetNames.length > 0 ? ` (${targetNames.join(', ')})` : ''
    p.intro(`Skills Manager - Install Groups${namesJoined}`)
    await installSkills(targetNames)
    p.outro('Done')
    return
  }

  if (command === 'add') {
    const namesJoined = targetNames.length > 0 ? ` (${targetNames.join(', ')})` : ''
    p.intro(`Skills Manager - Add Specific Skills${namesJoined}`)
    await installSpecificSkills(targetNames)
    p.outro('Done')
    return
  }

  if (skipPrompt) {
    p.log.error('Command required when using -y flag')
    p.log.info('Available commands: find, install, add, init, sync, check, cleanup')
    process.exit(1)
  }

  p.intro('Skills Manager')

  const action = await p.select({
    message: 'What would you like to do?',
    options: [
      { value: 'install', label: 'Install collections', hint: 'Copy entire skill collections to a local project' },
      { value: 'add', label: 'Add specific skills', hint: 'Choose individual skills to add to your project' },
      { value: 'find', label: 'Find a skill or collection', hint: 'Search by keyword' },
      { value: 'sync', label: 'Sync submodules', hint: 'Pull latest and sync Type 2 skills' },
      { value: 'init', label: 'Init submodules', hint: 'Add new submodules from meta.ts' },
      { value: 'check', label: 'Check updates', hint: 'See available updates' },
      { value: 'cleanup', label: 'Cleanup', hint: 'Remove skills not listed in meta.ts' },
    ],
  })

  if (p.isCancel(action)) {
    p.cancel('Cancelled')
    process.exit(0)
  }

  switch (action) {
    case 'install':
      await installSkills()
      break
    case 'add':
      await installSpecificSkills()
      break
    case 'find':
      await findSkills()
      break
    case 'init':
      await initSubmodules()
      break
    case 'sync':
      await syncSubmodules()
      break
    case 'check':
      await checkUpdates()
      break
    case 'cleanup':
      await cleanup()
      break
  }

  p.outro('Done')
}

main().catch(console.error)
