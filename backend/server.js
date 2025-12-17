const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors())

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Multi-Course Study Planner API',
    status: 'running',
    version: '1.0.0',
    features: [
      'Multi-course study planning',
      'Priority-based extra revision time (15% more for high priority courses)',
      'Overall intensity adjustment',
      'Date-based scheduling',
      'AI-powered planning with GROQ'
    ],
    endpoints: {
      generatePlan: 'POST /api/generate-plan',
      health: 'GET /api/health',
      testAI: 'POST /api/test-ai',
      testPlan: 'GET /api/test-plan',
      models: 'GET /api/models',
      goals: 'GET /api/goals',
      backgrounds: 'GET /api/backgrounds',
      timeOptions: 'GET /api/time-options',
      difficulties: 'GET /api/difficulties'
    },
    documentation: {
      note: 'Use the /api/generate-plan endpoint to create study plans with multiple courses',
      priorityFeature: 'Courses with weight > 70 get 15% extra revision time',
      intensityLevels: 'easy, medium, hard - affects session density and breaks'
    }
  });
});

// Check API key
if (!process.env.GROQ_API_KEY) {
  console.error('❌ ERROR: GROQ_API_KEY missing in .env file!');
  console.log('');
  console.log('📝 Create .env file with:');
  console.log('PORT=5000');
  console.log('GROQ_API_KEY=your_groq_key_here');
  console.log('');
  console.log('🔑 Get FREE key: https://console.groq.com/keys');
  // Don't exit in production for Vercel
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
}

// Helper function to calculate actual dates based on preferred days
function calculateStudyDates(totalDays, preferredDays, startDate = new Date()) {
  const dates = [];
  let currentDate = new Date(startDate);
  let daysAdded = 0;
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  while (daysAdded < totalDays) {
    const currentDayName = dayNames[currentDate.getDay()];
    
    if (preferredDays.includes(currentDayName)) {
      dates.push({
        date: currentDate.toISOString().split('T')[0],
        day: currentDayName,
        dayNumber: daysAdded + 1
      });
      daysAdded++;
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
    
    // Safety break
    if (dates.length > 100) break;
  }
  
  return dates;
}

// Calculate time allocation based on course weights
function calculateTimeAllocation(courses, dailyHours) {
  const totalWeight = courses.reduce((sum, course) => sum + (course.weight || 50), 0);
  
  return courses.map(course => {
    const percentage = (course.weight || 50) / totalWeight;
    return {
      ...course,
      dailyHours: dailyHours * percentage,
      percentage: Math.round(percentage * 100),
      priorityLevel: course.weight > 70 ? 'HIGH' : course.weight > 40 ? 'MEDIUM' : 'LOW'
    };
  });
}

// List of WORKING GROQ models
const WORKING_GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.2-3b-preview',
  'llama-3.2-1b-preview',
  'gemma2-9b-it',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768'
];

