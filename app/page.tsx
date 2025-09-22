"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Facebook, Twitter, Instagram, Linkedin, Trophy, Target, Users, Star, Menu, Eye, Zap, BarChart3, Clock, Shield, CheckCircle, PlayCircle, Sparkles, Brain, Cpu } from "lucide-react"
import { motion, Variants, Variant, Transition } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, ReactNode, useState, useEffect } from "react"
import { useMobile } from "../hooks/use-mobile"
import { ContactForm } from "@/components/contact-form"

// Animation variants
const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      duration: 0.8,
      bounce: 0.3
    }
  }
}

const staggerContainer: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      type: "tween"
    }
  }
}

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function BackgroundVideo() {
  const isMobile = useMobile()
  
  const videoUrl = isMobile 
    ? "/desktop.mp4"
    : "/desktop.mp4"

  return (
    <video 
      src={videoUrl}
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover"
    >
      Your browser does not support the video tag.
    </video>
  )
}

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-black relative overflow-hidden antialiased">
      
      {/* Navigation */}
              <nav className={`fixed z-50 transition-all duration-300 ease-in-out ${
          isScrolled 
            ? 'top-3 left-3 right-3 md:top-6 md:left-6 md:right-6 px-4 py-1.5 md:px-6 md:py-2 bg-black/60 rounded-2xl shadow-2xl backdrop-blur-md border border-black/100' 
            : 'top-0 left-0 right-0 px-4 py-3 md:px-6 md:py-5 bg-black/80 backdrop-blur-md border-b border-white/10'
        }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
              <img 
                src="/logo.jpg"
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            {!isScrolled && (
              <span className="text-white text-lg md:text-xl font-bold tracking-wide">Thinking Engines</span>
            )}
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 tracking-wide">
              Home
            </a>
            <a href="#about" className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 tracking-wide">
              About Us
            </a>
            <a href="#services" className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 tracking-wide">
              Services
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <ContactForm />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-300 ${
        isScrolled ? 'pt-20 md:pt-0' : 'pt-16 md:pt-20'
      }`}>
        {/* Hero Background Video with Dark Overlay */}
        <div className="absolute inset-0">
          <BackgroundVideo />
          {/* Strong dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-6 text-center">
          {/* Main Hero Content */}
          <div className="space-y-8 md:space-y-10">
            {/* Hero Title */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-6 md:space-y-8"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] sm:leading-[0.88] md:leading-[0.86] text-white tracking-[-0.01em] sm:tracking-[-0.02em] md:tracking-[-0.03em] font-display">
                We Empower<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-gray-200 font-light">
                  World's Passion
                </span><br />
                <span className="font-black">For Football</span>
              </h1>
            </motion.div>

            {/* Hero Description */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="space-y-6 md:space-y-8"
            >
              
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto px-6"
            >
             
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="pt-6 md:pt-8"
            >
              
                
            </motion.div>
          </div>
        </div>

        
      </section>

      {/* Gradient Transition */}
      <div className="relative z-10 w-full h-32 bg-gradient-to-b from-black via-gray-900 to-white"></div>

      {/* Products Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        id="services"
        className="relative z-10 px-4 md:px-6 py-16 md:py-24 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header with angled background */}
          <div className="relative mb-16 md:mb-20">
            <div className="flex justify-end">
              <div className="relative">
                <div className="bg-black text-white px-7 py-2.5 md:px-10 md:py-5 lg:px-16 lg:py-5 font-black text-2xl md:text-3xl lg:text-4xl tracking-tight"
                     style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
                  Our Services
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-16 md:space-y-24">
            {/* VISION+ - Text First on Mobile, Image Left on Desktop */}
            <AnimatedSection>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Content - First on mobile, second on desktop */}
                <div className="space-y-6 md:order-2">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-black tracking-tight font-display">
                    PreView 
                  </h3>
                  <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-light font-body mb-6">
                  An advanced AI-based system that automates critical decisions like goals, offsides, handballs, and fouls with precision and speed to help referees with faster & accurate decision making.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold text-black mb-2 font-display">Real-Time Analysis:</h4>
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed font-body">
                        AI processes player movement, ball dynamics and contact points to identify fouls, potential red and cards, penalties, and other crucial moments.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold text-black mb-2 font-display">Referee Alerts:</h4>
                      <p className="text-gray-600 text-base md:text-lg leading-relaxed font-body">
                        Alerts and insights are provided to referees via handheld devices or wearable tech for faster decision-making and more accurate calls.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Image - Second on mobile, first on desktop */}
                <motion.div 
                  className="relative overflow-hidden rounded-3xl shadow-2xl md:order-1"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="relative"
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "0%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <div className="bg-white aspect-[4/3]">
                      <img 
                        src="/tracking.jpg" 
                        alt="PostMatch Analytics" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Sweep overlay effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>
            </AnimatedSection>

            {/* PostMatch - Text Left, Image Right */}
            <AnimatedSection>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Content */}
                <div className="space-y-6 md:order-1">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-black tracking-tight font-display">
                    PostMatch 
                  </h3>
                  <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-light font-body mb-6">
                  PostMatch is our state of the art AI Technology which analyzes complete matches & creates custom datasets for each team & each player about their performances.
                  </p>
                  
                  
                </div>
                
                {/* Image */}
                <motion.div 
                  className="relative md:order-2 overflow-hidden rounded-3xl shadow-2xl"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="relative"
                    initial={{ x: "100%" }}
                    whileInView={{ x: "0%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <div className="bg-white aspect-[4/3]">
                      <img 
                        src="/PostMatch.png" 
                        alt="PostMatch Analytics" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Sweep overlay effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "100%" }}
                    whileInView={{ x: "-100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        id="about"
        className="relative z-10 px-4 md:px-6 py-16 md:py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left - About content */}
            <AnimatedSection className="space-y-6 md:space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
                About Thinking Engines
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed font-light">
              Thinking Engines empowers the passion of 3.5 billion football fans through AI — enabling players and coaches to analyze and interact with individual and team data via PostMatch, while helping referees make faster, more accurate real time decisions with PreView.
              </p>
              
              {/* Key features */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium text-lg">Real-Time Foul Detection</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-600 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium text-lg">Complete Match Performance Analytics</span>
                </div>
              </div>
            </AnimatedSection>

            
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <AnimatedSection className="relative z-10 px-4 md:px-6 py-16 md:py-24 bg-gray-50 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/playerrun.jpg" 
            alt="Player Running" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70"></div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-black text-white mb-6 md:mb-8 tracking-tight leading-tight">
            Ready to Transform<br/>Football?
          </h2>
          <p className="text-base md:text-xl text-white/90 mb-8 md:mb-12 leading-relaxed font-light max-w-3xl mx-auto px-2">
            Join the revolution in sports analytics and help referees make better decisions with our AI-powered insights and real-time match analysis.
          </p>
          <div className="flex justify-center">
            <ContactForm />
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="relative z-10 px-4 md:px-6 py-12 md:py-16 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center">
            <div className="text-gray-400 text-center">
              <p className="text-base md:text-lg">© 2025 Thinking Engines Pvt Ltd. All rights reserved.</p>
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

