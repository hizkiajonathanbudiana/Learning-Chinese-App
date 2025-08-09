import {
  ShieldCheckIcon,
  BookOpenIcon,
  SpeakerWaveIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Interactive Dictionary",
    description:
      "Click any Chinese character in our stories and news to get an instant definition, pinyin, and breakdown. Learning in context has never been easier.",
    icon: BookOpenIcon,
  },
  {
    name: "Real-Time Audio",
    description:
      "Listen to the correct pronunciation for any vocabulary, story, or news article. Our app uses your browser's built-in Web Speech API for clear, natural audio.",
    icon: SpeakerWaveIcon,
  },
  {
    name: "Private CMS",
    description:
      "A secure, admin-only Content Management System to add, edit, and manage all vocabulary, stories, and news articles directly within the app.",
    icon: ShieldCheckIcon,
  },
  {
    name: "AI-Powered Content",
    description:
      "Leverage the power of AI to generate new story and news drafts instantly. Just provide a prompt, and let the AI build the foundation for your content.",
    icon: CpuChipIcon,
  },
];

export default function HomePage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-accent-medium">
            Your Modern Learning Hub
          </h2>
          <p className="mt-2 text-heading">Learn Mandarin Intuitively</p>
          <p className="mt-6 subtext">
            Hanzi Hub is designed to immerse you in the language with real-world
            content and powerful, easy-to-use learning tools.
          </p>
        </div>
        <div className="mt-16 max-w-2xl mx-auto sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="flex flex-col p-6 bg-card-bg border border-border rounded-lg shadow-sm"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-accent-dark">
                  <feature.icon
                    className="h-6 w-6 flex-none text-accent-medium"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-text-secondary">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
