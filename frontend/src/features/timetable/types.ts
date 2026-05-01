export interface TimetableSlot {
  id: string
  classId: string
  sectionId: string | null
  subjectId: string | null
  teacherId: string | null
  dayOfWeek: number
  startTime: string
  endTime: string
  label: string | null
  createdAt: string
}

export interface CreateTimetableSlotRequest {
  classId: string
  sectionId: string | null
  subjectId: string | null
  teacherId: string | null
  dayOfWeek: number
  startTime: string
  endTime: string
  label: string | null
}
