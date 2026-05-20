import MarketingAiServicePage from '@/components/MarketingAiServicePage'

export const metadata = {
  title: 'Competitor Analysis | TopRank AI',
  description:
    'Benchmark your Google Business Profile and local presence against nearby competitors. Find gaps and opportunities.',
}

export default function CompetitorAnalysisPage() {
  return (
    <MarketingAiServicePage
      title="Competitor analysis"
      intro="Understand who is winning the map pack around you and what signals separate top listings from the rest: ratings, categories, proximity, and more."
      subIntro="Instead of guessing why a competitor outranks you, compare profiles side by side and connect those gaps to heatmap and rank data inside TopRank AI."
      bullets={[
        'Compare your business to others showing up for the same local intent.',
        'Identify competitor patterns you can realistically close or surpass.',
        'Tie insights back to heatmap and rank data for a full picture.',
        'Prioritize review velocity, categories, and listing completeness.',
      ]}
      features={[
        {
          title: 'Map pack benchmarking',
          description:
            'See which businesses appear alongside you for high-intent local searches and how their GBP signals differ from yours.',
        },
        {
          title: 'Gap analysis',
          description:
            'Spot missing categories, weaker review counts, or thin descriptions on your profile compared to leaders in the area.',
        },
        {
          title: 'Strategy alignment',
          description:
            'Turn competitor insights into a short list of actions: more reviews in weak grid cells, citation fixes, or content updates.',
        },
      ]}
      steps={[
        {
          title: 'Run a business audit',
          description: 'Start from your project in the dashboard and open the audit view for your primary location.',
        },
        {
          title: 'Review competitor listings',
          description: 'See who ranks near you and which profile elements correlate with stronger map visibility.',
        },
        {
          title: 'Plan your next moves',
          description: 'Combine audit findings with heatmap scans and rank tracking so every task ties to measurable outcomes.',
        },
      ]}
      dashboardHref="/dashboard/audit"
      iconKey="users"
    />
  )
}
