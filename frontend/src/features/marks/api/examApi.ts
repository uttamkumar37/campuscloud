import { apiClient } from '../../../api/client'
import { ENDPOINTS } from '../../../api/endpoints'
import type { ApiResponse } from '../../../types/api'

import type { CreateExamRequest, CreateExamResultRequest, Exam, ExamResult } from '../types'

export async function createExam(payload: CreateExamRequest) {
  const { data } = await apiClient.post<ApiResponse<Exam>>(ENDPOINTS.exams.base, payload)
  return data
}

export async function getExamsByClass(classId: string) {
  const { data } = await apiClient.get<ApiResponse<Exam[]>>(ENDPOINTS.exams.byClass(classId))
  return data
}

export async function createExamResult(payload: CreateExamResultRequest) {
  const { data } = await apiClient.post<ApiResponse<ExamResult>>(ENDPOINTS.exams.results, payload)
  return data
}

export async function getExamResults(examId: string) {
  const { data } = await apiClient.get<ApiResponse<ExamResult[]>>(ENDPOINTS.exams.resultsByExam(examId))
  return data
}
