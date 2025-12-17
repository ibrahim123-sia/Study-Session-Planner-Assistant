// src/pages/HomePage.jsx
import React, { useState } from 'react';
import PlanForm from '../components/PlanForm';
import PlanDisplay from '../components/PlanDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  BookOpen, 
  Calendar, 
  Target, 
  Clock, 
  Brain,
  CheckCircle,
  TrendingUp,
  Zap,
  Users,
  Shield,
  Sparkles
} from 'lucide-react';

const HomePage = () => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [apiStatus, setApiStatus] = useState('Checking...');

    const handleGeneratePlan = async (formData) => {
        setLoading(true);
        setError('');
        setApiStatus('Generating...');
        
        try {
            console.log('Sending request with data:', formData);
            
            const response = await fetch('https://study-session-planner-assistant.vercel.app/api/generate-plan',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.success || !data.error) {
                setPlan(data);
                setApiStatus('Connected');
            } else {
                setError(data.error || 'Failed to generate plan');
                setApiStatus('Error');
            }
        } catch (err) {
            console.error('Connection error:', err);
            setError(`Failed to connect to server: ${err.message}. Make sure backend is running on port 5000.`);
            setApiStatus('Disconnected');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setPlan(null);
        setError('');
    };

    const features = [
        {
            icon: <Target className="h-6 w-6" />,
            title: "Goal-Oriented Planning",
            description: "Transform vague goals into actionable study schedules"
        },
        {
            icon: <Brain className="h-6 w-6" />,
            title: "AI-Powered Optimization",
            description: "Intelligent scheduling based on cognitive science principles"
        },
        {
            icon: <Calendar className="h-6 w-6" />,
            title: "Flexible Scheduling",
            description: "Works with your availability and preferred study days"
        },
        {
            icon: <TrendingUp className="h-6 w-6" />,
            title: "Progress Tracking",
            description: "Built-in milestones to track your learning journey"
        }
    ];

    const stats = [
    
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Navigation/Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    StudyPlanner Pro
                                </h1>
                                <p className="text-xs text-gray-500">AI-Powered Academic Assistant</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                         
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                                <div className={`h-2 w-2 rounded-full ${apiStatus === 'Connected' ? 'bg-green-500 animate-pulse' : apiStatus === 'Generating' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></div>
                                <span className="text-xs font-medium text-gray-700">{apiStatus}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-6">
                            <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-blue-700">Powered by Advanced AI</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Smart Study Plans,<br />
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Maximum Results
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                            Transform your academic goals into structured, actionable study schedules 
                            with AI-powered optimization. Get personalized plans that adapt to your 
                            learning style and schedule.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Form/Plan Display */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                            {/* Form Header */}
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">
                                            {plan ? 'Your Study Plan' : 'Create Your Study Plan'}
                                        </h2>
                                        <p className="text-gray-300 text-sm mt-1">
                                            {plan ? 'Review your personalized schedule' : 'Fill in your details to get started'}
                                        </p>
                                    </div>
                                    {plan && (
                                        <button
                                            onClick={handleReset}
                                            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-all hover:scale-105 active:scale-95 shadow-sm"
                                        >
                                            Create New Plan
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Form Content */}
                            <div className="p-8">
                                {!plan ? (
                                    <PlanForm onSubmit={handleGeneratePlan} />
                                ) : (
                                    <PlanDisplay plan={plan} />
                                )}
                                
                                {loading && <LoadingSpinner />}
                                
                                {error && (
                                    <div className="mt-6 animate-fade-in">
                                        <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                                                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-semibold text-red-800">Generation Failed</h3>
                                                    <div className="mt-1 text-sm text-red-700">
                                                        <p>{error}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Stats Section */}
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Info & Features */}
                    <div className="space-y-8">
                        {/* Features Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">
                                    <Zap className="h-5 w-5 inline-block mr-2 text-blue-600" />
                                    Why Choose Us
                                </h3>
                                <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    PRO
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {features.map((feature, index) => (
                                    <div key={index} className="group p-3 hover:bg-gray-50 rounded-lg transition-all duration-300 hover:scale-[1.02]">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                                                <div className="text-blue-600">
                                                    {feature.icon}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                                                <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* How It Works */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200" id="how-it-works">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                <BookOpen className="h-5 w-5 inline-block mr-2 text-indigo-600" />
                                How It Works
                            </h3>
                            
                            <div className="space-y-4">
                                {[
                                    {
                                        step: "01",
                                        title: "Define Your Goals",
                                        description: "Specify your academic objectives and timeline"
                                    },
                                    {
                                        step: "02",
                                        title: "Input Topics & Schedule",
                                        description: "List subjects and your availability"
                                    },
                                    {
                                        step: "03",
                                        title: "AI Analysis",
                                        description: "Our algorithm creates optimal learning paths"
                                    },
                                    {
                                        step: "04",
                                        title: "Get Your Plan",
                                        description: "Receive personalized study schedule"
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start space-x-4 group">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="text-white font-bold text-sm">{item.step}</span>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tips & Best Practices */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-6 border border-blue-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                <CheckCircle className="h-5 w-5 inline-block mr-2 text-blue-600" />
                                Best Practices
                            </h3>
                            
                            <div className="space-y-3">
                                {[
                                    "Break complex topics into smaller chunks",
                                    "Schedule regular review sessions",
                                    "Include buffer time for difficult concepts",
                                    "Balance different subjects each day",
                                    "Prioritize based on exam dates",
                                    "Include practical application sessions"
                                ].map((tip, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <p className="ml-3 text-sm text-gray-700">{tip}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-6 p-4 bg-white/50 rounded-lg border border-blue-200">
                                <div className="flex items-center">
                                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Expert Support</p>
                                        <p className="text-xs text-gray-600">Based on learning science research</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technology Stack */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                <Shield className="h-5 w-5 inline-block mr-2 text-gray-600" />
                                Technologies & Tools
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">GROQ AI</span>
                                <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">React 18</span>
                                <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Node.js</span>
                                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Tailwind CSS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0">
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-6 w-6 text-blue-400" />
                                <span className="text-xl font-bold">StudyPlanner Pro</span>
                            </div>
                            <p className="text-gray-400 text-sm mt-2">AI-Powered Academic Success Platform</p>
                        </div>
                        
                        
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-gray-700 text-center">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} StudyPlanner Pro. All rights reserved. 
                            This tool is designed for educational purposes.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;