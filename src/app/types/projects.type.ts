export interface Project {
  id: string;
  title: string;
  short_description: string;
  long_description: string;
  repo_url: string;
  external_url: string;
  image_url: string;
  tags: string[];
  is_featured: boolean;
  year_created: number;
  project_entry_creation_timestamp: number;
}
