import { toast } from '@/shared/ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { credentialGroupApi } from '../api/credential-group-api'
import type { CreateCredentialGroupRequest } from '../schemas/credential-group-schemas'

export function useCreateCredentialGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCredentialGroupRequest) => credentialGroupApi.create(data),
    onSuccess: (newGroup) => {
      toast({
        variant: 'success',
        title: '✨ Group created!',
        description: `${newGroup.name} has been created successfully.`,
      })
      queryClient.invalidateQueries({ queryKey: ['credential-groups'] })
    },
    onError: (error) => {
      toast({
        variant: 'error',
        title: '❌ Failed to create group',
        description: error.message || 'Please try again later.',
      })
    },
  })
}
