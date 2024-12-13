import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import LessonContent from "@/components/lesson-content"
import CodeEditor from "@/components/code-editor"
import { fetchCourseAndTutorialData } from '@/src/utils/courseUtils'
import { db } from '@/src/db'

export default async function LearnPage({ params }: { params: { courseId: string } }) {
  const { courseId } = params

  if (!courseId) {
    notFound()
  }

  const { course, tutorials } = await fetchCourseAndTutorialData(courseId, db.client)

  if (!course || tutorials.length === 0) {
    notFound()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] mt-2">
      <div className="flex-grow overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 overflow-y-auto">
            <Suspense fallback={<div>Loading lesson content...</div>}>
              <LessonContent 
                initialTutorial={tutorials[0]}
                totalTutorials={tutorials.length}
              />
            </Suspense>
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-0">
            <Suspense fallback={<div>Loading code editor...</div>}>
              <CodeEditor 
                initialCode={tutorials[0].initial_code}
                solution={tutorials[0].solution}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

