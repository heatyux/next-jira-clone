import { Loader2 } from 'lucide-react'

const DashboardLoadingPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
    </div>
  )
}

export default DashboardLoadingPage
