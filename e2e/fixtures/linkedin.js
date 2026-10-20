// Pages LinkedIn (et Google) simplifiées mais fidèles à leur structure : liens de profil, textes visibles et cachés,
// badges de relation, boutons, attributs data-* stables. Deux mises en page de recherche : l'ancienne (classes
// lisibles) et la récente (classes aléatoires) — le lecteur ne doit dépendre d'aucune des deux.
const page = (titre, corps, style = '') => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${titre}</title>
<style>.visually-hidden,.a11y-text{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(1px,1px,1px,1px)}
ul,ol{list-style:none;padding:0}${style}</style></head><body><header><nav><a href="/feed/">Accueil</a><a href="/in/moi-meme/">Moi</a></nav></header>${corps}</body></html>`;

// Recherche de personnes, mise en page « entity-result » (classes lisibles).
function resultatClassique({ slug, nom, degre = '2e', titre, lieu, actuel = '', communs = '' }) {
  return `<li class="reusable-search__result-container">
  <div class="entity-result" data-chameleon-result-urn="urn:li:member:${slug.length}">
    <div class="entity-result__item">
      <div class="entity-result__universal-image"><a class="app-aware-link" href="https://www.linkedin.com/in/${slug}?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAA${slug.length}"><img alt="${nom}" src="data:,"></a></div>
      <div class="entity-result__content">
        <div class="mb1"><div class="t-roman t-sans"><div class="display-flex">
          <span class="entity-result__title-line"><span class="entity-result__title-text t-16">
            <a class="app-aware-link" href="https://www.linkedin.com/in/${slug}?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAA${slug.length}">
              <span dir="ltr"><span aria-hidden="true"><!---->${nom}<!----></span><span class="visually-hidden"><!---->Voir le profil de ${nom}<!----></span></span></a>
            <span class="entity-result__badge t-14 t-normal t-black--light"><div class="entity-result__badge-text">
              <span aria-hidden="true">• ${degre}</span><span class="visually-hidden">Relation de ${degre} niveau</span></div></span>
          </span></span></div></div>
          <div class="entity-result__primary-subtitle t-14 t-black t-normal"><!---->${titre}<!----></div>
          <div class="entity-result__secondary-subtitle t-14 t-normal"><!---->${lieu}<!----></div>
        </div>
        ${actuel ? `<p class="entity-result__summary t-12 t-black--light mb1">Actuellement : ${actuel}</p>` : ''}
        ${communs ? `<div class="entity-result__insights"><div class="entity-result__simple-insight"><a href="https://www.linkedin.com/in/${communs}/">${communs}</a> et 3 autres relations en commun</div></div>` : ''}
      </div>
      <div class="entity-result__actions"><button aria-label="Inviter ${nom} à rejoindre votre réseau" class="artdeco-button"><span>Se connecter</span></button></div>
    </div>
  </div></li>`;
}
// Même résultat, mise en page récente : classes aléatoires, data-view-name.
function resultatRecent({ slug, nom, degre = '3e et +', titre, lieu }) {
  return `<li class="kTzWq ABxyrPq">
  <div class="QxPmZ" data-chameleon-result-urn="urn:li:member:9${slug.length}" data-view-name="search-entity-result-universal-template">
    <div class="linked-area flex-1 cursor-pointer">
      <div class="uVfHt"><div class="zJpRt"><a class="OpqRs" href="https://www.linkedin.com/in/${slug}?miniProfileUrn=x" aria-hidden="true" tabindex="-1"><div class="ivm-image-view-model"><img alt="" src="data:,"></div></a></div>
      <div class="mNbVc pt3 pb3 t-12 t-black--light">
        <div class="t-roman t-sans"><div class="display-flex"><div class="hGfDs t-16"><a class="xCvBn" href="https://www.linkedin.com/in/${slug}?miniProfileUrn=x"><span dir="ltr"><span aria-hidden="true"><!---->${nom}<!----></span><span class="visually-hidden"><!---->Voir le profil de ${nom}<!----></span></span></a>
          <span class="wErTy t-14 t-normal t-black--light"><div class="aSdFg"><span aria-hidden="true">• ${degre}</span><span class="visually-hidden">Relation de ${degre} niveau</span></div></span></div></div></div>
        <div class="t-14 t-black t-normal"><!---->${titre}<!----></div>
        <div class="t-14 t-normal"><!---->${lieu}<!----></div>
      </div></div>
    </div>
    <div class="yUiOp"><button class="artdeco-button" aria-label="Suivre ${nom}"><span class="artdeco-button__text">Suivre</span></button></div>
  </div></li>`;
}
export const RECHERCHE = page('Recherche | LinkedIn', `<main id="main" class="scaffold-layout__main"><div class="search-results-container">
<h2 class="pb2 t-black--light t-14">Environ 1 200 résultats</h2>
<ul class="reusable-search__entity-result-list list-style-none">
${resultatClassique({ slug: 'jean-dupont-12345', nom: 'Jean Dupont', titre: 'Gérant chez Plomberie Dupont', lieu: 'Lyon, Auvergne-Rhône-Alpes, France', actuel: 'Gérant chez <strong>Plomberie</strong> Dupont', communs: 'pierre-voisin' })}
${resultatClassique({ slug: 'claire-moreau', nom: 'Claire Moreau', degre: '1er', titre: 'Fondatrice @ Chauffage Moreau | Plomberie &amp; énergies', lieu: 'Villeurbanne, Auvergne-Rhône-Alpes, France' })}
${resultatClassique({ slug: 'lucas-petit-etudiant', nom: 'Lucas Petit', titre: 'Étudiant en BTS plomberie', lieu: 'Lyon, Auvergne-Rhône-Alpes, France' })}
${resultatRecent({ slug: 'sophie-garnier-8a1b2c3d', nom: 'Sophie Garnier', titre: 'Directrice commerciale – Sanitaires Garnier', lieu: 'Marseille, Provence-Alpes-Côte d’Azur, France' })}
${resultatRecent({ slug: 'paul-roux', nom: 'Paul Roux', titre: 'Technicien de maintenance chez Grand Groupe Énergie', lieu: 'Région de Lyon' })}
<li class="reusable-search__result-container"><div class="entity-result"><div class="entity-result__content"><span class="entity-result__title-text"><span aria-hidden="true">Membre LinkedIn</span></span><div class="entity-result__primary-subtitle">Gérant</div></div></div></li>
</ul></div></main>`);

export const PROFIL = page('(3) Jean Dupont | LinkedIn', `<main class="scaffold-layout__main">
<section class="artdeco-card pv-top-card" data-member-id="123">
  <div class="ph5 pb5"><div class="mt2 relative">
    <div class="pv-text-details__left-panel">
      <div><span><a href="/in/jean-dupont-12345/overlay/about-this-profile/"><h1 class="text-heading-xlarge inline t-24 v-align-middle break-words">Jean Dupont</h1></a></span>
      <span class="text-body-small v-align-middle break-words t-black--light">(Il/Lui)</span></div>
      <div class="text-body-medium break-words">Gérant chez Plomberie Dupont | Chauffage et sanitaire à Lyon</div>
    </div>
    <ul class="pv-text-details__right-panel"><li><button aria-label="Entreprise actuelle : Plomberie Dupont. Cliquez pour passer à la section Expérience" class="pv-text-details__right-panel-item-link"><img alt="" src="data:,"><span><div class="inline-show-more-text">Plomberie Dupont</div></span></button></li></ul>
    <div class="pv-text-details__left-panel mt2"><span class="text-body-small inline t-black--light break-words">Lyon, Auvergne-Rhône-Alpes, France </span><span class="pv-text-details__separator t-black--light"> · </span><span class="pv-text-details__separator"><a href="/in/jean-dupont-12345/overlay/contact-info/" class="link-without-visited-state">Coordonnées</a></span></div>
    <ul class="pv-top-card--list"><li class="text-body-small"><span class="t-bold">500+</span> relations</li></ul>
  </div>
  <div class="pv-top-card-v2-ctas"><button>Se connecter</button><button>Message</button><button>Plus</button></div></div>
