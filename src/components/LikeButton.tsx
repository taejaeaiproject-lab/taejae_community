"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  liked: boolean;
  count: number;
  onLike: () => Promise<{ liked: boolean; count: number }>;
  size?: "sm" | "md";
};

export default function LikeButton({ liked: initialLiked, count: initialCount, onLike, size = "md" }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    setLiked((v) => !v);
    setCount((c) => liked ? c - 1 : c + 1);
    try {
      const result = await onLike();
      setLiked(result.liked);
      setCount(result.count);
    } catch {
      setLiked((v) => !v);
      setCount((c) => liked ? c + 1 : c - 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full font-medium transition-all active:scale-95",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
        liked
          ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      )}
    >
      <Heart
        size={size === "sm" ? 13 : 15}
        className={cn("transition-transform", liked && "fill-rose-500 scale-110")}
      />
      <span>{count > 0 ? count : ""}</span>
    </button>
  );
}
