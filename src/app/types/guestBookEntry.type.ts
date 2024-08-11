import {Timestamp} from "rxjs";

export interface GuestBookEntry {
  entry_id: number;
  date: Timestamp<any>;
  is_visible: boolean;
  entry_text: string;
  comment: string;
  user_uid: string;
}
