import MarketingAiServicePage from '@/components/MarketingAiServicePage'

export const metadata = {
  title: 'Rank Tracking | TopRank AI',
  description:
    'Track local pack and organic-style ranking signals over time. Monitor keywords and markets that matter to your business.',
}

export default function RankTrackingPage() {
  return (
    <MarketingAiServicePage
      title="Rank Tracking"
      intro="Keep a clear history of how you rank for the searches that bring you revenue, so you can prove progress to clients or your own team."
      subIntro="TopRank AI stores scan results over time so you can answer simple questions: Are we improving? Which keywords moved after a GBP update? What should we focus on this month?"
      bullets={[
        'Watch movement across keywords and markets you care about.',
        'Spot trends after GBP updates, review pushes, or site changes.',
        'Export-friendly views for reporting and stakeholder updates.',
        'Pair rank history with geo-grid heatmaps for full context.',
      ]}
      features={[
        {
          title: 'Keyword-level history',
          description:
            'Track the terms that drive calls and visits, not vanity rankings. See when a location climbs or drops after a change you made.',
        },
        {
          title: 'Client-ready reporting',
          description:
            'Agencies can show before-and-after movement without rebuilding spreadsheets every month. Share progress in language owners understand.',
        },
        {
          title: 'Actionable alerts',
          description:
            'When rankings slip in a neighborhood or for a priority keyword, you know where to invest next: reviews, citations, or on-page fixes.',
        },
      ]}
      steps={[
        {
          title: 'Add your business and keywords',
          description: 'Set the location and search terms that match how customers find you locally.',
        },
        {
          title: 'Run scans on a schedule',
          description: 'Capture rank positions regularly so trends are visible, not one-off snapshots.',
        },
        {
          title: 'Review reports in the dashboard',
          description: 'Open Reports to compare periods, export data, and plan the next round of local SEO work.',
        },
      ]}
      dashboardHref="/dashboard/reports"
      iconKey="chart"
    />
  )
}
