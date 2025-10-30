import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

const ResultsPage = ({ answers, onStartOver }) => {
  // Scroll to top when results page mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Get form data from localStorage
  const getFormData = () => {
    try {
      const data = localStorage.getItem('formData')
      return data ? JSON.parse(data) : {}
    } catch {
      return {}
    }
  }

  const formData = getFormData()
  
  // --- NEW: get a nice-looking first name (first token, title-cased) ---
  const formatName = (raw = '') => {
    const token = String(raw).trim().split(/\s+/)[0] || ''      // take first word only
    return token
      .toLowerCase()
      .replace(/^[a-z]/, c => c.toUpperCase())                  // Title-case first letter
  }
  const firstName = formatName(formData.firstName)

  // Score and tag providers based on form data
  const getScoredAndTaggedProviders = () => {
    if (!formData || Object.keys(formData).length === 0) {
      // If no form data, show providers with mixed tags
      return allProviders.map((provider, index) => ({
        ...provider,
        score: index < 3 ? 2 : 1,
        tag: index < 3 ? 'Best Match' : index < 6 ? 'Recommended' : 'You May Also Like'
      }))
    }

    const { assets = [], debtTypes = [], debtAmount = '' } = formData
    
    // Helper function to get debt amount numeric value
    const getDebtAmountValue = (debtAmount) => {
      if (!debtAmount) return 0
      if (debtAmount === '0-4999') return 2500
      if (debtAmount === '100000+') return 100000
      const [min, max] = debtAmount.split('-').map(Number)
      return (min + max) / 2
    }
    
    const debtAmountValue = getDebtAmountValue(debtAmount)
    
    // Score providers based on relevance
    const scoredProviders = allProviders.map(provider => {
      let score = 0
      let reasons = []
      
      // HIGH PRIORITY SCORING (Best Match candidates)
      
      // 1. Debt Relief - Always high priority for debt protection
      if (provider.category === 'debt-relief') {
        score += 8 // Base high score for debt relief
        reasons.push('Debt relief specialist')
        
        // Boost for significant debt amounts
        if (debtAmountValue >= 10000) {
          score += 3
          reasons.push('High debt amount - debt relief recommended')
        } else if (debtAmountValue >= 5000) {
          score += 2
          reasons.push('Moderate debt amount')
        }
      }
      
      // 2. Auto Insurance - High priority if user has car or auto loans
      if (provider.category === 'auto-insurance') {
        if (assets.includes('car')) {
          score += 6
          reasons.push('Car owner - auto insurance needed')
        }
        if (debtTypes.includes('auto-loans')) {
          score += 5
          reasons.push('Has auto loans - insurance protection important')
        }
        if (assets.includes('car') && debtTypes.includes('auto-loans')) {
          score += 2 // Bonus for both
          reasons.push('Car owner with auto loans')
        }
      }
      
      // 3. Home-related services - High priority for property owners
      if (['home-warranty', 'home-improvement', 'home-security', 'solar'].includes(provider.category)) {
        if (assets.includes('house') || assets.includes('land-property')) {
          score += 6
          reasons.push('Property owner - home services relevant')
          
          // Specific home service matching
          if (provider.category === 'home-warranty' && assets.includes('house')) {
            score += 2
            reasons.push('Home warranty for house owner')
          }
          if (provider.category === 'home-security' && assets.includes('house')) {
            score += 2
            reasons.push('Home security for house owner')
          }
          if (provider.category === 'solar' && assets.includes('house')) {
            score += 2
            reasons.push('Solar options for house owner')
          }
        }
      }
      
      // 4. Loans and Finance - High priority based on debt types and amounts
      if (['loan', 'finance', 'business-loan'].includes(provider.category)) {
        // High debt amount = higher loan priority
        if (debtAmountValue >= 20000) {
          score += 5
          reasons.push('High debt amount - loan options relevant')
        } else if (debtAmountValue >= 10000) {
          score += 3
          reasons.push('Moderate debt amount - financial assistance available')
        }
        
        // Specific debt type matching
        if (debtTypes.includes('credit-cards') && provider.category === 'loan') {
          score += 4
          reasons.push('Credit card debt - loan consolidation option')
        }
        if (debtTypes.includes('personal-loans') && provider.category === 'loan') {
          score += 3
          reasons.push('Personal loan debt - refinancing options')
        }
        if (debtTypes.includes('student-loans') && provider.category === 'finance') {
          score += 3
          reasons.push('Student loan debt - financial planning needed')
        }
        if (debtTypes.includes('taxes') && provider.category === 'finance') {
          score += 3
          reasons.push('Tax debt - financial assistance available')
        }
      }
      
      // MEDIUM PRIORITY SCORING (Recommended candidates)
      
      // 5. Legal services - Medium priority for injury cases
      if (provider.category === 'legal') {
        score += 2 // Base score for legal services
        reasons.push('Legal protection available')
      }
      
      // 6. Additional financial services
      if (provider.category === 'finance' && !debtTypes.includes('student-loans') && !debtTypes.includes('taxes')) {
        score += 1
        reasons.push('General financial services')
      }
      
      // LOW PRIORITY SCORING (You May Also Like candidates)
      
      // 7. Business loans - Lower priority unless specific indicators
      if (provider.category === 'business-loan') {
        score += 1
        reasons.push('Business financing option')
      }
      
      // 8. Fallback scoring for any remaining providers
      if (score === 0) {
        score += 0.5
        reasons.push('Additional option')
      }
      
      return {
        ...provider,
        score,
        reasons
      }
    })
    
    // Sort by score (highest first)
    const sortedProviders = scoredProviders.sort((a, b) => b.score - a.score)
    
    // Assign tags based on sophisticated scoring thresholds
    const taggedProviders = sortedProviders.map((provider, index) => {
      let tag = 'You May Also Like'
      
      // Best Match: High scores (8+) or top 3 with significant scores (5+)
      if (provider.score >= 8 || (index < 3 && provider.score >= 5)) {
        tag = 'Best Match'
      } 
      // Recommended: Medium-high scores (4-7) or positions 4-6 with decent scores (3+)
      else if (provider.score >= 4 || (index >= 3 && index < 6 && provider.score >= 3)) {
        tag = 'Recommended'
      }
      // You May Also Like: Lower scores or remaining positions
      else {
        tag = 'You May Also Like'
      }
      
      return {
        ...provider,
        tag
      }
    })
    
    // Filter to show only providers with some relevance or fallback to core categories
    const relevantProviders = taggedProviders.filter(p => p.score > 0 || ['debt-relief', 'finance'].includes(p.category))
    
    // Ensure we have a good distribution of categories
    const bestMatchCount = relevantProviders.filter(p => p.tag === 'Best Match').length
    const recommendedCount = relevantProviders.filter(p => p.tag === 'Recommended').length
    
    // If we don't have enough Best Match, promote highest scoring Recommended
    if (bestMatchCount < 3) {
      const toPromote = relevantProviders
        .filter(p => p.tag === 'Recommended')
        .sort((a, b) => b.score - a.score)
        .slice(0, 3 - bestMatchCount)
        .map(p => ({ ...p, tag: 'Best Match' }))
      
      // Update the providers array
      relevantProviders.forEach(provider => {
        if (toPromote.some(tp => tp.name === provider.name)) {
          provider.tag = 'Best Match'
        }
      })
    }
    
    // If we don't have enough Recommended, promote some You May Also Like
    if (recommendedCount < 3) {
      const toPromote = relevantProviders
        .filter(p => p.tag === 'You May Also Like')
        .sort((a, b) => b.score - a.score)
        .slice(0, 3 - recommendedCount)
        .map(p => ({ ...p, tag: 'Recommended' }))
      
      // Update the providers array
      relevantProviders.forEach(provider => {
        if (toPromote.some(tp => tp.name === provider.name)) {
          provider.tag = 'Recommended'
        }
      })
    }
    
    // If we still don't have enough providers, add fallbacks
    if (relevantProviders.length < 6) {
      const fallbackProviders = allProviders
        .filter(p => !relevantProviders.some(rp => rp.name === p.name))
        .slice(0, 6 - relevantProviders.length)
        .map(provider => ({
          ...provider,
          score: 0.5,
          reasons: ['Additional option'],
          tag: 'You May Also Like'
        }))
      
      return [...relevantProviders, ...fallbackProviders]
    }
    
    return relevantProviders.slice(0, 12) // Limit to 12 providers max
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      rotateX: -15,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        // Use tween for filter to avoid negative blur overshoot
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "tween",
        // Apply spring only to transform properties
        y: { type: "spring", stiffness: 100, damping: 15 },
        scale: { type: "spring", stiffness: 100, damping: 15 },
        rotateX: { type: "spring", stiffness: 100, damping: 15 }
      }
    }
  }

  const allProviders = [
    // { name: "Debt Relief - CPL - USA", logo: "/quiz/images/debtrelief1.svg", rating: 4.6, category: "debt-relief", features: ["Reduce monthly payments", "Consolidate unsecured debts", "Free consultation with experts"], link: "https://trk.trkclix.net/click?campaign_id=16&pub_id=57" },
    // { name: "DebtMD- US", logo: "/quiz/images/debtmd.svg", rating: 4.5, category: "debt-relief", features: ["Personalized debt analyzer", "Connect with verified debt specialists", "Get a custom debt relief plan"], link: "https://trk.trkclix.net/click?campaign_id=17&pub_id=57" },
    { name: "Insurify", logo: "/quiz/images/insurify.svg", rating: 4.5, category: "auto-insurance", 
      description: "Compare 100+ providers for your best rate.",
      features: ["Save up to $1,025 annually on premiums", "Transparent pricing with no hidden fees", "Quick online quotes from 100+ providers"], 
      oneLiner: "Compare in 60s", 
      link: "https://trk.trkclix.net/click?campaign_id=27&pub_id=57" },
    { name: "First American Home Warranty", logo: "/quiz/images/firstAmericanHomeWarranty.png", rating: 4.5, category: "home-warranty",  
      description: "Protect your home from unexpected breakdowns.",
      features: ["$100 discount with PROTECT promo code", "Covers major systems & home appliances", "Instant online quotes in minutes"], 
      oneLiner: "Quote in 60s", 
      link: "https://trk.trkclix.net/click?campaign_id=23&pub_id=57" },
    { name: "Endurance Warranty", logo: "/quiz/images/endurance.svg", rating: 4.8, category: "auto-insurance", "description": "Protect your vehicle from costly repairs.",
  features: ["Engine & transmission repair coverage", "24/7 roadside assistance nationwide", "30-day money-back satisfaction guarantee"], 
  oneLiner: "Check in 60s", 
  link: "https://trk.trkclix.net/click?campaign_id=22&pub_id=57" },
    { name: "Jacuzzi", logo: "/quiz/images/jacuzzi.svg", rating: 4.8, category: "home-improvement", "description": "Transform your bathroom with premium remodeling.",
  features: ["Professional tub-to-shower conversion", "No interest financing for 1 full year", "Same-day installation by certified experts"], link: "https://trk.trkclix.net/click?campaign_id=28&pub_id=57" },
    { name: "Otto Insurance", logo: "/quiz/images/otto.webp", rating: 4.8, category: "auto-insurance", "description": "Save on auto, home, and pet insurance.",
  features: ["Instant free quotes from top insurers", "Save $500+ annually on coverage", "No hidden fees or surprise charges"], 
  oneLiner: "Quote in 60s", 
  link: "https://trk.trkclix.net/click?campaign_id=36&pub_id=57" },
    { name: "The Accident Office", logo: "/quiz/images/theAccidentOfiice.svg", rating: 4.8, category: "legal", "description": "Get free legal evaluation for your injury case.",
  features: ["No upfront fees - pay only if you win", "All injury types and accident cases covered", "Maximize compensation with expert attorneys"], link: "https://trk.trkclix.net/click?campaign_id=33&pub_id=57" },
    { name: "Mutual of Omaha", logo: "/quiz/images/mutualOfOmaha.webp", rating: 4.8, category: "finance", "description": "Get free reverse mortgage guide from #1 lender.",
  features: ["America's #1 HUD-endorsed lender", "Free comprehensive reverse mortgage guide", "Expert support throughout the process"], link: "https://trk.trkclix.net/click?campaign_id=32&pub_id=57" },
    { name: "Metal Roofing Innovations", logo: "/quiz/images/metalRoofingInnovations.png", rating: 4.8, category: "home-improvement", "description": "Upgrade with durable, energy-efficient metal roofing.",
  features: ["Same-day professional installation", "Weather & fire resistant materials", "$0 down payment options available"], link: "https://trk.trkclix.net/click?campaign_id=31&pub_id=57" },
    { name: "ZippyLoan", logo: "/quiz/images/zippyLoan.png", rating: 4.8, category: "loan", "description": "Access personal loans up to $15,000 quickly.",
  features: ["Next-day funding up to $15,000", "All credit types welcome", "Secure online application process"], 
  oneLiner: "Check in 60s", 
  link: "https://trk.trkclix.net/click?campaign_id=50&pub_id=57" },
    { name: "Vivint", logo: "/quiz/images/vivint.png", rating: 4.8, category: "home-improvement", "description": "Protect your home with smart security systems.",
  features: ["Smart threat detection technology", "Remote monitoring from anywhere", "Save up to 10% on utility bills"], link: "https://trk.trkclix.net/click?campaign_id=48&pub_id=57" },
    { name: "Unclaimed Stimulus", logo: "/quiz/images/benefitsdepot.svg", rating: 4.8, category: "finance", "description": "Discover government grants for bills and education.",
  features: ["Access FEMA & education grant programs", "Step-by-step application guidance", "Tax breaks and financial benefits included"], link: "https://trk.trkclix.net/click?campaign_id=47&pub_id=57" },
    { name: "Speedy Loan", logo: "/quiz/images/speedyNetLoan.png", rating: 4.8, category: "loan", "description": "Get emergency cash up to $5,000 fast.",
      features: ["Quick online application form", "Emergency cash up to $5,000", "All credit types accepted"], 
      oneLiner: "Cash in 60s", 
      link: "https://trk.trkclix.net/click?campaign_id=46&pub_id=57" },
    { name: "PersonalLoan2You", logo: "/quiz/images/personalLoan2You.png", rating: 4.8, category: "loan",  "description": "Get personal loans $100-$5,000 in 24 hours.",
      features: ["Secure online application form", "24-hour funding to your account", "SSL encryption for data protection"], 
      oneLiner: "Options in 60s", 
      link: "https://trk.trkclix.net/click?campaign_id=58&pub_id=57" },
    { name: "PersonaLoan24", logo: "/quiz/images/personalLoan24.png", rating: 4.8, category: "loan", "description": "Get personal loans $100-$5,000 in 24 hours.",
  features: ["Same-day funding available", "Simple 3-step application process", "Secure encryption protects your data"], 
  oneLiner: "Pre-approval in 60s", 
  link: "https://trk.trkclix.net/click?campaign_id=57&pub_id=57" },
    { name: "GetCash4Me", logo: "/quiz/images/getCash4Me.png", rating: 4.8, category: "loan", "description": "Get loans $250-$10,000 in 15 minutes.",
  features: ["15-minute funding once approved", "All credit types and situations welcome", "No upfront fees or hidden charges"], 
  oneLiner: "Check in 60s", 
  link: "https://trk.trkclix.net/click?campaign_id=56&pub_id=57" },
    { name: "Wizzay", logo: "/quiz/images/wizzay.png", rating: 4.8, category: "loan","description": "Get loans $200-$5,000 next business day.",
  features: ["24-hour funding to your bank account", "All credit scores considered", "No submission fees or obligations"], 
  oneLiner: "Quiz in 60s", 
  link: "https://trk.trkclix.net/click?campaign_id=55&pub_id=57" },
    { name: "Easy Capital Access", logo: "/quiz/images/EasyCapitaAccess_logo.png", rating: 4.8, category: "business-loan", "description": "Get fast financial access regardless of credit.",
  features: ["Bad credit history welcome", "Free financial education resources", "Professional investment guidance included"], link: "https://trk.trkclix.net/click?campaign_id=54&pub_id=57" },
    { name: "Next Day Personal Loan", logo: "/quiz/images/nextDayPersonalLoan.svg", rating: 4.8, category: "loan", "description": "Get loans $100-$40,000 with flexible terms.",
  features: ["Next-day funding up to $40,000", "All credit types and histories accepted", "No credit impact from checking rates"], link: "https://trk.trkclix.net/click?campaign_id=52&pub_id=57" },
    { name: "Your Insurance Path", logo: "/quiz/images/yourInsurancePath.png", rating: 4.8, category: "auto-insurance", "description": "Get fast, free auto insurance quotes.",
  features: ["Personalized quotes for your vehicle", "Accurate pricing based on your profile", "Secure data protection guaranteed"], link: "https://trk.trkclix.net/click?campaign_id=59&pub_id=57" },
    { name: "Choice Home Warranty", logo: "/quiz/images/choiceHomeWarranty.png", rating: 4.5, category: "home-warranty", 
      "description": "Protect major home systems and appliances.",
      features: ["Covers major systems & home appliances", "Trusted by 2.4M homes nationwide", "Over 8M customer claims successfully handled"], link: "https://trk.trkclix.net/click?campaign_id=15&pub_id=57" },
    { name: "Easy Solar Quotes", logo: "/quiz/images/easySolarQuotes.png", rating: 4.5, category: "solar", "description": "Compare trusted solar installers to save money.",
  features: ["Get up to 4 personalized solar quotes", "Zero-down installation options available", "12-30 year comprehensive warranties included"], link: "https://trk.trkclix.net/click?campaign_id=19&pub_id=57" },
  ]

  const insuranceProviders = getScoredAndTaggedProviders()
  
  // Get count of high priority providers (Best Match)
  const getHighPriorityCount = () => {
    return insuranceProviders.filter(p => p.tag === 'Best Match').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight text-center">
            <div className="flex items-center justify-center">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              {/* --- NEW: personalize heading --- */}
              <span>
                {`Great News${firstName ? `, ${firstName}` : ''}!`}
              </span>
            </div>
          </h1>
          
          {/* SVG Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 sm:mb-8 flex justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="Layer_1" version="1.1" viewBox="16.8 5.3 294.17 214.2" width="150" height="109" className="max-w-full h-auto">
              <defs>
                <style>{`
                  .st0 {
                    fill: none;
                  }
                  .st1 {
                    fill: #191a37;
                    font-family: AvenirNextLTPro-Regular, 'Avenir Next LT Pro';
                    font-size: 19.58px;
                  }
                  .st1, .st2 {
                    isolation: isolate;
                  }
                  .st3 {
                    fill: #1f2147;
                  }
                  .st4 {
                    fill: #a31921;
                  }
                  .st5 {
                    clip-path: url(#clippath);
                  }
                `}</style>
                <clipPath id="clippath">
                  <rect className="st0" x="16.8" y="5.4" width="286" height="214"/>
                </clipPath>
              </defs>
              <g className="st2">
                <g className="st2">
                  <text className="st1" transform="translate(295.97 154.2)">
                    <tspan x="0" y="0">®</tspan>
                  </text>
                </g>
              </g>
              <g className="st5">
                <g>
                  <path className="st3" d="M44.3,141.2v29.3h-.1l-18.2-29.3h-9.2v39.1h7v-30.2h.1l18.6,30.2h8.8v-39.1h-7Z"/>
                  <path className="st3" d="M82.1,165.4l-6-15.9-6.1,15.9h12.2-.1ZM73.3,141.2h6l16.8,39.1h-7.9l-3.6-9h-17l-3.5,9h-7.8l17-39.1h0Z"/>
                  <path className="st3" d="M105.7,147.3h-12v-6.1h30.9v6.1h-12v33h-7v-33h.1Z"/>
                  <path className="st3" d="M137.2,141.2h-7v39.1h7v-39.1h0Z"/>
                  <path className="st3" d="M152.7,160.6c0,2,.3,3.9,1,5.8.6,1.7,1.5,3.2,2.8,4.6,1.2,1.3,2.6,2.3,4.3,3s3.6,1.1,5.4,1.1c1.9,0,3.7-.4,5.5-1.1,1.6-.7,3.1-1.7,4.3-3s2.2-2.9,2.8-4.5c.7-1.9,1-3.8,1-5.8s-.3-3.8-1-5.6c-.6-1.7-1.5-3.2-2.7-4.5s-2.6-2.3-4.3-3c-1.7-.8-3.6-1.1-5.5-1.1s-3.8.3-5.5,1.1c-1.6.7-3,1.7-4.2,3s-2.1,2.9-2.7,4.5c-.7,1.8-1,3.7-1,5.6h0l-.2-.1h0ZM145.1,160.6c0-2.9.5-5.8,1.6-8.5,1-2.4,2.5-4.6,4.4-6.4,1.9-1.8,4.2-3.2,6.6-4.1,2.7-1,5.5-1.5,8.4-1.4,2.9,0,5.7.5,8.5,1.4,2.5.9,4.8,2.3,6.7,4.1s3.4,4,4.4,6.4c1.1,2.7,1.6,5.6,1.6,8.5s-.5,5.7-1.6,8.4c-1,2.5-2.5,4.7-4.4,6.5-1.9,1.9-4.2,3.3-6.7,4.3-2.7,1-5.6,1.5-8.5,1.5s-5.7-.5-8.4-1.5c-2.5-1-4.7-2.4-6.6-4.3s-3.4-4.1-4.4-6.5c-1.1-2.7-1.6-5.5-1.6-8.4Z"/>
                  <path className="st3" d="M195,141.2h9.2l18.2,29.3h.1v-29.3h7v39.1h-8.8l-18.6-30.2h-.1v30.2h-7v-39.1h0Z"/>
                  <path className="st3" d="M260.2,165.4l-6-15.9-6.1,15.9h12.1ZM251.4,141.2h6l16.8,39.1h-8l-3.6-9h-16.9l-3.5,8.9h-7.8l17-39.1v.1h0Z"/>
                  <path className="st3" d="M279.2,141.2v39.1h23.6v-6.2h-16.6v-32.9h-7Z"/>
                  <path className="st3" d="M77,216.3c.9,0,1.8-.1,2.7-.3.9-.2,1.7-.6,2.4-1.1.8-.5,1.4-1.2,1.8-2.1.5-1,.7-2.1.7-3.3s-.2-2.4-.7-3.4c-.4-.8-1-1.5-1.8-2.1-.7-.5-1.6-.9-2.4-1-.9-.2-1.8-.3-2.7-.3h-2.9v13.5h2.9v.1h0ZM70.6,199.8h6.9c1.3,0,2.6.2,3.8.5,1.3.3,2.4.9,3.5,1.6,1.1.8,1.9,1.8,2.5,3,.7,1.2,1,2.8,1,4.6,0,1.5-.3,3-1,4.4-.6,1.2-1.5,2.2-2.5,3s-2.2,1.4-3.5,1.8c-1.2.4-2.5.6-3.8.6h-6.9v-19.6.1h0Z"/>
                  <path className="st3" d="M93.3,199.8v19.6h13.5v-3.1h-10v-5.5h9v-2.9h-9v-5h9.5v-3h-13v-.1Z"/>
                  <path className="st3" d="M115.3,216.4h4.5c.5,0,1-.2,1.4-.4s.8-.5,1.1-.9c.3-.5.5-1,.4-1.5,0-1-.3-1.8-1.1-2.2-.7-.4-1.8-.6-3.2-.6h-3.3v5.7l.2-.1ZM115.3,207.8h3.1c1.2,0,2-.2,2.7-.7.3-.2.5-.5.7-.9.2-.3.2-.7.2-1.1,0-.9-.3-1.5-.9-1.9s-1.6-.6-2.9-.6h-2.8v5.1l-.1.1h0ZM111.8,199.8h7.6c.7,0,1.5,0,2.2.3.7.2,1.3.5,1.9.9s1.1,1,1.4,1.7.5,1.4.5,2.1c0,1-.3,2-.9,2.7-.7.7-1.5,1.3-2.5,1.5h0c1.1.2,2.2.7,3,1.5.4.4.7.9.9,1.5.2.5.3,1.1.3,1.7,0,.9-.2,1.9-.6,2.7-.4.7-1,1.3-1.7,1.8s-1.5.8-2.4,1-1.8.3-2.7.3h-7.1v-19.6l.1-.1h0Z"/>
                  <path className="st3" d="M129.3,199.8v3h6v16.5h3.5v-16.5h6v-3h-15.5Z"/>
                  <path className="st3" d="M162.9,208.2c.5,0,1,0,1.5-.1.5,0,.9-.2,1.3-.4.4-.2.7-.5,1-.9s.4-.9.4-1.5c0-.5-.1-.9-.4-1.3-.2-.3-.5-.6-.9-.8s-.8-.4-1.3-.4-.9-.1-1.4-.1h-3.1v5.5h2.9ZM156.6,199.8h6.8c.9,0,1.8,0,2.7.3.8.2,1.6.5,2.3,1,.7.4,1.2,1,1.6,1.7.4.8.6,1.7.6,2.6,0,1.3-.4,2.5-1.2,3.5-.9.9-2,1.6-3.3,1.8l5.2,8.7h-4.2l-4.5-8.3h-2.5v8.3h-3.5v-19.6h0Z"/>
                  <path className="st3" d="M175.6,199.8v19.6h13.4v-3.1h-10v-5.5h9v-2.9h-9v-5h9.5v-3h-13l.1-.1Z"/>
                  <path className="st3" d="M194.1,199.8v19.6h11.8v-3.1h-8.3v-16.5h-3.5Z"/>
                  <path className="st3" d="M213.4,199.8h-3.5v19.6h3.5v-19.6Z"/>
                  <path className="st3" d="M219.4,199.8v19.6h13.4v-3.1h-10v-5.5h9v-2.9h-9v-5h9.5v-3h-13l.1-.1Z"/>
                  <path className="st3" d="M237.9,199.8v19.6h3.5v-8.2h8.6v-2.9h-8.6v-5.4h9.1v-3h-12.6v-.1h0Z"/>
                  <path className="st3" d="M301.6,209h-39.2v-1.2h39.2v1.2ZM56.5,209H17.4v-1.2h39.1v1.2Z"/>
                  <path className="st3" d="M200.6,34.8c-.2,1.6-.4,3.2-.4,4.7-.2,3.5,0,7.1.5,10.6v.8c0,.2-.3.5-.5.6-7.9,6.9-16.5,13-25.7,18.3-13.9,8-28.5,14.8-43.6,20.4h-.7c-2-2.3-3.9-4.6-6-7,1.5-.5,2.7-.9,3.9-1.3,13.9-4.6,27.4-10.6,40.1-17.9,7.5-4.3,14.6-9.5,20.9-15.4,4.3-3.9,8-8.4,11.1-13.3,0-.1.2-.3.4-.4"/>
                  <path className="st3" d="M151.6,105.8c1.4-.7,2.7-1.4,4.1-2.2,10.2-5.4,19.9-11.8,28.8-19.1,6.9-5.6,13-12.2,18.1-19.5.1-.1.2-.3.3-.4s0,0,.2,0c.4,1.7.7,3.3,1,4.9.2,1,.3,2,.5,2.9s0,1.8-.3,2.7c-3.9,8.2-9.6,15.4-16.8,21-7.5,6-15.9,10.8-24.9,14.1-.5.2-1,.2-1.5,0-3.3-1.3-6.5-2.7-9.8-4.1v-.3h.3,0Z"/>
                  <path className="st3" d="M135.9,95.8c2.5-1,4.8-2,7-3,13.2-5.7,26-12.3,37.8-20.7,7.4-5.1,14.2-11.2,20-18.1.1-.1.2-.3.4-.5.3,1.7.6,3.2.9,4.8.2,1.3.5,2.6.8,3.9v.6c0,.2-.2.4-.3.6-5.3,5.4-11,10.2-17.2,14.6-9.1,6.5-18.7,12.3-28.7,17.3-3.9,2-8,3.9-11.9,5.8-.2.1-.5.2-.7.2s-.5-.1-.7-.3c-2.4-1.7-4.8-3.4-7.3-5.3"/>
                  <path className="st4" d="M196,23.2l-2,2.5v.2l1.8,2.7v.2h-.3l-3-1.2h-.3l-2,2.5h-.4v-.1l.2-3.2v-.1h-.1l-3-1.1h-.1v-.2h.1l3.1-.8h.1v-3.3c.1,0,.2-.1.2-.1h.4l1.7,2.7h.3l3.1-.9h.3v.2s-.1,0-.1,0ZM180.3,20.5l-2.1,2.5v.2l1.8,2.7v.2h-.3l-3-1.2h-.3l-2,2.5h-.4v-.1l.2-3.2v-.1h-.1l-3-1.1h-.1v-.2h.1l3.1-.8h.1v-3.3c.1,0,.2,0,.2-.1h.4l1.7,2.7h.3l3.1-.9h.3s0,.2,0,.2ZM180.3,36.6l-2.1,2.5v.2l1.8,2.7v.2h-.3l-3-1.2h-.3l-2,2.5h-.4v-.1l.2-3.2v-.1h-.1l-3-1.1h-.1v-.2h.1l3.1-.8h.1v-3.3c.1,0,.2-.1.2-.1h.4l1.7,2.7h.3l3.1-.9h.3s0,.2,0,.2ZM164.7,15.3l-2.1,2.5v.2l1.8,2.7v.2h-.3l-3-1.2h-.3l-2,2.5h-.4v-.1l.2-3.2v-.1h-.1l-3.1-1.1h-.1v-.2h.1l3.1-.8h.1v-3.3c.1,0,.2,0,.2-.1h.3l1.7,2.7h.3l3.1-.9h.3v.2s.2,0,.2,0ZM164.7,30.7l-2.1,2.5v.2l1.8,2.7v.2h-.3l-3-1.2h-.3l-2,2.5s0,.1-.1.1h-.2s-.1,0-.1-.1v-.2l.2-3.2v-.1h-.1l-3-1.1h-.1v-.2h.1l3.1-.8h.1v-3.3c.1,0,.2-.1.2-.1h.4l1.7,2.7h.3l3.1-.9h.3v.2h0v.1h0ZM164.7,46.9l-2.1,2.5v.2l1.8,2.7v.2h-.3l-3-1.2h-.3l-2,2.5h-.4c-.1,0,0,0,0-.1l.2-3.2v-.1h-.1l-3-1.1h-.1v-.2h.1l3.1-.8h.1v-3.3c.1,0,.2-.1.2-.1h.3l1.7,2.7h.3l3.1-.9h.3v.2h.1,0ZM149.1,20.5l-2.1,2.5v.2l1.8,2.7v.2h-.3l-3-1.2h-.3l-2,2.5h-.4v-.1l.2-3.2v-.1h-.1l-3-1.1h-.1v-.2h.1l3.1-.8h.1v-3.3c.1,0,.2-.1.2-.1h.4l1.7,2.7h.3l3.1-.9h.2v.2s.1,0,.1,0ZM149.1,35.9l-2.1,2.5v.2l1.8,2.7v.2h-.3l-3-1.2h-.3l-2,2.5h-.4v-.1l.2-3.2v-.1h-.1l-3-1.1h-.1v-.2h.1l3.1-.8h.1v-3.3c.1,0,.2-.1.2-.1h.4l1.7,2.7h.3l3.1-.9h.3v.2h0ZM149.1,52.6l-2.1,2.5v.2l1.8,2.7v.2h-.3l-3-1.2h-.3l-2,2.5h-.4v-.1l.2-3.2v-.1h-.1l-3-1.1h-.1v-.2h.1l3.1-.8h.1v-3.3c.1,0,.2-.1.2-.1h.4l1.7,2.7h.3l3.1-.9h.2c.1,0,0,0,0,.1v.1s.1,0,.1,0ZM133.1,41.7l-2,2.4v.2l1.7,2.6v.2h-.2l-2.9-1.1h-.2l-1.9,2.4h-.3v-.1l.2-3.1v-.1h-.1l-2.9-1.1h-.1v-.2h.1l3-.8h.1v-3.2c.1,0,.2,0,.2-.1h.3l1.7,2.6h.2l3-.8h.2v.2h-.1,0ZM132.5,59.2l-2,2.4v.2l1.7,2.6v.2c0,.1,0,0-.1,0h-.1l-2.9-1.1h-.2l-1.9,2.4h-.3v-.1l.2-3.1v-.1h-.1l-2.9-1.1h-.1v-.2h.1l3-.8h.1v-3.2c.1,0,.2,0,.2-.1h.3l1.7,2.6h.2l3-.8h.2v.2h-.1,0ZM123.7,25.2l3-.8h.1v-3.2c.1,0,.2,0,.2-.1h.3l1.7,2.6h.2l3-.8h.2v.2l-2,2.4v.2l1.7,2.6v.2h-.2l-2.9-1.1h-.2l-1.9,2.4h-.3v-.1l.2-3.1v-.1h-.1l-2.9-1.1h-.1v-.2h.1-.1ZM207.8,17.9h-.5c-5.3-.3-10.5-1-15.7-2-10.3-2.1-20.2-5.6-29.5-10.4-.2-.1-.5-.2-.7-.2-.3,0-.5,0-.7.2-5,2.4-10.2,4.4-15.5,6-9.8,2.9-19.9,4.7-30.1,5.4-.6,0-.8.2-.8.8,0,2.3,0,4.6-.2,6.9,0,.2,0,.5.1.7s.3.4.6.4c1,.4,2,1,2.7,1.8.8.8,1.3,1.8,1.6,2.9.6,1.7.9,3.5.9,5.2,0,3.9-.3,7.8-.6,11.8-.5,6.7-1,13.4-1.7,20.1-.3,2.1,0,4.2,1,6,.9,1.5,1.6,3.1,2.4,4.7.5-.5,1.1-.9,1.8-1.3,7-2.5,14-4.9,20.8-7.6,12.3-4.8,24.2-10.8,35.4-17.9,7.1-4.4,13.6-9.6,19.5-15.5,1-.9,1.8-2,2.4-3.2,1.2-3.2,3-5.8,6.1-7.2.1,0,.2-.1.3-.2,0-.1.1-.2.2-.4v-7.1"/>
                </g>
              </g>
            </svg>
          </motion.div>
          
          <div className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto px-2 mb-6">
            <div className="block whitespace-nowrap">Based on your responses, we've matched you with a trusted debt relief partner.</div>
            <div className="block whitespace-nowrap">A dedicated specialist will reach out to you within the next 24–48 hours to discuss your options.</div>
          </div>
          
          {/* Benefit Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8 max-w-4xl mx-auto"
          >
            {/* Expect a call or email soon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-full px-4 py-3 border border-gray-200 flex items-center gap-3 shadow-sm"
            >
              <span className="text-2xl">📞</span>
              <span className="text-gray-800 font-medium text-sm">Expect a call or email soon</span>
            </motion.div>

            {/* Have your questions ready */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-full px-4 py-3 border border-gray-200 flex items-center gap-3 shadow-sm"
            >
              <span className="text-2xl">📋</span>
              <span className="text-gray-800 font-medium text-sm">Have your questions ready</span>
            </motion.div>

            {/* No pressure. No obligation. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-full px-4 py-3 border border-gray-200 flex items-center gap-3 shadow-sm"
            >
              <span className="text-2xl">✅</span>
              <span className="text-gray-800 font-medium text-sm">No pressure. No obligation.</span>
            </motion.div>
          </motion.div>
          
        </motion.div>

        {/* Offers Container Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-6xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200 p-6 sm:p-8 md:p-10"
        >
          {/* Offers Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl text-gray-900">
              You may also qualify for the following offers:
            </h2>
          </motion.div>

          {/* Provider Cards Container */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2 sm:space-y-3"
          >
            {insuranceProviders.map((provider, index) => (
            <motion.div
              key={provider.name}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.03, 
                y: -8,
                rotateY: 2,
                boxShadow: provider.tag === 'Best Match' 
                  ? "0 25px 50px -12px rgba(34, 197, 94, 0.25), 0 0 0 1px rgba(34, 197, 94, 0.1)"
                  : provider.tag === 'Recommended'
                  ? "0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                transition: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              className={`bg-white rounded-xl shadow-lg p-2 sm:p-3 md:p-4 border-2 transition-all duration-500 backdrop-blur-sm ${
                provider.tag === 'Best Match' 
                  ? 'border-green-400 bg-gradient-to-br from-green-50 via-white to-green-50 shadow-green-100' 
                  : provider.tag === 'Recommended' 
                  ? 'border-blue-400 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-blue-100'
                  : 'border-gray-200 hover:border-blue-300 shadow-gray-100'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {provider.tag === 'Best Match' && (
                <motion.div 
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.5 + index * 0.1, 
                    duration: 0.6, 
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, -2, 2, 0],
                    transition: { duration: 0.3 }
                  }}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-full inline-flex items-center space-x-2 mb-2 sm:mb-3 shadow-lg relative overflow-hidden"
                >
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      transform: 'translateX(-100%)',
                      animation: 'shimmer 2s infinite'
                    }}
                  />
                  <motion.svg 
                    className="w-3 h-3" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </motion.svg>
                  <span>BEST MATCH</span>
                </motion.div>
              )}
              
              {provider.tag === 'Recommended' && (
                <motion.div 
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.5 + index * 0.1, 
                    duration: 0.6, 
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, -2, 2, 0],
                    transition: { duration: 0.3 }
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-full inline-flex items-center space-x-2 mb-2 sm:mb-3 shadow-lg relative overflow-hidden"
                >
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      transform: 'translateX(-100%)',
                      animation: 'shimmer 2s infinite'
                    }}
                  />
                  <motion.svg 
                    className="w-3 h-3" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                  <span>RECOMMENDED</span>
                </motion.div>
              )}
              
              {provider.tag === 'You May Also Like' && (
                <motion.div 
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.5 + index * 0.1, 
                    duration: 0.6, 
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, -2, 2, 0],
                    transition: { duration: 0.3 }
                  }}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-full inline-flex items-center space-x-2 mb-2 sm:mb-3 shadow-lg relative overflow-hidden"
                >
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      transform: 'translateX(-100%)',
                      animation: 'shimmer 2s infinite'
                    }}
                  />
                  <motion.svg 
                    className="w-3 h-3" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 3, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </motion.svg>
                  <span>YOU MAY ALSO LIKE</span>
                </motion.div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-center">
                {/* Logo Section - Large size without box */}
                <motion.div 
                  className="text-center order-1"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className={`inline-block p-2 rounded-xl border-2 mb-2 sm:mb-3 transition-all duration-300 overflow-hidden ${
                      // Black backgrounds for specific logos with white/light text
                      provider.name === "Debt Relief - CPL - USA" ||
                      provider.name === "DebtMD- US" ||
                      provider.name === "Insurify" || 
                      provider.name === "The Accident Office" || 
                      provider.name === "Mutual of Omaha" || 
                      provider.name === "ZippyLoan" || 
                      provider.name === "Unclaimed Stimulus" || 
                      provider.name === "Next Day Personal Loan" || 
                      provider.name === "Choice Home Warranty" || 
                      provider.name === "Easy Solar Quotes"
                        ? "bg-black border-gray-600 shadow-lg" 
                        : "bg-white border-gray-200 shadow-md"
                    }`}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      transition: { duration: 0.3 }
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: '1000px'
                    }}
                  >
                    <motion.img
                      src={provider.logo}
                      alt={provider.name}
                      className={`object-contain transition-all duration-300 ${
                        // Add brightness enhancement for black backgrounds
                        provider.name === "Debt Relief - CPL - USA" ||
                        provider.name === "DebtMD- US" ||
                        provider.name === "Insurify" || 
                        provider.name === "The Accident Office" || 
                        provider.name === "Mutual of Omaha" || 
                        provider.name === "ZippyLoan" || 
                        provider.name === "Unclaimed Stimulus" || 
                        provider.name === "Next Day Personal Loan" || 
                        provider.name === "Choice Home Warranty" || 
                        provider.name === "Easy Solar Quotes"
                          ? "brightness-110 contrast-110"
                          : ""
                      } ${
                        provider.name === "Insurify" 
                          ? "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20" 
                          : "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 0.3 + index * 0.1, 
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                  </motion.div>
                  <div className="hidden text-sm sm:text-base md:text-lg font-bold text-gray-700 text-center px-2">
                    {provider.name}
                  </div>
                  {/* Website Name */}
                  <motion.h4 
                    className="font-semibold text-gray-900 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {provider.name}
                  </motion.h4>
                  {/* One-liner about the website */}
                  <motion.p 
                    className="text-xs text-gray-500 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {provider.oneLiner || "Get your personalized quote in under 60 seconds"}
                  </motion.p>
                  {/* Rating */}
                  <motion.div 
                    className="flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <motion.svg 
                          key={i} 
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(provider.rating) ? 'fill-current' : 'fill-gray-300'}`} 
                          viewBox="0 0 20 20"
                          initial={{ opacity: 0, rotate: -180 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 + i * 0.05, duration: 0.3 }}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </motion.svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm sm:text-base text-gray-600 font-medium">{provider.rating}</span>
                  </motion.div>
                </motion.div>

                {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 + index * 0.1 }}
                  className="order-3 flex flex-col justify-center"
      >
        <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
        <ul className="text-sm text-gray-600 space-y-1.5">
          {provider.features.map((feature, i) => (
            <motion.li 
              key={i} 
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 + i * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <motion.svg 
                className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </motion.svg>
              <span className="leading-relaxed">{feature}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

                {/* Get Quote Section - Now in middle */}
      <motion.div 
                  className="text-center order-2 flex flex-col justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <motion.p 
                    className="text-sm text-gray-700 mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    {provider.description || "Get personalized quotes and save money with our trusted partners."}
                  </motion.p>
        <motion.a
          href={provider.link}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ 
            scale: 1.05,
            y: -2,
            boxShadow: "0 15px 35px -5px rgba(59, 130, 246, 0.4), 0 5px 15px -3px rgba(59, 130, 246, 0.2)",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            transition: { duration: 0.3 }
          }}
          whileTap={{ 
            scale: 0.98,
            y: 0,
            transition: { duration: 0.1 }
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 w-full shadow-lg inline-block text-center mb-3 relative overflow-hidden group text-base sm:text-lg"
          style={{
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.25)"
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          <span className="relative z-10">Get Quote Now</span>
        </motion.a>
        <motion.p 
          className="text-xs text-gray-500 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
        >
          Free • No Obligation • Instant
        </motion.p>
      </motion.div>
          </div>
            </motion.div>
          ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 bg-white rounded-xl p-8 max-w-2xl mx-auto shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Different Options?
          </h3>
          <p className="text-gray-600 mb-6">
            Your responses help us find the best matches. Want to explore different options?
          </p>
          <button
            onClick={onStartOver}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
          >
            Start Over
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>
            * Savings based on average national rates. Individual results may vary.
            Quotes subject to underwriting approval.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default ResultsPage
