import { Button } from '@/shared/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { FolderPlus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateCredentialGroup } from '../hooks/use-create-credential-group'
import {
  type CreateCredentialGroupRequest,
  createCredentialGroupRequestSchema,
} from '../schemas/credential-group-schemas'

interface CreateCredentialGroupFormProps {
  parentId?: string
  parentName?: string
}

export function CreateCredentialGroupForm({
  parentId,
  parentName,
}: CreateCredentialGroupFormProps) {
  const [open, setOpen] = useState(false)
  const { mutate: createGroup, isPending } = useCreateCredentialGroup()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCredentialGroupRequest>({
    resolver: zodResolver(createCredentialGroupRequestSchema),
    defaultValues: {
      name: '',
      credentialGroupTypeName: 'general',
      credentialGroupId: parentId,
    },
  })

  const onSubmit = (data: CreateCredentialGroupRequest) => {
    createGroup(data, {
      onSuccess: () => {
        reset()
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {parentId ? (
          <Button size="sm" variant="outline" className="h-7 gap-1">
            <Plus size={14} />
          </Button>
        ) : (
          <Button size="lg" className="gap-2">
            <Plus size={20} />
            Create New Group
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FolderPlus className="text-blue-600" size={24} />
            {parentId ? 'Create Sub-Group' : 'Create Credential Group'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {parentId ? (
              <>
                Create a new group under{' '}
                <span className="font-semibold text-gray-900">{parentName}</span>
              </>
            ) : (
              'Organize your credentials by creating a new group'
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Group Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Production Servers, Email Accounts"
              className="h-11 text-base"
              autoFocus
              {...register('name')}
            />
            {errors.name && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <span>⚠️</span> {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-base">
              Group Type <span className="text-red-500">*</span>
            </Label>
            <Input
              id="type"
              placeholder="e.g., server, email, database"
              className="h-11 text-base"
              {...register('credentialGroupTypeName')}
            />
            {errors.credentialGroupTypeName && (
              <p className="flex items-center gap-1 text-sm text-red-600">
                <span>⚠️</span> {errors.credentialGroupTypeName.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              The type determines what fields are available for credentials in this group
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                reset()
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Group
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
