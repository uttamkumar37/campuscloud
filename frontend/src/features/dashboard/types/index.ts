export interface MetricPoint {
  label: string
  value: number
}

export interface RecentActivity {
  title: string
  description: string
  type: string
  occurredAt: string
}

export interface TenantBranding {
  tenantId: string
  schoolName: string
  logoUrl: string | null
  primaryColor: string
}

export interface TenantDashboardSummary {
  branding: TenantBranding
  totalStudents: number
  totalTeachers: number
  attendancePercentage: number
  feesCollected: number
  attendanceTrend: MetricPoint[]
  monthlyFeeCollection: MetricPoint[]
  recentActivity: RecentActivity[]
  quickInsights: string[]
}

// ─── Student Dashboard ────────────────────────────────────────────────────

export interface StudentProfileInfo {
  id: string
  admissionNo: string
  firstName: string
  lastName: string
  email: string
}

export interface AttendanceDay {
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'NO_RECORD'
}

export interface AttendanceSummaryInfo {
  totalDays: number
  presentDays: number
  presentPercent: number
  lastSevenDays: AttendanceDay[]
}

export interface FeesSummaryInfo {
  totalAmount: number
  paidAmount: number
  pendingAmount: number
  totalAssignments: number
  pendingAssignments: number
}

export interface ExamResultSummary {
  examTitle: string
  examDate: string
  marksObtained: number
  maxMarks: number
  grade: string | null
}

export interface HomeworkSummaryStudent {
  id: string
  title: string
  dueDate: string | null
  overdue: boolean
}

export interface TimetableSlotSummaryStudent {
  subjectName: string
  startTime: string
  endTime: string
  label: string | null
}

export interface StudentDashboard {
  profile: StudentProfileInfo
  attendance: AttendanceSummaryInfo
  fees: FeesSummaryInfo
  recentResults: ExamResultSummary[]
  recentHomework: HomeworkSummaryStudent[]
  todayTimetable: TimetableSlotSummaryStudent[]
}

// ─── Teacher Dashboard ────────────────────────────────────────────────────

export interface TeacherProfileInfo {
  id: string
  employeeNo: string
  firstName: string
  lastName: string
  email: string
}

export interface AssignedClassInfo {
  classId: string
  className: string
  sectionId: string
  sectionName: string
}

export interface HomeworkSummaryTeacher {
  id: string
  title: string
  dueDate: string | null
  className: string
}

export interface ExamSummaryTeacher {
  id: string
  title: string
  examDate: string
  className: string
}

export interface TimetableSlotSummaryTeacher {
  subjectName: string
  className: string
  sectionName: string
  startTime: string
  endTime: string
  label: string | null
}

export interface TeacherDashboard {
  profile: TeacherProfileInfo
  assignedClasses: AssignedClassInfo[]
  recentHomework: HomeworkSummaryTeacher[]
  recentExams: ExamSummaryTeacher[]
  todayTimetable: TimetableSlotSummaryTeacher[]
}
