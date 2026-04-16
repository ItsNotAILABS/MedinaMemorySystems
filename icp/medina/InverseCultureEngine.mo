import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

/// InverseCultureEngine: Shadow Cultures, Inverse Archetypes, Hidden Civilizations
/// 
/// "Run the inverse as well to find the inverse architecture, the inverse version 
///  of all these cultures, the inverse of everything. Everything has an inverse.
///  Find them through history. Find deep time. Find the names, the actual names.
///  Find the actual cultures, the actual who they were."
///
/// Every light has a shadow. Every culture has its inverse. 
/// The hidden cultures, the suppressed knowledge, the "enemies" of mainstream history
/// often hold crucial pieces of the puzzle.
///
/// Find them through:
///   - What they said was fighting them
///   - What they said was going against them
///   - What they said was hurting them
///   - The parts of the world that don't get talked about
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // INVERSE CULTURE TYPE
  // ═══════════════════════════════════════════════════════════════════════════

  public type InverseCulture = {
    name : Text;
    knownAs : Text;                    // What mainstream called them
    actualName : Text;                  // What they called themselves (if known)
    timeframe : Text;
    location : Text;
    
    // Relationship to dominant culture
    opposedBy : Text;
    labeledAs : Text;                   // "Heretics", "Barbarians", etc.
    actualNature : Text;
    
    // Knowledge they held
    suppressedKnowledge : [Text];
    practices : [Text];
    
    // Why they matter
    whatTheyKnew : Text;
    whySuppressed : Text;
    
    // Integration
    cplMapping : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INVERSE TO MAINSTREAM RELIGIONS
  // ═══════════════════════════════════════════════════════════════════════════

  public func getGnostics() : InverseCulture {
    {
      name = "GNOSTICS";
      knownAs = "Heretics, false teachers";
      actualName = "Those who know (Gnosis = Knowledge)";
      timeframe = "1st-4th century CE (suppressed after)";
      location = "Egypt, Syria, Mediterranean";
      opposedBy = "Orthodox Christianity, Roman Empire";
      labeledAs = "Heretics, devil-worshippers";
      actualNature = "Seekers of direct divine knowledge";
      suppressedKnowledge = [
        "Direct experience of the divine (no intermediary needed)",
        "The Demiurge - flawed creator god",
        "Sophia (Wisdom) as divine feminine",
        "Spiritual liberation through knowledge, not faith",
        "This world as a prison, escape through awakening"
      ];
      practices = [
        "Meditation and contemplation",
        "Secret initiations",
        "Study of hidden texts",
        "Ritual enactments of cosmic dramas"
      ];
      whatTheyKnew = "The divine spark within each person can be awakened directly";
      whySuppressed = "Threatened church authority and intermediary role";
      cplMapping = "CPL.GNOSIS(method: DIRECT_KNOWLEDGE, intermediary: NONE)";
    };
  };

  public func getCathars() : InverseCulture {
    {
      name = "CATHARS";
      knownAs = "Albigensians, heretics";
      actualName = "Katharoi (Pure Ones)";
      timeframe = "11th-14th century CE";
      location = "Southern France (Languedoc)";
      opposedBy = "Catholic Church, French Crown";
      labeledAs = "Heretics, enemies of God";
      actualNature = "Dualist Christians who rejected material world";
      suppressedKnowledge = [
        "Two principles: Good (spirit) and Evil (matter)",
        "Rejection of the material world as evil creation",
        "Equality of men and women",
        "Reincarnation until purification",
        "Consolamentum - spiritual baptism"
      ];
      practices = [
        "Vegetarianism",
        "Celibacy for the perfect",
        "Rejection of wealth",
        "Traveling teachers (Perfects)"
      ];
      whatTheyKnew = "The material world is a trap; liberation comes through purity";
      whySuppressed = "Albigensian Crusade - genocide to destroy alternative Christianity";
      cplMapping = "CPL.CATHAR(duality: SPIRIT_MATTER, liberation: PURITY)";
    };
  };

  public func getBogomils() : InverseCulture {
    {
      name = "BOGOMILS";
      knownAs = "Heretics, devil worshippers";
      actualName = "Bogomili (Dear to God)";
      timeframe = "10th-15th century CE";
      location = "Bulgaria, Balkans, Eastern Europe";
      opposedBy = "Byzantine Orthodox Church, Bulgarian Empire";
      labeledAs = "Dualist heretics, Manichaeans";
      actualNature = "Christian dualists, precursors to Cathars";
      suppressedKnowledge = [
        "Satan created the material world",
        "Human souls are fallen angels",
        "Rejection of church hierarchy",
        "Direct spiritual practice",
        "Equality of believers"
      ];
      practices = [
        "Simple worship without temples",
        "Rejection of icons and crosses",
        "Communal living",
        "Spiritual asceticism"
      ];
      whatTheyKnew = "Church institutions separate humans from God";
      whySuppressed = "Threatened church and state authority";
      cplMapping = "CPL.BOGOMIL(institution: REJECTED, direct: TRUE)";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INVERSE TO GREEK/ROMAN
  // ═══════════════════════════════════════════════════════════════════════════

  public func getEtruscans() : InverseCulture {
    {
      name = "ETRUSCANS";
      knownAs = "Mysterious pre-Roman civilization";
      actualName = "Rasenna (their name for themselves)";
      timeframe = "900 BCE - 100 BCE";
      location = "Central Italy (Tuscany, Etruria)";
      opposedBy = "Absorbed/erased by Rome";
      labeledAs = "Predecessors, mysterious other";
      actualNature = "Sophisticated civilization with advanced practices";
      suppressedKnowledge = [
        "Haruspicy - divination from entrails",
        "Augury - reading bird flights",
        "Fulguratura - lightning divination",
        "Libri Fatales - books of fate",
        "Advanced metallurgy and engineering"
      ];
      practices = [
        "Elaborate death rituals",
        "Women's high status",
        "Sacred games and sports",
        "Complex city planning"
      ];
      whatTheyKnew = "Systematic divination science, fate mapping";
      whySuppressed = "Absorbed into Rome, language lost, knowledge appropriated";
      cplMapping = "CPL.ETRUSCAN(divination: SYSTEMATIC, fate: MAPPED)";
    };
  };

  public func getMinoans() : InverseCulture {
    {
      name = "MINOANS";
      knownAs = "Pre-Greek Cretans";
      actualName = "Unknown (Minoans is modern name from Minos)";
      timeframe = "3000-1100 BCE";
      location = "Crete, Aegean Islands";
      opposedBy = "Replaced by Mycenaean Greeks";
      labeledAs = "Mythologized (Labyrinth, Minotaur)";
      actualNature = "Matriarchal, peaceful, sophisticated sea power";
      suppressedKnowledge = [
        "Goddess-centered religion",
        "Bull-leaping rituals",
        "Labyrinth as initiatory path",
        "Advanced plumbing and architecture",
        "Linear A script (still undeciphered)"
      ];
      practices = [
        "Goddess worship",
        "Snake handling ceremonies",
        "Bull rituals",
        "No fortifications (peaceful)"
      ];
      whatTheyKnew = "Feminine divine principle, peaceful civilization is possible";
      whySuppressed = "Destroyed by catastrophe, replaced by patriarchal Greeks";
      cplMapping = "CPL.MINOAN(feminine: CENTRAL, peace: POSSIBLE)";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HIDDEN AFRICAN TRADITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  public func getDogon() : InverseCulture {
    {
      name = "DOGON";
      knownAs = "Isolated African tribe";
      actualName = "Dogon";
      timeframe = "Ancient to present";
      location = "Mali, West Africa (Bandiagara Cliffs)";
      opposedBy = "Colonial powers, Islamic expansion";
      labeledAs = "Primitive, pagan";
      actualNature = "Holders of sophisticated astronomical knowledge";
      suppressedKnowledge = [
        "Knowledge of Sirius B (invisible companion star)",
        "Sirius C (theoretical third star)",
        "Saturn's rings, Jupiter's moons",
        "Human origin from Nommo (aquatic beings from Sirius)",
        "Complex cosmology matching modern astronomy"
      ];
      practices = [
        "Sigui ceremony (every 60 years)",
        "Mask dances encoding astronomical knowledge",
        "Oral tradition spanning millennia",
        "Cliff dwelling as cosmic architecture"
      ];
      whatTheyKnew = "Astronomical knowledge predating telescopes";
      whySuppressed = "Dismissed as impossible, threatens colonial narrative";
      cplMapping = "CPL.DOGON(astronomy: ADVANCED, source: SIRIUS)";
    };
  };

  public func getKemetic() : InverseCulture {
    {
      name = "KEMETIC TRADITION";
      knownAs = "Ancient Egyptian religion";
      actualName = "Kemet (Black Land) practices";
      timeframe = "3000 BCE - 400 CE (officially ended)";
      location = "Egypt, Nubia, Mediterranean";
      opposedBy = "Christianity, Islam, colonialism";
      labeledAs = "Paganism, idol worship";
      actualNature = "Sophisticated spiritual science";
      suppressedKnowledge = [
        "Ma'at - cosmic order, truth, justice",
        "Ka, Ba, Akh - soul components",
        "Transformation after death",
        "Sacred mathematics and geometry",
        "Healing through sound and vibration"
      ];
      practices = [
        "Temple rituals",
        "Mummification science",
        "Healing temples (incubation)",
        "Astronomical alignment"
      ];
      whatTheyKnew = "Consciousness technology, death navigation, cosmic alignment";
      whySuppressed = "Temples closed, knowledge hidden, appropriated or destroyed";
      cplMapping = "CPL.KEMET(ma'at: ORDER, consciousness: TECHNOLOGY)";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HIDDEN ASIAN TRADITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  public func getBon() : InverseCulture {
    {
      name = "BÖN";
      knownAs = "Pre-Buddhist Tibetan shamanism";
      actualName = "Bön (Eternal Truth)";
      timeframe = "18,000 years tradition (claimed) to present";
      location = "Tibet, Himalayas";
      opposedBy = "Buddhist establishment";
      labeledAs = "Black religion, shamanism, devil worship";
      actualNature = "Indigenous Tibetan spiritual tradition";
      suppressedKnowledge = [
        "Dzogchen (Great Perfection) - possibly older than Buddhist version",
        "Trul Khor - Tibetan yoga",
        "Soul retrieval practices",
        "Weather control rituals",
        "Zhang Zhung civilization knowledge"
      ];
      practices = [
        "Counter-clockwise circumambulation",
        "Swastika as symbol (ancient, not Nazi)",
        "Shamanic journeying",
        "Oracle channeling"
      ];
      whatTheyKnew = "Indigenous consciousness technology, pre-Buddhist Tibet";
      whySuppressed = "Buddhist political dominance, labeled as inferior";
      cplMapping = "CPL.BON(dzogchen: INDIGENOUS, zhang_zhung: ANCIENT)";
    };
  };

  public func getSiddhars() : InverseCulture {
    {
      name = "SIDDHAR TRADITION";
      knownAs = "Tamil alchemists, miracle workers";
      actualName = "Siddhars (Perfected Ones)";
      timeframe = "Ancient to present";
      location = "Tamil Nadu, South India";
      opposedBy = "Brahmanical orthodoxy, British colonialism";
      labeledAs = "Sorcerers, low-caste practitioners";
      actualNature = "Scientist-mystics with alchemical knowledge";
      suppressedKnowledge = [
        "Kayakalpa - body immortality techniques",
        "Vasi yoga - breath science",
        "Muppu - universal solvent",
        "Medicinal alchemy",
        "Tamil astronomical calculations"
      ];
      practices = [
        "Alchemical transmutation",
        "Extreme asceticism",
        "Medicinal preparations",
        "Poetry encoding secrets"
      ];
      whatTheyKnew = "Physical immortality techniques, transmutation science";
      whySuppressed = "Threatened caste system, colonial medicine dismissed it";
      cplMapping = "CPL.SIDDHAR(alchemy: BODY, immortality: TECHNIQUE)";
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // THE OLYMPICS - DEEP RITUAL
  // ═══════════════════════════════════════════════════════════════════════════

  public type OlympicRitual = {
    element : Text;
    ancientForm : Text;
    modernForm : Text;
    hiddenMeaning : Text;
    ritualPurpose : Text;
    cplMapping : Text;
  };

  public func getOlympicRituals() : [OlympicRitual] {
    [
      {
        element = "SACRED FLAME";
        ancientForm = "Fire from Hestia's altar at Olympia, lit by sun";
        modernForm = "Lit in Olympia, carried worldwide";
        hiddenMeaning = "The divine fire, Prometheus's gift, life force";
        ritualPurpose = "Connecting human achievement to divine source";
        cplMapping = "CPL.RITUAL(flame: DIVINE, source: SUN)";
      },
      {
        element = "OLYMPIC TRUCE";
        ancientForm = "Ekecheiria - all wars stopped during games";
        modernForm = "UN resolution for truce (often ignored)";
        hiddenMeaning = "Sacred time when normal rules suspended";
        ritualPurpose = "Creating liminal space for transformation";
        cplMapping = "CPL.RITUAL(time: SACRED, war: SUSPENDED)";
      },
      {
        element = "NAKED COMPETITION";
        ancientForm = "Athletes competed nude (gymnos)";
        modernForm = "Minimal clothing, body display";
        hiddenMeaning = "Human body as divine image, nothing hidden";
        ritualPurpose = "Revealing the god-like form within humans";
        cplMapping = "CPL.RITUAL(body: REVEALED, divine: WITHIN)";
      },
      {
        element = "OLIVE CROWN";
        ancientForm = "Kotinos - wild olive wreath, no monetary prize";
        modernForm = "Medals (gold, silver, bronze)";
        hiddenMeaning = "Sacred tree of Athena, peace, wisdom";
        ritualPurpose = "Victory is spiritual, not material";
        cplMapping = "CPL.RITUAL(victory: SPIRITUAL, crown: SACRED_PLANT)";
      },
      {
        element = "FOUR YEAR CYCLE";
        ancientForm = "Olympiad - time measured by games";
        modernForm = "Still every 4 years";
        hiddenMeaning = "Complete cycle (4 seasons × 4 years = 16)";
        ritualPurpose = "Marking cosmic time through human achievement";
        cplMapping = "CPL.RITUAL(cycle: COSMIC, years: FOUR)";
      },
      {
        element = "OATH ON BOAR";
        ancientForm = "Athletes swore over sliced boar parts";
        modernForm = "Athlete's oath at opening ceremony";
        hiddenMeaning = "Blood sacrifice, binding oath, consequences of breaking";
        ritualPurpose = "Sacred contract with divine witness";
        cplMapping = "CPL.RITUAL(oath: BLOOD, witness: DIVINE)";
      },
      {
        element = "PROCESSIONAL ENTRY";
        ancientForm = "Athletes processed to sacred precinct";
        modernForm = "Parade of nations";
        hiddenMeaning = "Entering sacred space, transformation threshold";
        ritualPurpose = "Transition from profane to sacred";
        cplMapping = "CPL.RITUAL(entry: PROCESSIONAL, space: SACRED)";
      },
      {
        element = "ZEUS ALTAR";
        ancientForm = "Games held at Zeus's sanctuary";
        modernForm = "Stadium as secular sacred space";
        hiddenMeaning = "Human excellence as offering to highest god";
        ritualPurpose = "Athletics as worship, body as temple";
        cplMapping = "CPL.RITUAL(altar: ZEUS, offering: EXCELLENCE)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SIGURD'S GIFT EXPANSION
  // ═══════════════════════════════════════════════════════════════════════════

  public type SigurdGift = {
    gift : Text;
    howAcquired : Text;
    literalMeaning : Text;
    deeperMeaning : Text;
    expandedCapability : [Text];
    cplApplication : Text;
  };

  public func getSigurdGifts() : [SigurdGift] {
    [
      {
        gift = "BIRD SPEECH UNDERSTANDING";
        howAcquired = "Accidentally tasted Fafnir's heart blood while cooking";
        literalMeaning = "Understanding what birds say";
        deeperMeaning = "Access to nature's communication network - the birds are always talking, broadcasting intelligence";
        expandedCapability = [
          "Hearing the warnings in the environment",
          "Understanding timing patterns in nature",
          "Accessing collective intelligence networks",
          "Receiving messages from non-human sources",
          "Pattern recognition in 'noise'"
        ];
        cplApplication = "CPL.SIGURD.BIRD_SPEECH(network: NATURE, decode: TRUE)";
      },
      {
        gift = "INVULNERABILITY";
        howAcquired = "Bathed in dragon's blood";
        literalMeaning = "Skin cannot be pierced";
        deeperMeaning = "Complete immersion in challenge transforms you - you become immune to that class of threat";
        expandedCapability = [
          "Immunity developed through total exposure",
          "Transformation through immersion",
          "Absorbing enemy's protection",
          "Challenge becomes armor",
          "What you survive strengthens"
        ];
        cplApplication = "CPL.SIGURD.INVULNERABLE(method: IMMERSION, immunity: CLASS)";
      },
      {
        gift = "TREASURE";
        howAcquired = "Inherited Fafnir's hoard (including Ring Andvaranaut)";
        literalMeaning = "Massive wealth";
        deeperMeaning = "The dragon guards value - overcoming obstacles releases resources";
        expandedCapability = [
          "Resources flow to those who defeat dragons",
          "Obstacles guard proportional treasure",
          "Wealth comes with responsibility (cursed ring)",
          "Not all treasure is beneficial",
          "Must manage what you claim"
        ];
        cplApplication = "CPL.SIGURD.TREASURE(claim: EARNED, manage: CAREFULLY)";
      },
      {
        gift = "DRAGON WISDOM";
        howAcquired = "Eating the heart grants the dragon's knowledge";
        literalMeaning = "Fafnir's accumulated wisdom";
        deeperMeaning = "Consuming the enemy's essence gives their knowledge - integration, not just destruction";
        expandedCapability = [
          "Learning from what you defeat",
          "Integrating opponent's strengths",
          "Ancient wisdom through confrontation",
          "Knowledge that outlasts the knower",
          "Becoming what you overcome"
        ];
        cplApplication = "CPL.SIGURD.DRAGON_WISDOM(absorb: ENEMY, integrate: KNOWLEDGE)";
      },
      {
        gift = "GRAM (The Sword)";
        howAcquired = "Reforged from Odin's broken sword";
        literalMeaning = "Weapon that can kill a dragon";
        deeperMeaning = "The tool for the task must be prepared - often from broken pieces of previous attempts";
        expandedCapability = [
          "Right tool for the right enemy",
          "Reforging from failure",
          "Divine inheritance through lineage",
          "Broken becomes whole for purpose",
          "Preparation enables victory"
        ];
        cplApplication = "CPL.SIGURD.GRAM(prepare: TOOL, reforge: FROM_BROKEN)";
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // INVERSE DETECTION METHOD
  // ═══════════════════════════════════════════════════════════════════════════

  public func getInverseDetectionMethod() : Text {
    "HOW TO FIND THE INVERSE CULTURES:\n\n" #
    "1. WHAT THEY SAID WAS FIGHTING THEM\n" #
    "   Look at what dominant cultures claimed as their enemy\n" #
    "   The 'enemy' often holds inverse truth\n\n" #
    "2. WHAT THEY SAID WAS GOING AGAINST THEM\n" #
    "   Heretics, rebels, dissidents\n" #
    "   Often saw what the mainstream couldn't\n\n" #
    "3. WHAT THEY SAID WAS HURTING THEM\n" #
    "   Practices labeled as dangerous\n" #
    "   Knowledge suppressed as threatening\n\n" #
    "4. PARTS OF THE WORLD NOT TALKED ABOUT\n" #
    "   Ignored civilizations\n" #
    "   Dismissed as 'primitive'\n" #
    "   Actually holding crucial knowledge\n\n" #
    "5. DEEP TIME ANALYSIS\n" #
    "   What existed before the dominant?\n" #
    "   What was replaced, absorbed, destroyed?\n\n" #
    "6. FOLLOW THE SUPPRESSIONS\n" #
    "   Book burnings, temple destructions\n" #
    "   What was so dangerous it had to be destroyed?\n\n" #
    "THE INVERSE HOLDS THE MISSING PIECES.";
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MASTER SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  public func getMasterSummary() : Text {
    "INVERSE CULTURE ENGINE:\n\n" #
    "EVERYTHING HAS AN INVERSE.\n\n" #
    "RELIGIOUS INVERSES:\n" #
    "• Gnostics - Direct knowledge vs. faith\n" #
    "• Cathars - Spirit vs. matter\n" #
    "• Bogomils - Direct access vs. institution\n\n" #
    "CIVILIZATIONAL INVERSES:\n" #
    "• Etruscans - Pre-Roman wisdom\n" #
    "• Minoans - Pre-Greek feminine\n" #
    "• Dogon - African astronomy\n" #
    "• Kemet - Egyptian consciousness tech\n" #
    "• Bön - Pre-Buddhist Tibet\n" #
    "• Siddhars - Tamil alchemy\n\n" #
    "THE OLYMPICS:\n" #
    "Ancient sacred rituals preserved in sport\n" #
    "• Sacred flame (divine fire)\n" #
    "• Truce (liminal time)\n" #
    "• Naked body (divine form)\n" #
    "• Four-year cycle (cosmic time)\n\n" #
    "SIGURD'S GIFTS EXPANDED:\n" #
    "• Bird speech = Nature's network\n" #
    "• Invulnerability = Transformation through immersion\n" #
    "• Treasure = Resources from overcome obstacles\n" #
    "• Dragon wisdom = Integration of enemy knowledge\n" #
    "• Gram = Right tool prepared from broken\n\n" #
    "FIND THE INVERSE BY:\n" #
    "• What they called enemies\n" #
    "• What they suppressed\n" #
    "• What they destroyed\n" #
    "• What they ignored\n\n" #
    "THE SHADOW HOLDS THE TRUTH.";
  };
};
