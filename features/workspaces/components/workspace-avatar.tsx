import Image from 'next/image'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type WorkspaceAvatarProps = {
  name: string
  image?: string
  className?: string
}

export const WorkspaceAvatar: React.FC<WorkspaceAvatarProps> = ({
  name,
  image,
  className,
}) => {
  if (image) {
    return (
      <div
        className={cn('size-10 relative rounded-md overflow-hidden', className)}
      >
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    )
  }

  return (
    <Avatar className={cn('size-10 rounded-md', className)}>
      <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase rounded-md">
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  )
}
