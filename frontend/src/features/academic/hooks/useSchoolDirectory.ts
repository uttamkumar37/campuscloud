import { useMemo } from 'react'

import type { SearchableOption } from '../../../components/ui/SearchableSelect'
import { useStudents } from '../../student/hooks/useStudents'
import { useTeachers } from '../../teacher/hooks/useTeachers'

import { useAcademicClasses, useAcademicSections, useAcademicSubjects } from './useAcademicData'

export function useSchoolDirectory() {
  const classesQuery = useAcademicClasses()
  const sectionsQuery = useAcademicSections()
  const subjectsQuery = useAcademicSubjects()
  const studentsQuery = useStudents({ page: 0, size: 200 })
  const teachersQuery = useTeachers({ page: 0, size: 200 })

  const classes = classesQuery.data?.data ?? []
  const sections = sectionsQuery.data?.data ?? []
  const subjects = subjectsQuery.data?.data ?? []
  const students = studentsQuery.data?.data.content ?? []
  const teachers = teachersQuery.data?.data.content ?? []

  const classOptions = useMemo<SearchableOption[]>(() => (
    classes.map((item) => ({
      value: item.id,
      label: item.name,
      searchText: item.code,
    }))
  ), [classes])

  const sectionOptions = useMemo<SearchableOption[]>(() => (
    sections.map((item) => ({
      value: item.id,
      label: `${item.className} - Section ${item.name}`,
      searchText: `${item.className} ${item.name}`,
    }))
  ), [sections])

  const subjectOptions = useMemo<SearchableOption[]>(() => (
    subjects.map((item) => ({
      value: item.id,
      label: item.name,
      searchText: item.code,
    }))
  ), [subjects])

  const studentOptions = useMemo<SearchableOption[]>(() => (
    students.map((item) => ({
      value: item.id,
      label: `${item.firstName} ${item.lastName} - ${item.admissionNo}`,
      searchText: `${item.firstName} ${item.lastName} ${item.admissionNo}`,
    }))
  ), [students])

  const teacherOptions = useMemo<SearchableOption[]>(() => (
    teachers.map((item) => ({
      value: item.id,
      label: `${item.firstName} ${item.lastName} - ${item.employeeNo}`,
      searchText: `${item.firstName} ${item.lastName} ${item.employeeNo} ${item.email}`,
    }))
  ), [teachers])

  const sectionsByClassId = useMemo(() => {
    return sections.reduce<Record<string, SearchableOption[]>>((acc, item) => {
      const nextOption = {
        value: item.id,
        label: `Section ${item.name}`,
        searchText: `${item.className} ${item.name}`,
      }

      if (!acc[item.classId]) {
        acc[item.classId] = [nextOption]
      } else {
        acc[item.classId].push(nextOption)
      }

      return acc
    }, {})
  }, [sections])

  const isLoading = [classesQuery, sectionsQuery, subjectsQuery, studentsQuery, teachersQuery].some(
    (query) => query.isLoading,
  )

  const hasError = [classesQuery, sectionsQuery, subjectsQuery, studentsQuery, teachersQuery].some(
    (query) => query.isError,
  )

  const getSectionsForClass = (classId: string) => sectionsByClassId[classId] ?? []
  const isSectionValidForClass = (classId: string, sectionId: string) => (
    getSectionsForClass(classId).some((item) => item.value === sectionId)
  )

  return {
    classes,
    sections,
    subjects,
    students,
    teachers,
    classOptions,
    sectionOptions,
    subjectOptions,
    studentOptions,
    teacherOptions,
    getSectionsForClass,
    isSectionValidForClass,
    isLoading,
    hasError,
  }
}