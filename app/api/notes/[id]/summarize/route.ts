import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import { Note } from "@/models/Note"
import { generateText } from "ai"
import { google } from "@ai-sdk/google" // ✅ Import Gemini

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const note = await Note.findOne({
      _id: params.id,
      userEmail: session.user.email,
    })

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    // 🔁 Generate summary using Gemini (Gemini Pro)
    const { text } = await generateText({
      model: google("models/gemini-2.0-flash"),
      system:
        "You are a helpful assistant that creates concise summaries of notes. Provide a clear, actionable summary in 2-3 sentences.",
      prompt: `Please summarize the following note:

Title: ${note.title}
Content: ${note.content}`,
    })

    return NextResponse.json({ summary: text })
  } catch (error) {
    console.error("Summarize note error:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
