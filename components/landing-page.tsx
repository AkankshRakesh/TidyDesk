import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, FileText, Brain, Shield } from "lucide-react"
import logo from "@/public/logo.png"
import Image from "next/image"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
              <Image src={logo} alt="Logo" width={32} height={32} />
            <span className="text-xl font-bold text-gray-900">TidyDesk</span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Personal Productivity
            <span className="text-blue-600"> Workspace</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Organize your thoughts, manage your tasks, and boost productivity with AI-powered assistance. Everything you
            need in one beautiful, secure workspace.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Start Free Today</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <FileText className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>Smart Notes</CardTitle>
              <CardDescription>Create, organize, and search through your notes with ease</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="w-10 h-10 text-green-600 mb-2" />
              <CardTitle>Task Management</CardTitle>
              <CardDescription>Keep track of your tasks with priorities and completion status</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Brain className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Get AI-powered summaries and insights from your notes</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-red-600 mb-2" />
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>Your data is encrypted and accessible only to you</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to boost your productivity?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of users who have transformed their workflow with My Workspace
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Get Started - It's Free</Link>
          </Button>
        </div>
      </main>

    </div>
  )
}