// Main function - Updated for multiple courses
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { 
      goal, 
      courses,  // Changed from topics to courses
      days: totalDays, 
      dailyHours, 
      difficulty = 'medium', 
      preferredTimes = 'Flexible',
      preferredDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    } = req.body;

    // Validation
    if (!goal || !courses || !totalDays || !dailyHours) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields',
        required: ['goal', 'courses', 'days', 'dailyHours']
      });
    }

    if (totalDays < 1 || totalDays > 14) {
      return res.status(400).json({ 
        success: false,
        error: 'Duration must be between 1-14 days' 
      });
    }

    if (dailyHours < 0.5 || dailyHours > 8) {
      return res.status(400).json({ 
        success: false,
        error: 'Daily hours must be between 0.5-8 hours' 
      });
    }

    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one course'
      });
    }

    console.log('📝 Generating multi-course study plan for:', goal);
    console.log('📊 Courses:', courses.length);
    console.log('📈 Parameters:', { totalDays, dailyHours, overallIntensity: difficulty });

    // Calculate time allocation for each course
    const coursesWithAllocation = calculateTimeAllocation(courses, dailyHours);
    console.log('⏰ Time Allocation:', coursesWithAllocation.map(c => ({
      name: c.name,
      priority: c.priorityLevel,
      percentage: c.percentage + '%',
      dailyHours: c.dailyHours.toFixed(2),
      extraRevision: c.priorityLevel === 'HIGH' ? '15% extra' : 'none'
    })));

    // Calculate actual study dates
    const studyDates = calculateStudyDates(totalDays, preferredDays);
    
    if (studyDates.length !== totalDays) {
      console.warn(`Warning: Could only find ${studyDates.length} days out of ${totalDays} requested`);
    }

    // Create detailed prompt for multiple courses with high priority revision time
    const prompt = `You are an Expert Multi-Course Study Planner. Create a detailed ${totalDays}-day study plan for MULTIPLE courses.

CRITICAL REQUIREMENTS:
1. The student is studying ${courses.length} different courses/subjects
2. Allocate study time proportionally based on course priority/weights
3. For courses with HIGH priority (weight > 70), allocate EXTRA REVISION TIME (15-20% extra time)
4. Balance courses across the week - don't focus on one course only
5. Include mixed sessions where appropriate (review of multiple courses)
6. Schedule ONLY on these specific days: ${preferredDays.join(', ')}
7. Account for OVERALL PLAN INTENSITY: ${difficulty}

OVERVIEW:
ACADEMIC GOAL: ${goal}
STUDY DURATION: ${totalDays} days
DAILY STUDY TIME: ${dailyHours} hours per day
OVERALL PLAN INTENSITY: ${difficulty}
AVAILABLE DAYS: ${preferredDays.join(', ')}
PREFERRED TIME SLOTS: ${preferredTimes}

COURSES WITH TIME ALLOCATION:
${coursesWithAllocation.map(course => {
  const extraReviseTime = course.priorityLevel === 'HIGH' ? ` [+${Math.round(course.dailyHours * 0.15)}h for revision]` : '';
  return `
