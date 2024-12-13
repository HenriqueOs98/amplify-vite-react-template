"use client"

import React, { useState, useEffect } from 'react'
import LessonContent from "@/components/lesson-content"
import CodeEditor from "@/components/code-editor"
import { fetchCourseAndTutorialData } from '@/src/utils/courseUtils'
import PocketBase from 'pocketbase'
import { Tutorial, Course } from '@/src/types/courseTypes'

const COURSE_ID = '000000000000001' // Replace with actual course ID
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL)

export default function LearnPage() {
  const [currentTutorialIndex, setCurrentTutorialIndex] = useState(0)
  const [course, setCourse] = useState<Course | null>(null)
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCourseData() {
      try {
        const data = await fetchCourseAndTutorialData(COURSE_ID, pb)
        setCourse(data.course)
        setTutorials(data.tutorials)
        setLoading(false)
      } catch (err) {
        setError('Failed to load course data')
        setLoading(false)
      }
    }

    loadCourseData()
  }, [])

  const handlePrevious = () => {
    setCurrentTutorialIndex(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentTutorialIndex(prev => Math.min(tutorials.length - 1, prev + 1))
  }

  const handleValidateSolution = (code: string) => {
    const currentTutorial = tutorials[currentTutorialIndex]
    if (code.trim() === currentTutorial.solution.trim()) {
      alert('Correct solution!')
      // Here you could update user progress, award exp, etc.
    } else {
      alert('Not quite right. Try again!')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] mt-2">
      <div className="flex-grow overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 overflow-y-auto">
            <LessonContent 
              tutorial={tutorials[currentTutorialIndex]}
              onPrevious={handlePrevious}
              onNext={handleNext}
              currentTutorial={currentTutorialIndex}
              totalTutorials={tutorials.length}
            />
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-0">
            <CodeEditor 
              initialCode={tutorials[currentTutorialIndex].initial_code}
              onValidate={handleValidateSolution}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

