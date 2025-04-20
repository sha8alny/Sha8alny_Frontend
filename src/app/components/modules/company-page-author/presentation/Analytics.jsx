import { Card, CardContent } from "@/app/components/ui/Card"
import { ArrowUp, BarChart2, MessageSquare, Repeat, Eye, TrendingUp } from "lucide-react"

export default function Analytics({company}) {
  // Sample data - in a real app, this would come from your API
  const overviewData = {
    reposts: { total: 1248, change: 12.5 },
    comments: { total: 3427, change: 8.2 },
    reactions: { total: 15689, change: 23.1 },
    impressions: { total: 124853, change: 18.7 },
    pageViews: { total: 45672, change: 5.3 },
  }

  const weeklyData = [
    { name: "Mon", reposts: 120, comments: 240, reactions: 1500, impressions: 12000, pageViews: 4200 },
    { name: "Tue", reposts: 150, comments: 320, reactions: 1800, impressions: 14500, pageViews: 4800 },
    { name: "Wed", reposts: 180, comments: 380, reactions: 2100, impressions: 16800, pageViews: 5300 },
    { name: "Thu", reposts: 220, comments: 450, reactions: 2400, impressions: 19200, pageViews: 5900 },
    { name: "Fri", reposts: 280, comments: 520, reactions: 2700, impressions: 22000, pageViews: 6500 },
    { name: "Sat", reposts: 250, comments: 480, reactions: 2500, impressions: 20500, pageViews: 6200 },
    { name: "Sun", reposts: 200, comments: 410, reactions: 2200, impressions: 18000, pageViews: 5800 },
  ]


  const monthlyData = [
    { name: "Jan", reposts: 800, comments: 2100, reactions: 9500, impressions: 85000, pageViews: 28000 },
    { name: "Feb", reposts: 950, comments: 2400, reactions: 10800, impressions: 92000, pageViews: 32000 },
    { name: "Mar", reposts: 1100, comments: 2800, reactions: 12500, impressions: 105000, pageViews: 38000 },
    { name: "Apr", reposts: 1250, comments: 3200, reactions: 14200, impressions: 118000, pageViews: 42000 },
    { name: "May", reposts: 1400, comments: 3600, reactions: 15800, impressions: 125000, pageViews: 45000 },
    { name: "Jun", reposts: 1250, comments: 3400, reactions: 15000, impressions: 120000, pageViews: 43000 },
  ]

  return (
    <div className="space-y-4 p-4 bg-[var(--foreground)] text-text rounded-lg mt-5 mx-3">
      <h1 className="text-2xl text-[var(--text)] font-bold">Analytics</h1>
      <div className="grid grid-cols-1 gap-4 ">
        <MetricCard
          title="Shares"
          value={company?.numShares}
          change={overviewData.reposts.change}
          icon={<Repeat className="h-4 w-4" />}
        />
        <MetricCard
          title="Comments"
          value={company?.numComment}
          change={overviewData.comments.change}
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <MetricCard
          title="Reactions"
          value={company?.numReactions}
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
          value={company?.views}
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
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
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