- ${course.name} (${course.percentage}% of daily time = ~${course.dailyHours.toFixed(1)} hours/day${extraReviseTime})
  Topics: ${Array.isArray(course.topics) ? course.topics.join(', ') : course.topics}
  Difficulty: ${course.difficulty || 'medium'}
  Priority: ${course.weight || 50}/100 (${course.priorityLevel})`;
}).join('')}

STUDY DAY SCHEDULE:
${studyDates.map((date, index) => `Day ${index + 1}: ${date.day} (${date.date})`).join('\n')}

INSTRUCTIONS:
1. Create a BALANCED schedule that includes ALL courses
2. Each day should include sessions from MULTIPLE courses
3. Distribute difficult topics across different days
4. For HIGH PRIORITY courses (weight > 70), include extra revision sessions (15-20% more time)
5. Include review sessions that combine related topics from different courses
6. Consider course difficulty when allocating time (harder courses get more time)
7. Include short breaks between sessions
8. Schedule based on preferred time slots: ${preferredTimes}
9. Ensure total daily study time is approximately ${dailyHours} hours
10. Account for OVERALL PLAN INTENSITY: ${difficulty}:
    - If intensity is "easy": More breaks, lighter sessions
    - If intensity is "medium": Balanced approach
    - If intensity is "hard": Dense sessions, fewer breaks, more focus

HIGH PRIORITY COURSES EXTRA TIME ALLOCATION:
${coursesWithAllocation.filter(c => c.priorityLevel === 'HIGH').map(c => `- ${c.name}: ${c.dailyHours.toFixed(1)}h base + ${(c.dailyHours * 0.15).toFixed(1)}h revision = ${(c.dailyHours * 1.15).toFixed(1)}h total`).join('\n') || 'None'}

Return ONLY valid JSON in this format:
{
  "goal": "${goal}",
  "totalDays": ${totalDays},
  "dailyHours": ${dailyHours},
  "overallIntensity": "${difficulty}",
  "courses": ${JSON.stringify(coursesWithAllocation.map(c => ({
    name: c.name,
    topics: Array.isArray(c.topics) ? c.topics : [c.topics],
    weight: c.weight,
    difficulty: c.difficulty || 'medium',
    priorityLevel: c.priorityLevel,
    allocatedPercentage: c.percentage,
    dailyHours: c.dailyHours,
    extraRevisionTime: c.priorityLevel === 'HIGH' ? (c.dailyHours * 0.15).toFixed(2) : 0,
    totalDailyTime: c.priorityLevel === 'HIGH' ? (c.dailyHours * 1.15).toFixed(2) : c.dailyHours.toFixed(2)
  })))},
  "timeAllocation": ${JSON.stringify(coursesWithAllocation.map(c => ({
    course: c.name,
    percentage: c.percentage,
    priorityLevel: c.priorityLevel,
    dailyBaseHours: c.dailyHours,
    extraRevisionHours: c.priorityLevel === 'HIGH' ? (c.dailyHours * 0.15).toFixed(2) : 0,
    totalDailyTime: c.priorityLevel === 'HIGH' ? (c.dailyHours * 1.15).toFixed(2) : c.dailyHours.toFixed(2),
    weeklyHours: (c.dailyHours * (c.priorityLevel === 'HIGH' ? 1.15 : 1) * totalDays).toFixed(2)
  })))},
  "description": "Brief overview explaining how courses are balanced with priority-based extra revision time",
  "dailySchedule": [
    {
      "day": 1,
      "dayOfWeek": "${studyDates[0]?.day || 'Monday'}",
      "date": "${studyDates[0]?.date || new Date().toISOString().split('T')[0]}",
      "totalHours": ${dailyHours},
      "focus": "Primary focus for today - mention which courses",
      "coursesCovered": ["Course1", "Course2"],
      "highPrioritySessions": ["Course with high priority gets extra revision"],
      "sessions": [
        {
          "time": "09:00 - 10:30",
          "course": "Course Name",
          "topic": "Specific Topic",
          "activity": "Study activity description",
          "duration": 1.5,
          "type": "study", // or "review", "practice", "break", "high-priority-review"
          "priority": "normal" // or "high" for high priority course sessions
        }
      ],
      "breaks": [
        {
          "time": "10:30 - 11:00",
          "duration": 0.5,
          "activity": "Break / Refresh"
        }
      ],
      "milestone": "Today's learning objectives across courses"
    }
  ],
  "courseBalance": {
    "strategy": "Explain how courses are balanced with priority-based extra time",
    "highPriorityExtraTime": ${JSON.stringify(coursesWithAllocation.filter(c => c.priorityLevel === 'HIGH').map(c => ({
      course: c.name,
      extraTimeHours: (c.dailyHours * 0.15).toFixed(2),
      extraTimePercentage: "15%",
      reason: "High priority course gets extra revision time"
    })))},
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  },
  "recommendations": ["Study tip 1", "Study tip 2"],
  "studyTips": ["Multi-course study tip 1", "Multi-course study tip 2"],
  "priorityBasedFeatures": {
    "highPriorityExtraRevision": true,
    "extraTimePercentage": "15%",
    "appliedToCourses": ${JSON.stringify(coursesWithAllocation.filter(c => c.priorityLevel === 'HIGH').map(c => c.name))}
  }
}

IMPORTANT: 
1. Each day MUST include sessions from AT LEAST 2 different courses. 
2. HIGH PRIORITY courses (weight > 70) get 15-20% extra time for revision.
3. Account for OVERALL PLAN INTENSITY in session density and breaks.
4. Balance is key!
5. Today's date is ${new Date().toISOString().split('T')[0]}.`;

    console.log('⚡ Calling GROQ API for multi-course plan...');
    
    // Try models in order until one works
    let planData;
    let usedModel;
    let lastError;
    
    for (const model of WORKING_GROQ_MODELS) {
      try {
        console.log(`   Trying model: ${model}`);
        const response = await callGroqAPI(prompt, model);
        planData = parseAIResponse(response);
        usedModel = model;
        console.log(`✅ Success with model: ${model}`);
        break;
      } catch (error) {
        lastError = error;
        console.log(`   Model ${model} failed: ${error.message}`);
        continue;
      }
    }

    if (!planData) {
      throw new Error(`All models failed. Last error: ${lastError?.message}`);
    }

    // Add metadata
    planData.metadata = {
      generatedAt: new Date().toISOString(),
      generatedBy: 'GROQ AI',
      model: usedModel,
      provider: 'GROQ',
      note: 'Multi-course study plan with priority-based extra revision',
      totalCourses: courses.length,
      highPriorityCourses: coursesWithAllocation.filter(c => c.priorityLevel === 'HIGH').length,
      input: {
        preferredDays,
        preferredTimes,
        totalDays: studyDates.length,
        courseCount: courses.length,
        overallIntensity: difficulty
      }
    };
    
    planData.success = true;
    planData.id = `plan_${Date.now()}`;
    
    console.log(`🎯 Successfully generated multi-course plan`);
    console.log(`📚 Courses scheduled: ${courses.length}`);
    console.log(`🎯 High priority courses: ${coursesWithAllocation.filter(c => c.priorityLevel === 'HIGH').length}`);
    console.log(`📅 Days scheduled: ${planData.dailySchedule?.length || 0} days`);
    console.log(`⚡ Overall intensity: ${difficulty}`);
    
    res.json(planData);

  } catch (error) {
    console.error('❌ GROQ API Error:', error.message);
    
    let errorMessage = 'Failed to generate study plan';
    let errorDetails = error.message;
    let statusCode = 500;
    
    if (error.message.includes('401') || error.message.includes('Invalid API key')) {
      statusCode = 401;
      errorMessage = 'Invalid GROQ API key';
      errorDetails = 'Please check your GROQ_API_KEY in .env file';
    } else if (error.message.includes('429') || error.message.includes('rate limit')) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded';
      errorDetails = 'Please wait a moment and try again';
    } else if (error.message.includes('model_decommissioned')) {
      statusCode = 400;
      errorMessage = 'Model deprecated';
      errorDetails = 'Please update server.js with latest models';
    }
    
    res.status(statusCode).json({ 
      success: false,
      error: errorMessage,
      message: errorDetails,
      provider: 'GROQ',
      timestamp: new Date().toISOString(),
      suggestion: 'Check https://console.groq.com/docs/models for latest models'
    });
  }
});