</section>
<section class="artdeco-card"><div id="about"></div><h2>Infos</h2><p>Plombier depuis 20 ans.</p></section>
</main>`);

export const ENTREPRISE = page('Plomberie Dupont : Personnes | LinkedIn', `<main>
<section class="org-top-card"><div class="org-top-card-primary-content"><h1 class="org-top-card-summary__title" title="Plomberie Dupont">Plomberie Dupont</h1><div class="org-top-card-summary-info-list">Plomberie · Lyon · 12 abonnés</div></div></section>
<div class="org-people-profile-card__card-spacing"><h2>12 salariés</h2><ul class="display-flex list-style-none flex-wrap">
<li class="grid grid__col--lg-8 org-people-profile-card__profile-card-spacing"><section class="artdeco-card full-width">
  <div class="artdeco-entity-lockup artdeco-entity-lockup--stacked-center"><div class="artdeco-entity-lockup__image"><a href="https://www.linkedin.com/in/lucas-bernard-abc?miniProfileUrn=x"><img alt="Lucas Bernard" src="data:,"></a></div>
  <div class="artdeco-entity-lockup__content"><div class="artdeco-entity-lockup__title"><a href="https://www.linkedin.com/in/lucas-bernard-abc?miniProfileUrn=x" class="link-without-visited-state"><div class="lt-line-clamp lt-line-clamp--single-line">Lucas Bernard</div></a></div>
  <div class="artdeco-entity-lockup__badge"><span class="a11y-text">Relation de 2e niveau</span><span class="artdeco-entity-lockup__degree" aria-hidden="true">· 2e</span></div>
  <div class="artdeco-entity-lockup__subtitle"><div class="lt-line-clamp lt-line-clamp--multi-line">Associé et cogérant</div></div></div></div>
  <footer><button class="artdeco-button"><span>Se connecter</span></button></footer></section></li>
