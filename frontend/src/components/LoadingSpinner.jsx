// src/components/LoadingSpinner.jsx
import React from 'react';
import { Brain, Zap, BookOpen } from 'lucide-react';

const LoadingSpinner = () => {
    const tips = [
        "Analyzing your topics and optimizing schedule...",
        "Creating balanced study sessions...",
        "Scheduling based on cognitive load theory...",
        "Incorporating spaced repetition...",
        "Finalizing your personalized plan..."
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-fade-in">
                <div className="text-center">
                    {/* Animated Icon */}
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-20"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                            <div className="relative">
                                <Brain className="h-10 w-10 text-blue-600 animate-pulse" />
                                <div className="absolute -top-1 -right-1">
                                    <Zap className="h-4 w-4 text-yellow-500 animate-bounce" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loading Text */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Crafting Your Perfect Study Plan
                    </h3>
                    <p className="text-gray-600 mb-6">
                        This may take a few moments...
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full animate-progress"></div>
                    </div>

                    {/* Random Tip */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 mb-6">
                        <div className="flex items-center">
                            <BookOpen className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                            <p className="text-sm text-blue-800">
                                {tips[Math.floor(Math.random() * tips.length)]}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-lg font-bold text-blue-600">AI</div>
                            <div className="text-xs text-gray-600">Powered</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-indigo-600">Optimal</div>
                            <div className="text-xs text-gray-600">Schedule</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-purple-600">Personalized</div>
                            <div className="text-xs text-gray-600">For You</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;