export interface Tutorial {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  title: string;
  content: string; // This is now a markdown string
  course: string;
  exp_reward: number;
  estimated_duration: number;
  solution: {
    language: string;
    code: string;
  };
  initial_code: {
    language: string;
    code: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  exp_reward: number;
  certificate_template: string;
}

