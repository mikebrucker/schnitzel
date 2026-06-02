type Props = { gender: "der" | "die" | "das" };

export function GenderChip({ gender }: Props) {
  return (
    <span className="text-xs font-mono tx-accent border bd-accent rounded-full px-1.5 leading-none py-1 self-center">
      {gender}
    </span>
  );
}
