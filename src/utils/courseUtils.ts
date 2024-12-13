import PocketBase from 'pocketbase';
import { Tutorial, Course } from '@/src/types/courseTypes';

interface CourseAndTutorials {
  course: Course;
  tutorials: Tutorial[];
}

export async function fetchCourseAndTutorialData(courseId: string, pb: PocketBase): Promise<CourseAndTutorials> {
  try {
    // Fetch the course record
    const courseRecord = await pb.collection('courses').getOne<Course>(courseId, {
      expand: 'tutorials',
    });

    // Extract tutorials from the expanded relation
    const tutorials = (courseRecord.expand?.tutorials || []).map((tutorial: any) => ({
      ...tutorial,
      initial_code: tutorial.initial_code || '// Start coding here',
      solution: tutorial.solution || '',
      // Ensure other required properties are present
      title: tutorial.title || 'Untitled Tutorial',
      content: tutorial.content || '',
      exp_reward: tutorial.exp_reward || 0,
      estimated_duration: tutorial.estimated_duration || 0,
    }));

    // Sort tutorials by ID in ascending order
    const sortedTutorials = tutorials.sort((a: Tutorial, b: Tutorial) => a.id.localeCompare(b.id));

    return {
      course: courseRecord,
      tutorials: sortedTutorials,
    };
  } catch (error) {
    console.error('Error fetching course and tutorial data:', error);
    throw new Error(`Failed to fetch course and tutorial data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

