import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = () => (
  <svg 
    className="w-12 h-12 animate-spin text-teal-500"
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      className="opacity-25"
    />
    <path
      fill="currentColor"
      d="M12 2C6.477 2 2 6.477 2 12h4c0-3.314 2.686-6 6-6V2z"
      className="opacity-75"
    />
  </svg>
)

const LoadingPage = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)

  // Target URL for redirection
  const REDIRECT_URL = 'https://trk.trkclix.net/click?campaign_id=17&pub_id=57'

  const messages = [
    "Please wait, we're finding the best program available for you...",
    "Analyzing your responses...",
    "Comparing insurance providers...",
    "Finding the best rates for your profile...",
    "Almost ready with your personalized quote..."
  ]

  useEffect(() => {
    // Scroll to top when loading page mounts
    window.scrollTo(0, 0)
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          
          // ************************************************************
          // ⭐ MODIFICATION HERE: Redirect to the external URL instead of calling onComplete()
          // ************************************************************
          setTimeout(() => {
            window.location.href = REDIRECT_URL
            // Note: onComplete is no longer needed, but if you want to keep the option, you could do:
            // if (onComplete) onComplete() 
            // but for external redirect, `window.location.href` handles the navigation.
          }, 500) // Wait 500ms after 100% before redirecting
          // ************************************************************

          return 100
        }
        return prev + 2
      })
    }, 100)

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length)
    }, 2000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, []) // Removed onComplete from dependencies as it's no longer used for navigation

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center px-4 sm:px-6"
      >
        <div className="relative mb-8 sm:mb-10 md:mb-12">
          <div className="relative">
            <svg className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="#14b8a6"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                transform="rotate(-90 50 50)"
                transition={{ duration: 0.1 }}
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <div className="w-full h-full bg-teal-500 rounded-full opacity-20"></div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="mt-3 sm:mt-4 text-sm font-semibold text-teal-600"
            key={progress}
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {progress}%
          </motion.div>
        </div>

        <motion.div
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 sm:space-y-6"
        >
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed px-2">
            {messages[currentMessage]}
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs sm:text-sm font-medium">Your information is safe and secure</span>
          </div>
        </motion.div>

        <motion.div 
          className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-xs sm:max-w-sm md:max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs font-medium text-gray-600">100% Free</p>
          </div>
          
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs font-medium text-gray-600">No Credit Check</p>
          </div>
          
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs font-medium text-gray-600">Instant Results</p>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 flex items-center justify-center space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="w-2 h-2 bg-teal-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: dot * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LoadingPage