export interface AcademicClass {
  id: string
  name: string
  code: string
  active: boolean
  createdAt: string
}

export interface AcademicSubject {
  id: string
  name: string
  code: string
  active: boolean
  createdAt: string
}

export interface AcademicSection {
  id: string
  name: string
  classId: string
  className: string
  active: boolean
  createdAt: string
}

export interface CreateAcademicClassRequest {
  name: string
  code: string
}

export interface CreateAcademicSubjectRequest {
  name: string
  code: string
}

export interface CreateAcademicSectionRequest {
  name: string
  classId: string
}
