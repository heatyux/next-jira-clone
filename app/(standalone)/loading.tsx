import { Loader2 } from 'lucide-react'

const StandaloneLoadingPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Loader2 className="size-6 text-muted-foreground animate-spin" />
    </div>
  )
}

export default StandaloneLoadingPage
