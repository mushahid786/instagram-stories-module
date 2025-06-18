// types.ts (optional shared type definition)
export interface StoryItem {
  type: 'image' | 'video';
  url: string;
  duration: number;
}

export interface UserStory {
  user: string;
  avatar: string;
  stories: StoryItem[];
}
