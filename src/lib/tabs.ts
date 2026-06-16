import type { ComponentType } from "react";
import { BookIcon, BubbleIcon, PersonIcon, SearchIcon, StarIcon } from "@/components/icons";
import type { TabRoot } from "@/store/useApp";

export type TabDef = {
  root: TabRoot;
  label: string;
  Icon: ComponentType;
};

export const TABS: Array<TabDef> = [
  { root: "/lessons", label: "Lessons", Icon: BookIcon },
  { root: "/dictionary", label: "Dictionary", Icon: SearchIcon },
  { root: "/phrasebook", label: "Phrasebook", Icon: BubbleIcon },
  { root: "/hobbies", label: "Hobbies", Icon: StarIcon },
  { root: "/profile", label: "Profile", Icon: PersonIcon },
];
