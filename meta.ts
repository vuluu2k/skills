export interface VendorSkillMeta {
  official?: boolean
  source: string
  skills?: Record<string, string> // sourceSkillName -> outputSkillName. If omitted, auto-discovers all subdirectories.
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
    'builderx_spa-design'
  ],
  'builderx_api': [
    'builderx_api-schemas',
    'builderx_api-controllers',
    'builderx_api-contexts',
    'builderx_api-kafka',
    'builderx_api-redis',
    'builderx_api-rabbitmq',
    'builderx_api-mongodb',
  ]
}
