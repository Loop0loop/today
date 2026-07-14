// 친구/책임 그룹 상태.
import { create } from "zustand";
import type { Friend, ReactionType } from "@/domain/types";

interface FriendsState {
  friends: Friend[];
  sendReaction: (friendId: string, type: ReactionType) => void;
}

export const useFriendsStore = create<FriendsState>((set) => ({
  friends: [
    {
      id: "f1",
      name: "김민수",
      avatar: "민수",
      streak: 5,
      consistency: 85,
      commitments: [
        { title: "코딩 테스트 1문제 풀기", completed: true },
        { title: "헬스장 유산소 40분", completed: false },
        { title: "영어 단어 30개 외우기", completed: true },
      ],
      reactionsSent: { cheer: false, congratulate: false, remind: false },
    },
    {
      id: "f2",
      name: "이지영",
      avatar: "지영",
      streak: 12,
      consistency: 100,
      commitments: [
        { title: "디자인 시안 피드백 반영", completed: true },
        { title: "매일 감사일기 쓰기", completed: true },
      ],
      reactionsSent: { cheer: false, congratulate: false, remind: false },
    },
  ],

  sendReaction: (friendId, type) =>
    set((state) => ({
      friends: state.friends.map((f) =>
        f.id === friendId
          ? {
              ...f,
              reactionsSent: {
                ...f.reactionsSent,
                [type]: true,
              },
            }
          : f,
      ),
    })),
}));
