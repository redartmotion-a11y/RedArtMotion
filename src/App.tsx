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
    document.title = 'RedArtMotion - Studio de Montage Vidéo & Motion Design | Expert en Production Vidéo';

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
    updateMeta('description', 'RedArtMotion, studio professionnel de montage vidéo et motion design basé en Algérie. Services complets : montage vidéo, motion design, color grading, mixage audio pour SaaS, Tech, Coaches et YouTubers.');
    updateMeta('keywords', 'montage vidéo, motion design, color grading, mixage audio, storyboard, animation, vidéo explicative, production vidéo, SaaS, Tech, YouTubers, Algérie, RedArtMotion');
    updateMeta('author', 'RedArtMotion');
    updateMeta('robots', 'index, follow');

    // Open Graph
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', 'https://redartmotion.com/', true);
    updateMeta('og:title', 'RedArtMotion - Studio de Montage Vidéo & Motion Design', true);
    updateMeta('og:description', 'Studio professionnel de montage vidéo et motion design. Transformez vos idées en vidéos percutantes avec nos services complets de production vidéo.', true);
    updateMeta('og:locale', 'fr_FR', true);

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', 'RedArtMotion - Studio de Montage Vidéo & Motion Design');
    updateMeta('twitter:description', 'Studio professionnel de montage vidéo et motion design. Services complets pour créateurs de contenu et entreprises innovantes.');

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
      "description": "Studio de montage vidéo et motion design professionnel",
      "url": "https://redartmotion.com",
      "telephone": "+33754000142",
      "email": "redartmotion@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "DZ"
      },
      "sameAs": [
        "https://www.instagram.com/redart.vfx/"
      ],
      "priceRange": "$$",
      "serviceType": ["Video Editing", "Motion Design", "Color Grading", "Audio Mixing", "Video Production"]
    };

    const structuredDataOrg = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "RedArtMotion",
      "url": "https://redartmotion.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+33754000142",
        "contactType": "customer service",
        "email": "redartmotion@gmail.com",
        "availableLanguage": ["French", "Arabic", "English"]
      },
      "sameAs": [
        "https://www.instagram.com/redart.vfx/"
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