export interface VendorSkillMeta {
  official?: boolean
  source: string
  skills?: Record<string, string> // sourceSkillName -> outputSkillName. If omitted, auto-discovers all subdirectories.
}

export interface RuleMeta {
  file: string // path relative to repo root, e.g. 'rules/vue-style.md'
  description?: string
}

export interface WorkflowMeta {
  file: string // path relative to repo root, e.g. 'workflows/git-flow.md'
  description?: string
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
  'vue': 'https://github.com/vuejs/docs',
  'pinia': 'https://github.com/vuejs/pinia',
  'deepinfra': 'https://github.com/deepinfra/docs',
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
  'vuejs-ai': {
    source: 'https://github.com/vuejs-ai/skills',
    skills: {
      'vue-best-practices': 'vue-best-practices',
      'vue-router-best-practices': 'vue-router-best-practices',
      'vue-testing-best-practices': 'vue-testing-best-practices',
      'vue-options-api-best-practices': 'vue-options-api-best-practices',
      'vue-pinia-best-practices': 'vue-pinia-best-practices',
      'vue-jsx-best-practices': 'vue-jsx-best-practices',
    },
  },
  'web-design-guidelines': {
    source: 'https://github.com/vercel-labs/agent-skills',
    skills: {
      'composition-patterns': 'composition-patterns',
      'web-design-guidelines': 'web-design-guidelines',
      'react-best-practices': 'react-best-practices',
      'deploy-to-vercel': 'deploy-to-vercel',
      'react-native-skills': 'react-native-skills',
      'vercel-cli-with-tokens': 'vercel-cli-with-tokens',
    },
  },
  'slidev': {
    official: true,
    source: 'https://github.com/slidevjs/slidev',
    skills: {
      slidev: 'slidev',
    },
  },
  'vueuse': {
    official: true,
    source: 'https://github.com/vueuse/vueuse',
    skills: {
      'vueuse-functions': 'vueuse-functions',
    },
  },
  'tsdown': {
    official: true,
    source: 'https://github.com/rolldown/tsdown',
    skills: {
      tsdown: 'tsdown',
    },
  },
  'turborepo': {
    official: true,
    source: 'https://github.com/vercel/turborepo',
    skills: {
      turborepo: 'turborepo',
    },
  },
  'next-skills': {
    official: true,
    source: 'https://github.com/vercel-labs/next-skills',
    skills: {
      'next-best-practices': 'next-best-practices',
      'next-cache-components': 'next-cache-components',
      'next-upgrade': 'next-upgrade',
    },
  },
  'anthropics': {
    official: true,
    source: 'https://github.com/anthropics/skills',
  },
  'shacdn-ui': {
    official: true,
    source: 'https://github.com/shadcn-ui/ui',
  },
  'awesome-copilot': {
    official: true,
    source: 'https://github.com/github/awesome-copilot',
  }
}

export const manual = [
  'vue-options',
  'pinia-options',
  'pinia',
  'vue',
  'builderx_spa-api',
  'builderx_spa-permission',
  'builderx_spa-design',
  'vue-antdv-tailwind',
  'builderx_api-schemas',
  'builderx_api-controllers',
  'builderx_api-contexts',
  'landing_page-schemas',
  'landing_page-controllers',
  'landing_page-contexts',
  'landing_page-plugs',
  'landing_page-oban',
  'landing_page-channels',
  'landing_page-vue2-editor',
]

/**
 * Collections of skills grouped by target projects/repos.
 * Use `npm start install` to quickly copy a batch of skills to a local project.
 */
export const collections: Record<string, string[]> = {
  'vue3-standard': [
    'vue',
    'pinia',
    'vue-best-practices',
    'vue-router-best-practices',
    'vue-testing-best-practices'
  ],
  'builderx_spa': [
    'vue-options',
    'pinia-options',
    'builderx_spa-api',
    'builderx_spa-permission',
    'builderx_spa-design',
    'git-commit',
  ],
  'builderx_api': [
    'builderx_api-schemas',
    'builderx_api-controllers',
    'builderx_api-contexts',
    'builderx_api-kafka',
    'builderx_api-redis',
    'builderx_api-rabbitmq',
    'builderx_api-mongodb',
    'git-commit',
    'deepinfra',
  ],
  'landing_page': [
    'landing_page-schemas',
    'landing_page-controllers',
    'landing_page-contexts',
    'landing_page-plugs',
    'landing_page-oban',
    'landing_page-channels',
    'landing_page-vue2-editor',
    'git-commit',
  ]
}

/**
 * Individual rule files (markdown) to install into AI tool rule directories.
 * Format: { 'rule-name': { file: 'rules/rule-name.md', description: '...' } }
 */
export const rules: Record<string, RuleMeta> = {
  'vue-style': {
    file: 'rules/vue-style.md',
    description: 'Vue 3 coding style and conventions',
  },
  'typescript-strict': {
    file: 'rules/typescript-strict.md',
    description: 'Strict TypeScript conventions',
  },
}

/**
 * Individual workflow files (markdown) to install into AI tool workflow directories.
 * Format: { 'workflow-name': { file: 'workflows/workflow-name.md', description: '...' } }
 */
export const workflows: Record<string, WorkflowMeta> = {
  'git-flow': {
    file: 'workflows/git-flow.md',
    description: 'Feature branch git workflow',
  },
}

/**
 * Grouped collections of rules + workflows per project.
 * Use `npm start rules` or `npm start workflows` to install a batch.
 */
export const ruleCollections: Record<string, { rules?: string[], workflows?: string[] }> = {
  'builderx_spa': {
    rules: ['vue-style', 'typescript-strict'],
    workflows: ['git-flow'],
  },
}
