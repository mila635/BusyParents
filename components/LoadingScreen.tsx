import React from 'react'

interface LoadingScreenProps {
  message?: string
  isVisible: boolean
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Signing you in...", 
  isVisible 
}) => {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 transform transition-all duration-300 scale-100 animate-slide-up">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">AI</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin">
              <div className="w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            
            {/* Inner dots */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {message}
          </h3>
          <p className="text-sm text-gray-500">
            Please wait while we authenticate your account
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse-slow"></div>
          </div>
        </div>

        {/* Subtle animation elements */}
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '500ms' }}></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
