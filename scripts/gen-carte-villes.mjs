// Génère app/modules/bs-carte-villes.js : noms des pays (en français) et grandes villes du monde pour la « Carte clients ».
// Usage : npm i --no-save all-the-cities@3 && node scripts/gen-carte-villes.mjs
// Villes : GeoNames via all-the-cities (CC BY 4.0). Capitales, villes de plus de 750 000 habitants, villes européennes
// de plus de 250 000 habitants et villes françaises de plus de 45 000 habitants.
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const cities = createRequire(import.meta.url)('all-the-cities');

// Noms français des pays du fond de carte (Natural Earth, noms anglais abrégés).
const PAYS = {
  'Fiji': 'Fidji', 'Tanzania': 'Tanzanie', 'W. Sahara': 'Sahara occ.', 'Canada': 'Canada', 'United States of America': 'États-Unis',
  'Kazakhstan': 'Kazakhstan', 'Uzbekistan': 'Ouzbékistan', 'Papua New Guinea': 'Papouasie-N.-G.', 'Indonesia': 'Indonésie',
  'Argentina': 'Argentine', 'Chile': 'Chili', 'Dem. Rep. Congo': 'RD Congo', 'Somalia': 'Somalie', 'Kenya': 'Kenya', 'Sudan': 'Soudan',
  'Chad': 'Tchad', 'Haiti': 'Haïti', 'Dominican Rep.': 'Rép. dominicaine', 'Russia': 'Russie', 'Bahamas': 'Bahamas',
  'Falkland Is.': 'Malouines', 'Norway': 'Norvège', 'Greenland': 'Groenland', 'Fr. S. Antarctic Lands': 'Terres australes fr.',
  'Timor-Leste': 'Timor oriental', 'South Africa': 'Afrique du Sud', 'Lesotho': 'Lesotho', 'Mexico': 'Mexique', 'Uruguay': 'Uruguay',
  'Brazil': 'Brésil', 'Bolivia': 'Bolivie', 'Peru': 'Pérou', 'Colombia': 'Colombie', 'Panama': 'Panama', 'Costa Rica': 'Costa Rica',
  'Nicaragua': 'Nicaragua', 'Honduras': 'Honduras', 'El Salvador': 'Salvador', 'Guatemala': 'Guatemala', 'Belize': 'Belize',
  'Venezuela': 'Venezuela', 'Guyana': 'Guyana', 'Suriname': 'Suriname', 'France': 'France', 'Ecuador': 'Équateur',
  'Puerto Rico': 'Porto Rico', 'Jamaica': 'Jamaïque', 'Cuba': 'Cuba', 'Zimbabwe': 'Zimbabwe', 'Botswana': 'Botswana',
  'Namibia': 'Namibie', 'Senegal': 'Sénégal', 'Mali': 'Mali', 'Mauritania': 'Mauritanie', 'Benin': 'Bénin', 'Niger': 'Niger',
  'Nigeria': 'Nigeria', 'Cameroon': 'Cameroun', 'Togo': 'Togo', 'Ghana': 'Ghana', "Côte d'Ivoire": "Côte d'Ivoire", 'Guinea': 'Guinée',
  'Guinea-Bissau': 'Guinée-Bissau', 'Liberia': 'Liberia', 'Sierra Leone': 'Sierra Leone', 'Burkina Faso': 'Burkina Faso',
  'Central African Rep.': 'Centrafrique', 'Congo': 'Congo', 'Gabon': 'Gabon', 'Eq. Guinea': 'Guinée équat.', 'Zambia': 'Zambie',
  'Malawi': 'Malawi', 'Mozambique': 'Mozambique', 'eSwatini': 'Eswatini', 'Angola': 'Angola', 'Burundi': 'Burundi', 'Israel': 'Israël',
  'Lebanon': 'Liban', 'Madagascar': 'Madagascar', 'Palestine': 'Palestine', 'Gambia': 'Gambie', 'Tunisia': 'Tunisie',
  'Algeria': 'Algérie', 'Jordan': 'Jordanie', 'United Arab Emirates': 'Émirats arabes unis', 'Qatar': 'Qatar', 'Kuwait': 'Koweït',
  'Iraq': 'Irak', 'Oman': 'Oman', 'Vanuatu': 'Vanuatu', 'Cambodia': 'Cambodge', 'Thailand': 'Thaïlande', 'Laos': 'Laos',
  'Myanmar': 'Birmanie', 'Vietnam': 'Viêt Nam', 'North Korea': 'Corée du Nord', 'South Korea': 'Corée du Sud', 'Mongolia': 'Mongolie',
  'India': 'Inde', 'Bangladesh': 'Bangladesh', 'Bhutan': 'Bhoutan', 'Nepal': 'Népal', 'Pakistan': 'Pakistan',
  'Afghanistan': 'Afghanistan', 'Tajikistan': 'Tadjikistan', 'Kyrgyzstan': 'Kirghizistan', 'Turkmenistan': 'Turkménistan',
  'Iran': 'Iran', 'Syria': 'Syrie', 'Armenia': 'Arménie', 'Sweden': 'Suède', 'Belarus': 'Biélorussie', 'Ukraine': 'Ukraine',
  'Poland': 'Pologne', 'Austria': 'Autriche', 'Hungary': 'Hongrie', 'Moldova': 'Moldavie', 'Romania': 'Roumanie',
  'Lithuania': 'Lituanie', 'Latvia': 'Lettonie', 'Estonia': 'Estonie', 'Germany': 'Allemagne', 'Bulgaria': 'Bulgarie',
  'Greece': 'Grèce', 'Turkey': 'Turquie', 'Albania': 'Albanie', 'Croatia': 'Croatie', 'Switzerland': 'Suisse',
  'Luxembourg': 'Luxembourg', 'Belgium': 'Belgique', 'Netherlands': 'Pays-Bas', 'Portugal': 'Portugal', 'Spain': 'Espagne',
  'Ireland': 'Irlande', 'New Caledonia': 'Nouvelle-Calédonie', 'Solomon Is.': 'Îles Salomon', 'New Zealand': 'Nouvelle-Zélande',
  'Australia': 'Australie', 'Sri Lanka': 'Sri Lanka', 'China': 'Chine', 'Taiwan': 'Taïwan', 'Italy': 'Italie', 'Denmark': 'Danemark',
  'United Kingdom': 'Royaume-Uni', 'Iceland': 'Islande', 'Azerbaijan': 'Azerbaïdjan', 'Georgia': 'Géorgie',
  'Philippines': 'Philippines', 'Malaysia': 'Malaisie', 'Brunei': 'Brunei', 'Slovenia': 'Slovénie', 'Finland': 'Finlande',
  'Slovakia': 'Slovaquie', 'Czechia': 'Tchéquie', 'Eritrea': 'Érythrée', 'Japan': 'Japon', 'Paraguay': 'Paraguay', 'Yemen': 'Yémen',
  'Saudi Arabia': 'Arabie saoudite', 'Antarctica': 'Antarctique', 'N. Cyprus': '', 'Cyprus': 'Chypre', 'Morocco': 'Maroc',
  'Egypt': 'Égypte', 'Libya': 'Libye', 'Ethiopia': 'Éthiopie', 'Djibouti': 'Djibouti', 'Somaliland': '', 'Uganda': 'Ouganda',
  'Rwanda': 'Rwanda', 'Bosnia and Herz.': 'Bosnie', 'Macedonia': 'Macédoine du Nord', 'Serbia': 'Serbie', 'Montenegro': 'Monténégro',
  'Kosovo': 'Kosovo', 'Trinidad and Tobago': 'Trinité-et-Tobago', 'S. Sudan': 'Soudan du Sud', 'Jersey': '', 'Guernsey': '',
  'Isle of Man': '', 'Malta': 'Malte', 'Liechtenstein': '', 'Åland': '', 'Faeroe Is.': 'Féroé', 'Andorra': '',
};
// Exonymes français des grandes villes.
const NOMS = {
  London: 'Londres', Moscow: 'Moscou', Beijing: 'Pékin', 'New York City': 'New York', 'Mexico City': 'Mexico', Cairo: 'Le Caire',
  Rome: 'Rome', Vienna: 'Vienne', Warsaw: 'Varsovie', Prague: 'Prague', Lisbon: 'Lisbonne', Athens: 'Athènes', Brussels: 'Bruxelles',
  Copenhagen: 'Copenhague', Munich: 'Munich', Milan: 'Milan', Naples: 'Naples', Turin: 'Turin', Venice: 'Venise', Florence: 'Florence',
  Geneva: 'Genève', Zurich: 'Zurich', Cologne: 'Cologne', Hamburg: 'Hambourg', Seville: 'Séville', Algiers: 'Alger', Tunis: 'Tunis',
  Rabat: 'Rabat', Casablanca: 'Casablanca', 'Saint Petersburg': 'Saint-Pétersbourg', Bucharest: 'Bucarest', Belgrade: 'Belgrade',
  Kyiv: 'Kiev', Kiev: 'Kiev', Minsk: 'Minsk', Stockholm: 'Stockholm', Oslo: 'Oslo', Helsinki: 'Helsinki', Dublin: 'Dublin',
  Edinburgh: 'Édimbourg', Antwerpen: 'Anvers', Antwerp: 'Anvers', 'The Hague': 'La Haye', Singapore: 'Singapour', Bangkok: 'Bangkok',
  Hanoi: 'Hanoï', 'Ho Chi Minh City': 'Hô Chi Minh-Ville', Seoul: 'Séoul', Tokyo: 'Tokyo', Delhi: 'Delhi', 'New Delhi': 'New Delhi',
  Mumbai: 'Bombay', Kolkata: 'Calcutta', Tehran: 'Téhéran', Baghdad: 'Bagdad', Riyadh: 'Riyad', Jerusalem: 'Jérusalem',
  Beirut: 'Beyrouth', Damascus: 'Damas', Ankara: 'Ankara', Istanbul: 'Istanbul', 'Cape Town': 'Le Cap', 'Addis Ababa': 'Addis-Abeba',
  Mogadishu: 'Mogadiscio', 'Kuwait City': 'Koweït', Havana: 'La Havane', 'Rio de Janeiro': 'Rio de Janeiro', 'São Paulo': 'São Paulo',
  'Brasília': 'Brasilia', Philadelphia: 'Philadelphie', 'New Orleans': 'La Nouvelle-Orléans', Montreal: 'Montréal', Montréal: 'Montréal',
  'Québec': 'Québec', 'Washington, D.C.': 'Washington', Washington: 'Washington', Tripoli: 'Tripoli', Khartoum: 'Khartoum',
  Kabul: 'Kaboul', Tashkent: 'Tachkent', 'Kuala Lumpur': 'Kuala Lumpur', Manila: 'Manille', Taipei: 'Taipei', 'Hong Kong': 'Hong Kong',
  Canton: 'Canton', Guangzhou: 'Canton', Nanjing: 'Nankin', Sydney: 'Sydney', Melbourne: 'Melbourne', Wellington: 'Wellington',
  Bern: 'Berne', Valletta: 'La Valette', Nicosia: 'Nicosie', Sofia: 'Sofia', Zagreb: 'Zagreb', Ljubljana: 'Ljubljana', Bratislava: 'Bratislava',
  Budapest: 'Budapest', Vilnius: 'Vilnius', Riga: 'Riga', Tallinn: 'Tallinn', Reykjavik: 'Reykjavik', 'Reykjavík': 'Reykjavik',
  Dakar: 'Dakar', Abidjan: 'Abidjan', Bamako: 'Bamako', Nouakchott: 'Nouakchott', Niamey: 'Niamey', Kinshasa: 'Kinshasa',
  Brazzaville: 'Brazzaville', Libreville: 'Libreville', 'Yaoundé': 'Yaoundé', Douala: 'Douala', 'Antananarivo': 'Antananarivo',
  'Port Louis': 'Port-Louis', 'Saint-Denis': 'Saint-Denis', Nairobi: 'Nairobi', Lagos: 'Lagos', Accra: 'Accra', Luanda: 'Luanda',
  Johannesburg: 'Johannesbourg', Pretoria: 'Pretoria', Bogotá: 'Bogota', Lima: 'Lima', Santiago: 'Santiago', 'Buenos Aires': 'Buenos Aires',
  Caracas: 'Caracas', Quito: 'Quito', 'La Paz': 'La Paz', Asunción: 'Asuncion', Montevideo: 'Montevideo', Panama: 'Panama',
  'Los Angeles': 'Los Angeles', Chicago: 'Chicago', Houston: 'Houston', 'San Francisco': 'San Francisco', Miami: 'Miami',
  Toronto: 'Toronto', Vancouver: 'Vancouver', Dubai: 'Dubaï', 'Abu Dhabi': 'Abou Dabi', Doha: 'Doha', Muscat: 'Mascate',
  Karachi: 'Karachi', Lahore: 'Lahore', Islamabad: 'Islamabad', Dhaka: 'Dacca', Kathmandu: 'Katmandou', Colombo: 'Colombo',
  Yangon: 'Rangoun', Rangoon: 'Rangoun', 'Phnom Penh': 'Phnom Penh', Vientiane: 'Vientiane', Pyongyang: 'Pyongyang', Ulaanbaatar: 'Oulan-Bator',
  Jakarta: 'Jakarta', Shanghai: 'Shanghai', Osaka: 'Osaka', Lyon: 'Lyon', Marseille: 'Marseille', Paris: 'Paris',
};
const EUROPE = new Set('AL AD AT BA BE BG BY CH CY CZ DE DK EE ES FI GB GR HR HU IE IS IT LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS SE SI SK SM UA VA XK'.split(' '));
const pick = cities.filter((c) => {
  if (c.country === 'FR') return c.population >= 45000 && /^PPL/.test(c.featureCode);
  if (c.featureCode === 'PPLC') return c.population >= 20000;
  if (EUROPE.has(c.country)) return c.population >= 250000;
  return c.population >= 750000;
}).sort((a, b) => b.population - a.population);
// Une seule entrée par nom et pays (GeoNames répète certaines villes).
const seen = new Set();
const villes = [];
for (const c of pick) {
  const key = c.name + c.country;
  if (seen.has(key)) continue;
  seen.add(key);
  const [lon, lat] = c.loc.coordinates;
  // [nom, lon, lat, population en milliers, 1 = capitale, pays]
  villes.push([NOMS[c.name] || c.name, +lon.toFixed(3), +lat.toFixed(3), Math.round(c.population / 1000), c.featureCode === 'PPLC' ? 1 : 0, c.country]);
}
const js = '/* Blackstart CRM : noms des pays et grandes villes de la « Carte clients » (généré par scripts/gen-carte-villes.mjs, ne pas modifier).\n' +
  ' * Villes : GeoNames (CC BY 4.0) via all-the-cities. Format : [nom, longitude, latitude, population en milliers, capitale, pays]. */\n' +
  'window.bsCarteNoms = ' + JSON.stringify({ pays: PAYS, villes }) + ';\n';
writeFileSync(new URL('../app/modules/bs-carte-villes.js', import.meta.url), js);
console.log(villes.length + ' villes, ' + (js.length / 1024).toFixed(0) + ' Ko');
