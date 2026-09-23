/**
 * Umrah duas with sources.
 *
 * Every entry names its source so readers (and reviewers) can check it. Where a
 * dua is a report from a Companion rather than a hadith of the Prophet ﷺ, the
 * source says so - accuracy matters more here than anywhere else on the site.
 * Transliterations are a pronunciation aid only.
 */

export type Dua = {
  id: string;
  when: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  source: string;
  note?: string;
};

export const duas: Dua[] = [
  {
    id: "niyyah",
    when: "Intention for Umrah (at the miqat, in ihram)",
    arabic: "لَبَّيْكَ اللَّهُمَّ عُمْرَةً",
    transliteration: "Labbayk Allāhumma ‘umratan",
    meaning: "Here I am, O Allah, for Umrah.",
    source: "Based on Sahih Muslim 1232",
    note:
      "The intention itself is in the heart. Many in Pakistan also say: Allāhumma innī urīdul-‘umrata fa yassirhā lī wa taqabbalhā minnī - “O Allah, I intend Umrah; make it easy for me and accept it from me.”",
  },
  {
    id: "talbiyah",
    when: "Talbiyah - from ihram until you begin tawaf",
    arabic:
      "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
    transliteration:
      "Labbayk Allāhumma labbayk, labbayka lā sharīka laka labbayk, innal-ḥamda wan-ni‘mata laka wal-mulk, lā sharīka lak",
    meaning:
      "Here I am, O Allah, here I am. Here I am - You have no partner - here I am. All praise, all blessings and all dominion are Yours. You have no partner.",
    source: "Sahih al-Bukhari 1549; Sahih Muslim 1184",
    note: "Men recite it aloud; women recite it quietly.",
  },
  {
    id: "enter-masjid",
    when: "Entering Masjid al-Haram (right foot first)",
    arabic: "بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Bismillāh, waṣ-ṣalātu was-salāmu ‘alā Rasūlillāh. Allāhumma-ftaḥ lī abwāba raḥmatik",
    meaning:
      "In the name of Allah, and peace and blessings be upon the Messenger of Allah. O Allah, open for me the doors of Your mercy.",
    source: "Sahih Muslim 713; Sunan Ibn Majah 771",
  },
  {
    id: "black-stone",
    when: "At the Black Stone, starting each circuit of tawaf",
    arabic: "بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ",
    transliteration: "Bismillāhi wallāhu akbar",
    meaning: "In the name of Allah, and Allah is the Greatest.",
    source: "Sahih al-Bukhari 1613 (takbir at the corner); “Bismillah” reported from Ibn ‘Umar (al-Bayhaqi)",
    note: "Face the Black Stone, raise your right hand towards it (istilam) and say this. Don't push through the crowd to touch it.",
  },
  {
    id: "rabbana",
    when: "Between the Yemeni Corner and the Black Stone",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ‘adhāban-nār",
    meaning:
      "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    source: "Qur'an 2:201; Sunan Abi Dawud 1892",
    note: "For the rest of each circuit there is no fixed dua - pray for whatever you wish, in any language.",
  },
  {
    id: "maqam",
    when: "Approaching Maqam Ibrahim after tawaf",
    arabic: "وَاتَّخِذُوا مِن مَّقَامِ إِبْرَاهِيمَ مُصَلًّى",
    transliteration: "Wattakhidhū min maqāmi Ibrāhīma muṣallā",
    meaning: "And take the standing place of Ibrahim as a place of prayer.",
    source: "Qur'an 2:125; Sahih Muslim 1218",
    note:
      "Then pray two rak‘ahs behind the Maqam if there is space, or anywhere in the mosque. It is Sunnah to recite Surah al-Kafirun in the first and al-Ikhlas in the second.",
  },
  {
    id: "zamzam",
    when: "Drinking Zamzam",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ",
    transliteration: "Allāhumma innī as’aluka ‘ilman nāfi‘an, wa rizqan wāsi‘an, wa shifā’an min kulli dā’",
    meaning: "O Allah, I ask You for beneficial knowledge, plentiful provision, and healing from every illness.",
    source: "Reported from Ibn ‘Abbas (Sunan al-Daraqutni)",
    note: "The Prophet ﷺ said Zamzam is “for whatever it is drunk for” (Sunan Ibn Majah 3062), so any dua may be made.",
  },
  {
    id: "safa-start",
    when: "Climbing Safa at the start of sa'i",
    arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ ۖ أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ",
    transliteration: "Innaṣ-ṣafā wal-marwata min sha‘ā’irillāh. Abda’u bimā bada’allāhu bih",
    meaning: "Indeed Safa and Marwah are among the symbols of Allah. I begin with what Allah began with.",
    source: "Qur'an 2:158; Sahih Muslim 1218",
    note: "Said once, at the very start of sa'i.",
  },
  {
    id: "safa-marwah",
    when: "On Safa and on Marwah, facing the Kaaba",
    arabic:
      "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ",
    transliteration:
      "Allāhu akbar, Allāhu akbar, Allāhu akbar. Lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamd, wa huwa ‘alā kulli shay’in qadīr. Lā ilāha illallāhu waḥdah, anjaza wa‘dah, wa naṣara ‘abdah, wa hazamal-aḥzāba waḥdah",
    meaning:
      "Allah is the Greatest. There is no god but Allah alone, without partner; His is the dominion and His is the praise, and He has power over all things. There is no god but Allah alone: He fulfilled His promise, supported His servant, and alone defeated the confederates.",
    source: "Sahih Muslim 1218",
    note: "Repeat it three times, raising your hands and making your own dua in between.",
  },
  {
    id: "green-lights",
    when: "Between the green lights during sa'i",
    arabic: "رَبِّ اغْفِرْ وَارْحَمْ، إِنَّكَ أَنْتَ الْأَعَزُّ الْأَكْرَمُ",
    transliteration: "Rabbighfir warḥam, innaka antal-a‘azzul-akram",
    meaning: "My Lord, forgive and have mercy. You are the Most Mighty, the Most Generous.",
    source: "Reported from Ibn Mas‘ud and Ibn ‘Umar (Musannaf Ibn Abi Shaybah)",
    note: "Men walk briskly between the green lights; women walk normally.",
  },
  {
    id: "leave-masjid",
    when: "Leaving the masjid (left foot first)",
    arabic: "بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    transliteration: "Bismillāh, waṣ-ṣalātu was-salāmu ‘alā Rasūlillāh. Allāhumma innī as’aluka min faḍlik",
    meaning:
      "In the name of Allah, and peace and blessings be upon the Messenger of Allah. O Allah, I ask You of Your bounty.",
    source: "Sahih Muslim 713; Sunan Ibn Majah 771",
  },
  {
    id: "salam",
    when: "Greeting the Prophet ﷺ at his grave in Madinah",
    arabic: "السَّلَامُ عَلَيْكَ يَا رَسُولَ اللَّهِ",
    transliteration: "As-salāmu ‘alayka yā Rasūlallāh",
    meaning: "Peace be upon you, O Messenger of Allah.",
    source: "Practice of Ibn ‘Umar (Muwatta Malik)",
    note: "Then greet Abu Bakr (As-salāmu ‘alayka yā Abā Bakr) and ‘Umar (As-salāmu ‘alayka yā ‘Umar), may Allah be pleased with them.",
  },
  {
    id: "travel",
    when: "Setting out on the journey",
    arabic:
      "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ",
    transliteration: "Subḥānal-ladhī sakhkhara lanā hādhā wa mā kunnā lahū muqrinīn, wa innā ilā Rabbinā lamunqalibūn",
    meaning:
      "Glory be to the One who has placed this at our service - we could never have done it ourselves - and to our Lord we will surely return.",
    source: "Qur'an 43:13-14; Sahih Muslim 1342",
  },
];

export function getDua(id: string): Dua {
  const d = duas.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown dua ${id}`);
  return d;
}
