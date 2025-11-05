import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Target, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import gsap from 'gsap';
import SakuraParticles from '@/components/SakuraParticles';
const Landing = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated
  } = useStore();
  useEffect(() => {
    // Hero animation
    gsap.fromTo('.hero-content', {
      opacity: 0,
      y: 50
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      stagger: 0.2
    });

    // Feature cards animation
    gsap.fromTo('.feature-card', {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 80%'
      }
    });
  }, []);
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/app/dashboard');
    } else {
      navigate('/auth');
    }
  };
  const features = [{
    icon: BookOpen,
    title: 'Interactive Learning',
    description: 'Master Japanese through engaging flashcards, vocabulary lists, and interactive exercises.'
  }, {
    icon: Target,
    title: 'Track Progress',
    description: 'Monitor your learning journey with detailed statistics and achievement milestones.'
  }, {
    icon: TrendingUp,
    title: 'Build Streaks',
    description: 'Stay motivated with daily streaks and earn XP as you progress through lessons.'
  }, {
    icon: Users,
    title: 'Community Driven',
    description: 'Join thousands of learners on their Japanese language learning adventure.'
  }];
  return <div className="min-h-screen gradient-bg relative overflow-hidden">
      <SakuraParticles />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
              <span className="text-2xl font-bold japanese-text text-red-500">日</span>
            </div>
            <span className="text-2xl font-bold font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              NihonLab
            </span>
          </div>
          <Button onClick={() => navigate('/auth')} variant="outline">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div className="hero-content" initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }}>
            <h1 className="text-5xl md:text-7xl font-heading font-bold bg-gradient-to-r from-primary via-orange-primary to-orange-secondary bg-clip-text text-transparent mb-6">
              Master Japanese with
              <br />
              Elegance and Calm
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Learn Japanese vocabulary, grammar, and kanji through interactive flashcards and gamified lessons. Track your progress and build daily streaks.
            </p>
            <Button onClick={handleGetStarted} size="lg" className="hero-content bg-gradient-hero hover:opacity-90 text-white text-lg px-8 py-6 rounded-xl shadow-glow transition-all hover:scale-105 group">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Japanese Characters Decoration */}
          <div className="hero-content flex justify-center gap-4 text-6xl opacity-20 font-japanese">
            <span>日</span>
            <span>本</span>
            <span>語</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Everything You Need to Learn
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful tools to accelerate your Japanese learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
          const Icon = feature.icon;
          return <motion.div key={index} className="feature-card bg-card rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-border" whileHover={{
            scale: 1.02
          }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4 shadow-glow">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>;
        })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-hero rounded-3xl p-12 md:p-20 text-center shadow-glow">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-zinc-700">
            Start Your Journey Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-zinc-700">
            Join thousands of learners mastering Japanese with NihonLab
          </p>
          <Button onClick={handleGetStarted} size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-xl transition-all hover:scale-105">
            Begin Learning Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 NihonLab. Master Japanese with Motion and Fun.</p>
        </div>
      </footer>
    </div>;
};
export default Landing;