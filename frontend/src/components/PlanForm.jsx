import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Book, 
  Layers,
  Target,
  Clock,
  Calendar,
  Brain,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const PlanForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        goal: '',
        days: 7,
        dailyHours: 2,
        difficulty: 'medium',
        preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        preferredTimes: 'Morning 9-12, Evening 7-10',
        courses: [
            {
                id: 1,
                name: '',
                topics: '',
                weight: 50, // Priority/importance (1-100)
                difficulty: 'medium'
            }
        ]
    });

    const [activeCourse, setActiveCourse] = useState(0);

    // Days of week options
    const daysOfWeek = [
        { id: 'monday', label: 'Monday' },
        { id: 'tuesday', label: 'Tuesday' },
        { id: 'wednesday', label: 'Wednesday' },
        { id: 'thursday', label: 'Thursday' },
        { id: 'friday', label: 'Friday' },
        { id: 'saturday', label: 'Saturday' },
        { id: 'sunday', label: 'Sunday' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCourseChange = (index, field, value) => {
        const updatedCourses = [...formData.courses];
        updatedCourses[index][field] = value;
        setFormData(prev => ({ ...prev, courses: updatedCourses }));
    };

    const addCourse = () => {
        const newCourse = {
            id: Date.now(),
            name: '',
            topics: '',
            weight: 50,
            difficulty: 'medium'
        };
        setFormData(prev => ({
            ...prev,
            courses: [...prev.courses, newCourse]
        }));
        setActiveCourse(formData.courses.length);
    };

    const removeCourse = (index) => {
        if (formData.courses.length <= 1) {
            alert('You need at least one course');
            return;
        }
        const updatedCourses = formData.courses.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, courses: updatedCourses }));
        if (activeCourse >= updatedCourses.length) {
            setActiveCourse(updatedCourses.length - 1);
        }
    };

    const handleDayToggle = (day) => {
        setFormData(prev => {
            const currentDays = [...prev.preferredDays];
            const dayIndex = currentDays.indexOf(day);
            
            if (dayIndex > -1) {
                currentDays.splice(dayIndex, 1);
            } else {
                currentDays.push(day);
            }
            
            return {
                ...prev,
                preferredDays: currentDays
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate courses
        const validCourses = formData.courses.filter(course => 
            course.name.trim() && course.topics.trim()
        );
        
        if (validCourses.length === 0) {
            alert('Please enter at least one course with topics');
            return;
        }

        // Process topics for each course
        const processedCourses = validCourses.map(course => ({
            ...course,
            topics: course.topics
                .split(',')
                .map(topic => topic.trim())
                .filter(topic => topic.length > 0)
        }));

        // Check if any course has no topics
        const coursesWithTopics = processedCourses.filter(course => 
            course.topics.length > 0
        );

        if (coursesWithTopics.length === 0) {
            alert('Please enter topics for at least one course');
            return;
        }

        const formattedData = {
            ...formData,
            courses: coursesWithTopics
        };
        
        console.log('Submitting form data:', formattedData);
        onSubmit(formattedData);
    };

    // Pre-fill with sample data for testing
    const loadSampleData = () => {
        setFormData({
            goal: 'Prepare for Final Exams',
            days: 7,
            dailyHours: 3,
            difficulty: 'medium',
            preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            preferredTimes: 'Morning 9-12, Evening 7-10',
            courses: [
                {
                    id: 1,
                    name: 'Operating Systems',
                    topics: 'Process Management, Memory Management, File Systems, Virtual Memory, Scheduling',
                    weight: 80,
                    difficulty: 'hard'
                },
                {
                    id: 2,
                    name: 'Big Data Analytics',
                    topics: 'Hadoop, MapReduce, Spark, HDFS, Data Warehousing',
                    weight: 60,
                    difficulty: 'medium'
                },
                {
                    id: 3,
                    name: 'Database Systems',
                    topics: 'SQL Queries, Normalization, Transactions, Indexing',
                    weight: 40,
                    difficulty: 'easy'
                }
            ]
        });
        setActiveCourse(0);
    };

    const getTotalWeight = () => {
        return formData.courses.reduce((sum, course) => sum + course.weight, 0);
    };

    const getHighPriorityCourses = () => {
        return formData.courses.filter(course => course.weight > 70);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Input */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center mb-4">
                    <Target className="h-5 w-5 text-blue-600 mr-2" />
                    <label className="block text-lg font-semibold text-gray-900">
                        Academic Goal
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                </div>
                <input
                    type="text"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    placeholder="e.g., Prepare for final exams, Complete semester projects..."
                    className="w-full px-4 py-3 bg-white border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                />
                <p className="mt-2 text-sm text-blue-700">
                    What do you want to achieve with this study plan?
                </p>
            </div>

            {/* Courses Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Layers className="h-5 w-5 text-white mr-2" />
                            <h3 className="text-lg font-bold text-white">Courses & Subjects</h3>
                        </div>
                        <button
                            type="button"
                            onClick={addCourse}
                            className="flex items-center px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Course
                        </button>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">
                        Add multiple courses and allocate study time based on priority
                    </p>
                </div>

                {/* Course Tabs */}
                <div className="border-b border-gray-200 bg-gray-50 px-6">
                    <div className="flex overflow-x-auto">
                        {formData.courses.map((course, index) => (
                            <button
                                key={course.id}
                                type="button"
                                onClick={() => setActiveCourse(index)}
                                className={`flex items-center px-4 py-3 border-b-2 font-medium transition-all relative ${
                                    activeCourse === index
                                        ? 'border-blue-600 text-blue-700 bg-white'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <Book className="h-4 w-4 mr-2" />
                                {course.name || `Course ${index + 1}`}
                                {course.weight > 70 && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                        HIGH PRIORITY
                                    </span>
                                )}
                                {formData.courses.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeCourse(index);
                                        }}
                                        className="ml-2 p-1 hover:bg-gray-200 rounded"
                                    >
                                        <Trash2 className="h-3 w-3 text-gray-500" />
                                    </button>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Course Form */}
                <div className="p-6">
                    {formData.courses.map((course, index) => (
                        <div
                            key={course.id}
                            className={`space-y-4 ${index !== activeCourse ? 'hidden' : ''}`}
                        >
                            {/* Course Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Course/Subject Name
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={course.name}
                                    onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
                                    placeholder="e.g., Operating Systems, Calculus, Physics"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>

                            {/* Topics Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Topics to Cover (separate by commas)
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    value={course.topics}
                                    onChange={(e) => handleCourseChange(index, 'topics', e.target.value)}
                                    placeholder="e.g., Process Management, Memory Management, File Systems..."
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Enter all topics for this course. Example: "Derivatives, Integrals, Limits"
                                </p>
                            </div>

                            {/* Course Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Priority/Weight */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Priority: <span className={`font-bold ${course.weight > 70 ? 'text-red-600 animate-pulse' : course.weight > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                                            {course.weight}%
                                            {course.weight > 70 && ' (HIGH PRIORITY - Extra revision time)'}
                                            {course.weight > 40 && course.weight <= 70 && ' (Medium Priority)'}
                                            {course.weight <= 40 && ' (Low Priority)'}
                                        </span>
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={course.weight}
                                            onChange={(e) => handleCourseChange(index, 'weight', parseInt(e.target.value))}
                                            className="flex-1 h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:shadow-lg"
                                        />
                                        <div className="w-16 text-center">
                                            <span className={`text-lg font-bold ${
                                                course.weight > 70 ? 'text-red-600' : 
                                                course.weight > 40 ? 'text-yellow-600' : 'text-green-600'
                                            }`}>
                                                {course.weight}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span className="text-green-600">Low</span>
                                        <span className="text-yellow-600">Medium</span>
                                        <span className="text-red-600">High (Extra revision)</span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Higher priority = more study time allocated (70+ = 15% extra revision time)
                                    </p>
                                </div>

                                {/* Course Difficulty */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Difficulty
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: 'easy', label: 'Easy', color: 'green' },
                                            { value: 'medium', label: 'Medium', color: 'yellow' },
                                            { value: 'hard', label: 'Hard', color: 'red' }
                                        ].map((level) => (
                                            <button
                                                key={level.value}
                                                type="button"
                                                onClick={() => handleCourseChange(index, 'difficulty', level.value)}
                                                className={`px-3 py-2 rounded-lg border transition-all text-sm ${
                                                    course.difficulty === level.value
                                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-600 shadow-md font-semibold'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-300'
                                                }`}
                                            >
                                                {level.label}
                                            </button>
                                        ))}
                                    </div>
                                    {course.difficulty === 'hard' && (
                                        <p className="mt-2 text-sm text-blue-600 font-medium">
                                            ✓ Hard difficulty selected - will allocate more study time
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Course Summary */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Course Distribution</span>
                            <span className="text-sm font-semibold text-blue-600">
                                Total: {getTotalWeight()}%
                            </span>
                        </div>
                        <div className="space-y-2">
                            {formData.courses.map((course, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="w-32 text-sm text-gray-600 truncate">
                                        {course.name || `Course ${index + 1}`}
                                    </div>
                                    <div className="flex-1 ml-4">
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${
                                                    course.weight > 70 
                                                        ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                                                        : course.weight > 40 
                                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                                                        : 'bg-gradient-to-r from-green-500 to-emerald-600'
                                                }`}
                                                style={{ width: `${(course.weight / getTotalWeight()) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className={`w-16 text-right text-sm font-medium ${
                                        course.weight > 70 ? 'text-red-600' : 
                                        course.weight > 40 ? 'text-yellow-600' : 'text-green-600'
                                    }`}>
                                        {course.weight}%
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* High Priority Warning */}
                        {getHighPriorityCourses().length > 0 && (
                            <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
                                <div className="flex items-start">
                                    <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-red-800">High Priority Courses Detected</p>
                                        <p className="text-sm text-red-700 mt-1">
                                            {getHighPriorityCourses().map(c => c.name).join(', ')} will receive 15% extra revision time in the generated plan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Study Schedule Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Duration and Hours */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-6">
                        <Clock className="h-5 w-5 text-blue-600 mr-2" />
                        <label className="block text-lg font-semibold text-gray-900">
                            Schedule Settings
                        </label>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Study Duration: <span className="font-bold text-blue-600">{formData.days} days</span>
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="range"
                                    name="days"
                                    min="1"
                                    max="14"
                                    value={formData.days}
                                    onChange={handleChange}
                                    className="flex-1 h-2 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="w-20 text-center">
                                    <span className="text-lg font-semibold text-gray-700">
                                        {formData.days}
                                    </span>
                                    <div className="text-xs text-gray-500">days</div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>1 day</span>
                                <span>14 days</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Daily Study Time: <span className="font-bold text-blue-600">{formData.dailyHours} hours/day</span>
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="range"
                                    name="dailyHours"
                                    min="0.5"
                                    max="8"
                                    step="0.5"
                                    value={formData.dailyHours}
                                    onChange={handleChange}
                                    className="flex-1 h-2 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="w-20 text-center">
                                    <span className="text-lg font-semibold text-gray-700">
                                        {formData.dailyHours}
                                    </span>
                                    <div className="text-xs text-gray-500">hours</div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>0.5h</span>
                                <span>8h</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preferred Days and Times */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-6">
                        <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                        <label className="block text-lg font-semibold text-gray-900">
                            Availability
                        </label>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Preferred Days */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Study Days
                            </label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                {daysOfWeek.map((day) => (
                                    <button
                                        key={day.id}
                                        type="button"
                                        onClick={() => handleDayToggle(day.label)}
                                        className={`py-2.5 rounded-lg border transition-all ${
                                            formData.preferredDays.includes(day.label)
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md transform scale-105'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="font-medium text-sm">{day.label.substring(0, 3)}</div>
                                        {formData.preferredDays.includes(day.label) && (
                                            <div className="text-xs opacity-90">✓</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                Selected: <span className="font-medium text-blue-600">{formData.preferredDays.join(', ')}</span>
                            </div>
                        </div>

                        {/* Preferred Times */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preferred Study Times
                            </label>
                            <input
                                type="text"
                                name="preferredTimes"
                                value={formData.preferredTimes}
                                onChange={handleChange}
                                placeholder="e.g., Morning 9-11, Afternoon 2-4, Evening 7-9"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Specify your preferred study time slots
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overall Plan Intensity */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center mb-6">
                    <Brain className="h-5 w-5 text-blue-600 mr-2" />
                    <label className="block text-lg font-semibold text-gray-900">
                        Overall Plan Intensity
                        <span className="ml-2 text-sm font-normal text-gray-600">
                            (Currently: <span className={`font-bold ${
                                formData.difficulty === 'easy' ? 'text-green-600' :
                                formData.difficulty === 'medium' ? 'text-blue-600' : 'text-red-600'
                            }`}>{formData.difficulty.toUpperCase()}</span>)
                        </span>
                    </label>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { 
                            value: 'easy', 
                            label: 'Light', 
                            desc: 'Balanced pace with breaks', 
                            icon: '🌱',
                            details: 'More breaks, lighter sessions',
                            color: 'green'
                        },
                        { 
                            value: 'medium', 
                            label: 'Standard', 
                            desc: 'Regular study intensity', 
                            icon: '⚡',
                            details: 'Balanced sessions, standard pace',
                            color: 'blue'
                        },
                        { 
                            value: 'hard', 
                            label: 'Intensive', 
                            desc: 'Focused exam preparation', 
                            icon: '🔥',
                            details: 'Dense sessions, fewer breaks',
                            color: 'red'
                        }
                    ].map((level) => (
                        <button
                            key={level.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, difficulty: level.value }))}
                            className={`px-4 py-4 rounded-xl border transition-all transform hover:scale-[1.02] active:scale-[0.98] text-left ${
                                formData.difficulty === level.value
                                    ? `bg-gradient-to-r from-${level.color}-600 to-${level.color}-700 text-white border-${level.color}-600 shadow-lg ring-2 ring-${level.color}-400 ring-offset-2`
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-bold text-lg">{level.label}</div>
                                <div className="text-xl">{level.icon}</div>
                            </div>
                            <div className="text-sm mb-1">{level.desc}</div>
                            <div className={`text-xs ${formData.difficulty === level.value ? 'text-blue-100' : 'text-gray-500'}`}>
                                {level.details}
                            </div>
                            {formData.difficulty === level.value && (
                                <div className="mt-2 pt-2 border-t border-white/20">
                                    <div className="text-xs font-medium text-white/90 flex items-center">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        SELECTED
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
                
                {/* Intensity Description */}
                <div className={`mt-4 p-4 rounded-lg transition-all duration-300 ${
                    formData.difficulty === 'easy' ? 'bg-green-50 border border-green-200' :
                    formData.difficulty === 'medium' ? 'bg-blue-50 border border-blue-200' :
                    'bg-red-50 border border-red-200'
                }`}>
                    <div className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                            formData.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
                            formData.difficulty === 'medium' ? 'bg-blue-100 text-blue-600' :
                            'bg-red-100 text-red-600'
                        }`}>
                            <TrendingUp className="h-3 w-3" />
                        </div>
                        <div>
                            <p className={`text-sm font-semibold ${
                                formData.difficulty === 'easy' ? 'text-green-800' :
                                formData.difficulty === 'medium' ? 'text-blue-800' :
                                'text-red-800'
                            }`}>
                                {formData.difficulty === 'easy' 
                                    ? 'Light Intensity'
                                    : formData.difficulty === 'medium'
                                    ? 'Standard Intensity'
                                    : 'Intensive'}
                            </p>
                            <p className={`text-sm ${
                                formData.difficulty === 'easy' ? 'text-green-700' :
                                formData.difficulty === 'medium' ? 'text-blue-700' :
                                'text-red-700'
                            }`}>
                                {formData.difficulty === 'easy' 
                                    ? 'Suitable for consistent, long-term learning with ample breaks. Perfect for gradual progress.'
                                    : formData.difficulty === 'medium'
                                    ? 'Balanced approach for most study goals. Optimal mix of study sessions and breaks.'
                                    : 'Recommended for exam preparation or tight deadlines. Focused sessions with fewer breaks.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-4">
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Generate Multi-Course Study Plan
                    {getHighPriorityCourses().length > 0 && (
                        <span className="ml-2 px-2 py-1 bg-white/20 text-xs rounded-full">
                            +15% revision for high priority
                        </span>
                    )}
                </button>
                
                <button
                    type="button"
                    onClick={loadSampleData}
                    className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                >
                    Load Sample Multi-Course Plan with Priority Settings
                </button>
                
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">{formData.courses.length}</span> courses added
                        </p>
                    </div>
                    
                    {getHighPriorityCourses().length > 0 && (
                        <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-50 to-pink-50 rounded-full">
                            <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">{getHighPriorityCourses().length}</span> high priority courses (15% extra revision time)
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
};

export default PlanForm;