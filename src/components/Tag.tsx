interface TagProps {
  label: string;
}

export function Tag({ label }: TagProps) {
  return (
    <span className="rounded-full border border-teal-800/50 bg-teal-950 px-2.5 py-0.5 text-xs font-medium text-teal-300">
      {label}
    </span>
  );
}

interface TagListProps {
  tags: string[];
  className?: string;
}

export function TagList({ tags, className = "" }: TagListProps) {
  if (tags.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Tag key={tag} label={tag} />
      ))}
    </div>
  );
}
