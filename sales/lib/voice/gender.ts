// Genre du prospect deviné d'après son prénom, pour lui donner une voix d'homme ou de femme. Prénoms courants en
// français, en anglais et en Afrique de l'Ouest et de l'Est ; un prénom inconnu garde la voix par défaut.
export type Gender = 'female' | 'male';

const FEMALE = new Set(
  `aicha aïcha amandine amelie amélie aminata amina anne annie audrey aurelie aurélie awa beatrice béatrice camille carole
caroline catherine cecile cécile celine céline chantal charlotte chiamaka chloe chloé christine claire clara claudine
corinne delphine diane elise élise elodie élodie emilie émilie emma estelle eva fanny fatou fatoumata florence francoise
françoise gabrielle grace helene hélène ines inès isabelle jeanne jennifer jessica joelle joëlle julie juliette karine
kadiatou laetitia laura laure lea léa lucie manon marie marine mariam mariama martine mathilde melanie mélanie monique
nadia nadine nathalie ngozi nicole oceane océane pauline rachel rose sabine sandrine sarah sophie stephanie stéphanie
susan suzanne sylvie valerie valérie vanessa veronique véronique virginie wanjiru yasmine zoe zoé adaeze abena akosua
efua ama ifeoma chioma folake funmilayo naledi thandiwe mary jane kate katherine linda lisa olivia emily anna`.split(/\s+/),
);

const MALE = new Set(
  `adama alain alexandre antoine arnaud benoit benoît bernard boubacar bruno christophe cyril daniel david denis didier
eric éric etienne étienne fabrice francois françois frederic frédéric gilles guillaume hugo ibrahima jacques jason
jean jerome jérôme julien kevin kwame kofi larry laurent lucas luc mamadou marc mark mathieu michel moussa nicolas
olivier omar ousmane pascal patrick paul phil philippe pierre romain samuel sebastien sébastien serge stephane stéphane
thierry thomas vincent yann yannick chinedu emeka tunde otieno kamau john james robert michael william richard joseph
peter george andrew joshua luca andrea issa mustapha`.split(/\s+/),
);

export function guessGender(fullName: string): Gender | null {
  const first = fullName.trim().split(/[\s-]+/)[0]?.toLowerCase() ?? '';
  if (!first) return null;
  if (FEMALE.has(first)) return 'female';
  if (MALE.has(first)) return 'male';
  // Terminaisons presque toujours féminines en français (Ginette, Gabrielle, Pauline, Mélodie…).
  if (/(ette|elle|ine|ie|ienne)$/.test(first)) return 'female';
  return null;
}