// GROQ API call function
async function callGroqAPI(prompt, model = 'llama-3.2-3b-preview') {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a Multi-Course Study Planner Assistant. You MUST return ONLY valid JSON. Create balanced schedules that include multiple courses each day with extra revision time for high priority courses. Account for overall intensity level.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 6000, // Increased for multi-course plans with priority features
      top_p: 0.9,
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GROQ API error ${response.status}: ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response structure from GROQ API');
  }
  
  return data.choices[0].message.content;
}

// Parse AI response
function parseAIResponse(aiText) {
  try {
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.goal || !parsed.dailySchedule) {
      throw new Error('Missing required fields in response');
    }
    
    return parsed;
    
  } catch (error) {
    console.error('Parse error:', error.message);
    console.log('Raw response:', aiText.substring(0, 500));
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

app.get('/api/goals', (req, res) => {
  res.json([
    'Prepare for Final Exams',
    'Complete Course Project',
    'Study for Midterm Exams',
    'Prepare for Certification',
    'Master Specific Topics',
    'Improve Grades'
  ]);
});

app.get('/api/backgrounds', (req, res) => {
  res.json([
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
  ]);
});

app.get('/api/time-options', (req, res) => {
  res.json([
    { id: '1-2', label: '1-2 hours/day' },
    { id: '2-3', label: '2-3 hours/day' },
    { id: '3-4', label: '3-4 hours/day' },
    { id: '4+', label: '4+ hours/day' }
  ]);
});

app.get('/api/difficulties', (req, res) => {
  res.json([
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' }
  ]);
});

// Get available models
app.get('/api/models', (req, res) => {
  res.json({
    success: true,
    models: WORKING_GROQ_MODELS,
    recommended: 'llama-3.2-3b-preview',
    timestamp: new Date().toISOString()
  });
});

// Test GROQ connection
app.post('/api/test-ai', async (req, res) => {
  try {
    console.log('🧪 Testing GROQ API connection...');
    
    let success = false;
    let testResult;
    let usedModel;
    
    for (const model of WORKING_GROQ_MODELS.slice(0, 2)) {
      try {
        const response = await callGroqAPI('Return {"status": "OK", "message": "API is working"}', model);
        const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)[0]);
        success = true;
        testResult = parsed;
        usedModel = model;
        break;
      } catch (error) {
        console.log(`   Model ${model} test failed: ${error.message}`);
        continue;
      }
    }
    
    if (success) {
      res.json({
        success: true,
        message: 'GROQ API is working correctly',
        model: usedModel,
        response: testResult,
        timestamp: new Date().toISOString(),
        availableModels: WORKING_GROQ_MODELS
      });
    } else {
      throw new Error('All models failed');
    }
    
  } catch (error) {
    console.error('Test Error:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'GROQ API test failed',
      message: error.message,
      timestamp: new Date().toISOString(),
      solution: 'Check your GROQ_API_KEY and account status'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Multi-Course Study Planner API is running',
    timestamp: new Date().toISOString(),
    features: [
      'Multi-course planning',
      'Priority-based extra revision time (15% more for high priority)',
      'Overall intensity adjustment',
      'Date-based scheduling',
      'AI-powered with GROQ'
    ],
    status: {
      groqApi: process.env.GROQ_API_KEY ? 'Configured' : 'Missing',
      cors: 'Enabled for localhost and Vercel',
      version: '1.0.0'
    }
  });
});

