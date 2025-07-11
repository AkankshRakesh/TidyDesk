"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { NotesTab } from "./notes-tab"
import { TasksTab } from "./tasks-tab"
import { useAppStore } from "@/lib/store"
import { LogOut, User } from "lucide-react"
import Image from "next/image"
import logo from "@/public/logo.png"
export function Dashboard() {
  const { data: session } = useSession()
  const { setNotes, setTasks, setLoading } = useAppStore()
  const [activeTab, setActiveTab] = useState("notes")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [notesRes, tasksRes] = await Promise.all([fetch("/api/notes"), fetch("/api/tasks")])

        if (notesRes.ok) {
          const notes = await notesRes.json()
          setNotes(notes)
        }

        if (tasksRes.ok) {
          const tasks = await tasksRes.json()
          setTasks(tasks)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [setNotes, setTasks, setLoading])

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
                <Image src={logo} alt="Logo" width={32} height={32} />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">My Workspace</h1>
                <p className="text-sm text-gray-600">Welcome back, {session?.user?.name}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="break-all text-sm max-w-[200px]">{session?.user?.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 sm:max-w-sm w-full mx-auto">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="mt-6">
            <NotesTab />
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <TasksTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
