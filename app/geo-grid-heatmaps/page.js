import MarketingAiServicePage from '@/components/MarketingAiServicePage'
import GeoGridDashboardPreview from '@/components/GeoGridDashboardPreview'

export const metadata = {
  title: 'Geo-Grid Heatmaps | TopRank AI',
  description:
    'Visualize local pack rankings across a geo-grid. Build heatmaps for your service area and see where you win or lose.',
}

export default function GeoGridHeatmapsPage() {
  return (
    <MarketingAiServicePage
      title="Geo-Grid Heatmaps"
      intro="See your Google Maps and local pack visibility at every point in a grid around your business. Not one average rank, but a full map of strengths and blind spots."
      subIntro="Service businesses rarely rank the same everywhere in a city. Geo-grids show where you dominate, where competitors win, and where a few reviews or citations could shift the map."
      bullets={[
        'Configure grid shape, density, and radius to match how you actually serve customers.',
        'Run scans for the keywords that drive calls and direction requests.',
        'Use results to prioritize GBP, reviews, and on-page work where it moves the needle.',
        'Share visual heatmaps with clients who need to see coverage, not spreadsheets.',
      ]}
      features={[
        {
          title: 'Block-by-block visibility',
          description:
            'Each grid point reflects real local pack positions for your keyword, so you see geographic winners and losers at a glance.',
        },
        {
          title: 'Flexible scan areas',
          description:
            'Adjust radius and density for dense urban cores, suburbs, or multi-location brands that need separate grids per store.',
        },
        {
          title: 'Credit-efficient workflows',
          description:
            'Run focused scans on priority keywords first, then expand once you know which markets deserve deeper coverage.',
        },
      ]}
      steps={[
        {
          title: 'Create a project',
          description: 'Add your business location and the keywords that matter most for leads and foot traffic.',
        },
        {
          title: 'Design your grid',
          description: 'Set miles between points and search radius so the scan matches your real service area.',
        },
        {
          title: 'Read the heatmap',
          description: 'Use green and red zones to decide where to push reviews, listings, and content next.',
        },
      ]}
      dashboardHref="/dashboard/projects/new"
      iconKey="grid"
    >
      <GeoGridDashboardPreview />
    </MarketingAiServicePage>
  )
}
