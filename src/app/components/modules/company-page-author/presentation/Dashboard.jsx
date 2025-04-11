import { Button } from "@/app/components/ui/Button";
export default function Dashboard({company, goToPostsPage}) {
    return(
        <div className="mb-6 rounded-lg bg-[var(--foreground)] p-6 shadow-md">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">Welcome back, 
                    {company?.name}
                </h2>
                <p className="text-zinc-400">Here's what's happening with your account today</p>
              </div>
              <div className="flex items-center gap-3">
                <Button className="bg-[var(--secondary)] text-[var(--text)] hover:bg-[var(--secondary)] cursor-pointer" onClick={()=>goToPostsPage()}>Create Post</Button>
              </div>
            </div>
        </div>
    )
}