<li class="grid grid__col--lg-8 org-people-profile-card__profile-card-spacing"><section class="artdeco-card full-width">
  <div class="artdeco-entity-lockup"><div class="artdeco-entity-lockup__content"><div class="artdeco-entity-lockup__title"><a href="https://www.linkedin.com/in/emma-leroy-plombiere?miniProfileUrn=y"><div class="lt-line-clamp">Emma Leroy</div></a></div>
  <div class="artdeco-entity-lockup__subtitle"><div class="lt-line-clamp">Plombière chauffagiste</div></div></div></div>
  <footer><button><span>Message</span></button></footer></section></li>
</ul></div></main>`);

export const SALESNAV = page('Sales Navigator', `<main><div id="search-results-container" style="height:500px;overflow-y:auto">
<ol class="artdeco-list">
${Array.from({ length: 25 }, (_, i) => `<li class="artdeco-list__item pl3 pv3" style="min-height:120px"><div data-x-search-result="LEAD" class="lazy"${i < 6 ? '' : ' data-attendre="1"'}>${i < 6 ? '' : '<div class="skeleton"></div>'}</div></li>`).join('\n')}
</ol></div>
<script>
  // Comme Sales Navigator : un résultat n'est rempli que lorsqu'il approche de la zone visible.
  const PERS = Array.from({ length: 25 }, (_, i) => ({ nom: 'Prospect ' + 'ABCDEFGHIJKLMNOPQRSTUVWXY'[i] + ' Martin', titre: i % 2 ? 'Gérant' : 'Directeur général', ent: 'Boulangerie ' + (i + 1), lieu: i % 3 ? 'Lyon, Auvergne-Rhône-Alpes, France' : 'Paris, Île-de-France, France' }));
  const c = document.getElementById('search-results-container');
  function remplir() {
    document.querySelectorAll('[data-x-search-result]').forEach((d, i) => {
      if (d.dataset.ok) return;
      const r = d.getBoundingClientRect(), h = c.getBoundingClientRect();
      if (r.top > h.bottom + 200) return;
      const p = PERS[i];
      d.dataset.ok = '1';
      d.innerHTML = '<div class="artdeco-entity-lockup"><div class="artdeco-entity-lockup__title"><a href="/sales/lead/ACwAAA' + i + 'xyz,NAME_SEARCH,Ab' + i + '?_ntb=tok" data-control-name="view_lead_panel_via_search_lead_name"><span data-anonymize="person-name">' + p.nom + '</span></a></div>' +
        '<div class="artdeco-entity-lockup__badge"><span class="a11y-text">Relation de 2e niveau</span><span aria-hidden="true">2e</span></div>' +
        '<div class="artdeco-entity-lockup__subtitle"><span data-anonymize="title">' + p.titre + '</span><span class="separator--middot"> · </span><a href="/sales/company/' + i + '" data-anonymize="company-name">' + p.ent + '</a></div>' +
        '<div class="artdeco-entity-lockup__caption"><span data-anonymize="location">' + p.lieu + '</span></div></div>' +
        '<div><button>Enregistrer</button><button aria-label="Plus d’actions">…</button></div>';
    });
  }
  c.addEventListener('scroll', remplir); remplir();
