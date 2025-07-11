"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAppStore, type Note } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Brain, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function NotesTab() {
  const { notes, addNote, updateNote, deleteNote, isLoading } = useAppStore()
  const { toast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [aiSummary, setAiSummary] = useState<{ noteId: string; summary: string } | null>(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<string | null>(null)

  const handleCreateNote = async (formData: FormData) => {
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    if (!title || !content) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })

      if (response.ok) {
        const note = await response.json()
        addNote(note)
        setIsCreateOpen(false)
        toast({
          title: "Success",
          description: "Note created successfully",
        })
      } else {
        throw new Error("Failed to create note")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      })
    }
  }

  const handleUpdateNote = async (formData: FormData) => {
    if (!editingNote) return

    const title = formData.get("title") as string
    const content = formData.get("content") as string

    try {
      const response = await fetch(`/api/notes/${editingNote._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })

      if (response.ok) {
        const updatedNote = await response.json()
        updateNote(editingNote._id, updatedNote)
        setEditingNote(null)
        toast({
          title: "Success",
          description: "Note updated successfully",
        })
      } else {
        throw new Error("Failed to update note")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      })
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        deleteNote(noteId)
        toast({
          title: "Success",
          description: "Note deleted successfully",
        })
      } else {
        throw new Error("Failed to delete note")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      })
    }
  }

  const handleGenerateSummary = async (noteId: string) => {
    setIsGeneratingSummary(noteId)
    try {
      const response = await fetch(`/api/notes/${noteId}/summarize`, {
        method: "POST",
      })

      if (response.ok) {
        const { summary } = await response.json()
        setAiSummary({ noteId, summary })
      } else {
        throw new Error("Failed to generate summary")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI summary",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSummary(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notes</h2>
          <p className="text-gray-600">Capture and organize your thoughts</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <form action={handleCreateNote} className="space-y-4">
              <div>
                <Input name="title" placeholder="Note title" required />
              </div>
              <div>
                <Textarea name="content" placeholder="Write your note here..." rows={6} required />
              </div>
              <Button type="submit" className="w-full">
                Create Note
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-600 mb-4">Create your first note to get started</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Note
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note._id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <CardDescription>
                      {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerateSummary(note._id)}
                      disabled={isGeneratingSummary === note._id}
                    >
                      {isGeneratingSummary === note._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Brain className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditingNote(note)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteNote(note._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3">{note.content}</p>
                {aiSummary?.noteId === note._id && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <Brain className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">AI Summary</span>
                    </div>
                    <p className="text-sm text-blue-700">{aiSummary.summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <form action={handleUpdateNote} className="space-y-4">
              <div>
                <Input name="title" defaultValue={editingNote.title} placeholder="Note title" required />
              </div>
              <div>
                <Textarea
                  name="content"
                  defaultValue={editingNote.content}
                  placeholder="Write your note here..."
                  rows={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Update Note
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
