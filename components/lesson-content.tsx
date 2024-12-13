'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Tutorial } from '@/src/types/courseTypes'
import ReactMarkdown from 'react-markdown'

interface LessonContentProps {
  initialTutorial: Tutorial;
  totalTutorials: number;
}

export default function LessonContent({ 
  initialTutorial,
  totalTutorials
}: LessonContentProps) {
  const [currentTutorial, setCurrentTutorial] = useState(initialTutorial)
  const [currentTutorialIndex, setCurrentTutorialIndex] = useState(0)

  const handlePrevious = () => {
    // Implement previous tutorial logic
  }

  const handleNext = () => {
    // Implement next tutorial logic
  }

  return (
    <div className="p-6 text-foreground relative">
      <div className="space-y-6 font-roboto-mono">
        <h2 className="font-orbitron text-2xl">{currentTutorial.title}</h2>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{currentTutorial.content}</ReactMarkdown>
        </div>
        <p>Estimated duration: {currentTutorial.estimated_duration} minutes</p>
        <p>Experience reward: {currentTutorial.exp_reward} XP</p>
      </div>
      <div className="mt-8 flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentTutorialIndex === 0}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentTutorialIndex === totalTutorials - 1}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

