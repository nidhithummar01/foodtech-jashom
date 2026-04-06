import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, MapPin } from 'lucide-react';
import { brandsMock } from '../data/brands.mock';

type AuraItem = { label: string; score: number; color: string };
type UpdateItem = { id: string; timeAgo: string; title: string; desc: string; type: string; icon: string };
type ReviewItem = { id: string; author: string; rating: number; date: string; text: string };
type LocationReview = { id: string; city: string; area: string; zomato: number; swiggy: number; google: number };
type ReviewSummary = {
  totalReviews: number; avgRating: number;
  ratingBreakdown: { star: number; count: number }[];
  platforms: { name: string; icon: string; rating: number; reviews: string }[];
};
type AreaData = {
  aiInsight: string;
  lci: { score: number; label: string };
  lciMetrics: { label: string; value: string; color: string }[];
  demandTrend: { month: string; value: number }[];
  demandIndex: string; demandPeak: string; demandTrendLabel: string;
  landmarks: { name: string; dist: string; type: string }[];
  competitors: { name: string; initials: string; outlets: number; avgRating: number | null; trend: string; threat: string }[];
};

type LocationIntel = {
  suggestedAreas: string[];
  defaultArea: string;
  areas: Record<string, AreaData>;
};

type BrandDetail = {
  id: string; name: string; initials: string; category: string; presence: string;
  formats: string; founded: string; tagline: string; outlets: string; investment: string;
  opened36m: string; closed36m: string; outletsAmd: number; auraScore: number;
  recommended: string | null; tags: string[]; highlights: string[];
  auraBreakdown: AuraItem[];
  recentUpdates: UpdateItem[];
  reviews: ReviewItem[];
  reviewSummary: ReviewSummary;
  locationReviews: LocationReview[];
  fofoDetails: {
    models: Array<{
      type: string; fullName: string; description: string;
      investment: string; spaceRequired: string; royalty: string;
      agreementTerm: string; roiPeriod: string; grossMargin: string;
      requirements: string[];
      applicationProcess: { step: number; title: string; desc: string }[];
    }>;
  };
  locationIntel: LocationIntel;
  quickFacts: {
    totalOutlets: string; investment: string; outletsAmd: number;
    overallRating: string; opened36m: string; closed36m: string; auraScore: string;
  };
};

const tagColors: Record<string, string> = {
  FOFO: 'bg-blue-100 text-blue-700 border border-blue-200',
  FOCO: 'bg-purple-100 text-purple-700 border border-purple-200',
  GROWING: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  'SERIES A': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  'SERIES B': 'bg-orange-100 text-orange-700 border border-orange-200',
};

const updateTypeColors: Record<string, string> = {
  funding:      'bg-emerald-100 text-emerald-700',
  expansion:    'bg-blue-100 text-blue-700',
  launch:       'bg-purple-100 text-purple-700',
  award:        'bg-yellow-100 text-yellow-700',
  announcement: 'bg-orange-100 text-orange-700',
  partnership:  'bg-teal-100 text-teal-700',
  product:      'bg-pink-100 text-pink-700',
};

type Tab = 'about' | 'updates' | 'reviews' | 'fofo' | 'location';

const TABS: { id: Tab; label: string; icon: string; badge?: (b: BrandDetail) => number | null }[] = [
  { id: 'about', label: 'About', icon: '🏢' },
  { id: 'updates', label: 'Recent Updates', icon: '📢', badge: (b) => b.recentUpdates.length },
  { id: 'reviews', label: 'Reviews', icon: '⭐', badge: (b) => b.reviews.length },
  { id: 'fofo', label: 'FOFO / FOCO Details', icon: '🤝' },
  { id: 'location', label: 'Location Intel', icon: '📍' },
];

function BrandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('about');
  const brand = (brandsMock as unknown as BrandDetail[]).find((b) => b.id === id);

  if (!brand) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <p className="text-lg font-medium">Brand not found</p>
        <button type="button" onClick={() => navigate('/brands')} className="mt-4 text-sm text-emerald-600 hover:underline">
          Back to Brands
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/brands')}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-700 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Brands
      </button>

      {/* Header card */}
      <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-base font-bold text-white shadow-sm sm:h-16 sm:w-16 sm:text-xl">
              {brand.initials}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 sm:text-2xl">{brand.name}</h1>
              <p className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-gray-500 sm:text-sm">
                <MapPin className="h-3 w-3 text-emerald-500 sm:h-3.5 sm:w-3.5" />
                {brand.category} · {brand.presence}
              </p>
              <p className="mt-1 text-xs font-medium text-emerald-600 sm:text-sm">{brand.outlets} outlets</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {brand.tags.map((tag) => (
                  <span key={tag} className={`rounded-md px-2 py-0.5 text-xs font-semibold ${tagColors[tag] ?? 'bg-gray-100 text-gray-600'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            {brand.recommended && (
              <span className="mb-2 rounded-full border border-yellow-300 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                🏆 {brand.recommended}
              </span>
            )}
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 border-emerald-500 bg-white shadow-sm sm:h-20 sm:w-20">
              <span className="text-xl font-bold text-emerald-700 sm:text-2xl">{brand.auraScore}</span>
              <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Score</span>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          <StatCard label="OPENED (36M)" value={brand.opened36m} valueClass="text-emerald-600" />
          <StatCard label="CLOSED (36M)" value={brand.closed36m} valueClass="text-red-500" />
          <StatCard label="INVESTMENT" value={brand.investment} valueClass="text-blue-600" />
          <StatCard label="TOTAL OUTLETS" value={brand.outlets} valueClass="text-emerald-700" />
          <StatCard label="OUTLETS AMD" value={String(brand.outletsAmd)} valueClass="text-gray-800" />
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border border-emerald-100 bg-white shadow-sm">
        <div className="flex overflow-x-auto border-b border-emerald-100">
          {TABS.map((tab) => {
            const badgeCount = tab.badge?.(brand);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-emerald-600'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {badgeCount != null && (
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-3 sm:p-5">
          {activeTab === 'about' && <AboutTab brand={brand} />}
          {activeTab === 'updates' && <UpdatesTab brand={brand} />}
          {activeTab === 'reviews' && <ReviewsTab brand={brand} />}
          {activeTab === 'fofo' && <FofoTab brand={brand} />}
          {activeTab === 'location' && <LocationTab brand={brand} />}
        </div>
      </div>
    </div>
  );
}

/* ── About Tab ── */
const auraBarTextClass: Record<string, string> = {
  'bg-yellow-400': 'text-yellow-600',
  'bg-emerald-400': 'text-emerald-600',
  'bg-blue-400': 'text-blue-600',
  'bg-red-400': 'text-red-600',
  'bg-orange-400': 'text-orange-600',
};

function AboutSectionCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">{children}</div>;
}

function AboutSectionHeader({
  emoji,
  title,
  right,
}: {
  emoji: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-lg leading-none shadow-sm">
          {emoji}
        </div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      </div>
      {right}
    </div>
  );
}

function AboutTab({ brand }: { brand: BrandDetail }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <AboutSectionCard>
          <AboutSectionHeader emoji="🏢" title="Brand Overview" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <OverviewField label="FOUNDED" value={brand.founded} />
            <OverviewField label="CATEGORY" value={brand.category} />
            <OverviewField label="FORMATS" value={brand.formats} valueClass="text-emerald-600" />
            <OverviewField label="PRESENCE" value={brand.presence} />
          </div>
          <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50/80 p-3 sm:p-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">BRAND TAGLINE</p>
            <p className="mt-1.5 text-sm italic leading-relaxed text-gray-600">{brand.tagline}</p>
          </div>
        </AboutSectionCard>

        <AboutSectionCard>
          <AboutSectionHeader emoji="✨" title="Key Highlights" />
          <ul className="space-y-2.5">
            {brand.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                  ✓
                </span>
                <span className="leading-snug">{h}</span>
              </li>
            ))}
          </ul>
        </AboutSectionCard>

        <AboutSectionCard>
          <AboutSectionHeader
            emoji="📊"
            title="Score Breakdown"
            right={<span className="shrink-0 text-sm font-medium tabular-nums text-gray-500">{brand.auraScore} / 100</span>}
          />
          <div className="space-y-4">
            {brand.auraBreakdown.map((item) => {
              const scoreText = auraBarTextClass[item.color] ?? 'text-gray-700';
              return (
                <div key={item.label} className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)_auto] sm:gap-4">
                  <span className="text-xs text-gray-600 sm:text-sm">{item.label}</span>
                  <div className="relative flex h-5 w-full min-w-0 items-center sm:order-none">
                    <div className="absolute inset-x-0 h-px rounded-full bg-gray-200" />
                    <div
                      className={`relative z-[1] h-2.5 rounded-full shadow-sm ${item.color}`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <span className={`text-right text-sm font-semibold tabular-nums sm:w-10 ${scoreText}`}>{item.score}</span>
                </div>
              );
            })}
          </div>
        </AboutSectionCard>
      </div>
      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-800">🚀 Express Interest</h2>
          <div className="space-y-2">
            <button type="button" className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">
              Request Franchise Info
            </button>
            {['📄 Download Full Report', '📍 Location Intelligence', '📞 Speak to Advisor'].map((label) => (
              <button key={label} type="button" className="w-full rounded-lg border border-emerald-200 py-2.5 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-50">
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-800">⚡ Quick Facts</h2>
          <div className="divide-y divide-gray-100">
            <QuickFactRow label="Total Outlets" value={brand.quickFacts.totalOutlets} valueClass="text-emerald-600" />
            <QuickFactRow label="Investment" value={brand.quickFacts.investment} valueClass="text-blue-600" />
            <QuickFactRow label="Outlets in AMD" value={String(brand.quickFacts.outletsAmd)} valueClass="text-gray-800" />
            <QuickFactRow label="Overall Rating" value={brand.quickFacts.overallRating} valueClass="text-yellow-600" prefix={<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />} />
            <QuickFactRow label="Opened (36M)" value={brand.quickFacts.opened36m} valueClass="text-emerald-600" />
            <QuickFactRow label="Closed (36M)" value={brand.quickFacts.closed36m} valueClass="text-red-500" />
            <QuickFactRow label="Score" value={brand.quickFacts.auraScore} valueClass="text-emerald-700" prefix={<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />} />
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-800">🔥 Compare Brands</h2>
          <button type="button" className="w-full rounded-lg border border-dashed border-emerald-300 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50">
            + Add to Comparison
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">Compare up to 3 brands side by side</p>
        </div>
      </div>
    </div>
  );
}

/* ── Recent Updates Tab ── */
function UpdatesTab({ brand }: { brand: BrandDetail }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left: updates feed */}
      <div className="lg:col-span-2">
        <div className="rounded-xl border border-emerald-100 bg-white shadow-sm">
          {/* header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              📢 Recent Updates
            </h2>
            <span className="text-xs text-gray-400">{brand.recentUpdates.length} updates</span>
          </div>
          {/* list */}
          <ul className="divide-y divide-gray-50">
            {brand.recentUpdates.map((update) => (
              <li key={update.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                {/* icon bubble */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-base">
                  {update.icon}
                </div>
                {/* content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800">{update.title}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{update.desc}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${updateTypeColors[update.type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {update.type}
                    </span>
                    <span className="text-xs text-gray-400">{update.timeAgo}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: sidebar */}
      <div className="space-y-5">
        {/* Express Interest */}
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
            🚀 Express Interest
          </h2>
          <div className="space-y-2">
            <button type="button" className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">
              Request Franchise Info
            </button>
            {['📄 Download Full Report', '📍 Location Intelligence', '📞 Speak to Advisor'].map((label) => (
              <button key={label} type="button" className="w-full rounded-lg border border-emerald-200 py-2.5 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-50">
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Facts */}
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">
            ⚡ Quick Facts
          </h2>
          <div className="divide-y divide-gray-100">
            <QuickFactRow label="Total Outlets"  value={brand.quickFacts.totalOutlets}       valueClass="text-emerald-600" />
            <QuickFactRow label="Investment"      value={brand.quickFacts.investment}         valueClass="text-blue-600" />
            <QuickFactRow label="Outlets in AMD"  value={String(brand.quickFacts.outletsAmd)} valueClass="text-gray-800" />
            <QuickFactRow label="Overall Rating"  value={brand.quickFacts.overallRating}      valueClass="text-yellow-600" prefix={<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />} />
            <QuickFactRow label="Opened (36M)"    value={brand.quickFacts.opened36m}          valueClass="text-emerald-600" />
            <QuickFactRow label="Closed (36M)"    value={brand.quickFacts.closed36m}          valueClass="text-red-500" />
            <QuickFactRow label="Score"      value={brand.quickFacts.auraScore}          valueClass="text-emerald-700" prefix={<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />} />
          </div>
        </div>

        {/* Compare Brands */}
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">
            🔥 Compare Brands
          </h2>
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-emerald-300 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            + Add to Comparison
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">Compare up to 3 brands side by side</p>
        </div>
      </div>
    </div>
  );
}

/* ── Reviews Tab ── */
function ReviewsTab({ brand }: { brand: BrandDetail }) {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationReview | null>(null);
  const [platformFilter, setPlatformFilter] = useState<'all' | 'zomato' | 'swiggy' | 'google'>('all');
  const s = brand.reviewSummary;
  const maxCount = Math.max(...s.ratingBreakdown.map((r) => r.count));

  const filteredLocations = brand.locationReviews.filter((l) => {
    const q = search.toLowerCase();
    return q === '' || l.city.toLowerCase().includes(q) || l.area.toLowerCase().includes(q);
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left */}
      <div className="space-y-5 lg:col-span-2">
        {/* Overall Rating Summary */}
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">⭐ Overall Rating Summary</h2>
            <span className="text-xs text-gray-400">{s.totalReviews.toLocaleString()} reviews · All platforms</span>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <div className="flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-yellow-500">{s.avgRating.toFixed(1)}</span>
              <div className="mt-1 flex gap-0.5">
                {[1,2,3,4,5].map((n) => (
                  <Star key={n} className={`h-4 w-4 ${n <= Math.round(s.avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="mt-1 text-xs text-gray-400">{s.totalReviews.toLocaleString()}</span>
              <span className="text-xs text-gray-400">total reviews</span>
            </div>
            <div className="flex-1 space-y-1.5">
              {[...s.ratingBreakdown].reverse().map((r) => (
                <div key={r.star} className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-2 text-right">{r.star}</span>
                  <div className="h-2 flex-1 rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${(r.count / maxCount) * 100}%` }} />
                  </div>
                  <span className="w-10 text-right text-gray-400">{r.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {s.platforms.map((p) => (
              <div key={p.name} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
                <span className="text-xl">{p.icon}</span>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">{p.name}</p>
                <p className="mt-1 text-lg font-bold text-yellow-500">{p.rating.toFixed(1)}</p>
                <p className="text-[11px] text-gray-400">{p.reviews} reviews</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews by Location */}
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">📍 Reviews by Location</h2>
              <p className="mt-0.5 text-xs text-gray-400">{brand.locationReviews.length} locations · Click a location to see reviews</p>
            </div>
            <input
              type="text"
              placeholder="Search city or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-emerald-200 px-3 py-1.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 sm:w-48"
            />
          </div>
          {filteredLocations.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">No locations match "{search}"</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => { setSelectedLocation(loc); setPlatformFilter('all'); }}
                  className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-left transition-colors hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">{loc.city}</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-800">{loc.area}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">🔴 <span className="font-semibold text-yellow-600">{loc.zomato.toFixed(1)}</span></span>
                    <span className="flex items-center gap-1">🟠 <span className="font-semibold text-yellow-600">{loc.swiggy.toFixed(1)}</span></span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /><span className="font-semibold text-yellow-600">{loc.google.toFixed(1)}</span></span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location Detail Panel */}
        {selectedLocation && (
          <div className="rounded-xl border border-emerald-200 bg-white shadow-sm">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                📍 {selectedLocation.area}, {selectedLocation.city.charAt(0) + selectedLocation.city.slice(1).toLowerCase()}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedLocation(null)}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Platform rating cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'ZOMATO', icon: '�', rating: selectedLocation.zomato, color: 'text-re(d-500' },
                  { name: 'SWIGGY', icon: '🟠', rating: selectedLocation.swiggy, color: 'text-orange-500' },
                  { name: 'GOOGLE', icon: '⭐', rating: selectedLocation.google, color: 'text-blue-500' },
                ].map((p) => (
                  <div key={p.name} className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-center">
                    <span className="text-2xl">{p.icon}</span>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">{p.name}</p>
                    <p className={`mt-1 text-2xl font-bold ${p.color}`}>{p.rating.toFixed(1)}</p>
                  </div>
                ))}
              </div>

              {/* Platform filter tabs */}
              <div className="flex flex-wrap gap-2">
                {(['all', 'zomato', 'swiggy', 'google'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setPlatformFilter(f)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      platformFilter === f
                        ? 'bg-emerald-600 text-white'
                        : 'border border-emerald-200 bg-white text-gray-600 hover:bg-emerald-50'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'zomato' ? '🔴 Zomato' : f === 'swiggy' ? '🟠 Swiggy' : '⭐ Google'}
                  </button>
                ))}
              </div>

              {/* Empty state — no individual reviews in mock */}
              <div className="rounded-lg border border-dashed border-emerald-200 bg-gray-50 py-8 text-center">
                <p className="text-sm text-gray-400">No reviews captured for this location yet</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <div className="space-y-5">
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">🚀 Express Interest</h2>
          <div className="space-y-2">
            <button type="button" className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">
              Request Franchise Info
            </button>
            {['📄 Download Full Report', '📍 Location Intelligence', '📞 Speak to Advisor'].map((label) => (
              <button key={label} type="button" className="w-full rounded-lg border border-emerald-200 py-2.5 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-50">
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">⚡ Quick Facts</h2>
          <div className="divide-y divide-gray-100">
            <QuickFactRow label="Total Outlets"  value={brand.quickFacts.totalOutlets}       valueClass="text-emerald-600" />
            <QuickFactRow label="Investment"      value={brand.quickFacts.investment}         valueClass="text-blue-600" />
            <QuickFactRow label="Outlets in AMD"  value={String(brand.quickFacts.outletsAmd)} valueClass="text-gray-800" />
            <QuickFactRow label="Overall Rating"  value={brand.quickFacts.overallRating}      valueClass="text-yellow-600" prefix={<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />} />
            <QuickFactRow label="Opened (36M)"    value={brand.quickFacts.opened36m}          valueClass="text-emerald-600" />
            <QuickFactRow label="Closed (36M)"    value={brand.quickFacts.closed36m}          valueClass="text-red-500" />
            <QuickFactRow label="Score"      value={brand.quickFacts.auraScore}          valueClass="text-emerald-700" prefix={<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />} />
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">🔥 Compare Brands</h2>
          <button type="button" className="w-full rounded-lg border border-dashed border-emerald-300 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50">
            + Add to Comparison
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">Compare up to 3 brands side by side</p>
        </div>
      </div>
    </div>
  );
}

/* ── FOFO/FOCO Tab ── */
function FofoTab({ brand }: { brand: BrandDetail }) {
  const [activeModel, setActiveModel] = useState(0);
  const models = brand.fofoDetails.models;
  const m = models[activeModel];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left main content */}
      <div className="space-y-5 lg:col-span-2">
        {/* Header */}
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">🤝 Franchise Models</h2>
            <span className="text-xs text-gray-400">Select model to explore</span>
          </div>

          {/* Model selector tabs */}
          <div className="grid grid-cols-2 gap-3">
            {models.map((model, i) => (
              <button
                key={model.type}
                type="button"
                onClick={() => setActiveModel(i)}
                className={`rounded-lg border-2 p-4 text-left transition-all ${
                  activeModel === i
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-100 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50/50'
                }`}
              >
                <p className={`text-base font-bold ${activeModel === i ? 'text-emerald-700' : 'text-gray-700'}`}>
                  {model.type}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">{model.fullName}</p>
              </button>
            ))}
          </div>

          {/* Description */}
          <div className="mt-4 rounded-lg border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3">
            <p className="text-sm text-gray-700">{m.description}</p>
          </div>
        </div>

        {/* Key terms grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: 'INVESTMENT REQUIRED', value: m.investment, valueClass: 'text-emerald-600' },
            { label: 'SPACE REQUIRED',      value: m.spaceRequired, valueClass: 'text-gray-800' },
            { label: 'ROYALTY / REVENUE SPLIT', value: m.royalty, valueClass: 'text-emerald-600' },
            { label: 'AGREEMENT TERM',      value: m.agreementTerm, valueClass: 'text-gray-800' },
            { label: 'ESTIMATED ROI PERIOD', value: m.roiPeriod, valueClass: 'text-orange-500' },
            { label: 'GROSS MARGIN / RETURN', value: m.grossMargin, valueClass: 'text-emerald-600' },
          ].map(({ label, value, valueClass }) => (
            <div key={label} className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
              <p className={`mt-1.5 text-base font-bold ${valueClass}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Requirements */}
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Requirements</h3>
          <ul className="space-y-2">
            {m.requirements.map((req) => (
              <li key={req} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-0.5 font-bold text-emerald-500">✓</span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Application Process */}
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Application Process</h3>
          <div className="space-y-0">
            {m.applicationProcess.map((step, idx) => (
              <div key={step.step} className={`flex items-start gap-4 py-3 ${idx < m.applicationProcess.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {step.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Apply button */}
          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            🤝 Apply for {m.type} Franchise
          </button>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="space-y-5">
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">🚀 Express Interest</h2>
          <div className="space-y-2">
            <button type="button" className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">
              Request Franchise Info
            </button>
            {['📄 Download Full Report', '📍 Location Intelligence', '📞 Speak to Advisor'].map((label) => (
              <button key={label} type="button" className="w-full rounded-lg border border-emerald-200 py-2.5 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-50">
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">⚡ Quick Facts</h2>
          <div className="divide-y divide-gray-100">
            <QuickFactRow label="Total Outlets"  value={brand.quickFacts.totalOutlets}       valueClass="text-emerald-600" />
            <QuickFactRow label="Investment"      value={brand.quickFacts.investment}         valueClass="text-blue-600" />
            <QuickFactRow label="Outlets in AMD"  value={String(brand.quickFacts.outletsAmd)} valueClass="text-gray-800" />
            <QuickFactRow label="Overall Rating"  value={brand.quickFacts.overallRating}      valueClass="text-yellow-600" prefix={<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />} />
            <QuickFactRow label="Opened (36M)"    value={brand.quickFacts.opened36m}          valueClass="text-emerald-600" />
            <QuickFactRow label="Closed (36M)"    value={brand.quickFacts.closed36m}          valueClass="text-red-500" />
            <QuickFactRow label="Score"      value={brand.quickFacts.auraScore}          valueClass="text-emerald-700" prefix={<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />} />
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">🔥 Compare Brands</h2>
          <button type="button" className="w-full rounded-lg border border-dashed border-emerald-300 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50">
            + Add to Comparison
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">Compare up to 3 brands side by side</p>
        </div>
      </div>
    </div>
  );
}

/* ── Location Intel Tab ── */
function LocationTab({ brand }: { brand: BrandDetail }) {
  const [areaInput, setAreaInput] = useState(brand.locationIntel.defaultArea);
  const [activeArea, setActiveArea] = useState(brand.locationIntel.defaultArea);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('done');
  const [loadStep, setLoadStep] = useState(0);
  const loc = brand.locationIntel;

  // Get data for the currently analysed area, fall back to first available
  const areaData: AreaData = loc.areas[activeArea] ?? Object.values(loc.areas)[0];
  const maxDemand = Math.max(...areaData.demandTrend.map((d) => d.value));

  const loadingSteps = [
    'Fetching outlet & competitor data',
    'Scanning landmarks within 4 km',
    'Computing demand trends',
    'Generating location score',
  ];

  const handleAnalyse = () => {
    setStatus('loading');
    setLoadStep(0);
    [0, 1, 2, 3].forEach((step) => {
      setTimeout(() => {
        setLoadStep(step + 1);
        if (step === 3) setTimeout(() => {
          // Match input to a known area key (case-insensitive prefix match)
          const matched = loc.suggestedAreas.find((a) =>
            a.toLowerCase() === areaInput.trim().toLowerCase() ||
            areaInput.trim().toLowerCase().startsWith(a.toLowerCase())
          ) ?? loc.defaultArea;
          setActiveArea(matched);
          setStatus('done');
        }, 400);
      }, (step + 1) * 600);
    });
  };

  const threatColors: Record<string, string> = {
    High: 'bg-red-100 text-red-600',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-emerald-100 text-emerald-700',
    'Your Brand': 'bg-emerald-600 text-white',
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left main */}
      <div className="space-y-5 lg:col-span-2">

        {/* Analyse input */}
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">📍 Location Intelligence</h2>
            <span className="text-xs text-gray-400">AI-powered area analysis</span>
          </div>
          <p className="mb-3 text-xs text-gray-500">
            Enter an area or city to get AI-powered location intelligence — demand signals, competitors, nearby landmarks, and an investment viability score.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={areaInput}
              onChange={(e) => { setAreaInput(e.target.value); setStatus('idle'); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyse()}
              className="flex-1 rounded-lg border border-emerald-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              placeholder="Enter area or city..."
            />
            <button
              type="button"
              onClick={handleAnalyse}
              disabled={status === 'loading'}
              className="whitespace-nowrap rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              Analyse Area ↗
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-gray-400">Try:</span>
            {loc.suggestedAreas.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => { setAreaInput(area); setStatus('idle'); }}                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  areaInput === area
                    ? 'border-emerald-500 bg-emerald-100 text-emerald-700'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {status === 'loading' && (
          <div className="rounded-xl border border-emerald-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
              <p className="text-sm font-medium text-gray-600">Analysing location intelligence...</p>
              <ul className="space-y-2 text-sm">
                {loadingSteps.map((step, i) => (
                  <li key={step} className={`flex items-center gap-2 transition-colors ${
                    i < loadStep ? 'text-emerald-600' : 'text-gray-300'
                  }`}>
                    <span className="text-xs">{i < loadStep ? '✓' : '◌'}</span>
                    <span className={i < loadStep ? 'font-semibold' : ''}>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Results */}
        {status === 'done' && (
          <>
            {/* AI Insight */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-[10px] font-bold text-white">AI</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                  ✦ LOCATION INTELLIGENCE — {areaInput.toUpperCase()}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-700">{areaData.aiInsight}</p>
            </div>

            {/* Map placeholder */}
            <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <span className="text-sm font-semibold text-gray-800">{areaInput.split(',')[0]}</span>
                <span className="text-xs text-gray-400">4km radius</span>
              </div>
              <div className="relative h-52 bg-gray-50">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="border border-gray-100" />
                  ))}
                </div>
                <div className="absolute left-[38%] top-[55%] h-3.5 w-3.5 rounded-full bg-yellow-400 shadow" />
                <div className="absolute left-[52%] top-[42%] h-3.5 w-3.5 rounded-full bg-red-400 shadow" />
                <div className="absolute left-[44%] top-[38%] h-3.5 w-3.5 rounded-full bg-red-400 shadow" />
                <div className="absolute left-[60%] top-[60%] h-3.5 w-3.5 rounded-full bg-emerald-400 shadow" />
                <div className="absolute left-[30%] top-[48%] h-3.5 w-3.5 rounded-full bg-purple-400 shadow" />
                <div className="absolute left-[55%] top-[70%] h-3 w-3 rounded-full bg-gray-300 shadow" />
              </div>
              <div className="flex flex-wrap gap-4 border-t border-gray-100 px-4 py-2.5">
                {[
                  { color: 'bg-yellow-400', label: "This brand's outlet" },
                  { color: 'bg-red-400', label: 'Competitor outlet' },
                  { color: 'bg-emerald-400', label: 'Landmark' },
                  { color: 'bg-purple-400', label: 'Opportunity zone' },
                  { color: 'bg-gray-300', label: 'Closed outlet' },
                ].map((l) => (
                  <span key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>

            {/* LCI */}
            <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">📊 Location Composite Index (LCI)</h2>
                <span className="text-sm font-bold text-emerald-600">
                  {areaData.lci.score} <span className="font-normal text-gray-400">/ 100 · {areaData.lci.label}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {areaData.lciMetrics.map((m) => (
                  <div key={m.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
                    <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-gray-400">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Demand Trend bar chart */}
            <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">🍕 Pizza Demand Trend</h2>
                <span className="text-xs text-gray-400">Last 9 months · {areaInput.split(',')[0]}</span>
              </div>
              <div className="flex h-36 items-end gap-1.5">
                {areaData.demandTrend.map((d, i) => (
                  <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t ${i === areaData.demandTrend.length - 1 ? 'bg-yellow-400' : 'bg-emerald-200'}`}
                      style={{ height: `${Math.round((d.value / maxDemand) * 112)}px` }}
                    />
                    <span className="text-[10px] text-gray-400">{d.month}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Demand index: <span className="font-semibold text-yellow-600">{areaData.demandIndex}</span> · Peak:{' '}
                <span className="font-semibold text-yellow-600">{areaData.demandPeak}</span> · Trend:{' '}
                <span className="font-semibold text-emerald-600">↑ {areaData.demandTrendLabel}</span>
              </p>
            </div>

            {/* Landmarks */}
            <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">🏛 Demand Drivers — Nearby Landmarks</h2>
                <span className="text-xs text-gray-400">Within 4 km radius</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {areaData.landmarks.map((lm) => (
                  <div key={lm.name} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 text-sm">🏢</div>
                    <p className="text-xs font-semibold leading-tight text-gray-800">{lm.name}</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">{lm.dist} · {lm.type}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive Analysis */}
            <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-800">⚔️ Competitive Analysis</h2>
                <span className="text-xs text-gray-400">{areaData.competitors.length} brands tracked</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      <th className="pb-2 pr-4">Brand</th>
                      <th className="pb-2 pr-4">Outlets</th>
                      <th className="hidden pb-2 pr-4 sm:table-cell">Avg Rating</th>
                      <th className="hidden pb-2 pr-4 sm:table-cell">Trend (6M)</th>
                      <th className="pb-2">Threat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {areaData.competitors.map((c) => (
                      <tr key={c.name}>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-100 text-[10px] font-bold text-emerald-700">
                              {c.initials}
                            </div>
                            <span className="font-medium text-gray-800">{c.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{c.outlets}</td>
                        <td className="hidden py-3 pr-4 font-semibold text-yellow-600 sm:table-cell">
                          {c.avgRating != null ? c.avgRating.toFixed(1) : '—'}
                        </td>
                        <td className={`hidden py-3 pr-4 font-semibold sm:table-cell ${c.trend.startsWith('+') ? 'text-emerald-600' : c.trend === '—' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {c.trend}
                        </td>
                        <td className="py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${threatColors[c.threat] ?? 'bg-gray-100 text-gray-600'}`}>
                            {c.threat}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Idle — prompt to analyse */}
        {status === 'idle' && (
          <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50 py-12 text-center">
            <p className="text-sm text-gray-500">Click <span className="font-semibold text-emerald-700">Analyse Area</span> to load location intelligence</p>
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <div className="space-y-5">
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">🚀 Express Interest</h2>
          <div className="space-y-2">
            <button type="button" className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700">
              Request Franchise Info
            </button>
            {['📄 Download Full Report', '📍 Location Intelligence', '📞 Speak to Advisor'].map((label) => (
              <button key={label} type="button" className="w-full rounded-lg border border-emerald-200 py-2.5 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-50">
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800">⚡ Quick Facts</h2>
          <div className="divide-y divide-gray-100">
            <QuickFactRow label="Total Outlets"  value={brand.quickFacts.totalOutlets}       valueClass="text-emerald-600" />
            <QuickFactRow label="Investment"      value={brand.quickFacts.investment}         valueClass="text-blue-600" />
            <QuickFactRow label="Outlets in AMD"  value={String(brand.quickFacts.outletsAmd)} valueClass="text-gray-800" />
            <QuickFactRow label="Overall Rating"  value={brand.quickFacts.overallRating}      valueClass="text-yellow-600" prefix={<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />} />
            <QuickFactRow label="Opened (36M)"    value={brand.quickFacts.opened36m}          valueClass="text-emerald-600" />
            <QuickFactRow label="Closed (36M)"    value={brand.quickFacts.closed36m}          valueClass="text-red-500" />
            <QuickFactRow label="Score"      value={brand.quickFacts.auraScore}          valueClass="text-emerald-700" prefix={<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />} />
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-800">🔥 Compare Brands</h2>
          <button type="button" className="w-full rounded-lg border border-dashed border-emerald-300 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50">
            + Add to Comparison
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">Compare up to 3 brands side by side</p>
        </div>
      </div>
    </div>
  );
}

/* ── Shared sub-components ── */
function StatCard({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <p className={`text-xl font-bold ${valueClass}`}>{value}</p>
      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
    </div>
  );
}

function OverviewField({ label, value, valueClass = 'text-gray-800' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-3.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1.5 font-mono text-sm font-medium leading-snug ${valueClass}`}>{value}</p>
    </div>
  );
}

function QuickFactRow({ label, value, valueClass, prefix }: { label: string; value: string; valueClass: string; prefix?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`flex items-center gap-1 font-semibold ${valueClass}`}>{prefix}{value}</span>
    </div>
  );
}

export default BrandDetailPage;
