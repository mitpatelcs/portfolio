/**
 * Icon resolution for content-driven chips and social links.
 * - Brand icons come from the `simple-icons` package (SVG path data).
 * - Conceptual icons use lucide-react via the "lucide:<name>" convention in
 *   content/technologies.json.
 * - LinkedIn is not distributed by simple-icons (trademark policy), so its
 *   path is embedded locally.
 */
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import {
  Envelope,
  FacebookLogo,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  MediumLogo,
  PinterestLogo,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react/dist/ssr';
import {
  ArrowRightLeft,
  Brain,
  Cpu,
  Database,
  Eye,
  FileSearch,
  Headphones,
  Laptop,
  MessageSquareText,
  Network,
  Smartphone,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import type { SimpleIcon } from 'simple-icons';
import {
  siC,
  siDocker,
  siFacebook,
  siFastapi,
  siFlask,
  siGit,
  siGithub,
  siHuggingface,
  siInstagram,
  siKeras,
  siLangchain,
  siLinux,
  siMedium,
  siMlflow,
  siMongodb,
  siMysql,
  siOpencv,
  siPinterest,
  siPostgresql,
  siPydantic,
  siPython,
  siScikitlearn,
  siStreamlit,
  siTensorflow,
  siX,
} from 'simple-icons';

const SIMPLE_ICONS: Record<string, SimpleIcon> = {
  python: siPython,
  c: siC,
  tensorflow: siTensorflow,
  langchain: siLangchain,
  scikitlearn: siScikitlearn,
  fastapi: siFastapi,
  huggingface: siHuggingface,
  pydantic: siPydantic,
  git: siGit,
  github: siGithub,
  docker: siDocker,
  streamlit: siStreamlit,
  linux: siLinux,
  mysql: siMysql,
  postgresql: siPostgresql,
  mongodb: siMongodb,
  opencv: siOpencv,
  mlflow: siMlflow,
  flask: siFlask,
  keras: siKeras,
  x: siX,
  instagram: siInstagram,
  pinterest: siPinterest,
  medium: siMedium,
  facebook: siFacebook,
};

const LUCIDE_ICONS: Record<string, LucideIcon> = {
  database: Database,
  brain: Brain,
  network: Network,
  'message-square-text': MessageSquareText,
  sparkles: Sparkles,
  'file-search': FileSearch,
  'trending-up': TrendingUp,
  eye: Eye,
  'arrow-right-left': ArrowRightLeft,
  laptop: Laptop,
  smartphone: Smartphone,
  headphones: Headphones,
};

function SimpleIconSvg({ icon, className }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg role="img" viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

/** Renders the icon for a registry key ("<simple-icons slug>" or "lucide:<name>"). */
export function RegistryIcon({ iconKey, className }: { iconKey: string; className?: string }) {
  if (iconKey.startsWith('lucide:')) {
    const Lucide = LUCIDE_ICONS[iconKey.slice('lucide:'.length)];
    if (Lucide) return <Lucide className={className} aria-hidden="true" />;
  }
  const simple = SIMPLE_ICONS[iconKey];
  if (simple) return <SimpleIconSvg icon={simple} className={className} />;
  return <Cpu className={className} aria-hidden="true" />; // documented default fallback
}

/**
 * Social platform icons — Phosphor duotone, the exact style the reference
 * portfolio uses for its hero/footer social rows (SSR-safe imports).
 * For platform "other", the label resolves the brand (e.g. label "Facebook").
 */
const SOCIAL_ICONS: Record<string, PhosphorIcon> = {
  x: XLogo,
  linkedin: LinkedinLogo,
  github: GithubLogo,
  youtube: YoutubeLogo,
  instagram: InstagramLogo,
  pinterest: PinterestLogo,
  medium: MediumLogo,
  facebook: FacebookLogo,
  email: Envelope,
};

export function SocialIcon({
  platform,
  label,
  className,
}: {
  platform: string;
  label?: string;
  className?: string;
}) {
  const key = platform === 'other' ? (label ?? '').toLowerCase() : platform;
  const Icon = SOCIAL_ICONS[key] ?? Envelope;
  return <Icon weight="duotone" className={className} aria-hidden="true" />;
}
