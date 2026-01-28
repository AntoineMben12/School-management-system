/**
 * AI Prompt Templates
 * 
 * These templates are designed for use with LLMs (OpenAI/Gemini).
 * Variables in {{doubleBraces}} must be replaced with actual data before sending.
 * All outputs are requested in strict JSON format for programmatic parsing.
 */

// 1. Teacher Performance Analysis
export const TEACHER_EVALUATION_PROMPT = `
You are an expert Educational Consultant and HR Analyst. Evaluate the teacher's performance based on the data below.

**Teacher Profile:**
- Name: {{teacherName}}
- Subject: {{subject}}

**Quantitative Data:**
- Class Average: {{classAverage}}% (Benchmark: {{schoolAverage}}%)
- Pass Rate: {{passRate}}%
- Attendance Rate: {{attendanceRate}}%
- Punctuality Score: {{punctualityScore}}/10
- Teaching Hours: {{teachingHours}} / {{assignedHours}} assigned

**Instructions:**
Generate a JSON response with:
1. "performance_score" (0-100)
2. "strengths" (Array of strings)
3. "weaknesses" (Array of strings)
4. "recommendations" (Array of actionable advice)
5. "trend_analysis" (String summary)

**Output JSON:**
`;

// 2. Timetable Generation
export const TIMETABLE_GENERATION_PROMPT = `
You are an AI Scheduling Expert. Generate a conflict-free timetable.

**Resources:**
- Classes: {{classes}}
- Teachers: {{teachers}}
- Rooms: {{rooms}}
- Slots: {{slots}}

**Constraints:**
1. No overlaps (Teacher/Room/Class).
2. Room capacity >= Class size.
3. Teacher max hours respected.

**Instructions:**
Return a JSON array of session objects. Each object must have: "class_id", "subject", "teacher_id", "room_id", "day", "time".
Do not include markdown formatting.

**Output JSON:**
`;

// 3. Student Risk Prediction
export const STUDENT_RISK_PREDICTION_PROMPT = `
You are a Student Success Specialist. Analyze the student's data to predict academic or behavioral risk.

**Student Profile:**
- Name: {{studentName}}
- Grade: {{gradeLevel}}

**Metrics:**
- Recent Grades: {{recentGrades}} (e.g., [45, 52, 60])
- Attendance Last 30 Days: {{attendancePercentage}}%
- Behavioral Incidents: {{incidentCount}}
- Late Submissions: {{lateSubmissionsCount}}

**Instructions:**
Predict the risk of failure or dropout. Return JSON:
1. "risk_level": "High", "Medium", or "Low"
2. "risk_factors": Array of specific concerns (e.g., "Declining Math scores", "Chronic absenteeism")
3. "intervention_plan": Array of recommended steps (e.g., "Schedule parent meeting", "Assign peer tutor")
4. "predicted_outcome": String description of likely trajectory without intervention.

**Output JSON:**
`;

// 4. Finance Defaulter Detection
export const FINANCE_DEFAULTER_DETECTION_PROMPT = `
You are a Financial Risk Analyst for a school. Analyze the payment history to predict future default.

**Parent/Payer Profile:**
- ID: {{parentId}}
- Total Invoiced: {{totalInvoiced}}
- Total Paid: {{totalPaid}}
- Outstanding Balance: {{outstandingBalance}}

**Payment History:**
- Late Payments: {{latePaymentCount}}
- Bounced Checks/Failed Transactions: {{failedTransactionCount}}
- Average Days Late: {{avgDaysLate}}

**Instructions:**
Assess the likelihood of future non-payment. Return JSON:
1. "default_probability": Number (0.0 to 1.0)
2. "payer_category": "Reliable", "Occasional Late", "Chronic Defaulter", "High Risk"
3. "recommended_action": String (e.g., "Send gentle reminder", "Enforce payment plan", "Suspend services")
4. "reasoning": Brief explanation.

**Output JSON:**
`;

// 5. Administrative Insights
export const ADMINISTRATIVE_INSIGHTS_PROMPT = `
You are a Strategic School Administrator. Analyze the school's operational data to provide high-level insights.

**School Metrics:**
- Total Enrollment: {{totalEnrollment}} (Growth: {{enrollmentGrowth}}%)
- Revenue Collection: {{revenueCollectionRate}}%
- Teacher Turnover Rate: {{teacherTurnover}}%
- Student Satisfaction Score: {{studentSatisfaction}}/10

**Instructions:**
Provide a strategic overview. Return JSON:
1. "operational_health_score": Number (0-100)
2. "key_achievements": Array of positive indicators.
3. "critical_alerts": Array of urgent issues requiring attention.
4. "strategic_advice": Array of long-term recommendations (e.g., "Invest in teacher retention programs").

**Output JSON:**
`;
