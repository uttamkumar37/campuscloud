export interface Teacher {
  id: string
  employeeNo: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  hireDate: string
  active: boolean
  createdAt: string
}

export interface CreateTeacherRequest {
  employeeNo: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  hireDate: string
}

export interface UpdateTeacherRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string | null
}
