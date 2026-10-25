import type { Metadata } from 'next';
import Link from 'next/link';
import { SettingsPanel } from '@/components/settings/settings-panel';
import { LanguageSwitch } from '@/components/shell/language-switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Experience, Persona, Skill } from '@/lib/domain';
import { getI18n, requireOnboarded } from '@/lib/server/context';

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.settings.title };
}

export default async function SettingsPage() {
  const { profile } = await requireOnboarded();
  const { t, locale } = await getI18n();
  const st = t.settings;
  return (
    <SettingsPanel
      title={st.profileTitle}
      subtitle={st.profileText}
      actions={
        <Button asChild variant="outline" size="sm">
          <Link href="/onboarding">{st.profileEdit}</Link>
        </Button>
      }
    >
      <dl className="grid gap-3 text-sm sm:grid-cols-[200px_1fr]">
        <dt className="text-muted-foreground">{t.onboarding.personaQuestion}</dt>
        <dd>{t.enums.persona[profile.persona as Persona]}</dd>
        <dt className="text-muted-foreground">{t.onboarding.experienceQuestion}</dt>
        <dd>{t.enums.experience[profile.experience as Experience]}</dd>
        <dt className="text-muted-foreground">{t.dashboard.focusTitle}</dt>
        <dd className="flex flex-wrap gap-1.5">
          {profile.goals.map((g) => (
            <Badge key={g} variant="outline" className="border-primary/25 bg-primary/5 text-foreground">
              {t.enums.skill[g as Skill]}
            </Badge>
          ))}
        </dd>
        {profile.offerName && (
          <>
            <dt className="text-muted-foreground">{t.onboarding.offerName}</dt>
            <dd>{profile.offerName}</dd>
          </>
        )}
      </dl>
      <Card className="bg-surface-2/60 p-4 sm:p-5">
        <CardHeader className="mb-0 items-center">
          <div>
            <CardTitle className="text-sm">{st.languageTitle}</CardTitle>
            <CardDescription className="mt-0.5 text-xs">{t.common.language}</CardDescription>
          </div>
          <LanguageSwitch locale={locale} label={st.languageTitle} />
        </CardHeader>
      </Card>
    </SettingsPanel>
  );
}
