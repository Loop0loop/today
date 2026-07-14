// 도메인 엔티티 타입.
// 순수 로직 타입(TaskStatus, CommitmentRecord 등)은 task.ts에, 여기는 저장소/뷰가
// 공유하는 엔티티 형태를 둔다.

export type TodoTag = "BASS" | "DEV" | "etc" | "PLAY" | null;

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
  tag: TodoTag;
}

export interface RolloverTask {
  id: string;
  title: string;
  resolved: boolean;
}

export interface FriendCommitment {
  title: string;
  completed: boolean;
}

export type ReactionType = "cheer" | "congratulate" | "remind";

export interface ReactionsSent {
  cheer: boolean;
  congratulate: boolean;
  remind: boolean;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  consistency: number;
  commitments: FriendCommitment[];
  reactionsSent: ReactionsSent;
}

export interface Diary {
  id: string;
  date: string;
  content: string;
}

export type AppTheme = "light" | "dark" | "system";
