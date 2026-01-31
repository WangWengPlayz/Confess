import { Heart } from 'lucide-react'
import ConfessionForm from '@/components/ConfessionForm'
import ConfessionWall from '@/components/ConfessionWall'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted to-accent">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-primary sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-8 h-8 text-primary fill-primary animate-pulse" />
            <h1 className="text-4xl font-bold text-primary">Confess Your Love</h1>
            <Heart className="w-8 h-8 text-primary fill-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg">
            Share your anonymous Valentine&apos;s confession with the world
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Confession Form - Takes 2 columns on desktop */}
          <div className="md:col-span-2">
            <ConfessionForm />
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* About */}
            <div className="bg-card border-2 border-primary rounded-lg p-6 shadow-lg">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                About
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                Express your feelings anonymously. Share your love story, crushes, or Valentine&apos;s confessions without judgment.
              </p>
            </div>

            {/* Rules */}
            <div className="bg-card border-2 border-secondary rounded-lg p-6 shadow-lg">
              <h3 className="font-bold text-foreground mb-3">House Rules</h3>
              <ul className="text-sm text-foreground space-y-2">
                <li>✓ Be respectful</li>
                <li>✓ Keep it clean</li>
                <li>✓ No harassment</li>
                <li>✓ No spam</li>
                <li>✓ Spread love</li>
              </ul>
            </div>

            {/* Admin Link */}
            <div className="bg-accent border-2 border-accent rounded-lg p-6 shadow-lg text-center">
              <p className="text-sm text-foreground mb-3">Are you an admin?</p>
              <a
                href="/admin"
                className="inline-block px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg font-semibold transition-colors"
              >
                Admin Dashboard
              </a>
            </div>
          </div>
        </div>

        {/* Confessions Wall */}
        <div className="mt-12">
          <ConfessionWall />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t-2 border-primary py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Made with <Heart className="w-4 h-4 text-primary fill-primary inline" /> for Valentine&apos;s Day</p>
        </div>
      </footer>
    </main>
  )
}
