import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { Portfolio } from './components/Portfolio';
import { About } from './components/About';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  useEffect(() => {
    // Set document title and meta tags
    document.title = 'RedArtMotion - Video Editing & Motion Design Studio | Expert Video Production';

    // Update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Primary Meta Tags
    updateMeta('description', 'RedArtMotion, professional video editing and motion design studio. Complete services: video editing, motion design, color grading, audio mixing for SaaS, Tech, Coaches, and YouTubers.');
    updateMeta('keywords', 'video editing, motion design, color grading, audio mixing, storyboard, animation, explainer video, video production, SaaS, Tech, YouTubers, RedArtMotion');
    updateMeta('author', 'RedArtMotion');
    updateMeta('robots', 'index, follow');

    // Open Graph
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', 'https://redartmotion.com/', true);
    updateMeta('og:title', 'RedArtMotion - Video Editing & Motion Design Studio', true);
    updateMeta('og:description', 'Professional video editing and motion design studio. Transform your ideas into impactful videos with our complete production services.', true);
    updateMeta('og:locale', 'en_US', true);

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', 'RedArtMotion - Video Editing & Motion Design Studio');
    updateMeta('twitter:description', 'Professional video editing and motion design studio. Complete services for content creators and innovative companies.');

    // Mobile
    updateMeta('theme-color', '#09090b');
    updateMeta('mobile-web-app-capable', 'yes');
    updateMeta('apple-mobile-web-app-capable', 'yes');
    updateMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');

    // Structured Data
    const structuredDataBusiness = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "RedArtMotion",
      "description": "Professional video editing and motion design studio",
      "url": "https://redartmotion.com",
      "telephone": "+33 7 54 00 01 42",
      "email": "redartmotion@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "DZ"
      },
      "sameAs": [
        "https://www.instagram.com/redart_motion/"
      ],
      "priceRange": "$$",
      "serviceType": ["Short Form", "Motion Design", "Color Grading", "Audio Mixing", "Video Production"]
    };

    const structuredDataOrg = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "RedArtMotion",
      "url": "https://redartmotion.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+33 7 54 00 01 42",
        "contactType": "customer service",
        "email": "redartmotion@gmail.com",
        "availableLanguage": ["English", "French", "Arabic"]
      },
      "sameAs": [
        "https://www.instagram.com/redart_motion/"
      ]
    };

    // Add or update structured data scripts
    let scriptBusiness = document.querySelector('script[data-schema="business"]');
    if (!scriptBusiness) {
      scriptBusiness = document.createElement('script');
      scriptBusiness.setAttribute('type', 'application/ld+json');
      scriptBusiness.setAttribute('data-schema', 'business');
      document.head.appendChild(scriptBusiness);
    }
    scriptBusiness.textContent = JSON.stringify(structuredDataBusiness);

    let scriptOrg = document.querySelector('script[data-schema="organization"]');
    if (!scriptOrg) {
      scriptOrg = document.createElement('script');
      scriptOrg.setAttribute('type', 'application/ld+json');
      scriptOrg.setAttribute('data-schema', 'organization');
      document.head.appendChild(scriptOrg);
    }
    scriptOrg.textContent = JSON.stringify(structuredDataOrg);

  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminPanel />
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <Portfolio />
      <About />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}