import { Plus } from "lucide-react";

export default function AddButton({onClick}) {
  return (
    <div onClick={onClick} className="p-1 hover:cursor-pointer hover:bg-primary/20 text-primary rounded-md">
      <Plus />
    </div>
  );
}
