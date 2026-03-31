import {useTranslations} from 'next-intl';
import {Link} from '../../i18n/routing';
import { Badge } from "@/components/ui/badge";
import { Terminal, Zap, Target, Sparkles, CheckCircle2, Database, Boxes, Code2, ArrowRight, BookOpen, GitFork, Package, Users, Layers, Shield, RefreshCw, ChevronRight } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import * as motion from "framer-motion/client";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const collections = [
  {
    name: "builderx_spa",
    icon: Boxes,
    color: "cyan",
    skills: ["vue-options", "pinia-options", "builderx_spa-api", "builderx_spa-permission", "builderx_spa-design", "git-commit"],
    desc: "collections_builderx_spa",
  },
  {
    name: "builderx_api",
    icon: Database,
    color: "rose",
    skills: ["builderx_api-schemas", "builderx_api-controllers", "builderx_api-contexts", "builderx_api-kafka", "builderx_api-redis", "builderx_api-rabbitmq", "builderx_api-mongodb", "git-commit", "deepinfra"],
    desc: "collections_builderx_api",
  },
  {
    name: "landing_page",
    icon: Layers,
    color: "amber",
    skills: ["landing_page-schemas", "landing_page-controllers", "landing_page-contexts", "landing_page-plugs", "landing_page-oban", "landing_page-channels", "landing_page-vue2-editor", "git-commit"],
    desc: "collections_landing_page",
  },
  {
    name: "vue3-standard",
    icon: Code2,
    color: "emerald",
    skills: ["vue", "pinia", "vue-best-practices", "vue-router-best-practices", "vue-testing-best-practices"],
    desc: "collections_vue3_standard",
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; shadow: string; badge: string; icon: string }> = {
  cyan:    { border: "border-cyan-400/30 hover:border-cyan-400/60", bg: "bg-cyan-400/10", text: "text-cyan-400", shadow: "hover:shadow-cyan-400/10", badge: "bg-cyan-950 text-cyan-300 border-cyan-400/20", icon: "from-cyan-400/20 to-cyan-400/5" },
  rose:    { border: "border-rose-500/30 hover:border-rose-500/60", bg: "bg-rose-500/10", text: "text-rose-400", shadow: "hover:shadow-rose-500/10", badge: "bg-rose-950 text-rose-300 border-rose-500/20", icon: "from-rose-500/20 to-rose-500/5" },
  amber:   { border: "border-amber-400/30 hover:border-amber-400/60", bg: "bg-amber-400/10", text: "text-amber-400", shadow: "hover:shadow-amber-400/10", badge: "bg-amber-950 text-amber-300 border-amber-400/20", icon: "from-amber-400/20 to-amber-400/5" },
  emerald: { border: "border-emerald-400/30 hover:border-emerald-400/60", bg: "bg-emerald-400/10", text: "text-emerald-400", shadow: "hover:shadow-emerald-400/10", badge: "bg-emerald-950 text-emerald-300 border-emerald-400/20", icon: "from-emerald-400/20 to-emerald-400/5" },
};

const aiTools = [
  "Claude Code", "Cursor", "Windsurf", "GitHub Copilot", "Cline", "Codex",
];

export default function LandingPage() {
  const t = useTranslations('Index');
  const h = useTranslations('Hero');
  const f = useTranslations('Features');

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50 selection:bg-rose-500/30 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.1),transparent)]" />
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-rose-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-cyan-400/[0.03] rounded-full blur-[150px]" />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-zinc-950/70 backdrop-blur-2xl">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 font-bold text-lg group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:shadow-cyan-400/30 transition-shadow duration-300">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white">devskill</span>
          </a>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            <a href="#features" className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">{t('why_devskill')}</a>
            <a href="#how-it-works" className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">{t('how_it_works')}</a>
            <a href="#collections" className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">{t('collections')}</a>
            <a href="#architecture" className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">{t('architecture_title')}</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex bg-zinc-900/80 rounded-full p-0.5 border border-white/[0.08]">
              <Link href="/" locale="en" className="px-2.5 py-1 text-xs rounded-full hover:bg-white/10 transition-colors font-medium text-zinc-400 hover:text-white">EN</Link>
              <Link href="/" locale="vi" className="px-2.5 py-1 text-xs rounded-full hover:bg-white/10 transition-colors font-medium text-zinc-400 hover:text-white">VN</Link>
            </div>
            <a href="https://github.com/vuluu2k/skills" target="_blank" className="inline-flex items-center justify-center size-8 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-all">
              <GithubIcon className="w-[18px] h-[18px]" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-28 lg:pt-36 pb-20 lg:pb-28 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-6 border-white/[0.12] bg-white/[0.04] text-zinc-300 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-sm">
                {h('badge')}
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-400 leading-[1.25]">
                {t('title')}
              </h1>

              <p className="text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                {t('subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                <a
                  href="https://github.com/vuluu2k/skills"
                  target="_blank"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl font-semibold text-sm bg-white text-zinc-950 hover:bg-zinc-100 transition-colors shadow-lg shadow-white/10"
                >
                  <GithubIcon className="w-4 h-4" />
                  {h('cta')}
                </a>
                <div className="w-full sm:w-auto flex items-center gap-3 bg-zinc-900/80 border border-white/[0.08] px-4 h-12 rounded-xl text-sm font-mono backdrop-blur-sm">
                  <Terminal className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="text-zinc-200 font-medium">{h('install_cmd')}</span>
                  <CopyButton value="npx devskill" variant="ghost" className="h-7 w-7 hover:bg-white/10 text-zinc-500 hover:text-white -mr-1 shrink-0" />
                </div>
              </div>
            </motion.div>

            {/* Terminal Preview */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="max-w-3xl mx-auto mt-4"
            >
              <div className="rounded-xl overflow-hidden bg-zinc-900/80 border border-white/[0.08] shadow-2xl shadow-black/40">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  </div>
                  <span className="mx-auto text-[11px] text-zinc-500 font-mono">Terminal</span>
                </div>
                <div className="p-5 font-mono text-[13px] leading-relaxed space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">$</span>
                    <span className="text-white font-semibold">npx devskill</span>
                  </div>
                  <div className="space-y-1.5 text-zinc-400 pl-4 border-l border-white/[0.06]">
                    <p className="text-cyan-400 font-medium">? {t('terminal_select')}</p>
                    <p className="text-white/90">  <span className="text-emerald-400">&#10003;</span> builderx_api <span className="text-zinc-600">({t('terminal_skills', {count: 9})})</span></p>
                    <p className="text-white/90">  <span className="text-emerald-400">&#10003;</span> landing_page <span className="text-zinc-600">({t('terminal_skills', {count: 8})})</span></p>
                    <p className="text-zinc-500">  <span className="text-zinc-600">&#9675;</span> vue3-standard <span className="text-zinc-600">({t('terminal_skills', {count: 5})})</span></p>
                    <p className="text-zinc-500">  <span className="text-zinc-600">&#9675;</span> builderx_spa <span className="text-zinc-600">({t('terminal_skills', {count: 6})})</span></p>
                  </div>
                  <div className="pt-2 space-y-1">
                    <p className="text-emerald-400">&#10003; {t('terminal_installed', {count: 17})}</p>
                    <p className="text-zinc-500">{t('terminal_path')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Works with */}
        <section className="py-12 border-y border-white/[0.04]">
          <div className="container mx-auto px-4 sm:px-6">
            <p className="text-center text-xs font-medium text-zinc-500 uppercase tracking-widest mb-6">{t('works_with')}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {aiTools.map((tool) => (
                <span key={tool} className="text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors cursor-default">{tool}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: "299+", label: t('stats_skills') },
                { value: "7+", label: t('stats_collections') },
                { value: "20+", label: t('stats_frameworks') },
                { value: "6+", label: t('stats_ai_tools') },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl lg:text-4xl font-extrabold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-sm font-medium text-cyan-400 mb-3 tracking-wide">{t('why_devskill_label')}</p>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">{t('why_devskill')}</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">{t('why_devskill_desc')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {[
                { icon: Zap, title: f('onboarding.title'), desc: f('onboarding.desc'), color: "cyan" },
                { icon: Shield, title: f('accuracy.title'), desc: f('accuracy.desc'), color: "rose" },
                { icon: RefreshCw, title: f('frictionless.title'), desc: f('frictionless.desc'), color: "emerald" },
              ].map((feature) => {
                const c = feature.color;
                return (
                  <div key={feature.title} className="group p-6 rounded-xl bg-zinc-900/50 border border-white/[0.06] hover:border-white/[0.12] hover:bg-zinc-900/80 transition-all duration-300">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c === 'cyan' ? 'from-cyan-400/15 to-cyan-400/5' : c === 'rose' ? 'from-rose-500/15 to-rose-500/5' : 'from-emerald-400/15 to-emerald-400/5'} flex items-center justify-center mb-4 border ${c === 'cyan' ? 'border-cyan-400/20' : c === 'rose' ? 'border-rose-500/20' : 'border-emerald-400/20'}`}>
                      <feature.icon className={`w-5 h-5 ${c === 'cyan' ? 'text-cyan-400' : c === 'rose' ? 'text-rose-400' : 'text-emerald-400'}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 lg:py-28 border-t border-white/[0.04]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-sm font-medium text-rose-400 mb-3 tracking-wide">{t('how_it_works_label')}</p>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">{t('how_it_works')}</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">{t('how_it_works_desc')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { step: "01", icon: Terminal, title: t('step1_title'), desc: t('step1_desc') },
                { step: "02", icon: Package, title: t('step2_title'), desc: t('step2_desc') },
                { step: "03", icon: Sparkles, title: t('step3_title'), desc: t('step3_desc') },
              ].map((item, i) => (
                <div key={item.step} className="relative text-center p-6">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-12 right-0 translate-x-1/2 z-10">
                      <ChevronRight className="w-5 h-5 text-zinc-700" />
                    </div>
                  )}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 border border-white/[0.08] mb-4">
                    <item.icon className="w-5 h-5 text-zinc-300" />
                  </div>
                  <div className="text-[10px] font-mono text-zinc-600 mb-2 tracking-widest">{t('step_label')} {item.step}</div>
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Collections */}
        <section id="collections" className="py-20 lg:py-28 border-t border-white/[0.04]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-sm font-medium text-emerald-400 mb-3 tracking-wide">{t('collections_label')}</p>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">{t('collections')}</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">{t('collections_desc')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {collections.map((col) => {
                const c = colorMap[col.color];
                return (
                  <div key={col.name} className={`group p-5 rounded-xl bg-zinc-900/50 border ${c.border} ${c.shadow} hover:shadow-lg transition-all duration-300`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.icon} flex items-center justify-center shrink-0 border border-white/[0.06]`}>
                        <col.icon className={`w-5 h-5 ${c.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-white">{col.name}</h3>
                          <span className={`text-[11px] font-mono ${c.text}`}>{col.skills.length} skills</span>
                        </div>
                        <p className="text-sm text-zinc-500 mb-3">{t(col.desc)}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {col.skills.slice(0, 4).map((skill) => (
                            <span key={skill} className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono border ${c.badge}`}>
                              {skill}
                            </span>
                          ))}
                          {col.skills.length > 4 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono text-zinc-500 bg-zinc-800/50 border border-white/[0.06]">
                              +{col.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section id="architecture" className="py-20 lg:py-28 border-t border-white/[0.04]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-sm font-medium text-amber-400 mb-3 tracking-wide">{t('architecture_label')}</p>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">{t('architecture_title')}</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">{t('architecture_desc')}</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {/* Manual skills */}
              <div className="flex items-start gap-4 p-5 rounded-xl bg-zinc-900/50 border border-white/[0.06]">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400/15 to-cyan-400/5 flex items-center justify-center shrink-0 border border-cyan-400/20">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{t('arch_manual_title')}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{t('arch_manual_desc')}</p>
                </div>
              </div>

              {/* Sources */}
              <div className="flex items-start gap-4 p-5 rounded-xl bg-zinc-900/50 border border-white/[0.06]">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/15 to-rose-500/5 flex items-center justify-center shrink-0 border border-rose-500/20">
                  <Database className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{t('sources_title')}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{t('sources_desc')}</p>
                </div>
              </div>

              {/* Vendor */}
              <div className="flex items-start gap-4 p-5 rounded-xl bg-zinc-900/50 border border-white/[0.06]">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400/15 to-emerald-400/5 flex items-center justify-center shrink-0 border border-emerald-400/20">
                  <GitFork className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{t('vendor_title')}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{t('vendor_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 border-t border-white/[0.04]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4">{t('contribute_title')}</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">{t('contribute_desc')}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://github.com/vuluu2k/skills"
                  target="_blank"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl font-semibold text-sm bg-white text-zinc-950 hover:bg-zinc-100 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  {h('cta')}
                </a>
                <a
                  href="https://github.com/vuluu2k/skills/issues"
                  target="_blank"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl font-semibold text-sm bg-zinc-900 text-white hover:bg-zinc-800 border border-white/[0.08] transition-colors"
                >
                  {t('contribute_cta_issue')}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-400 to-rose-500 flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-zinc-400">devskill</span>
            </div>
            <p className="text-xs text-zinc-600">{t('footer')}</p>
            <div className="flex items-center gap-5 text-xs text-zinc-500">
              <a href="https://github.com/vuluu2k/skills" target="_blank" className="hover:text-zinc-300 transition-colors">GitHub</a>
              <a href="https://github.com/vuluu2k/skills/issues" target="_blank" className="hover:text-zinc-300 transition-colors">Issues</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
