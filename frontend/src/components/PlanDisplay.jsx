import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Target, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Brain,
  Zap,
  Layers,
  BarChart3,
  Users,
  Download,
  Printer,
  Share2
} from 'lucide-react';

const PlanDisplay = ({ plan }) => {
  const [expandedDay, setExpandedDay] = useState(null);
  const [activeTab, setActiveTab] = useState('schedule');

  if (!plan) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400">No plan data available</div>
      </div>
    );
  }

  // Safely extract data with fallbacks
  const courses = plan.courses || [];
  const dailySchedule = plan.dailySchedule || [];
  const timeAllocation = plan.timeAllocation || [];
  const goal = plan.goal || 'Study Plan';
  const totalDays = plan.totalDays || 0;
  const dailyHours = plan.dailyHours || 0;
  const overallIntensity = plan.overallIntensity || plan.difficulty || 'medium';
  const description = plan.description || '';
  const courseBalance = plan.courseBalance || {};
  const recommendations = plan.recommendations || [];
  const studyTips = plan.studyTips || [];

  // Calculate high priority courses
  const highPriorityCourses = courses.filter(course => 
    course.priorityLevel === 'HIGH' || course.weight > 70
  );

  const toggleDay = (dayIndex) => {
    if (expandedDay === dayIndex) {
      setExpandedDay(null);
    } else {
      setExpandedDay(dayIndex);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(plan, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `study-plan-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getIntensityColor = (intensity) => {
    switch(intensity?.toLowerCase()) {
      case 'easy': return 'green';
      case 'medium': return 'blue';
      case 'hard': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return 'red';
      case 'MEDIUM': return 'yellow';
      case 'LOW': return 'green';
      default: return 'gray';
    }
  };

  const getActivityTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'study': return 'blue';
      case 'review': return 'purple';
      case 'practice': return 'green';
      case 'break': return 'gray';
      case 'high-priority-review': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div className="space-y-8">
      {/* Plan Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{goal}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{totalDays} days</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{dailyHours} hours/day</span>
              </div>
              <div className="flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                <span className={`font-semibold text-${getIntensityColor(overallIntensity)}-300`}>
                  {overallIntensity.toUpperCase()} Intensity
                </span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{courses.length} courses</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
          <p className="text-gray-700">{description}</p>
        </div>
      )}

      {/* High Priority Alert */}
      {highPriorityCourses.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-5 border border-red-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">High Priority Courses Detected</h3>
              <p className="text-red-700">
                {highPriorityCourses.map(c => c.name).join(', ')} will receive 15% extra revision time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'schedule'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="h-4 w-4 inline-block mr-2" />
            Daily Schedule
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'courses'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Layers className="h-4 w-4 inline-block mr-2" />
            Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('time')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'time'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline-block mr-2" />
            Time Allocation
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'tips'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Zap className="h-4 w-4 inline-block mr-2" />
            Tips & Recommendations
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            {dailySchedule.map((day, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Day Header */}
                <div 
                  className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 cursor-pointer hover:from-blue-50 hover:to-indigo-50 transition-all"
                  onClick={() => toggleDay(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          Day {index + 1}: {day.dayOfWeek || `Day ${index + 1}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {day.date} • Focus: {day.focus || 'Multiple courses'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{day.totalHours || dailyHours} hours</div>
                        <div className="text-sm text-gray-500">Total study time</div>
                      </div>
                      {expandedDay === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                  
                  {/* Day Summary */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {day.coursesCovered && day.coursesCovered.map((course, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {course}
                      </span>
                    ))}
                    {day.highPrioritySessions && day.highPrioritySessions.length > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                        High Priority Review
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Expanded Content */}
                {expandedDay === index && (
                  <div className="p-6 space-y-6">
                    {/* Milestone */}
                    {day.milestone && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-start">
                          <Target className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-green-800 mb-1">Today's Milestone</h4>
                            <p className="text-green-700">{day.milestone}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Sessions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-blue-600" />
                        Study Sessions
                      </h4>
                      <div className="space-y-3">
                        {day.sessions && day.sessions.map((session, sessionIndex) => (
                          <div 
                            key={sessionIndex}
                            className={`p-4 rounded-lg border ${
                              session.priority === 'high' 
                                ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' 
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-gray-900">{session.time}</span>
                                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                    session.priority === 'high' 
                                      ? 'bg-red-100 text-red-700' 
                                      : `bg-${getActivityTypeColor(session.type)}-100 text-${getActivityTypeColor(session.type)}-700`
                                  }`}>
                                    {session.priority === 'high' ? 'HIGH PRIORITY' : session.type?.toUpperCase()}
                                  </span>
                                </div>
                                <h5 className="font-semibold text-gray-900">{session.course}</h5>
                                <p className="text-gray-600">{session.topic}</p>
                                <p className="text-gray-500 text-sm mt-1">{session.activity}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">{session.duration || 1.5}h</div>
                                <div className="text-sm text-gray-500">Duration</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Breaks */}
                    {day.breaks && day.breaks.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <Users className="h-5 w-5 mr-2 text-gray-600" />
                          Breaks
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {day.breaks.map((breakItem, breakIndex) => (
                            <div key={breakIndex} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium text-gray-900">{breakItem.time}</span>
                                  <p className="text-gray-600 text-sm">{breakItem.activity}</p>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-gray-900">{breakItem.duration || 0.5}h</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-xl border overflow-hidden ${
                    course.priorityLevel === 'HIGH' 
                      ? 'border-red-300 shadow-lg' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className={`p-4 ${
                    course.priorityLevel === 'HIGH' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
                      : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{course.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                            course.priorityLevel === 'HIGH' 
                              ? 'bg-white/30' 
                              : 'bg-white/20'
                          }`}>
                            {course.priorityLevel || 'MEDIUM'} PRIORITY
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                            course.difficulty === 'hard' 
                              ? 'bg-red-500/30' 
                              : course.difficulty === 'medium' 
                              ? 'bg-yellow-500/30' 
                              : 'bg-green-500/30'
                          }`}>
                            {course.difficulty?.toUpperCase() || 'MEDIUM'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{course.weight || 50}%</div>
                        <div className="text-xs opacity-90">Weight</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {/* Time Allocation */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Daily Time:</span>
                        <span className="font-semibold text-gray-900">
                          {parseFloat(course.dailyHours || course.totalDailyTime || 0).toFixed(2)}h
                          {course.extraRevisionTime && parseFloat(course.extraRevisionTime) > 0 && (
                            <span className="text-red-600 ml-1">
                              (+{parseFloat(course.extraRevisionTime).toFixed(2)}h revision)
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            course.priorityLevel === 'HIGH' 
                              ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                              : course.priorityLevel === 'MEDIUM'
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gradient-to-r from-green-500 to-emerald-600'
                          }`}
                          style={{ width: `${course.allocatedPercentage || 100/courses.length}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Topics */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                        Topics
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(course.topics) ? (
                          course.topics.slice(0, 5).map((topic, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                              {topic}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {course.topics || 'No topics specified'}
                          </span>
                        )}
                        {Array.isArray(course.topics) && course.topics.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{course.topics.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Extra Revision Time for High Priority */}
                    {course.priorityLevel === 'HIGH' && parseFloat(course.extraRevisionTime) > 0 && (
                      <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                          <div>
                            <p className="text-sm font-semibold text-red-800">Extra Revision Time</p>
                            <p className="text-xs text-red-700">
                              15% additional time allocated for review and practice
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Allocation Tab */}
        {activeTab === 'time' && (
          <div className="space-y-6">
            {/* Time Allocation Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Time Distribution Across Courses
              </h3>
              
              <div className="space-y-4">
                {timeAllocation.map((allocation, index) => {
                  // Safely parse float values with fallbacks
                  const dailyBaseHours = parseFloat(allocation.dailyBaseHours || allocation.dailyHours || 0);
                  const extraRevisionHours = parseFloat(allocation.extraRevisionHours || 0);
                  const totalDailyTime = parseFloat(allocation.totalDailyTime || dailyBaseHours + extraRevisionHours);
                  const percentage = parseFloat(allocation.percentage || (100 / timeAllocation.length));
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{allocation.course}</span>
                          {allocation.priorityLevel === 'HIGH' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                              HIGH PRIORITY
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900">
                            {totalDailyTime.toFixed(2)}h daily
                          </span>
                          {extraRevisionHours > 0 && (
                            <span className="text-red-600 text-xs ml-1">
                              (+{extraRevisionHours.toFixed(2)}h revision)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              allocation.priorityLevel === 'HIGH' 
                                ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                                : allocation.priorityLevel === 'MEDIUM'
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                : 'bg-gradient-to-r from-green-500 to-emerald-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-16 text-right">
                          <span className="font-bold text-gray-900">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                        <div>
                          <div>Base Time</div>
                          <div className="font-semibold text-gray-900">{dailyBaseHours.toFixed(2)}h</div>
                        </div>
                        {extraRevisionHours > 0 && (
                          <div>
                            <div>Extra Revision</div>
                            <div className="font-semibold text-red-600">{extraRevisionHours.toFixed(2)}h</div>
                          </div>
                        )}
                        <div>
                          <div>Weekly Total</div>
                          <div className="font-semibold text-gray-900">
                            {(totalDailyTime * totalDays).toFixed(2)}h
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* High Priority Summary */}
              {highPriorityCourses.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">High Priority Time Allocation</h4>
                  <div className="space-y-2">
                    {timeAllocation
                      .filter(a => a.priorityLevel === 'HIGH')
                      .map((allocation, index) => {
                        const dailyBaseHours = parseFloat(allocation.dailyBaseHours || allocation.dailyHours || 0);
                        const extraRevisionHours = parseFloat(allocation.extraRevisionHours || 0);
                        
                        return (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-red-700">{allocation.course}</span>
                            <div>
                              <span className="text-red-900 font-semibold">
                                {dailyBaseHours.toFixed(2)}h base + {extraRevisionHours.toFixed(2)}h extra
                              </span>
                              <span className="text-red-600 ml-2">
                                (Total: {(dailyBaseHours + extraRevisionHours).toFixed(2)}h)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Course Balance Strategy */}
            {courseBalance && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Course Balance Strategy</h3>
                <p className="text-gray-700 mb-4">{courseBalance.strategy || 'Courses are balanced based on priority and difficulty levels.'}</p>
                
                {courseBalance.recommendations && courseBalance.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Recommendations:</h4>
                    <ul className="space-y-2">
                      {courseBalance.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tips & Recommendations Tab */}
        {activeTab === 'tips' && (
          <div className="space-y-6">
            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-gray-700">{rec}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Study Tips */}
            {studyTips.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-600" />
                  Study Tips
                </h3>
                <div className="space-y-3">
                  {studyTips.map((tip, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold">✓</span>
                      </div>
                      <p className="text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Overall Intensity Tips */}
            <div className={`p-6 rounded-xl border ${
              overallIntensity === 'easy' 
                ? 'bg-green-50 border-green-200' 
                : overallIntensity === 'medium' 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                {overallIntensity.toUpperCase()} Intensity Tips
              </h3>
              <div className="space-y-3">
                {overallIntensity === 'easy' && (
                  <>
                    <p className="text-gray-700">• Take regular breaks every 45-50 minutes</p>
                    <p className="text-gray-700">• Mix study sessions with light activities</p>
                    <p className="text-gray-700">• Focus on understanding rather than memorization</p>
                  </>
                )}
                {overallIntensity === 'medium' && (
                  <>
                    <p className="text-gray-700">• Take breaks every 60 minutes</p>
                    <p className="text-gray-700">• Alternate between different subjects</p>
                    <p className="text-gray-700">• Include both study and practice sessions</p>
                  </>
                )}
                {overallIntensity === 'hard' && (
                  <>
                    <p className="text-gray-700">• Focus on high-priority topics first</p>
                    <p className="text-gray-700">• Take short breaks every 90 minutes</p>
                    <p className="text-gray-700">• Include intensive practice sessions</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-500">
            Plan generated on {plan.metadata?.generatedAt ? new Date(plan.metadata.generatedAt).toLocaleDateString() : new Date().toLocaleDateString()}
            {plan.metadata?.model && ` using ${plan.metadata.model}`}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveTab('schedule')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Start Studying
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDisplay;