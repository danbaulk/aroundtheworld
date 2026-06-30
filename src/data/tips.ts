// Curated, static per-country travel tips — keyed by ISO alpha-3, mirroring the badges/challenges
// data style. Written from a UK traveller's perspective (gov.uk advice, British spelling). This is
// a hand-picked seed set; countries without an entry fall back to a "no tips yet" state in the UI.
// Add a country by appending an entry below — nothing else needs to change.

export type CountryTip = {
  currency: string
  airport: string // airport → city transfer & public transport
  phrases: { en: string; local: string }[] // a few quick words
  sim: string
  govAdvice: { summary: string; url: string } // gov.uk travel advice
  scams: string[]
  vaccines: string
  entry: string // entry requirements for a UK passport holder
  atms: string // where to get cash without fees
  shops: string // tourist-friendly supermarkets / pharmacists
  water: string // is the tap water safe?
  toilets: string
}

export const TIPS: Record<string, CountryTip> = {
  JPN: {
    currency: 'Japanese yen (¥). Still a fairly cash-based society — carry notes for small shops, shrines and rural areas.',
    airport: 'Narita/Haneda → Tokyo: the Narita Express (N\'EX) or Keisei Skyliner from Narita; the Tokyo Monorail or Keikyu line from Haneda. Get an IC card (Suica/PASMO, or the mobile version) for all trains, buses and convenience stores.',
    phrases: [
      { en: 'Hello', local: 'Konnichiwa' },
      { en: 'Thank you', local: 'Arigatou gozaimasu' },
      { en: 'Excuse me / sorry', local: 'Sumimasen' },
      { en: 'Yes / No', local: 'Hai / Iie' },
    ],
    sim: 'Buy a data-only travel SIM or eSIM (e.g. at the airport) — most carriers don\'t do pay-as-you-go for tourists. Pocket Wi-Fi rental is popular for groups.',
    govAdvice: { summary: 'No major warnings; standard advice on earthquakes/typhoons.', url: 'https://www.gov.uk/foreign-travel-advice/japan' },
    scams: ['Very low crime overall.', 'Touts outside Roppongi/Kabukicho bars can lead to inflated bills — avoid bars you\'re ushered into.'],
    vaccines: 'No special vaccines required; be up to date on routine jabs (check the NHS Fit for Travel site).',
    entry: 'UK passport holders get visa-free entry for up to 90 days as a tourist.',
    atms: '7-Eleven (7-Bank) and Japan Post ATMs reliably accept foreign cards 24/7 — most convenient for cash.',
    shops: 'Convenience stores (7-Eleven, Lawson, FamilyMart) are everywhere for food, cash and SIMs. Pharmacies: Matsumoto Kiyoshi, Welcia.',
    water: 'Tap water is safe to drink across the country.',
    toilets: 'Excellent and free — clean public toilets in stations and convenience stores, often with heated/washlet seats.',
  },
  FRA: {
    currency: 'Euro (€). Cards are accepted almost everywhere; carry a little cash for markets and small cafés.',
    airport: 'CDG → Paris: RER B train to the centre (~35 min), or the Roissybus to Opéra. Orly → Paris: the Orlyval shuttle to RER B, or tram T7. Use a Navigo Easy card or contactless for the metro.',
    phrases: [
      { en: 'Hello', local: 'Bonjour' },
      { en: 'Thank you', local: 'Merci' },
      { en: 'Please', local: 'S\'il vous plaît' },
      { en: 'Excuse me', local: 'Pardon' },
    ],
    sim: 'Any EU SIM/eSIM works (Orange, SFR, Free, Bouygues). UK roaming may now incur charges — check your plan or buy a local/eSIM.',
    govAdvice: { summary: 'Standard advice; be alert to pickpockets and occasional strikes/demonstrations.', url: 'https://www.gov.uk/foreign-travel-advice/france' },
    scams: ['Pickpockets on the metro and around major sights (Eiffel Tower, Sacré-Cœur).', 'The "gold ring" and petition/clipboard distractions.', 'Friendship-bracelet sellers at Montmartre.'],
    vaccines: 'No special vaccines required beyond routine UK jabs.',
    entry: 'UK passport holders can visit visa-free for up to 90 days in any 180 within the Schengen area.',
    atms: 'Bank ATMs (BNP Paribas, Crédit Agricole, Société Générale) are fee-free; avoid standalone "Euronet" machines, which add charges.',
    shops: 'Supermarkets: Monoprix, Carrefour, Franprix. Pharmacies show a green cross and are well stocked.',
    water: 'Tap water is safe; ask for "une carafe d\'eau" in restaurants for free tap water.',
    toilets: 'Public "sanisette" toilets in Paris are free; cafés expect you to be a customer.',
  },
  THA: {
    currency: 'Thai baht (฿). Cash-led outside hotels and malls — carry small notes for street food, markets and tuk-tuks.',
    airport: 'Suvarnabhumi (BKK) → Bangkok: the Airport Rail Link to the BTS/MRT, or a metered taxi (insist on the meter, plus a small airport surcharge). Don\'t take one from touts inside the terminal — use the official taxi queue.',
    phrases: [
      { en: 'Hello', local: 'Sawasdee (khrap/kha)' },
      { en: 'Thank you', local: 'Khop khun (khrap/kha)' },
      { en: 'How much?', local: 'Tao rai?' },
      { en: 'No problem', local: 'Mai pen rai' },
    ],
    sim: 'Cheap tourist SIMs (AIS, TrueMove, dtac) sold at the airport with generous data — bring your passport to register.',
    govAdvice: { summary: 'Generally safe; care near the southern border provinces and during political demonstrations.', url: 'https://www.gov.uk/foreign-travel-advice/thailand' },
    scams: ['"The Grand Palace is closed today" tuk-tuk gem/tailor scams — it isn\'t.', 'Jet-ski and motorbike rental damage claims.', 'Rigged taxi meters — agree to use the meter or walk away.'],
    vaccines: 'Routine jabs plus hepatitis A and typhoid are commonly advised; consider others for rural/long stays — see a travel clinic 4–6 weeks ahead.',
    entry: 'UK passport holders get visa-exempt entry (currently up to 60 days) for tourism; check the latest as rules change.',
    atms: 'ATMs charge a flat foreign-card fee (~220฿) per withdrawal — take out larger amounts less often. Bank counters can be cheaper.',
    shops: '7-Eleven and Family Mart are ubiquitous; Big C / Tesco Lotus for supermarkets; Boots and Watsons for pharmacies.',
    water: 'Don\'t drink the tap water — bottled water is cheap and everywhere; avoid ice from street stalls if unsure (most tourist areas use safe factory ice).',
    toilets: 'Mix of Western and squat toilets; carry tissue and small change; many use a bidet spray rather than paper.',
  },
  USA: {
    currency: 'US dollar ($). Card-first, but keep small notes for tipping. Tipping is expected: ~18–20% in restaurants, $1–2 per drink/bag.',
    airport: 'Transfers vary by city — many have a rail link (e.g. JFK AirTrain → subway, or the "L" Blue Line at Chicago O\'Hare). Uber/Lyft pickups are usually at a signed rideshare zone.',
    phrases: [{ en: 'English is spoken nationwide', local: 'Spanish is widely useful in the south-west' }],
    sim: 'eSIMs from T-Mobile/AT&T or travel eSIMs are easiest; physical tourist SIMs are sold at airports and big-box stores.',
    govAdvice: { summary: 'Standard advice; be aware of local rules and the ESTA requirement.', url: 'https://www.gov.uk/foreign-travel-advice/usa' },
    scams: ['Costumed characters in Times Square demanding tips for photos.', 'Inflated "tourist" taxi fares — prefer metered cabs or rideshare apps.'],
    vaccines: 'No special vaccines required beyond routine UK jabs. Note: healthcare is very expensive — travel insurance is essential.',
    entry: 'UK passport holders need an approved ESTA (apply online, costs ~$21, valid 2 years) before flying under the Visa Waiver Programme.',
    atms: 'Use ATMs inside banks (Chase, Bank of America) to avoid skimming and high standalone fees.',
    shops: 'Supermarkets: Walmart, Target, Trader Joe\'s, Whole Foods. Pharmacies: CVS, Walgreens (also sell basic medicines and toiletries).',
    water: 'Tap water is safe to drink in virtually all areas.',
    toilets: 'Free public "restrooms" in malls, cafés and gas stations; ask for the "restroom", not the "toilet".',
  },
  ESP: {
    currency: 'Euro (€). Cards widely accepted; carry coins for small bars and markets.',
    airport: 'Madrid-Barajas → centre: Metro Line 8 or the Cercanías train. Barcelona-El Prat → centre: the Aerobús or R2 Nord train. Buy a multi-journey metro ticket (T-casual in Barcelona).',
    phrases: [
      { en: 'Hello', local: 'Hola' },
      { en: 'Thank you', local: 'Gracias' },
      { en: 'Please', local: 'Por favor' },
      { en: 'The bill, please', local: 'La cuenta, por favor' },
    ],
    sim: 'Any EU SIM/eSIM works (Movistar, Vodafone, Orange). Check UK roaming charges before relying on your home plan.',
    govAdvice: { summary: 'Standard advice; watch for pickpockets in Barcelona and Madrid.', url: 'https://www.gov.uk/foreign-travel-advice/spain' },
    scams: ['Pickpockets on Barcelona\'s La Rambla and the metro.', 'Distraction tricks ("there\'s something on your jacket").', 'Fake police asking to "check" your wallet — real police won\'t.'],
    vaccines: 'No special vaccines required beyond routine UK jabs.',
    entry: 'UK passport holders can visit visa-free for up to 90 days in any 180 within the Schengen area.',
    atms: 'Use bank ATMs (CaixaBank, BBVA, Santander); decline the machine\'s currency-conversion offer and pay in euros.',
    shops: 'Supermarkets: Mercadona, Carrefour, Dia. Pharmacies (farmacia) show a green cross and rotate 24-hour duty shifts.',
    water: 'Tap water is safe in most of the country, though it can taste of chlorine on the coast/islands.',
    toilets: 'Few free public toilets — use cafés/department stores (El Corte Inglés is reliable).',
  },
  ITA: {
    currency: 'Euro (€). Cards accepted in cities; carry cash for small trattorias, markets and rural towns.',
    airport: 'Rome Fiumicino → centre: the Leonardo Express to Termini (~32 min). Milan Malpensa → centre: the Malpensa Express to Cadorna/Centrale. Validate paper rail tickets before boarding.',
    phrases: [
      { en: 'Hello', local: 'Ciao / Buongiorno' },
      { en: 'Thank you', local: 'Grazie' },
      { en: 'Please', local: 'Per favore' },
      { en: 'Excuse me', local: 'Scusi' },
    ],
    sim: 'Any EU SIM/eSIM works (TIM, Vodafone, WindTre). Check your UK roaming terms first.',
    govAdvice: { summary: 'Standard advice; beware pickpockets around major sights and stations.', url: 'https://www.gov.uk/foreign-travel-advice/italy' },
    scams: ['Pickpockets near the Colosseum, Trevi Fountain and on Rome\'s Metro Line A.', 'Bracelet/“gift” sellers who then demand money.', 'Restaurants near sights with no prices — check the menu and "coperto" (cover charge) first.'],
    vaccines: 'No special vaccines required beyond routine UK jabs.',
    entry: 'UK passport holders can visit visa-free for up to 90 days in any 180 within the Schengen area.',
    atms: 'Use bank ATMs (Bancomat) inside branches; avoid standalone Euronet machines and always pay in euros.',
    shops: 'Supermarkets: Conad, Coop, Esselunga. Pharmacies (farmacia) show a green cross; some open at night on a rota.',
    water: 'Tap water is safe; the free public "nasoni" fountains in Rome are drinkable.',
    toilets: 'Public toilets are scarce and often charge ~€1 — keep coins, or use a café.',
  },
  AUS: {
    currency: 'Australian dollar (A$). Very card-friendly — contactless works almost everywhere, even for small amounts.',
    airport: 'Sydney → centre: the Airport Link train to the CBD. Melbourne (Tullamarine) → centre: the SkyBus. Get an Opal (Sydney) or Myki (Melbourne) card, or just tap a contactless card on public transport.',
    phrases: [{ en: 'English is spoken nationwide', local: 'Casual slang: "arvo" = afternoon, "brekkie" = breakfast' }],
    sim: 'Prepaid SIMs (Telstra has the best rural coverage; Optus, Vodafone cheaper in cities) sold at airports and supermarkets.',
    govAdvice: { summary: 'Standard advice; respect bushfire, surf and heat warnings.', url: 'https://www.gov.uk/foreign-travel-advice/australia' },
    scams: ['Low scam risk.', 'Main hazards are natural: strong sun, rip currents (swim between the red-and-yellow flags), and wildlife.'],
    vaccines: 'No special vaccines required beyond routine UK jabs.',
    entry: 'UK passport holders need an ETA or eVisitor visa (apply online before travel) — you cannot enter visa-free.',
    atms: 'Major bank ATMs (Commonwealth, Westpac, ANZ, NAB) are fee-free for their own customers; foreign cards may incur a small fee.',
    shops: 'Supermarkets: Woolworths, Coles, Aldi. Pharmacies (chemist): Chemist Warehouse, Priceline.',
    water: 'Tap water is safe to drink everywhere.',
    toilets: 'Free, clean public toilets are plentiful; the National Public Toilet Map app lists them.',
  },
  ARE: {
    currency: 'UAE dirham (AED, "Dhs"). Cards accepted widely; carry some cash for taxis and souks (haggling expected in markets).',
    airport: 'Dubai (DXB) → city: the Metro Red Line runs through the airport, or use the official taxi rank / careem/Uber. Abu Dhabi: airport taxi or the bus. Buy a Nol card for Dubai\'s metro, tram and buses.',
    phrases: [
      { en: 'Hello (peace be upon you)', local: 'As-salamu alaykum' },
      { en: 'Thank you', local: 'Shukran' },
      { en: 'Please', local: 'Min fadlak' },
      { en: 'God willing', local: 'Inshallah' },
    ],
    sim: 'Tourist SIMs from du or Etisalat (e) sold at the airport with data + some free local minutes; passport needed to register.',
    govAdvice: { summary: 'Respect local laws and customs — they are strict on public behaviour, alcohol, drugs and social media.', url: 'https://www.gov.uk/foreign-travel-advice/united-arab-emirates' },
    scams: ['Low crime, but watch for unofficial taxis and inflated "tourist" prices in souks — agree a price first.'],
    vaccines: 'No special vaccines required beyond routine UK jabs.',
    entry: 'UK passport holders get a free visa-on-arrival (currently up to 30/40 days). Note: many common medicines (e.g. codeine) are controlled — check before bringing them.',
    atms: 'Bank ATMs are everywhere in malls; foreign-card fees vary, so withdraw larger amounts.',
    shops: 'Supermarkets: Carrefour, Lulu, Spinneys. Pharmacies are plentiful in malls and often open late.',
    water: 'Tap water is technically safe (desalinated) but most people drink bottled water, which is cheap.',
    toilets: 'Clean, free, air-conditioned toilets in every mall; many have a water spray alongside paper.',
  },
  MEX: {
    currency: 'Mexican peso (MX$). Cash-led outside resorts and cities — carry small notes; some places quote US dollars in tourist zones (paying in pesos is usually better value).',
    airport: 'Mexico City (MEX) → centre: use the official "Taxi Autorizado" desks (pay inside, fixed zones) or an app like Uber/DiDi — avoid unmarked taxis. Cancún → hotel zone: pre-booked shuttle or the ADO bus to downtown.',
    phrases: [
      { en: 'Hello', local: 'Hola' },
      { en: 'Thank you', local: 'Gracias' },
      { en: 'Please', local: 'Por favor' },
      { en: 'How much?', local: '¿Cuánto cuesta?' },
    ],
    sim: 'Telcel has the best coverage; buy a prepaid SIM ("Amigo") at OXXO shops or the airport and top up at any OXXO.',
    govAdvice: { summary: 'Safe for most tourism, but some states/regions carry warnings — check the map before travelling.', url: 'https://www.gov.uk/foreign-travel-advice/mexico' },
    scams: ['Unofficial airport taxis overcharging.', 'ATM skimming — use machines inside banks.', 'Card "cloning" — keep your card in sight when paying.'],
    vaccines: 'Routine jabs plus hepatitis A and typhoid commonly advised; mosquito precautions in some areas — see a travel clinic.',
    entry: 'UK passport holders don\'t need a visa for tourism (up to 180 days); you\'ll get an entry stamp/FMM — keep it.',
    atms: 'Use ATMs inside banks (BBVA, Santander, Banorte); decline dynamic currency conversion and choose pesos.',
    shops: 'Convenience: OXXO (everywhere). Supermarkets: Soriana, Chedraui, Walmart. Pharmacies: Farmacias Guadalajara, Del Ahorro.',
    water: 'Don\'t drink the tap water — stick to bottled/purified ("agua purificada"); be cautious with ice and salads outside reputable places.',
    toilets: 'Carry tissue and coins; bins are provided for paper (plumbing often can\'t handle it); some public toilets charge a few pesos.',
  },
  MAR: {
    currency: 'Moroccan dirham (MAD). A closed currency — get it on arrival, not before. Very cash-led; carry small notes for tips, taxis and souks.',
    airport: 'Marrakech (RAK) → centre: bus 19 or a "petit taxi" (agree the fare first, or insist on the meter). Casablanca (CMN) → city: the Al Bidaoui train runs from the airport to Casa-Voyageurs.',
    phrases: [
      { en: 'Hello (peace be upon you)', local: 'Salam (alaikum)' },
      { en: 'Thank you', local: 'Shukran' },
      { en: 'No, thank you', local: 'La, shukran' },
      { en: 'How much?', local: 'Bshhal?' },
    ],
    sim: 'Cheap tourist SIMs from Maroc Telecom, Orange or inwi at the airport or in town; passport needed.',
    govAdvice: { summary: 'Generally safe for tourists; take care in crowded medinas and be alert to your surroundings.', url: 'https://www.gov.uk/foreign-travel-advice/morocco' },
    scams: ['Unofficial "guides" who attach themselves to you in the medina then demand payment.', '"This way is closed / let me show you" detours to a shop.', 'Henna ladies and photo-with-animal touts in Marrakech\'s Jemaa el-Fnaa.'],
    vaccines: 'Routine jabs plus hepatitis A and typhoid commonly advised; see a travel clinic before you go.',
    entry: 'UK passport holders can visit visa-free for up to 90 days as a tourist.',
    atms: 'Bank ATMs are common in cities (charges vary); keep a stock of cash before heading into rural areas/mountains.',
    shops: 'Supermarkets: Marjane, Carrefour, Acima (mainly in cities). Pharmacies are well stocked with a green crescent/cross sign.',
    water: 'Stick to bottled water; avoid tap water and ice outside good hotels/restaurants.',
    toilets: 'Often squat-style outside hotels; carry tissue and coins; a small tip for an attendant is normal.',
  },
}

/** The curated tips for a country, or undefined if it isn't in the seed set. */
export function getTips(a3: string): CountryTip | undefined {
  return TIPS[a3]
}
