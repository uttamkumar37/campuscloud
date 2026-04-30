import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'

import { createExam, createExamResult, getExamResults, getExamsByClass } from '../api/examApi'
import type { CreateExamRequest, CreateExamResultRequest } from '../types'

export function useExamsByClass(classId: string) {
  return useQuery({
    queryKey: queryKeys.examsByClass(classId),
    queryFn: () => getExamsByClass(classId),
    enabled: classId.length > 0,
  })
}

export function useCreateExam() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateExamRequest) => createExam(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.examsByClass(variables.classId) })
    },
  })
}

export function useExamResults(examId: string) {
  return useQuery({
    queryKey: queryKeys.examResults(examId),
    queryFn: () => getExamResults(examId),
    enabled: examId.length > 0,
  })
}

export function useCreateExamResult() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateExamResultRequest) => createExamResult(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.examResults(variables.examId) })
    },
  })
}
