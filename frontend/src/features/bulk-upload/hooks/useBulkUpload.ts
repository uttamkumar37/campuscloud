import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '../../../app/queryKeys'
import { downloadBulkSampleWorkbook, uploadBulkWorkbook } from '../api/bulkUploadApi'

export function useBulkUpload() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      file,
      onProgress,
    }: {
      file: File
      onProgress?: (progress: number) => void
    }) => uploadBulkWorkbook(file, onProgress),
    onSuccess: () => {
      // Invalidate all caches that bulk upload may have populated
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.academicClasses })
      queryClient.invalidateQueries({ queryKey: queryKeys.academicSections })
    },
  })
}

export function useBulkSampleDownload() {
  return useMutation({
    mutationFn: downloadBulkSampleWorkbook,
  })
}
