export interface GuestBookEntry {
  entry_id: number;
  username: string;
  timestamp: number;
  status: string;
  is_visible: boolean;
  entry_text: string;
  edited: boolean;
  silent_edit: boolean;
  comment: string;
  user_uid: string;
}
