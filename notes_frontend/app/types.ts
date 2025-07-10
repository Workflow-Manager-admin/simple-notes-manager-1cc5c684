export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  name: string;
  displayName: string;
}
