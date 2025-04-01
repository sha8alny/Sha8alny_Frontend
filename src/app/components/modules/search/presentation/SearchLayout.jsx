import { Card, CardContent } from "@/app/components/ui/Card";

export function SearchLayout({ sidebar, content }) {
  return (
    <main className="container mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-5 gap-4 font-sans">
      <div className="md:col-span-1 ">
        {sidebar}  
      </div>
      <div className="md:col-span-4 space-y-4 font-sans">{content}</div>
    </main>
  );
}
