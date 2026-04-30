export interface HomeworkItem {
  id: string
  title: string
  description: string | null
  classId: string
  sectionId: string | null
  assignedByUserId: string | null
  dueDate: string | null
  createdAt: string
}

export interface CreateHomeworkRequest {
  title: string
  description: string | null
  classId: string
  sectionId: string | null
  dueDate: string | null
}
