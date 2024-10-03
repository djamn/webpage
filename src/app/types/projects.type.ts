export interface Project {
  id: string;
  title: string;
  short_desc: string;
  long_desc: string;
  subpage_url: string,
  repo_url: string;
  external_url: string;
  image_url: string;
  tags: string[];
  is_featured: boolean;
  year_created: number;
  project_entry_creation_timestamp: number;
  likes: number;
  views: number
}
