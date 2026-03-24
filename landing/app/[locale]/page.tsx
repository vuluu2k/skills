import {useTranslations} from 'next-intl';
import {Link} from '../../i18n/routing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, Zap, Target, Boxes, Code2, Sparkles, CheckCircle2, Database } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import * as motion from "framer-motion/client";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export default function LandingPage() {
  const t = useTranslations('Index');
  const h = useTranslations('Hero');
  const f = useTranslations('Features');

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50 selection:bg-rose-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] pointer-events-none -z-10" />
      <div className="fixed top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-rose-500/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/60 backdrop-blur-2xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:shadow-cyan-400/40 transition-all duration-300">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-200">devskill</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <a href="#features" className="hover:text-rose-400 transition-colors">{t('why_devskill')}</a>
            <a href="#installation" className="hover:text-cyan-400 transition-colors">{t('installation')}</a>
            <a href="#collections" className="hover:text-rose-400 transition-colors">{t('collections')}</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex bg-zinc-900/80 rounded-full p-1 border border-white/10 backdrop-blur-md">
              <Link href="/" locale="en" className="px-3 py-1 text-xs rounded-full hover:bg-white/10 transition-colors font-medium">EN</Link>
              <Link href="/" locale="vi" className="px-3 py-1 text-xs rounded-full hover:bg-white/10 transition-colors font-medium">VN</Link>
            </div>
            <a 
              href="https://github.com/vuluu2k/skills" 
              target="_blank" 
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent size-8 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-32 lg:pt-40">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-40 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-rose-500/5 to-cyan-400/5 rounded-full blur-[120px] -z-10" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <Badge variant="outline" className="mb-8 border-rose-500/30 bg-rose-500/10 text-rose-300 px-5 py-2 font-medium tracking-wide">
              {h('badge')}
            </Badge>
            <h1 className="text-6xl md:text-8xl font-extrabold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-500 pb-2">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-12 leading-relaxed text-balance font-light">
              {t('subtitle')}
            </p>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed text-balance">
              {h('description')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto sm:max-w-none">
              <a 
                href="https://github.com/vuluu2k/skills"
                target="_blank"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 h-14 rounded-2xl group shadow-lg shadow-rose-500/25 transition-all text-base font-bold bg-white text-zinc-950 hover:bg-zinc-200"
              >
                {h('cta')}
                <GithubIcon className="ml-3 w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <div className="w-full sm:w-auto flex items-center justify-between gap-3 bg-zinc-900/80 border border-white/10 px-5 h-14 rounded-2xl text-sm font-mono text-zinc-200 backdrop-blur-md shadow-inner">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <span className="tracking-tight font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-rose-400">{h('install_cmd')}</span>
                </div>
                <CopyButton value="npx devskill" variant="ghost" className="h-8 w-8 hover:bg-white/10 text-zinc-400 hover:text-white -mr-2" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 mb-40 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">{t('why_devskill')}</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-cyan-400 to-rose-500 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <Card className="bg-zinc-900/70 border-white/10 shadow-xl shadow-black/50 backdrop-blur-xl hover:bg-zinc-900/90 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-400/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-32 bg-cyan-400/5 rounded-full blur-[80px] -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
              <CardHeader className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-cyan-400/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-cyan-400/20">
                  <Zap className="w-7 h-7 text-cyan-400" />
                </div>
                <CardTitle className="text-2xl text-white font-bold tracking-tight">{f('onboarding.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-zinc-300 leading-relaxed text-base">{f('onboarding.desc')}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-900/70 border-white/10 shadow-xl shadow-black/50 backdrop-blur-xl hover:bg-zinc-900/90 hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-32 bg-rose-500/5 rounded-full blur-[80px] -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
              <CardHeader className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-rose-500/20">
                  <Target className="w-7 h-7 text-rose-400" />
                </div>
                <CardTitle className="text-2xl text-white font-bold tracking-tight">{f('accuracy.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-zinc-300 leading-relaxed text-base">{f('accuracy.desc')}</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/70 border-white/10 shadow-xl shadow-black/50 backdrop-blur-xl hover:bg-zinc-900/90 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-[80px] -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
              <CardHeader className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-purple-500/20">
                  <Sparkles className="w-7 h-7 text-purple-400" />
                </div>
                <CardTitle className="text-2xl text-white font-bold tracking-tight">{f('frictionless.title')}</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-zinc-300 leading-relaxed text-base">{f('frictionless.desc')}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Big Terminal Installation Section */}
        <section id="installation" className="container mx-auto px-4 mb-40">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-100 to-white">{t('installation')}</h2>
              <p className="text-xl text-zinc-400">Launch the interactive CLI to select your skills.</p>
            </div>
            
            {/* Window frame */}
            <div className="rounded-2xl overflow-hidden bg-black/80 border border-white/10 shadow-2xl shadow-rose-500/10 backdrop-blur-xl">
              {/* Window header */}
              <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="mx-auto flex items-center gap-2 text-xs text-zinc-400 font-mono">
                  <Terminal className="w-3 h-3" />
                  bash - devskill CLI
                </div>
              </div>
              
              {/* Terminal body */}
              <div className="p-6 md:p-8 font-mono text-sm md:text-base leading-loose overflow-x-auto relative group">
                <div className="flex items-center justify-between">
                  <p className="text-zinc-400 italic mb-2"># Khởi chạy CLI thiết lập tương tác (Interactive Mode)</p>
                  <CopyButton value="npx devskill" className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/5" />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-rose-500">➜</span>
                  <span className="text-cyan-400">~</span>
                  <span className="text-white font-bold tracking-wider">npx devskill</span>
                </div>
                <div className="mt-6 border-l-2 border-white/10 pl-4 py-2 space-y-2 text-zinc-300">
                  <p className="text-cyan-400 font-bold">? Select the skills you want to install:</p>
                  <p className="text-zinc-400">❯ ◉ builderx_api</p>
                  <p className="text-zinc-400">  ◉ builderx_spa</p>
                  <p className="text-zinc-400">  ◯ basic_react</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-zinc-300 text-sm font-medium">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                No Globals Needed
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                One-Click Interactive
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                Instant Setup
              </div>
            </div>
          </div>
        </section>

        {/* Collections Cards Grid Section */}
        <section id="collections" className="container mx-auto px-4 mb-40">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">{t('collections')}</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-cyan-400 to-rose-500 mx-auto rounded-full mb-6" />
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">Discover our highly curated skill collections designed for specific tech stacks.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Card 1 */}
            <Card className="bg-zinc-900/80 border-white/20 shadow-xl shadow-black/50 backdrop-blur-md hover:bg-zinc-800 hover:border-cyan-400/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-300 flex flex-col h-full group">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-400/10 text-cyan-400 rounded-xl flex items-center justify-center mb-4 border border-cyan-400/20 group-hover:scale-110 transition-transform">
                  <Boxes className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl text-white">🏗️ builderx_spa</CardTitle>
                <CardDescription className="text-zinc-400 mt-2">Specialized architecture rules for building modern Single Page Applications.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-zinc-800/80 text-cyan-300 hover:bg-zinc-800 border border-cyan-400/20">vue-options</Badge>
                  <Badge variant="secondary" className="bg-zinc-800/80 text-cyan-300 hover:bg-zinc-800 border border-cyan-400/20">pinia-options</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="bg-zinc-900/80 border-white/20 shadow-xl shadow-black/50 backdrop-blur-md hover:bg-zinc-800 hover:border-rose-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-300 flex flex-col h-full group">
              <CardHeader>
                <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center mb-4 border border-rose-500/20 group-hover:scale-110 transition-transform">
                  <Database className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl text-white">⚙️ builderx_api</CardTitle>
                <CardDescription className="text-zinc-400 mt-2">Strict guidelines for robust Phoenix Elixir backend development and Ecto rules.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-zinc-800/80 text-rose-300 hover:bg-zinc-800 border border-rose-500/20">api-schemas</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="bg-zinc-900/80 border-white/20 shadow-xl shadow-black/50 backdrop-blur-md hover:bg-zinc-800 hover:border-purple-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 flex flex-col h-full group">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-4 border border-purple-500/20 group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl text-white">🌟 vue3-standard</CardTitle>
                <CardDescription className="text-zinc-400 mt-2">Pure Vue 3 Mastery. Learn the best practices for standard modern applications.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-zinc-800/80 text-purple-300 hover:bg-zinc-800 border border-purple-500/20">vue</Badge>
                  <Badge variant="secondary" className="bg-zinc-800/80 text-purple-300 hover:bg-zinc-800 border border-purple-500/20">pinia</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 bg-zinc-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold opacity-70">
            <Zap className="w-5 h-5 text-rose-500" />
            <span className="text-white tracking-wide">devskill</span>
          </div>
          <p className="text-zinc-300 text-sm">{t('footer')}</p>
          <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-rose-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-rose-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
