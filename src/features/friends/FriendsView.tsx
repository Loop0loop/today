import { useState } from "react";
import { Users, Flame, CheckCircle2, Circle, AlertCircle, Heart } from "lucide-react";
import { useFriendsStore } from "@/store/useFriendsStore";
import type { ReactionType } from "@/domain/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function FriendsView() {
  const friends = useFriendsStore((s) => s.friends);
  const sendReaction = useFriendsStore((s) => s.sendReaction);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleReact = (friendId: string, name: string, type: ReactionType) => {
    sendReaction(friendId, type);

    let typeKorean = "";
    if (type === "cheer") typeKorean = "🔥 응원하기";
    if (type === "congratulate") typeKorean = "🎉 축하하기";
    if (type === "remind") typeKorean = "⏰ 콕 찌르기";

    triggerToast(`${name}님에게 ${typeKorean}를 보냈습니다!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in slide-in-from-top-3">
          <Heart className="size-3 text-rose-500 fill-current" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-1.5">
          <Users className="size-4.5 text-foreground" />
          책임 그룹 피드
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          서로의 목표를 응원하고 콕 찔러서 행동을 유도해보세요. (2~5명 제한)
        </p>
      </div>

      {/* Friends Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {friends.map((friend) => {
          const completedCount = friend.commitments.filter((c) => c.completed).length;
          const totalCount = friend.commitments.length;
          const progressRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

          return (
            <Card key={friend.id} className="border border-border/80 shadow-none bg-card">
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full space-y-4">
                {/* Header Profile */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-muted-foreground text-sm select-none">
                      {friend.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{friend.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-0.5 text-[11px] font-semibold text-muted-foreground">
                          <Flame className="size-3 text-orange-500 fill-current" />
                          {friend.streak}일째
                        </span>
                        <span className="text-[10px] text-border">|</span>
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          일관성 {friend.consistency}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-muted-foreground">
                    {completedCount} / {totalCount} 완료 ({progressRate}%)
                  </span>
                </div>

                {/* Friend's Commitments List */}
                <div className="space-y-2 bg-secondary/35 rounded-xl p-3 border border-border">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    오늘의 할 일
                  </span>
                  {friend.commitments.length > 0 ? (
                    friend.commitments.map((comm, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {comm.completed ? (
                          <CheckCircle2 className="size-4 text-primary shrink-0" />
                        ) : (
                          <Circle className="size-4 text-border shrink-0" />
                        )}
                        <span
                          className={`truncate ${
                            comm.completed ? "text-muted-foreground line-through font-normal" : "text-foreground font-semibold"
                          }`}
                        >
                          {comm.title}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-muted-foreground py-1 flex items-center gap-1">
                      <AlertCircle className="size-3" /> 아직 할 일을 등록하지 않았습니다.
                    </div>
                  )}
                </div>

                {/* Reaction Actions */}
                <div className="flex gap-1.5 border-t border-border pt-3">
                  <Button
                    size="xs"
                    variant={friend.reactionsSent.cheer ? "outline" : "secondary"}
                    className={`flex-1 text-[11px] h-8 bg-secondary hover:bg-border text-muted-foreground shadow-none cursor-pointer ${
                      friend.reactionsSent.cheer ? "border-border bg-background text-muted-foreground/60 opacity-60" : ""
                    }`}
                    onClick={() => handleReact(friend.id, friend.name, "cheer")}
                    disabled={friend.reactionsSent.cheer}
                  >
                    {friend.reactionsSent.cheer ? "🔥 완료" : "🔥 응원"}
                  </Button>
                  <Button
                    size="xs"
                    variant={friend.reactionsSent.congratulate ? "outline" : "secondary"}
                    className={`flex-1 text-[11px] h-8 bg-secondary hover:bg-border text-muted-foreground shadow-none cursor-pointer ${
                      friend.reactionsSent.congratulate ? "border-border bg-background text-muted-foreground/60 opacity-60" : ""
                    }`}
                    onClick={() => handleReact(friend.id, friend.name, "congratulate")}
                    disabled={friend.reactionsSent.congratulate || progressRate < 100}
                  >
                    {friend.reactionsSent.congratulate ? "🎉 완료" : "🎉 축하"}
                  </Button>
                  <Button
                    size="xs"
                    variant={friend.reactionsSent.remind ? "outline" : "secondary"}
                    className={`flex-1 text-[11px] h-8 bg-secondary hover:bg-border text-muted-foreground shadow-none cursor-pointer ${
                      friend.reactionsSent.remind ? "border-border bg-background text-muted-foreground/60 opacity-60" : ""
                    }`}
                    onClick={() => handleReact(friend.id, friend.name, "remind")}
                    disabled={friend.reactionsSent.remind || progressRate === 100}
                  >
                    {friend.reactionsSent.remind ? "⏰ 완료" : "⏰ 리마인드"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