</script></main>`);

export const RELATIONS = page('Relations | LinkedIn', `<main><section class="mn-connections"><header><h1>1 245 relations</h1></header><ul>
<li class="mn-connection-card artdeco-list" style="display:flex">
  <a class="mn-connection-card__picture" href="/in/sophie-lambert-zen/"><img alt="" src="data:,"></a>
  <a class="mn-connection-card__link" href="/in/sophie-lambert-zen/"><span class="mn-connection-card__name t-16" style="display:block">Sophie Lambert</span><span class="mn-connection-card__occupation t-14" style="display:block">Gérante – Institut Beauté Zen</span><time class="time-badge" style="display:block">Relation établie il y a 2 semaines</time></a>
  <div class="mn-connection-card__action-container"><button>Message</button></div>
</li>
<li class="mn-connection-card artdeco-list">
  <a class="mn-connection-card__link" href="/in/marc-blanc/"><span class="mn-connection-card__name t-16">Marc Blanc</span><span class="mn-connection-card__occupation t-14">CEO at Blanc Immobilier</span><time class="time-badge">Relation établie il y a 1 mois</time></a>
  <div class="mn-connection-card__action-container"><button>Message</button></div>
</li></ul></section></main>`);

export const GOOGLE = page('site:linkedin.com/in gérant plombier Lyon - Recherche Google', `<div id="search"><div id="rso">
<div class="g"><div class="yuRUbf"><a href="https://fr.linkedin.com/in/jean-dupont-12345" data-ved="1"><br><h3 class="LC20lb">Jean Dupont - Gérant - Plomberie Dupont | LinkedIn</h3><div><cite>fr.linkedin.com › jean-dupont-12345</cite></div></a></div>
<div class="VwiC3b"><span>Gérant chez Plomberie Dupont · Expérience : Plomberie Dupont · Formation : Lycée Hector Guimard · Lieu : Lyon · 500+ relations sur LinkedIn.</span></div></div>
<div class="g"><div class="yuRUbf"><a href="https://fr.linkedin.com/in/nadia-benali" data-ved="2"><h3 class="LC20lb">Nadia Benali – Fondatrice – N.B. Rénovation | LinkedIn</h3></a></div>
<div class="VwiC3b"><span>Villeurbanne, Auvergne-Rhône-Alpes, France · Fondatrice · N.B. Rénovation · Expérience : N.B. Rénovation · Formation : ...</span></div></div>
<div class="g"><div class="yuRUbf"><a href="https://fr.linkedin.com/in/karim-haddad-77" data-ved="4"><h3 class="LC20lb">Karim Haddad - Gérant chez Haddad Électricité | LinkedIn</h3></a></div>
<div class="VwiC3b"><span>Électricien depuis 15 ans à Lyon. Dépannage, rénovation…</span></div></div>
<div class="g"><div class="yuRUbf"><a href="https://www.linkedin.com/company/plomberie-dupont" data-ved="3"><h3>Plomberie Dupont | LinkedIn</h3></a></div></div>
</div></div>`);

// Export officiel « Obtenir une copie de vos données » › Relations.
export const CONNECTIONS_CSV = `Notes:
"When exporting your connection data, you may notice that some of the email addresses are missing. You will only see email addresses for connections who have allowed their connections to see or download their email address using this setting https://www.linkedin.com/psettings/privacy/email. You can learn more here https://www.linkedin.com/help/linkedin/answer/261"

