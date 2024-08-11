import {Timestamp} from "rxjs";

export interface GuestBookEntry {
  entry_id: number;
  username: string;
  timestamp: Timestamp<any>;
  status: string;
  is_visible: boolean;
  entry_text: string;
  comment: string;
  user_uid: string;
}
