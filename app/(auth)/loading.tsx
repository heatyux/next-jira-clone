import { Loader2 } from 'lucide-react'

const AuthLoadingPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="size-6 text-muted-foreground animate-spin" />
    </div>
  )
}

export default AuthLoadingPage
