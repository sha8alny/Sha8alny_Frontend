import { Card, CardContent } from "@/app/components/ui/Card"
import { ArrowUp, BarChart2, MessageSquare, Repeat, Eye, TrendingUp } from "lucide-react"

export default function Analytics({company}) {
  const overviewData = {
    reposts: { total: 1248, change: 12.5 },
    comments: { total: 3427, change: 8.2 },
    reactions: { total: 15689, change: 23.1 },
    impressions: { total: 124853, change: 18.7 },
    pageViews: { total: 45672, change: 5.3 },
  }
  return (
    <div className="space-y-4 p-4 bg-[var(--foreground)] text-text rounded-lg mt-5 mx-3">
      <h1 className="text-2xl text-[var(--text)] font-bold">Analytics</h1>
      <div className="grid grid-cols-1 gap-4 ">
        <MetricCard
          title="Shares"
          value={company?.isOwner?.numShares}
          change={overviewData.reposts.change}
          icon={<Repeat className="h-4 w-4" />}
        />
        <MetricCard
          title="Comments"
          value={company?.isOwner?.numComments}
          change={overviewData.comments.change}
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <MetricCard
          title="Reactions"
          value={company?.isOwner?.numReactions}
          change={overviewData.reactions.change}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          title="Impressions"
          value={overviewData.impressions.total}
          change={overviewData.impressions.change}
          icon={<Eye className="h-4 w-4" />}
        />
        <MetricCard
          title="Page Views"
          value={company?.isOwner?.views}
          change={overviewData.pageViews.change}
          icon={<BarChart2 className="h-4 w-4" />}
        />
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, icon }) {
  return (
    <Card className="bg-[var(--foreground)] text-text">
      <CardContent >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="rounded-full bg-secondary p-1">{icon}</div>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">{(value ?? 0).toLocaleString()}</p>
          <div className="flex items-center mt-1">
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            <p className="text-xs text-green-500">{change}%</p>
            <p className="text-xs text-muted-foreground ml-1">vs last period</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

