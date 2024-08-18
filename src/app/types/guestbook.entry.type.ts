export interface GuestBookEntry {
  entry_id: number;
  username: string;
  timestamp: number;
  status: string;
  is_visible: boolean;
  entry_text: string;
  comment: string;
  user_uid: string;
}
