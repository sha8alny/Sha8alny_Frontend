import { Plus, ThumbsUp } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import SkillContainer from "../container/SkillContainer";
import Container from "@/app/components/layout/Container";

export const SkillCard = ({ skill, level }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{skill.skill_name}</h3>
        <span className="text-xs font-medium text-background bg-secondary px-2 py-0.5 rounded-full">
          {level.level}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full dark:bg-gray-800">
        <div
          className="h-2 bg-secondary rounded-full"
          style={{ width: `${level.width}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{skill.endorsements_count} endorsements</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 hover:bg-foreground hover:cursor-pointer"
        >
          <ThumbsUp className="w-3 h-3 mr-1" />
          Endorse
        </Button>
      </div>
    </div>
  );
};

export default function Skills({ skills }) {
  return (
    <Container className="border border-[#111] shadow-lg p-8 mt-4">
      <h3 className="flex justify-between text-2xl mb-4 font-bold">
        Skills{" "}
        <button className="p-1 hover:bg-gray-500 rounded-md">
          <Plus />
        </button>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <SkillContainer key={index} skill={skill} />
        ))}
      </div>
    </Container>
  );
}
