/**
 * 𓂀 ENTERPRISE LANDING PAGE 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Deep Tech Enterprise Landing - Interactive, Beautiful, Professional
 * 
 * "Make it nice and deep tech. Make it nice. Make it nice and deep tech."
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const LANDING_CONFIG = {
  brand: {
    name: 'Medina Memory Systems',
    tagline: 'Deep Tech Memory Infrastructure',
    subtagline: 'This is deeper than what you know. This is deeper than what you think it is.',
  },
  
  hero: {
    headline: 'Memory That Understands',
    subheadline: 'Enterprise-grade cognitive infrastructure for the next generation of intelligent applications.',
    ctaPrimary: 'Deploy Now',
    ctaSecondary: 'View Research',
  },
  
  products: [
    {
      name: 'Memory Vault',
      description: 'Secure, intelligent memory storage that grows with you.',
      icon: '🗄️',
      frequency: 528,
    },
    {
      name: 'Document Intelligence',
      description: 'Transform documents into intelligent, searchable knowledge.',
      icon: '📄',
      frequency: 639,
    },
    {
      name: 'Knowledge Graph',
      description: 'Build living knowledge graphs that evolve with understanding.',
      icon: '🕸️',
      frequency: 741,
    },
    {
      name: 'Semantic Search',
      description: 'Search by meaning, not just keywords.',
      icon: '🔍',
      frequency: 852,
    },
    {
      name: 'Context Engine',
      description: 'Build applications that truly understand context.',
      icon: '🎯',
      frequency: 396,
    },
    {
      name: 'Pattern Recognition',
      description: 'Discover hidden patterns in any data.',
      icon: '🔮',
      frequency: 417,
    },
    {
      name: 'Temporal Memory',
      description: 'Memory that understands time.',
      icon: '⏳',
      frequency: 432,
    },
    {
      name: 'Sacred Geometry',
      description: 'Mathematical harmony for modern computing.',
      icon: '🔯',
      frequency: 963,
    },
    {
      name: 'Frequency Alignment',
      description: 'Optimize performance through harmonic principles.',
      icon: '🎵',
      frequency: 7.83,
    },
    {
      name: 'Organism Sync',
      description: 'Distributed state management that just works.',
      icon: '🔄',
      frequency: 136.1,
    },
  ],
  
  features: [
    {
      title: 'Instant Scale',
      description: 'From one user to millions. Our architecture scales infinitely.',
      icon: '📈',
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-grade encryption. SOC 2 compliant. GDPR ready.',
      icon: '🔒',
    },
    {
      title: 'ICP Native',
      description: 'Built on the Internet Computer for true decentralization.',
      icon: '🌐',
    },
    {
      title: 'API First',
      description: 'RESTful APIs that integrate with any stack.',
      icon: '⚡',
    },
  ],
  
  enterprise: {
    title: 'Enterprise Solutions',
    description: 'Custom deployments, dedicated support, and advanced features for organizations.',
    features: [
      'Dedicated infrastructure',
      'Custom integrations',
      '24/7 support',
      'SLA guarantees',
      'On-premise option',
      'Custom training',
    ],
    cta: 'Contact Enterprise',
  },
  
  research: {
    title: 'Research & Publications',
    description: 'Explore our academic research and technical publications.',
    cta: 'View Research Blog',
  },
  
  footer: {
    company: '© 2024 Medina Memory Systems. All rights reserved.',
    links: [
      { text: 'Privacy', href: '/privacy' },
      { text: 'Terms', href: '/terms' },
      { text: 'Security', href: '/security' },
      { text: 'Enterprise', href: '/enterprise' },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function LandingPage() {
  const config = LANDING_CONFIG;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-sm border-b border-gold-500/20 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">𓂀</span>
            <span className="font-bold text-xl text-gold-400">{config.brand.name}</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#products" className="text-gray-300 hover:text-white transition">Products</a>
            <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
            <a href="#enterprise" className="text-gray-300 hover:text-white transition">Enterprise</a>
            <a href="/blog" className="text-gray-300 hover:text-white transition">Research</a>
            <button className="bg-gold-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-gold-400 transition">
              {config.hero.ctaPrimary}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
            {config.hero.headline}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto">
            {config.hero.subheadline}
          </p>
          <p className="text-lg text-gray-500 italic mb-12 max-w-2xl mx-auto">
            {config.brand.subtagline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-gold-500 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gold-400 transition transform hover:scale-105">
              🚀 {config.hero.ctaPrimary}
            </button>
            <button className="border border-gold-500/50 text-gold-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-500/10 transition">
              📚 {config.hero.ctaSecondary}
            </button>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section id="products" className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">10 Enterprise Products</h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Full-scale SaaS solutions that integrate with any stack, at any scale.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {config.products.map((product, i) => (
              <div 
                key={i}
                className="bg-gray-800/50 border border-gold-500/20 rounded-xl p-6 hover:border-gold-500/50 transition transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{product.icon}</div>
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Medina</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {config.features.map((feature, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Enterprise Section */}
      <section id="enterprise" className="py-20 px-6 bg-gradient-to-r from-gold-900/20 to-gold-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">{config.enterprise.title}</h2>
              <p className="text-gray-400 mb-8">{config.enterprise.description}</p>
              <ul className="space-y-3 mb-8">
                {config.enterprise.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <span className="text-gold-500 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="bg-gold-500 text-black px-8 py-4 rounded-lg font-bold hover:bg-gold-400 transition">
                {config.enterprise.cta}
              </button>
            </div>
            <div className="bg-gray-800/50 border border-gold-500/20 rounded-xl p-8">
              <div className="text-6xl text-center mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-center mb-2">Enterprise Ready</h3>
              <p className="text-gray-400 text-center">
                Trusted by leading organizations worldwide for mission-critical applications.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Research CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">{config.research.title}</h2>
          <p className="text-gray-400 mb-8">{config.research.description}</p>
          <a 
            href="/blog"
            className="inline-block border border-gold-500/50 text-gold-400 px-8 py-4 rounded-lg font-semibold hover:bg-gold-500/10 transition"
          >
            📚 {config.research.cta}
          </a>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gold-500/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-xl">𓂀</span>
            <span className="text-gray-400">{config.footer.company}</span>
          </div>
          <div className="flex space-x-6">
            {config.footer.links.map((link, i) => (
              <a key={i} href={link.href} className="text-gray-400 hover:text-white transition">
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