// Test with sample data
app.get('/api/test-plan', async (req, res) => {
  try {
    const sampleData = {
      goal: "Prepare for Final Exams",
      courses: [
        {
          id: 1,
          name: "Operating Systems",
          topics: "Process Management, Memory Management, File Systems, Virtual Memory",
          weight: 80, // High priority
          difficulty: "hard"
        },
        {
          id: 2,
          name: "Database Systems",
          topics: "SQL Queries, Normalization, Transactions, Indexing",
          weight: 60, // Medium priority
          difficulty: "medium"
        },
        {
          id: 3,
          name: "Data Structures",
          topics: "Trees, Graphs, Sorting Algorithms, Hash Tables",
          weight: 40, // Low priority
          difficulty: "easy"
        }
      ],
      days: 7,
      dailyHours: 3,
      difficulty: "medium",
      preferredTimes: "Morning 9-12, Evening 7-10",
      preferredDays: ["Monday", "Tuesday", "Wednesday", "Thursday"]
    };

    // Create a mock request
    const mockReq = { body: sampleData };
    const mockRes = {
      json: (data) => res.json(data),
      status: (code) => ({ 
        json: (data) => res.status(code).json(data)
      })
    };
    
    // Call the main handler
    await app._router.stack.find(layer => 
      layer.route && layer.route.path === '/api/generate-plan' && layer.route.methods.post
    ).handle(mockReq, mockRes);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error.message
    });
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.method} ${req.url} does not exist`,
    availableEndpoints: {
      GET: ['/', '/api/health', '/api/goals', '/api/backgrounds', '/api/time-options', '/api/difficulties', '/api/models', '/api/test-plan'],
      POST: ['/api/generate-plan', '/api/test-ai']
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Export the app for Vercel
module.exports = app;

// Only start server locally (not in Vercel production)
if (process.env.NODE_ENV !== 'production' || process.env.LOCAL_DEV) {
  app.listen(PORT, () => {
    console.log('='.repeat(70));
    console.log('🚀 MULTI-COURSE STUDY PLANNER WITH PRIORITY-BASED FEATURES');
    console.log('='.repeat(70));
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`⚡ AI Provider: GROQ`);
    console.log(`📚 Feature: Multi-course scheduling enabled`);
    console.log(`🎯 Feature: High priority courses get extra revision time (15% more)`);
    console.log(`📊 Feature: Overall plan intensity adjustment`);
    console.log(`🔑 API Key: ${process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Missing'}`);
    console.log('');
    console.log('📝 ENDPOINTS:');
    console.log(`   • GET  / (API Documentation)`);
    console.log(`   • POST /api/generate-plan (Priority-based extra revision)`);
    console.log(`   • GET  /api/health`);
    console.log(`   • POST /api/test-ai`);
    console.log(`   • GET  /api/test-plan`);
    console.log('');
    console.log('💡 TIP: Courses with weight > 70 get 15% extra revision time');
    console.log('💡 TIP: Overall intensity affects session density and breaks');
    console.log('='.repeat(70));
  });
}