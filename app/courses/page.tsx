'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Course {
  id: string;
  title: string;
  description: string;
  tutorials: string[];
  certificate_template: string;
  exp_reward: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/courses')
        if (response.ok) {
          const data = await response.json()
          setCourses(data.items)
        } else {
          throw new Error('Failed to fetch courses')
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
        setError('Failed to load courses. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) return <div className="container mx-auto mt-8 text-center">Loading courses...</div>
  if (error) return <div className="container mx-auto mt-8 text-center text-red-500">{error}</div>

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Choose a Course</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Number of tutorials: {course.tutorials.length}</p>
              <p>Experience reward: {course.exp_reward} XP</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button 
                className="w-full" 
                onClick={() => router.push(`/learn/${course.id}`)}
              >
                Start Course
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

