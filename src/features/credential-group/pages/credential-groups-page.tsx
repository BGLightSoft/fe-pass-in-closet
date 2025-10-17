import { useWorkspaceStore } from '@/features/workspace/store/workspace-store'
import { Card, CardContent } from '@/shared/ui/card'
import { FolderTree, Info, Layers } from 'lucide-react'
import { CreateCredentialGroupForm } from '../components/create-credential-group-form'
import { CredentialGroupTree } from '../components/credential-group-tree'
import { useCredentialGroups } from '../hooks/use-credential-groups'
import { useDeleteCredentialGroup } from '../hooks/use-delete-credential-group'

export default function CredentialGroupsPage() {
  const { data: groups, isLoading } = useCredentialGroups()
  const { mutate: deleteGroup } = useDeleteCredentialGroup()
  const { currentWorkspace } = useWorkspaceStore()

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="mt-4 text-sm text-gray-600">Loading credential groups...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 p-3">
            <FolderTree size={32} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Credential Groups</h1>
            <p className="text-gray-600">
              Organize credentials in{' '}
              <span className="font-semibold text-blue-600">
                {currentWorkspace?.name || 'your workspace'}
              </span>
            </p>
          </div>
        </div>
        <CreateCredentialGroupForm />
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex items-start gap-3 p-4">
          <Info className="mt-0.5 flex-shrink-0 text-blue-600" size={20} />
          <div className="text-sm text-blue-900">
            <p className="font-medium">Hierarchical Organization</p>
            <p className="mt-1 text-blue-700">
              Create groups and sub-groups to organize your credentials. Click on a group to view
              its credentials, or use the <Layers className="inline" size={14} /> icon to create a
              sub-group.
            </p>
          </div>
        </CardContent>
      </Card>

      <CredentialGroupTree groups={groups || []} onDelete={deleteGroup} />
    </div>
  )
}
