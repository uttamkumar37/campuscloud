import { useMutation } from '@tanstack/react-query'
import { createUser } from '../api/usersApi'
import type { CreateUserRequest } from '../types'

export function useCreateUser() {
  return useMutation({
    mutationFn: (payload: CreateUserRequest) => createUser(payload),
  })
}
