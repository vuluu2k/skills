export interface VendorSkillMeta {
  official?: boolean
  source: string
  skills: Record<string, string> // sourceSkillName -> outputSkillName
}

/**
 * Repositories to clone as submodules and generate skills from their docs.
 * After cloning, read docs and generate skills manually into skills/{name}/
 * Then update the Git SHA in skills/{name}/GENERATION.md
 *
 * Format: { 'skill-name': 'https://github.com/org/repo' }
 */
export const submodules: Record<string, string> = {
  // Example: add repos you want to generate skills from
  // 'react': 'https://github.com/reactjs/react.dev',
}

/**
 * Repositories that already maintain their own skills directory.
 * The CLI will clone them and sync the specified skills automatically.
 *
 * Format: { 'vendor-name': { source: 'repo-url', skills: { 'source-skill': 'output-skill' } } }
 */
export const vendors: Record<string, VendorSkillMeta> = {
  // Example: sync skills from a repo that already has them
  // 'vueuse': {
  //   source: 'https://github.com/vueuse/vueuse',
  //   skills: { 'vueuse-functions': 'vueuse-functions' }
  // },
}

/**
 * Hand-written skills managed manually (not from submodules or vendors).
 * These are listed here for tracking — the CLI uses this list during cleanup.
 */
export const manual = [
  'vue-options',
  'pinia-options',
]
