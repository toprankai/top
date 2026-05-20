import MarketingAiServicePage from '@/components/MarketingAiServicePage'

export const metadata = {
  title: 'Listing Management | TopRank AI',
  description:
    'Manage citations and directory listings. Improve NAP consistency and discover listing opportunities.',
}

export default function ListingManagementPage() {
  return (
    <MarketingAiServicePage
      title="Listing Management"
      intro="Keep your business visible and consistent everywhere it appears online: directories, data aggregators, and niche sites that influence local trust and discovery."
      bullets={[
        'Track submissions and listing URLs in one place.',
        'Reduce conflicting name, address, and phone data across the web.',
        'Support stronger local SEO signals alongside your GBP work.',
      ]}
      dashboardHref="/dashboard/citations"
      iconKey="clipboard"
    />
  )
}
