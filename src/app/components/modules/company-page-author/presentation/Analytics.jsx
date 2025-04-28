import { Card, CardContent } from "@/app/components/ui/Card"
import { ArrowUp, BarChart2, MessageSquare, Repeat, Eye, TrendingUp } from "lucide-react"

/**
 * @namespace AnalyticsComponents
 */
/**
 * Analytics component that displays various metrics for the company. 
 * It renders multiple MetricCard components, each showing a specific metric with its value and percentage change.
 * @component
 * @param {Object} analytics - The analytics data object containing the metrics for the company.
 * @param {number} analytics.numShares - The number of shares for the company.
 * @param {number} analytics.sharesChange - The percentage change of shares.
 * @param {number} analytics.numComments - The number of comments for the company.
 * @param {number} analytics.commentsChange - The percentage change of comments.
 * @param {number} analytics.numReactions - The number of reactions for the company.
 * @param {number} analytics.reactionsChange - The percentage change of reactions.
 * @param {number} analytics.numImpressions - The number of impressions for the company.
 * @param {number} analytics.impressionsChange - The percentage change of impressions.
 * @param {number} analytics.numViews - The number of page views for the company.
 * @param {number} analytics.viewsChange - The percentage change of page views.
 * 
 * @returns {JSX.Element} The rendered Analytics component.
 */

export default function Analytics({analytics}) {
  return (
    <div className="space-y-4 p-4 bg-[var(--foreground)] text-text rounded-lg mt-5 mx-3">
      <h1 className="text-2xl text-[var(--text)] font-bold">Analytics</h1>
      <div className="grid grid-cols-1 gap-4 ">
        <MetricCard
          title="Shares"
          value={analytics?.numShares}
          change={analytics?.sharesChange}
          icon={<Repeat className="h-4 w-4" />}
        />
        <MetricCard
          title="Comments"
          value={analytics?.numComments}
          change={analytics?.commentsChange}
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <MetricCard
          title="Reactions"
          value={analytics?.numReactions}
          change={analytics?.reactionsChange}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          title="Impressions"
          value={analytics?.numImpressions}
          change={analytics?.impressionsChange}
          icon={<Eye className="h-4 w-4" />}
        />
        <MetricCard
          title="Page Views"
          value={analytics?.numViews}
          change={analytics?.viewsChange}
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

