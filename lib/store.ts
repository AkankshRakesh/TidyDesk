import { create } from "zustand"

export interface Note {
  _id: string
  title: string
  content: string
  userEmail: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  _id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  completed: boolean
  userEmail: string
  createdAt: string
  updatedAt: string
}

interface AppState {
  notes: Note[]
  tasks: Task[]
  isLoading: boolean

  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void

  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void

  setLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  notes: [],
  tasks: [],
  isLoading: false,

  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, updatedNote) =>
    set((state) => ({
      notes: state.notes.map((note) => (note._id === id ? { ...note, ...updatedNote } : note)),
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note._id !== id),
    })),

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task._id === id ? { ...task, ...updatedTask } : task)),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),
}))
