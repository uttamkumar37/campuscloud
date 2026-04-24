import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'

import {
  createAcademicClass,
  createAcademicSection,
  createAcademicSubject,
  getAcademicClasses,
  getAcademicSections,
  getAcademicSubjects,
} from '../api/academicApi'

export function useAcademicClasses() {
  return useQuery({
    queryKey: queryKeys.academicClasses,
    queryFn: getAcademicClasses,
  })
}

export function useCreateAcademicClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAcademicClass,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.academicClasses })
    },
  })
}

export function useAcademicSubjects() {
  return useQuery({
    queryKey: queryKeys.academicSubjects,
    queryFn: getAcademicSubjects,
  })
}

export function useCreateAcademicSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAcademicSubject,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.academicSubjects })
    },
  })
}

export function useAcademicSections() {
  return useQuery({
    queryKey: queryKeys.academicSections,
    queryFn: getAcademicSections,
  })
}

export function useCreateAcademicSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAcademicSection,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.academicSections })
    },
  })
}
