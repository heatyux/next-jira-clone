'use client'

import { Fragment } from 'react'

import { ArrowLeft, MoreVertical } from 'lucide-react'
import Link from 'next/link'

import { DottedSeparator } from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { useConfirm } from '@/hooks/use-confirm'

import { useDeleteMember } from '../api/use-delete-member'
import { useGetMembers } from '../api/use-get-members'
import { useUpdateMember } from '../api/use-update-member'
import { MemberRole } from '../types'
import { MemberAvatar } from './member-avatar'

export const MembersList = () => {
  const workspaceId = useWorkspaceId()

  const [ConfirmDialog, confirm] = useConfirm(
    'Remove member',
    'This member will be removed from this workspace.',
    'destructive',
  )

  const { data: members } = useGetMembers({ workspaceId })
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember()
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember()

  const isPending = isUpdatingMember || isDeletingMember

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ param: { memberId }, json: { role } })
  }

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm()

    if (!ok) {
      return
    }

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload()
        },
      },
    )
  }

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members list</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        {members?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                name={member.name}
                className="size-10"
                fallbackClassName="text-lg"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs to-muted-foreground">{member.email}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger disabled={isPending} asChild>
                  <Button
                    title="View options"
                    className="ml-auto focus-visible:ring-0"
                    variant="secondary"
                    size="icon"
                  >
                    <MoreVertical className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium"
                    disabled={isPending}
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.ADMIN)
                    }
                  >
                    Set as Administrator
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="font-medium"
                    disabled={isPending}
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.MEMBER)
                    }
                  >
                    Set as Member
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="font-medium text-amber-700"
                    disabled={isPending}
                    onClick={() => handleDeleteMember(member.$id)}
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {index < members.documents.length - 1 && (
              <Separator className="my-2.5" />
            )}
          </Fragment>
        ))}
      </CardContent>

      <ConfirmDialog />
    </Card>
  )
}
