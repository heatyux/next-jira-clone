'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { DottedSeparator } from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { useJoinWorkspace } from '../api/use-join-workspace'
import { useInveiteCode } from '../hooks/use-invite-code'
import { useWorkspaceId } from '../hooks/use-workspace-id'

type JoinWorkspaceFormProps = {
  initialValues: { name: string }
}

export const JoinWorkspaceForm = ({
  initialValues,
}: JoinWorkspaceFormProps) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const inviteCode = useInveiteCode()

  const { mutate: joinWorkspace, isPending } = useJoinWorkspace()

  const handleJoinworkspace = () => {
    joinWorkspace(
      {
        param: { workspaceId },
        json: { code: inviteCode },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`)
        },
      },
    )
  }

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>

        <CardDescription>
          You&apos;ve been invited to join <strong>{initialValues.name}</strong>{' '}
          workspace.
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
          <Button
            disabled={isPending}
            size="lg"
            variant="secondary"
            type="button"
            className="w-full md:w-fit"
            asChild
          >
            <Link href="/">Cacncel</Link>
          </Button>

          <Button
            disabled={isPending}
            size="lg"
            type="button"
            onClick={handleJoinworkspace}
            className="w-full md:w-fit"
          >
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
