import type { Locale } from '../domain.ts';

// Appel de démonstration de la page publique /demo : un appel à froid écrit à l'avance, joué par deux voix de
// synthèse, sur le scénario « standard téléphonique IA pour un plombier » du catalogue. Ce n'est pas un appel
// réel : la page l'annonce comme une démo scénarisée.
export type DemoLine = {
  role: 'seller' | 'prospect';
  text: string;
  // Texte prononcé, quand il diffère de l'affichage (nombres, heures).
  say?: string;
  // Silence avant la réplique, en secondes : temps de réflexion du prospect, enchaînement rapide, etc.
  gap?: number;
};

export type DemoCall = { seller: string; lines: DemoLine[] };

export const DEFAULT_GAP = 0.45;

export const DEMO_CALL: Record<Locale, DemoCall> = {
  fr: {
    seller: 'Camille',
    lines: [
      { role: 'prospect', text: "Plomberie Lefèvre, j'écoute.", gap: 0 },
      {
        role: 'seller',
        text: "Bonjour Monsieur Lefèvre, Camille, de Blackstart. Trente secondes, et si ça ne vous parle pas, je vous laisse. Ça vous va ?",
      },
      { role: 'prospect', text: 'Trente secondes, hein. Je pars sur un chantier, là.', gap: 0.3 },
      {
        role: 'seller',
        text: "Promis. On aide les plombiers à ne plus rater d'appels pendant les chantiers. Qui décroche quand vous avez les mains dans une chaudière ?",
      },
      { role: 'prospect', text: 'Ben… personne. Ma femme le matin, quand elle est là. Sinon ça tombe sur la messagerie, et les gens laissent rarement un message.', gap: 0.8 },
      { role: 'seller', text: "Combien d'appels vous ratez comme ça dans une semaine, à la louche ?" },
      { role: 'prospect', text: "Je sais pas… une dizaine ? Plus en hiver, avec les pannes de chauffage. Le lundi, c'est la catastrophe.", gap: 0.9 },
      { role: 'seller', text: "Une dizaine. Et combien d'entre eux rappellent vraiment, d'après vous ?" },
      { role: 'prospect', text: "Pas beaucoup. Les urgences, ils appellent le suivant sur Google. Une fuite, ça attend pas. C'est comme ça.", gap: 0.6 },
      {
        role: 'seller',
        text: "C'est ce qu'on règle. Notre assistant décroche à votre place, jour et nuit, prend la demande, cale le rendez-vous et vous envoie un SMS.",
      },
      { role: 'prospect', text: "Ouais, un robot, quoi. Mes clients, ils veulent parler à quelqu'un, pas à une machine.", gap: 0.35 },
      {
        role: 'seller',
        text: "Je comprends. Qu'est-ce qui compte le plus pour eux quand ils appellent : parler à un humain, ou avoir une réponse tout de suite ?",
      },
      { role: 'prospect', text: "… Une réponse, surtout. Quand t'as de l'eau partout dans la cuisine, tu veux juste que quelqu'un vienne. Et ma femme arrête le téléphone en janvier, alors bon.", gap: 1.1 },
      { role: 'prospect', text: 'Et ça coûte combien, votre truc ?', gap: 0.5 },
      {
        role: 'seller',
        text: "149 € HT par mois, sans engagement. Un seul dépannage récupéré, et c'est remboursé.",
        say: "Cent quarante-neuf euros hors taxes par mois, sans engagement. Un seul dépannage récupéré, et c'est remboursé.",
      },
      { role: 'prospect', text: 'Mouais. Envoyez-moi plutôt un mail, je regarderai ce soir.', gap: 0.7 },
      {
        role: 'seller',
        text: "Je vous l'envoie. Mais rien ne vaut de l'entendre. Jeudi 18 h, ou vendredi 7 h 30 avant vos chantiers : qu'est-ce qui vous arrange ?",
        say: "Je vous l'envoie. Mais rien ne vaut de l'entendre. Jeudi dix-huit heures, ou vendredi sept heures et demie avant vos chantiers : qu'est-ce qui vous arrange ?",
      },
      { role: 'prospect', text: 'Jeudi 18 h… Ouais, ça peut aller. Mais vingt minutes, pas plus.', say: 'Jeudi dix-huit heures… Ouais, ça peut aller. Mais vingt minutes, pas plus.', gap: 1 },
      { role: 'seller', text: "Vingt minutes, chrono. Je vous envoie l'invitation sur ce numéro, c'est bien votre portable ?" },
      { role: 'prospect', text: "C'est celui-là, ouais. Allez, je dois y aller.", gap: 0.4 },
      { role: 'seller', text: 'Merci Monsieur Lefèvre, bon chantier, et à jeudi !', gap: 0.3 },
      { role: 'prospect', text: 'À jeudi.', gap: 0.25 },
    ],
  },
  en: {
    seller: 'Camille',
    lines: [
      { role: 'prospect', text: 'Lewis Plumbing, go ahead.', gap: 0 },
      {
        role: 'seller',
        text: "Hi Mr. Lewis, Camille from Blackstart. Thirty seconds, and if it's not for you, I'll let you go. Fair?",
      },
      { role: 'prospect', text: "Thirty seconds. I'm heading out to a job.", gap: 0.3 },
      {
        role: 'seller',
        text: "Deal. We help plumbers stop missing calls while they're on a job. Who picks up when your hands are inside a boiler?",
      },
      { role: 'prospect', text: "Well… nobody. My wife in the mornings, when she's around. Otherwise it goes to voicemail, and people hardly ever leave a message.", gap: 0.8 },
      { role: 'seller', text: 'How many calls do you think you miss that way in a week, roughly?' },
      { role: 'prospect', text: "I don't know… ten? More in winter, with all the heating breakdowns. Mondays are a disaster.", gap: 0.9 },
      { role: 'seller', text: 'Ten. And how many of those actually call you back, would you say?' },
      { role: 'prospect', text: "Not many. Emergencies just call the next guy on Google. A leak won't wait. That's how it is.", gap: 0.6 },
      {
        role: 'seller',
        text: "That's what we fix. Our assistant answers for you, day and night, takes the request, books the job and texts you a summary.",
      },
      { role: 'prospect', text: "Yeah, a robot. My customers want to talk to a person, not a machine.", gap: 0.35 },
      {
        role: 'seller',
        text: 'I understand. What matters most to them when they call: talking to a human, or getting an answer right away?',
      },
      { role: 'prospect', text: "… An answer, mostly. When there's water all over your kitchen, you just want someone to show up. And my wife's quitting the phones in January, so…", gap: 1.1 },
      { role: 'prospect', text: "And what does that thing cost?", gap: 0.5 },
      {
        role: 'seller',
        text: '$159 a month, no commitment. Save one emergency job and it pays for itself.',
        say: 'A hundred and fifty-nine dollars a month, no commitment. Save one emergency job and it pays for itself.',
      },
      { role: 'prospect', text: "Hm. Just send me an email, I'll look at it tonight.", gap: 0.7 },
      {
        role: 'seller',
        text: "I'll send it. But nothing beats hearing it. Thursday at 6 pm, or Friday at 7:30 am before your jobs: which works better?",
        say: "I'll send it. But nothing beats hearing it. Thursday at six pm, or Friday at seven thirty am before your jobs: which works better?",
      },
      { role: 'prospect', text: "Thursday at six… Yeah, that could work. But twenty minutes, no more.", gap: 1 },
      { role: 'seller', text: "Twenty minutes, on the clock. I'll text the invite to this number, is this your cell?" },
      { role: 'prospect', text: "That's the one. Alright, I've got to go.", gap: 0.4 },
      { role: 'seller', text: 'Thanks Mr. Lewis, have a good one, see you Thursday!', gap: 0.3 },
      { role: 'prospect', text: 'See you Thursday.', gap: 0.25 },
    ],
  },
};

// Durée estimée d'une réplique quand le son n'est pas disponible (débit d'une conversation, en mots par seconde).
export function estimatedSeconds(line: DemoLine) {
  const words = (line.say ?? line.text).split(/\s+/).filter(Boolean).length;
  return Math.max(0.8, words / 2.6);
}
