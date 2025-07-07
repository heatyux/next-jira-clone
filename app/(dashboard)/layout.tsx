import { PropsWithChildren } from 'react'

import { Sidebar } from '@/components/sidebar'

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen">
      <div className="flex size-full">
        <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-auto">
          <Sidebar />
        </div>

        <div className="lg:pl-[264px]">
          <div className="mx-auto max-w-screen-xl h-full">
            {/* TODO: Navbar */}

            <main className="h-full py-8 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
