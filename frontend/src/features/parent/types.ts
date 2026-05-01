export interface Child {
  studentId: string
  admissionNo: string
  firstName: string
  lastName: string
}

export interface LinkParentRequest {
  parentUserId: string
  studentId: string
}
