export interface Project {
  id: string;
  title: string;
  short_desc: string;
  long_desc: string;

  sub_page_url: string,
  repo_url: string;
  external_url: string;
  image_url: string;
  tags: string[];
  is_featured: boolean;
  project_year: number;
  entry_created_at: number;
  entry_last_updated_at: number;
  likes: number;
  views: number
}
