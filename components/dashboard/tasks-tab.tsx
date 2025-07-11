"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useAppStore, type Task } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function TasksTab() {
  const { tasks, addTask, updateTask, deleteTask, isLoading } = useAppStore()
  const { toast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleCreateTask = async (formData: FormData) => {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const priority = formData.get("priority") as string

    if (!title) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority }),
      })

      if (response.ok) {
        const task = await response.json()
        addTask(task)
        setIsCreateOpen(false)
        toast({
          title: "Success",
          description: "Task created successfully",
        })
      } else {
        throw new Error("Failed to create task")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTask = async (formData: FormData) => {
    if (!editingTask) return

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const priority = formData.get("priority") as string

    try {
      const response = await fetch(`/api/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          completed: editingTask.completed,
        }),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        updateTask(editingTask._id, updatedTask)
        setEditingTask(null)
        toast({
          title: "Success",
          description: "Task updated successfully",
        })
      } else {
        throw new Error("Failed to update task")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const handleToggleComplete = async (task: Task) => {
    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...task,
          completed: !task.completed,
        }),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        updateTask(task._id, updatedTask)
        toast({
          title: "Success",
          description: `Task marked as ${updatedTask.completed ? "completed" : "incomplete"}`,
        })
      } else {
        throw new Error("Failed to update task")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        deleteTask(taskId)
        toast({
          title: "Success",
          description: "Task deleted successfully",
        })
      } else {
        throw new Error("Failed to delete task")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)

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
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600">
            {pendingTasks.length} pending, {completedTasks.length} completed
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form action={handleCreateTask} className="space-y-4">
              <div>
                <Input name="title" placeholder="Task title" required />
              </div>
              <div>
                <Textarea name="description" placeholder="Task description (optional)" rows={3} />
              </div>
              <div>
                <Select name="priority" defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-600 mb-4">Create your first task to get started</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Tasks</h3>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <Card key={task._id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleToggleComplete(task)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                              <Button variant="ghost" size="sm" onClick={() => setEditingTask(task)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task._id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                          <p className="text-xs text-gray-500 mt-2">
                            Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Tasks</h3>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <Card key={task._id} className="opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => handleToggleComplete(task)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 line-through">{task.title}</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task._id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600 mt-1 line-through">{task.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Completed {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <form action={handleUpdateTask} className="space-y-4">
              <div>
                <Input name="title" defaultValue={editingTask.title} placeholder="Task title" required />
              </div>
              <div>
                <Textarea
                  name="description"
                  defaultValue={editingTask.description}
                  placeholder="Task description (optional)"
                  rows={3}
                />
              </div>
              <div>
                <Select name="priority" defaultValue={editingTask.priority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Update Task
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
