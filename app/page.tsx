import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="space-y-2 space-x-2">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="muted">Muted</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button disabled>Disabled</Button>

      <hr />

      <Button>Default</Button>
      <Button size="icon">😊</Button>
      <Button size="lg">Large</Button>
      <Button size="sm">Small</Button>
      <Button size="xs">Extra Small</Button>
    </main>
  )
}
