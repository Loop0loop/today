import React, { useState } from "react";
import { NotebookPen, Send, CalendarDays } from "lucide-react";
import { useDiaryStore } from "@/store/useDiaryStore";
import { useToday } from "@/lifecycle/hooks/useToday";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function DiaryView() {
  const diaries = useDiaryStore((s) => s.diaries);
  const addDiary = useDiaryStore((s) => s.addDiary);
  const today = useToday();
  const [diaryText, setDiaryText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryText.trim()) return;
    addDiary(diaryText.trim(), today);
    setDiaryText("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-1.5">
          <NotebookPen className="size-4.5 text-foreground" />
          오늘 한 줄 회고
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          성공이나 실패 모두 좋은 행동입니다. 오늘 하루는 어땠나요?
        </p>
      </div>

      {/* Diary Form */}
      <Card className="border border-border/80 shadow-none bg-card">
        <CardContent className="p-4 sm:p-5">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <textarea
              aria-label="오늘 한 줄 회고 입력"
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              placeholder="오늘 끝낸 약속의 소감, 혹은 미룬 약속의 이유를 가볍게 적어보세요..."
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-secondary/35 p-3 text-sm text-foreground focus:border-zinc-400 focus:bg-card focus:outline-none focus:ring-1 focus:ring-zinc-450"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                className="bg-foreground text-background hover:opacity-90 flex items-center gap-1 text-xs cursor-pointer shadow-xs"
                disabled={!diaryText.trim()}
              >
                <Send className="size-3" /> 등록하기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Diary List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          회고 타임라인 ({diaries.length})
        </h3>

        <div className="space-y-3">
          {diaries.map((diary) => (
            <Card key={diary.id} className="border border-border/80 shadow-none bg-card">
              <CardContent className="p-4 flex gap-3.5 items-start">
                <div className="size-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground shrink-0 select-none">
                  <CalendarDays className="size-4" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {diary.date}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed whitespace-pre-line">
                    {diary.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
