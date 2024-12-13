# Learning Platform Database Schema

This document outlines the database structure for our learning platform, including user profiles, social features, and content management.

## Core Tables

### Profiles
| Field | Type | Description |
|-------|------|-------------|
| id | System | Unique identifier |
| user | Relation | Reference to users collection |
| bio | Rich Editor | User biography |
| avatar | File | Profile picture |
| cover_photo | File | Profile header image |
| location | Plain Text | User's location |
| website | URL | User's website |
| is_premium | Boolean | Premium subscription status |
| premium_until | DateTime | Subscription expiration date |
| social_links | JSON | Social media profile links |
| visibility | Select | Privacy setting ['public', 'friends_only', 'private'] |

### Posts
| Field | Type | Description |
|-------|------|-------------|
| id | System | Unique identifier |
| author | Relation | Reference to users collection |
| content | Rich Editor | Post content |
| media | File | Attached images/videos |
| visibility | Select | Privacy setting ['public', 'friends_only', 'private'] |
| likes_count | Number | Total number of likes |
| comments_count | Number | Total number of comments |
| created | System | Creation timestamp |
| updated | System | Last update timestamp |

### Comments
| Field | Type | Description |
|-------|------|-------------|
| id | System | Unique identifier |
| post | Relation | Reference to posts collection |
| author | Relation | Reference to users collection |
| content | Rich Editor | Comment content |
| parent_comment | Relation | Reference to parent comment (for nested comments) |
| created | System | Creation timestamp |
| updated | System | Last update timestamp |

### Likes
| Field | Type | Description |
|-------|------|-------------|
| id | System | Unique identifier |
| user | Relation | Reference to users collection |
| post | Relation | Reference to posts collection |
| created | System | Creation timestamp |

### Connections
| Field | Type | Description |
|-------|------|-------------|
| id | System | Unique identifier |
| follower | Relation | Reference to users collection (who is following) |
| following | Relation | Reference to users collection (who is being followed) |
| status | Select | Connection status ['pending', 'accepted', 'blocked'] |
| created | System | Creation timestamp |

## Learning Progress Tables

### User Progress
| Field | Type | Description |
|-------|------|-------------|
| id | System | Unique identifier |
| user | Relation | Reference to users collection |
| total_exp | Number | Total experience points earned |
| current_level | Number | Current user level |
| daily_streak | Number | Consecutive days of activity |
| last_activity_date | DateTime | Last learning activity timestamp |
| completed_tutorials_count | Number | Total completed tutorials |
| completed_courses_count | Number | Total completed courses |

### Tutorials
| Field | Type | Description |
|-------|------|-------------|
| id | System | Unique identifier |
| title | Plain Text | Tutorial title |
| content | Rich Editor | Tutorial content |
| course | Relation | Reference to courses collection |
| exp_reward | Number | Experience points awarded on completion |
| estimated_duration | Number | Estimated completion time in minutes |

### Courses
| Field | Type | Description |
|-------|------|-------------|
| id | System | Unique identifier |
| title | Plain Text | Course title |
| description | Rich Editor | Course description |
| tutorials | Relation | Reference to tutorials collection (multiple) |
| certificate_template | File | Certificate template file |
| exp_reward | Number | Bonus experience points for course completion |

### User Tutorial Progress
| Field | Type | Description |
|-------|------|-------------|
| id | System | Unique identifier |
| user | Relation | Reference to users collection |
| tutorial | Relation | Reference to tutorials collection |
| status | Select | Progress status ['not_started', 'in_progress', 'completed'] |
| completion_date | DateTime | Tutorial completion timestamp |

### User Course Progress
| Field | Type | Description |
|-------|------|-------------|
| id | System | Unique identifier |
| user | Relation | Reference to users collection |
| course | Relation | Reference to courses collection |
| status | Select | Progress status ['not_started', 'in_progress', 'completed'] |
| completion_date | DateTime | Course completion timestamp |

### Certificates
| Field | Type | Description |
|-------|------|-------------|
| id | System | Unique identifier |
| user | Relation | Reference to users collection |
| course | Relation | Reference to courses collection |
| issue_date | DateTime | Certificate issuance timestamp |
| certificate_url | File | Generated certificate file |

## Relationships

- Users can have one Profile
- Users can create many Posts
- Posts can have many Comments and Likes
- Users can have many Connections (followers/following)
- Users can track progress through multiple Tutorials and Courses
- Courses contain multiple Tutorials
- Users can earn Certificates upon Course completion

## Notes

- All tables include system-generated IDs
- Timestamps (created, updated) are automatically managed by the system
- Visibility settings control content access across the platform
- Progress tracking includes experience points, levels, and streaks
- Certificate generation is automated upon course completion

