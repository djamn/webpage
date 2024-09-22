export interface GuestBookEntry {
  entry_id: number;
  title: string;
  username: string;
  timestamp: number;
  is_visible: boolean;
  entry_message: string;
  edited: boolean;
  edited_timestamp: number;
  silent_edit: boolean;
  comment: string;
  user_uid: string;
}