First Name,Last Name,URL,Email Address,Company,Position,Connected On
Jean,Dupont,https://www.linkedin.com/in/jean-dupont-12345,,Plomberie Dupont,Gérant,12 Mar 2024
Aïcha,Diallo,https://www.linkedin.com/in/aicha-diallo,aicha@exemple.fr,"Diallo Plomberie, SARL",Fondatrice,03 Jan 2025
Thomas,Girard,https://www.linkedin.com/in/thomas-girard,,Université Lyon 2,Étudiant,20 Sep 2025
`;

// Mise en page 2025-2026 (« SDUI ») : classes en empreintes, repères data-view-name / componentkey, pas de h1 sur le
// profil. La carte de résultat est un <a> qui contient d'autres <a> : React les construit ainsi, le script le refait.
const h = (n) => `_${(0x8f3cc85f + n).toString(16)}`;
export const RECHERCHE_SDUI = page('Recherche | LinkedIn', `<main data-view-name="people-search-results"><div componentkey="SearchResultsMainContent"><div role="list" data-testid="lazy-column">
<div role="listitem"><div data-view-name="people-search-result" data-display-contents="true" class="${h(1)}"><span data-a="https://www.linkedin.com/in/camille-martin-4b2a1c9/">
<div class="${h(2)}"><div class="${h(3)}"><figure data-view-name="image"><img alt="Camille Martin" src="data:,"></figure><div class="${h(4)}">
<p class="${h(5)}"><a href="https://www.linkedin.com/in/camille-martin-4b2a1c9/" data-view-name="search-result-lockup-title">Camille Martin</a><span> </span><a href="#" data-view-name="search-result-lockup-title"><svg></svg></a><span><span> • 2e</span></span></p>
<p class="${h(6)}">Directrice commerciale chez Acme SAS | SaaS B2B</p><p class="${h(7)}">Lyon, Auvergne-Rhône-Alpes, France</p></div>
<div data-view-name="relationship-building-button"><div data-view-name="edge-creation-connect-action"><button type="button" aria-label="Invitez Camille Martin à rejoindre votre réseau"><span>Se connecter</span></button></div></div></div>
<p class="${h(8)}">Entreprise actuelle :<span> </span>Directrice <strong><span>commerciale</span></strong> chez Acme SAS</p>
<div><figure data-view-name="image"><img alt="" src="data:,"></figure><p><a href="https://www.linkedin.com/in/julie-roux/" data-view-name="search-result-social-proof-insight"><strong>Julie Roux</strong></a><span> </span>est une relation que vous avez en commun</p></div>
</div></span></div></div>
<div role="listitem"><div data-view-name="people-search-result" data-display-contents="true"><span data-a="https://www.linkedin.com/in/thomas-bernard-pro/">
<div><div><figure><svg></svg></figure><div><p><a href="https://www.linkedin.com/in/thomas-bernard-pro/" data-view-name="search-result-lockup-title">Thomas Bernard</a><span><span> • 3e et +</span></span></p>
<p>Fondateur @ Boulangerie Bernard</p><p>Annecy</p></div>
<div data-view-name="relationship-building-button"><div data-view-name="edge-creation-follow-action"><button type="button" aria-label="Suivez Thomas Bernard"><span>Suivre</span></button></div></div></div>
<div><p><a href="#" data-view-name="search-result-social-proof-insight">2 k abonnés</a></p></div></div></span></div></div>
</div><nav data-view-name="pagination"><button data-page-number="1" aria-current="true">1</button><button data-page-number="2">2</button></nav></div></main>
<script>document.querySelectorAll('span[data-a]').forEach((s) => { const a = document.createElement('a'); a.href = s.dataset.a; while (s.firstChild) a.appendChild(s.firstChild); s.replaceWith(a); });</script>`, 'p{margin:0}');

export const PROFIL_SDUI = page('(3) Camille Martin | LinkedIn', `<main><div componentkey="com.linkedin.sdui.profile.card.refACoAAAB1c2EBxYz123Topcard"><div componentkey="ACoAAAB1c2EBxYz123-topcard-content">
<div><figure><img alt="Camille Martin" src="data:,"></figure></div><div><div><a componentkey="ProfileVerificationTriggerRef-ACoAAAB1c2EBxYz123"><h2>Camille Martin</h2></a><a><svg></svg></a><p>(Dupont)</p><p>· 2e</p></div>
<p>Directrice commerciale chez Acme SAS | SaaS B2B</p><div><figure><img alt=""></figure><p>Acme SAS · EM Lyon Business School</p></div>
<div><p>Lyon, Auvergne-Rhône-Alpes, France</p><p>·</p><p><a>Coordonnées</a></p></div><div><p>1 245 abonnés</p><span>·</span><span>500+</span><span>relations</span></div>
<div><p>Julie Roux, Paul Morel et 3 autres relations en commun</p></div><div><button>Message</button><button>Se connecter</button><button>Plus</button></div></div></div></div>
<div componentkey="com.linkedin.sdui.profile.card.refACoAAAB1c2EBxYz123AboutTopLevelSection"><h2>Infos</h2><div data-testid="expandable-text-box">Vingt ans dans la vente B2B.</div></div>
<aside><h2>Autres profils consultés</h2><a href="https://www.linkedin.com/in/autre-personne/">Autre Personne</a></aside></main>`);

export const RELATIONS_SDUI = page('Relations | LinkedIn', `<main><h1>1 234 relations</h1><div data-view-name="connections-list">
<div><a data-view-name="connections-profile" href="https://www.linkedin.com/in/camille-martin-4b2a1c9/"><figure aria-label="Photo de profil de Camille Martin"><img alt="" src="data:,"></figure></a>
<div><a data-view-name="connections-profile" href="https://www.linkedin.com/in/camille-martin-4b2a1c9/"><p>Camille Martin</p><p>Directrice commerciale chez Acme SAS</p></a><p>Relation établie le 12 septembre 2026</p></div>
<div><button data-view-name="message-button">Message</button><button aria-label="Plus d’actions"><svg></svg></button></div></div>
<div><a data-view-name="connections-profile" href="https://www.linkedin.com/in/thomas-bernard-pro/"><figure><svg></svg></figure></a>
<div><a data-view-name="connections-profile" href="https://www.linkedin.com/in/thomas-bernard-pro/"><p>Thomas Bernard</p><p>Fondateur @ Boulangerie Bernard</p></a><p>Relation établie le 30 août 2026</p></div>
<div><button data-view-name="message-button">Message</button></div></div></div><button><span>Afficher plus de résultats</span></button></main>`);
