import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required.'),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((val) => (val === '' ? undefined : val)),
    ])
    .optional(),
  workspaceId: z.string({ message: 'Workspace id is required.' }),
})
