import Image from 'next/image';

import CopyEmail from '@/components/sections/CopyEmail';
import HeroReveal from '@/components/sections/HeroReveal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SocialIcon } from '@/lib/icons';
import { hero, profile, socials } from '@/lib/data';

export default function Hero() {
  return (
    <section className="flex flex-col gap-4">
      <HeroReveal index={0}>
        <div className="flex items-center gap-4">
          <Image
            src={profile.avatar.image}
            alt={profile.avatar.alt}
            width={100}
            height={100}
            priority
            data-oneko-dodge="true"
            className={
              hero.avatarTreatment === 'colored-disc'
                ? 'size-24 rounded-full bg-blue-300 object-cover dark:bg-yellow-300'
                : 'size-24 rounded-full object-cover'
            }
          />
          <div>
            <h1 data-oneko-dodge="true" className="text-lg font-bold whitespace-nowrap sm:text-2xl">
              {profile.fullName}
            </h1>
            <p data-oneko-dodge="true" className="flex flex-wrap items-center gap-x-1 gap-y-1 text-base text-muted-foreground">
              <span>{hero.roleLine.join(' · ')}</span>
              <span>·</span>
              <CopyEmail email={profile.email} />
            </p>
          </div>
        </div>
      </HeroReveal>

      <HeroReveal index={1}>
        <p className="max-w-xl text-sm text-muted-foreground">{hero.bio}</p>
      </HeroReveal>

      <HeroReveal index={2}>
        <TooltipProvider delayDuration={150}>
          <div className="my-0 flex flex-wrap gap-0.5">
            {socials.map((s) => (
              <Tooltip key={`${s.platform}-${s.url}`}>
                <TooltipTrigger asChild>
                  <a
                    href={s.url}
                    target={s.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    aria-label={s.label || s.platform}
                    className="flex items-center gap-2 p-1.5 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <SocialIcon platform={s.platform} label={s.label} className="size-5" />
                    <span className="sr-only">{s.label || s.platform}</span>
                  </a>
                </TooltipTrigger>
                <TooltipContent>{s.label || platformLabel(s.platform)}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </HeroReveal>
    </section>
  );
}

function platformLabel(platform: string): string {
  const labels: Record<string, string> = {
    x: 'X',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    youtube: 'YouTube',
    instagram: 'Instagram',
    pinterest: 'Pinterest',
    medium: 'Medium',
    email: 'Email',
  };
  return labels[platform] ?? platform;
}
