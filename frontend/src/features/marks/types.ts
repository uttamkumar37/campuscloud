export interface Exam {
  id: string
  title: string
  examDate: string
  classId: string
  sectionId: string
  subjectId: string
  maxMarks: number
  active: boolean
  createdAt: string
}

export interface ExamResult {
  id: string
  examId: string
  studentId: string
  marksObtained: number
  grade: string | null
  remarks: string | null
  published: boolean
  createdAt: string
}

export interface CreateExamRequest {
  title: string
  examDate: string
  classId: string
  sectionId: string
  subjectId: string
  maxMarks: number
}

export interface CreateExamResultRequest {
  examId: string
  studentId: string
  marksObtained: number
  grade: string | null
  remarks: string | null
  published: boolean
}
