// 슬라이드 옵션 서랍. routines/spaces는 현재와 동일하게 컴포넌트 로컬 상태.
import { useState } from "react";
import { Menu, X, Check, Flame } from "lucide-react";
import { useUiStore } from "@/store/useUiStore";

interface Routine {
  id: string;
  title: string;
  active: boolean;
}

interface Space {
  name: string;
  color: string;
}

const INITIAL_ROUTINES: Routine[] = [
  { id: "r1", title: "매일 아침 30분 조깅", active: true },
  { id: "r2", title: "어휘 30개 암기", active: true },
  { id: "r3", title: "매일 1커밋 완료", active: false },
];

const INITIAL_SPACES: Space[] = [
  { name: "BASS", color: "bg-blue-500" },
  { name: "DEV", color: "bg-pink-500" },
  { name: "etc", color: "bg-emerald-500" },
  { name: "PLAY", color: "bg-amber-500" },
];

export function OptionDrawer() {
  const isOpen = useUiStore((s) => s.isOptionBarOpen);
  const setOpen = useUiStore((s) => s.setOptionBarOpen);

  const [routines, setRoutines] = useState<Routine[]>(INITIAL_ROUTINES);
  const [spaces, setSpaces] = useState<Space[]>(INITIAL_SPACES);
  const [newSpaceName, setNewSpaceName] = useState("");

  if (!isOpen) return null;

  const handleAddSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;
    setSpaces([...spaces, { name: newSpaceName.trim(), color: "bg-zinc-500" }]);
    setNewSpaceName("");
  };

  const handleToggleRoutine = (id: string) => {
    setRoutines(
      routines.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="h-full w-80 bg-card/95 border-l border-border/80 p-6 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right duration-300 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Menu className="size-4 text-primary" />
              옵션 설정 및 관리
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              aria-label="옵션 바 닫기"
            >
              <X className="size-4.5" />
            </button>
          </div>

          {/* Routines Settings */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              고정 루틴 반복 관리
            </span>

            <div className="space-y-2">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  onClick={() => handleToggleRoutine(routine.id)}
                  className="flex items-center justify-between p-2.5 border border-border bg-secondary/20 rounded-xl cursor-pointer hover:bg-secondary/40 transition-colors"
                >
                  <span className="text-xs font-semibold text-foreground">
                    {routine.title}
                  </span>
                  <div
                    className={`size-4 rounded border flex items-center justify-center transition-all ${
                      routine.active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-transparent"
                    }`}
                  >
                    <Check className="size-3 stroke-[2.5px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spaces Management */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              카테고리 스페이스 관리
            </span>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {spaces.map((space) => (
                <div
                  key={space.name}
                  className="flex items-center justify-between p-2 border border-border bg-secondary/15 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className={`size-2.5 rounded-full ${space.color}`} />
                    <span className="text-xs font-bold text-foreground">
                      {space.name}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setSpaces(spaces.filter((s) => s.name !== space.name))
                    }
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSpace} className="flex items-center gap-1.5 pt-1">
              <input
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                placeholder="새 카테고리..."
                className="flex-1 h-8 text-[11px] px-2.5 rounded-lg border border-border bg-secondary/35 text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-none"
              />
              <button
                type="submit"
                className="h-8 px-3 rounded-lg bg-foreground text-background text-xs font-bold hover:opacity-90 cursor-pointer"
              >
                추가
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Info Banner */}
        <div className="pt-4 border-t border-border flex items-center gap-2 text-muted-foreground select-none">
          <Flame className="size-4 text-orange-500 fill-current" />
          <span className="text-[10px] font-bold">
            로컬 옵션이 실시간 적용 중입니다.
          </span>
        </div>
      </div>
    </div>
  );
}
