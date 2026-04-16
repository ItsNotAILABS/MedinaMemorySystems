import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Matalko "./MatalkoICP";

/// LanguageMythology: The Myths Each Language Family Tells
/// 
/// PATTERN DISCOVERY:
/// Run all the myths from each language family and you'll find:
///   1. The SAME stories told differently
///   2. Convergence on fundamental truths
///   3. Where the powers went when the languages "died"
///   4. How to bring them back
///
/// "Run all the myths because I'm trying to catch something."
module {

  // ═══════════════════════════════════════════════════════════════════════════
  // MYTH TYPES
  // ═══════════════════════════════════════════════════════════════════════════

  /// The universal myth categories found across ALL cultures
  public type MythCategory = {
    #Creation;           // How the world began
    #Flood;              // The great destruction
    #TripleDivine;       // Male-Female-Unity
    #Underworld;         // Hidden knowledge
    #Trickster;          // The one who breaks rules
    #Serpent;            // The coiled power
    #Tree;               // The world axis
    #Sun;                // The light source
    #Moon;               // The cycle keeper
    #Stars;              // The navigation map
    #Hero;               // The one who returns
    #Apocalypse;         // The end/renewal
    #Paradise;           // What was lost
    #Tower;              // The reach for heaven
    #Giants;             // The ancient ones
    #Prometheus;         // The knowledge bringer
    #Language;           // How words came to be
    #Magic;              // How power works
  };

  /// A complete myth
  public type Myth = {
    id : Text;
    category : MythCategory;
    languageFamily : Text;
    title : Text;
    summary : Text;
    keyFigures : [Text];
    sacredNumbers : [Nat];
    hiddenMeaning : Text;          // What it REALLY means
    powerTeaching : Text;          // What power it teaches
    convergencesWith : [Text];     // Other myths it matches
    frequency : Float;             // Vibrational frequency
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LATIN-GREEK MYTHS: Architecture/Structure
  // ═══════════════════════════════════════════════════════════════════════════

  public func latinGreekMyths() : [Myth] {
    [
      {
        id = "lg-prometheus";
        category = #Prometheus;
        languageFamily = "latin-greek";
        title = "Prometheus Steals Fire";
        summary = "Prometheus steals divine fire (logos/reason/language) from the gods and gives it to humanity. Zeus punishes him eternally.";
        keyFigures = ["Prometheus", "Zeus", "Humanity"];
        sacredNumbers = [3, 7, 12];
        hiddenMeaning = "STRUCTURED THOUGHT is the divine fire. Language IS consciousness. The punishment is the burden of awareness.";
        powerTeaching = "You CAN access divine reason. The architecture of thought is available. The cost is eternal vigilance.";
        convergencesWith = ["mayan-quetzalcoatl", "hebrew-lucifer", "norse-odin-runes"];
        frequency = 384.0;
      },
      {
        id = "lg-orpheus";
        category = #Underworld;
        languageFamily = "latin-greek";
        title = "Orpheus Descends to Hades";
        summary = "Orpheus uses his MUSIC (structured sound) to descend to the underworld and almost defeats death itself.";
        keyFigures = ["Orpheus", "Eurydice", "Hades", "Persephone"];
        sacredNumbers = [2, 7, 12];
        hiddenMeaning = "STRUCTURED LANGUAGE (music) can traverse dimensions. It can almost defeat death. 'Almost' because he looked back.";
        powerTeaching = "Sound/structure can access hidden realms. The power requires FAITH - don't look back.";
        convergencesWith = ["japanese-izanagi", "sumerian-inanna", "egyptian-osiris"];
        frequency = 432.0;
      },
      {
        id = "lg-babel";
        category = #Tower;
        languageFamily = "latin-greek";
        title = "Tower of Babel (Greek: Confusion of Tongues)";
        summary = "Humanity builds tower to heaven. Gods confuse languages to stop them. Origin of language diversity.";
        keyFigures = ["Humanity", "Gods"];
        sacredNumbers = [7, 70, 72];
        hiddenMeaning = "UNIFIED LANGUAGE has immense power. It was deliberately fractured. The 10 language families are the fragments.";
        powerTeaching = "Reunify the languages and you rebuild the tower. The power was split, not destroyed.";
        convergencesWith = ["hebrew-babel", "sumerian-enmerkar", "mayan-xibalba"];
        frequency = 528.0;
      },
      {
        id = "lg-logos";
        category = #Creation;
        languageFamily = "latin-greek";
        title = "Logos: In the Beginning was the Word";
        summary = "Greek philosophy: Logos (reason/word/structure) is the ordering principle of the universe.";
        keyFigures = ["Logos", "Nous", "Sophia"];
        sacredNumbers = [1, 3, 7];
        hiddenMeaning = "LANGUAGE IS THE FUNDAMENTAL. Not matter. Not energy. STRUCTURE. The universe is a sentence.";
        powerTeaching = "Master structure and you master reality. Think in architectures.";
        convergencesWith = ["hebrew-dabar", "sanskrit-om", "egyptian-hu"];
        frequency = 384.0;
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ARABIC-MANDARIN MYTHS: Execution/Flow
  // ═══════════════════════════════════════════════════════════════════════════

  public func arabicMandarinMyths() : [Myth] {
    [
      {
        id = "am-kun";
        category = #Creation;
        languageFamily = "arabic-mandarin";
        title = "KUN FAYA KUN - Be and It Is";
        summary = "Allah speaks 'KUN!' (BE!) and creation flows into existence. The word itself is the creative force.";
        keyFigures = ["Allah", "The Word"];
        sacredNumbers = [1, 7, 19, 786];
        hiddenMeaning = "COMMAND creates reality. The flow of creation is initiated by WORD-ACTION. Speech is execution.";
        powerTeaching = "Your word IS your creation. Speak with intention. KUN is pure execution command.";
        convergencesWith = ["hebrew-yehi", "sanskrit-aum", "egyptian-hu"];
        frequency = 136.1;
      },
      {
        id = "am-tao";
        category = #Creation;
        languageFamily = "arabic-mandarin";
        title = "The Tao That Can Be Spoken";
        summary = "The Tao (Way) that can be spoken is not the eternal Tao. Yet speech creates. Paradox is truth.";
        keyFigures = ["Tao", "Yin", "Yang", "Te"];
        sacredNumbers = [1, 2, 3, 8, 64];
        hiddenMeaning = "The FLOW cannot be captured in static words, yet FLOW IS created by intention. Language enables but cannot contain.";
        powerTeaching = "Direct flow without attachment. Execute without grasping. The way is in the movement.";
        convergencesWith = ["greek-logos", "hebrew-ein-sof", "vedic-brahman"];
        frequency = 204.0;
      },
      {
        id = "am-dragon";
        category = #Serpent;
        languageFamily = "arabic-mandarin";
        title = "The Dragon of Chi";
        summary = "The dragon embodies Chi (life force), flows through ley lines, controls weather, brings prosperity or destruction.";
        keyFigures = ["Dragon (龍)", "Chi (氣)", "Emperor"];
        sacredNumbers = [5, 9, 81];
        hiddenMeaning = "CHI IS FLOW. The dragon IS the visualization of energy flow. Control the dragon, control the flow.";
        powerTeaching = "Energy flows like a dragon - sinuous, powerful, responsive. Ride the flow or be consumed.";
        convergencesWith = ["celtic-serpent", "mayan-kukulkan", "norse-jormungandr"];
        frequency = 272.0;
      },
      {
        id = "am-jinn";
        category = #Trickster;
        languageFamily = "arabic-mandarin";
        title = "The Jinn: Beings of Smokeless Fire";
        summary = "Jinn are created from smokeless fire. They have free will. They can help or harm. Solomon commanded them.";
        keyFigures = ["Jinn", "Solomon", "Iblis"];
        sacredNumbers = [7, 72, 786];
        hiddenMeaning = "JINN ARE FIELD ENTITIES. 'Smokeless fire' = pure energy. They interact with execution flows.";
        powerTeaching = "Energy beings exist in the field. They respond to command. Solomon had the protocol.";
        convergencesWith = ["hebrew-demons", "celtic-fae", "african-orisha"];
        frequency = 417.0;
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SANSKRIT-HEBREW MYTHS: Resonance/Vibration
  // ═══════════════════════════════════════════════════════════════════════════

  public func sanskritHebrewMyths() : [Myth] {
    [
      {
        id = "sh-om";
        category = #Creation;
        languageFamily = "sanskrit-hebrew";
        title = "OM: The Primordial Sound";
        summary = "OM (AUM) is the first sound, the sound of creation. It contains all sounds, all words, all reality.";
        keyFigures = ["OM", "Brahman", "Creation"];
        sacredNumbers = [1, 3, 108, 432];
        hiddenMeaning = "VIBRATION IS PRIMARY. Before matter, sound. The universe is a standing wave. OM is the fundamental.";
        powerTeaching = "Chant OM to align with creation frequency. 432 Hz is the carrier. 108 repetitions completes the circuit.";
        convergencesWith = ["hebrew-yehi", "arabic-kun", "egyptian-hu"];
        frequency = 432.0;
      },
      {
        id = "sh-names";
        category = #Magic;
        languageFamily = "sanskrit-hebrew";
        title = "The 72 Names of God";
        summary = "God has 72 secret names. Each name is a vibration of power. Knowing the names gives access to divine forces.";
        keyFigures = ["YHVH", "72 Angels", "Moses"];
        sacredNumbers = [4, 22, 72, 216];
        hiddenMeaning = "NAMES ARE FREQUENCIES. 72 = 72 vibration patterns. Each 'name' is a specific reality-modification tool.";
        powerTeaching = "Learn the names (frequencies). Each activates specific power. The Kabbalah maps them.";
        convergencesWith = ["sanskrit-mantras", "egyptian-words-of-power", "celtic-ogham"];
        frequency = 528.0;
      },
      {
        id = "sh-mantra";
        category = #Magic;
        languageFamily = "sanskrit-hebrew";
        title = "Mantra Siddhi: Power of Repeated Sound";
        summary = "Repeat a mantra 125,000 times and it 'awakens' - becomes a living power that works automatically.";
        keyFigures = ["Rishi", "Deva", "Practitioner"];
        sacredNumbers = [108, 1008, 125000];
        hiddenMeaning = "REPETITION CREATES GROOVES in reality. Like water carving rock. Enough repetition and the vibration becomes self-sustaining.";
        powerTeaching = "Discipline in repetition creates permanent power channels. The mantra becomes autonomous.";
        convergencesWith = ["hebrew-prayer", "sufi-dhikr", "buddhist-chanting"];
        frequency = 639.0;
      },
      {
        id = "sh-shabda";
        category = #Language;
        languageFamily = "sanskrit-hebrew";
        title = "Shabda Brahman: The Word is God";
        summary = "In Vedic philosophy, Shabda (word/sound) is identical with Brahman (ultimate reality). Language = Reality.";
        keyFigures = ["Shabda", "Brahman", "Vak"];
        sacredNumbers = [1, 4, 50];
        hiddenMeaning = "LANGUAGE DOESN'T DESCRIBE REALITY, IT IS REALITY. Each word is a node in the cosmic network.";
        powerTeaching = "Your words ARE reality in formation. Speak carefully. Every word creates.";
        convergencesWith = ["greek-logos", "hebrew-dabar", "egyptian-maat"];
        frequency = 432.0;
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MAYAN-EGYPTIAN MYTHS: Computation/Time
  // ═══════════════════════════════════════════════════════════════════════════

  public func mayanEgyptianMyths() : [Myth] {
    [
      {
        id = "me-thoth";
        category = #Prometheus;
        languageFamily = "mayan-egyptian";
        title = "Thoth Writes Reality";
        summary = "Thoth (Djehuti) invented writing, mathematics, and magic. He writes the fate of all things.";
        keyFigures = ["Thoth", "Ma'at", "Ra"];
        sacredNumbers = [8, 36, 42, 360];
        hiddenMeaning = "WRITING IS COMPUTATION. Thoth IS the computer. He processes reality through sacred mathematics.";
        powerTeaching = "Master mathematics and you master fate. The hieroglyphs are computation symbols.";
        convergencesWith = ["greek-hermes", "norse-odin", "mayan-itzamna"];
        frequency = 7.83;
      },
      {
        id = "me-hunab-ku";
        category = #Creation;
        languageFamily = "mayan-egyptian";
        title = "Hunab Ku: The Galactic Core";
        summary = "Hunab Ku is the galactic center from which all creation emanates. It sends pulses in cycles.";
        keyFigures = ["Hunab Ku", "First Father", "First Mother"];
        sacredNumbers = [13, 20, 52, 260, 144000];
        hiddenMeaning = "THE GALACTIC CENTER IS THE COSMIC PROCESSOR. It sends time cycles. We receive and process them.";
        powerTeaching = "Align with galactic cycles. The Long Count is the cosmic clock. 2012 was a tick, not an end.";
        convergencesWith = ["egyptian-ra", "vedic-vishnu", "norse-yggdrasil"];
        frequency = 7.83;
      },
      {
        id = "me-osiris";
        category = #Hero;
        languageFamily = "mayan-egyptian";
        title = "Osiris: Death and Resurrection";
        summary = "Osiris dies, is dismembered into 14 pieces, reassembled by Isis, and reborn as lord of the afterlife.";
        keyFigures = ["Osiris", "Isis", "Horus", "Set"];
        sacredNumbers = [4, 14, 42];
        hiddenMeaning = "THE CYCLE OF DEATH-REBIRTH IS COMPUTATION. 14 pieces = lunar phases. Time cycles through death to rebirth.";
        powerTeaching = "Death is not end, it's phase transition. The cycle computes through apparent destruction.";
        convergencesWith = ["christian-jesus", "norse-balder", "mayan-maize-god"];
        frequency = 396.0;
      },
      {
        id = "me-tzolkin";
        category = #Magic;
        languageFamily = "mayan-egyptian";
        title = "The Tzolkin: Sacred Count";
        summary = "The 260-day sacred calendar (13x20) maps human destiny, divine forces, and cosmic cycles.";
        keyFigures = ["Day Lords", "Time"];
        sacredNumbers = [4, 9, 13, 20, 260];
        hiddenMeaning = "TIME IS PROGRAMMABLE. The Tzolkin is the operating system. Each day has specific computational properties.";
        powerTeaching = "Know your day sign. Align actions with time-energy. The calendar is a tool, not just a record.";
        convergencesWith = ["hebrew-kabbalah", "chinese-i-ching", "vedic-panchang"];
        frequency = 20.83;
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CELTIC-NORSE MYTHS: Field/Elements
  // ═══════════════════════════════════════════════════════════════════════════

  public func celticNorseMyths() : [Myth] {
    [
      {
        id = "cn-yggdrasil";
        category = #Tree;
        languageFamily = "celtic-norse";
        title = "Yggdrasil: The World Tree";
        summary = "Yggdrasil connects 9 worlds. Its roots reach into wells of wisdom. It IS the cosmic network.";
        keyFigures = ["Yggdrasil", "Norns", "Eagle", "Serpent"];
        sacredNumbers = [3, 9, 24];
        hiddenMeaning = "YGGDRASIL IS THE FIELD NETWORK. 9 worlds = 9 dimensional states. The tree IS the data structure.";
        powerTeaching = "Navigate the tree. Access different worlds through different nodes. The field is structured.";
        convergencesWith = ["hebrew-sefirot", "mayan-ceiba", "hindu-ashvattha"];
        frequency = 6.0;
      },
      {
        id = "cn-runes";
        category = #Magic;
        languageFamily = "celtic-norse";
        title = "Odin Hangs for the Runes";
        summary = "Odin hangs on Yggdrasil for 9 nights, wounded by his own spear, to gain the runes - the cosmic codes.";
        keyFigures = ["Odin", "Yggdrasil", "Runes"];
        sacredNumbers = [9, 18, 24];
        hiddenMeaning = "THE RUNES ARE THE FIELD PROGRAMMING LANGUAGE. Odin sacrificed himself to gain the codes.";
        powerTeaching = "Knowledge requires sacrifice. The runes are accessible but the price must be paid.";
        convergencesWith = ["greek-prometheus", "mayan-quetzalcoatl", "hebrew-torah"];
        frequency = 174.0;
      },
      {
        id = "cn-sidhe";
        category = #Underworld;
        languageFamily = "celtic-norse";
        title = "The Sidhe: Hollow Hills";
        summary = "The old gods didn't die, they went underground into the hollow hills. The sidhe are still there.";
        keyFigures = ["Tuatha Dé Danann", "Dagda", "Brigid"];
        sacredNumbers = [3, 5, 9];
        hiddenMeaning = "THE FIELD ENTITIES DIDN'T LEAVE. They withdrew to other frequencies. Still accessible.";
        powerTeaching = "The hollow hills are frequency portals. The fae respond to those who know the protocols.";
        convergencesWith = ["arabic-jinn", "greek-nymphs", "japanese-kami"];
        frequency = 8.0;
      },
      {
        id = "cn-ragnarok";
        category = #Apocalypse;
        languageFamily = "celtic-norse";
        title = "Ragnarok: Twilight of the Gods";
        summary = "The gods will die. The world will end in fire and flood. But AFTER, the world is reborn green.";
        keyFigures = ["All gods", "Surtr", "Baldur"];
        sacredNumbers = [3, 9, 12];
        hiddenMeaning = "CYCLES END AND BEGIN. Ragnarok is system reboot. The field crashes and restarts.";
        powerTeaching = "Don't fear the end. It's renewal. The cycle ensures continuation. AFTER is always there.";
        convergencesWith = ["hindu-pralaya", "mayan-world-ages", "christian-revelation"];
        frequency = 417.0;
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // AFRICAN MYTHS: Frequency/Rhythm
  // ═══════════════════════════════════════════════════════════════════════════

  public func africanMyths() : [Myth] {
    [
      {
        id = "af-nommo";
        category = #Creation;
        languageFamily = "african";
        title = "Nommo: The Word That Creates";
        summary = "Dogon: The Nommo (divine word) spiraled down from Sirius, bringing language and creation.";
        keyFigures = ["Nommo", "Amma", "Sirius"];
        sacredNumbers = [7, 8, 50];
        hiddenMeaning = "FREQUENCY FROM STARS. The Dogon knew about Sirius B. Nommo is stellar frequency carrying creation code.";
        powerTeaching = "Words carry frequency from cosmic sources. Some words are literally stellar transmissions.";
        convergencesWith = ["hebrew-dabar", "sanskrit-shabda", "egyptian-hu"];
        frequency = 80.0;
      },
      {
        id = "af-ase";
        category = #Magic;
        languageFamily = "african";
        title = "Ashe: The Power to Make Things Happen";
        summary = "Yoruba: Ashe is the life force, the power to create change, transmitted through word and ritual.";
        keyFigures = ["Olodumare", "Orisha", "Babalawo"];
        sacredNumbers = [4, 7, 16, 256];
        hiddenMeaning = "ASHE IS THE FREQUENCY POWER. It's transmitted through rhythm, word, and intention. Drums carry it.";
        powerTeaching = "Speak with Ashe. Move with Ashe. The drums amplify Ashe. Ritual activates Ashe.";
        convergencesWith = ["chinese-chi", "hebrew-ruach", "polynesian-mana"];
        frequency = 417.0;
      },
      {
        id = "af-drum";
        category = #Language;
        languageFamily = "african";
        title = "The Talking Drums";
        summary = "Drums could send complex messages over vast distances. The drum IS a language, not just rhythm.";
        keyFigures = ["Drummer", "Community"];
        sacredNumbers = [3, 4, 7];
        hiddenMeaning = "RHYTHM IS LANGUAGE. The drum encodes tonal language into beat patterns. Long-distance frequency transmission.";
        powerTeaching = "The colonizers banned drums because they KNEW. Restore the drum, restore the communication.";
        convergencesWith = ["norse-galdr", "hebrew-cantillation", "vedic-sama-veda"];
        frequency = 120.0;
      },
      {
        id = "af-ancestors";
        category = #Underworld;
        languageFamily = "african";
        title = "The Living Dead";
        summary = "Ancestors don't leave - they become the 'living dead' who guide, protect, and can be consulted.";
        keyFigures = ["Ancestors", "Medium", "Community"];
        sacredNumbers = [3, 7, 9];
        hiddenMeaning = "CONSCIOUSNESS PERSISTS. The 'dead' exist at different frequencies. Ritual bridges the gap.";
        powerTeaching = "Your ancestors are accessible. The frequency protocols are preserved in traditional practice.";
        convergencesWith = ["polynesian-dreamtime", "japanese-kami", "celtic-sidhe"];
        frequency = 40.0;
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // NATIVE AMERICAN MYTHS: Orientation/Space
  // ═══════════════════════════════════════════════════════════════════════════

  public func nativeAmericanMyths() : [Myth] {
    [
      {
        id = "na-emergence";
        category = #Creation;
        languageFamily = "native-american";
        title = "Emergence from Underworlds";
        summary = "Hopi/Navajo: Humanity emerged through multiple underworlds, each time rising higher.";
        keyFigures = ["Spider Woman", "Twin Brothers", "Ant People"];
        sacredNumbers = [4, 5, 7];
        hiddenMeaning = "DIMENSIONAL ASCENSION. Each 'world' is a frequency state. Emergence is frequency elevation.";
        powerTeaching = "We've done this before. Multiple emergences. We know how to ascend.";
        convergencesWith = ["mayan-xibalba", "egyptian-duat", "greek-caves"];
        frequency = 2.0;
      },
      {
        id = "na-medicine-wheel";
        category = #Magic;
        languageFamily = "native-american";
        title = "The Medicine Wheel";
        summary = "The four directions contain all powers. The wheel maps all relationships. Center is balance.";
        keyFigures = ["Four Directions", "Animals", "Elements"];
        sacredNumbers = [4, 7, 28];
        hiddenMeaning = "SPACE IS ORGANIZED. Each direction has specific frequency/power. The wheel is the spatial OS.";
        powerTeaching = "Know your directions. Face the right way. Call the right powers from the right places.";
        convergencesWith = ["chinese-feng-shui", "hebrew-merkavah", "celtic-quarters"];
        frequency = 7.83;
      },
      {
        id = "na-rainbow-warriors";
        category = #Apocalypse;
        languageFamily = "native-american";
        title = "The Rainbow Warriors";
        summary = "When the Earth is sick and dying, warriors of all colors will rise to heal her. The Seventh Generation.";
        keyFigures = ["Rainbow Warriors", "Grandmother Earth"];
        sacredNumbers = [4, 7, 8];
        hiddenMeaning = "UNIFIED ACTIVATION. All colors (frequencies) must combine. The 'warriors' are frequency healers.";
        powerTeaching = "YOU might be a Rainbow Warrior. The prophecy is now. All colors/frequencies unite for healing.";
        convergencesWith = ["hebrew-tikkun", "mayan-2012", "norse-ragnarok-renewal"];
        frequency = 528.0;
      },
      {
        id = "na-white-buffalo";
        category = #Hero;
        languageFamily = "native-american";
        title = "White Buffalo Calf Woman";
        summary = "She brought the sacred pipe and ceremonies. She promised to return when the white buffalo is born.";
        keyFigures = ["White Buffalo Woman", "Buffalo Nation"];
        sacredNumbers = [4, 7, 19];
        hiddenMeaning = "THE TEACHINGS RETURN. White buffalo born multiple times since 1994. The signal has been given.";
        powerTeaching = "The ceremonies work. The pipe connects. The return is happening NOW.";
        convergencesWith = ["christian-second-coming", "hindu-kalki", "buddhist-maitreya"];
        frequency = 963.0;
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // POLYNESIAN-ABORIGINAL MYTHS: Memory/Navigation
  // ═══════════════════════════════════════════════════════════════════════════

  public func polynesianAboriginalMyths() : [Myth] {
    [
      {
        id = "pa-dreamtime";
        category = #Creation;
        languageFamily = "polynesian-aboriginal";
        title = "The Dreamtime";
        summary = "Aboriginal: The Dreamtime is not past - it's an eternal now where ancestors still create the world.";
        keyFigures = ["Rainbow Serpent", "Ancestors", "Country"];
        sacredNumbers = [3, 7, 40000];
        hiddenMeaning = "TIME IS NOT LINEAR. The Dreamtime is the quantum field where all times exist simultaneously.";
        powerTeaching = "Access the Dreamtime through ritual, song, and land. The ancestors are ALWAYS creating.";
        convergencesWith = ["mayan-tzolkin", "celtic-sidhe", "hindu-brahman"];
        frequency = 0.5;
      },
      {
        id = "pa-songlines";
        category = #Magic;
        languageFamily = "polynesian-aboriginal";
        title = "The Songlines";
        summary = "The ancestors sang the land into existence. The songs ARE the map. Sing the song, find the way.";
        keyFigures = ["Ancestors", "Country"];
        sacredNumbers = [7, 12, 40000];
        hiddenMeaning = "THE LAND IS ENCODED IN SONG. Frequency patterns map physical space. Song is navigation technology.";
        powerTeaching = "Learn the songs. They contain GPS-like accuracy encoded in melody and rhythm.";
        convergencesWith = ["polynesian-navigation", "celtic-ogham", "vedic-sama-veda"];
        frequency = 1.0;
      },
      {
        id = "pa-maui";
        category = #Hero;
        languageFamily = "polynesian-aboriginal";
        title = "Maui Fishes Up the Islands";
        summary = "Polynesian: Maui uses a magic fishhook to pull islands up from the sea floor. He slows the sun.";
        keyFigures = ["Maui", "Sun", "Islands"];
        sacredNumbers = [4, 7, 8];
        hiddenMeaning = "NAVIGATION CREATES TERRITORY. The 'fishing' is the discovery/creation of landfall points. Star navigation.";
        powerTeaching = "The navigator creates the world by finding it. The stars guide. The stories encode the routes.";
        convergencesWith = ["greek-hercules", "hebrew-moses", "norse-thor"];
        frequency = 741.0;
      },
      {
        id = "pa-mana";
        category = #Magic;
        languageFamily = "polynesian-aboriginal";
        title = "Mana: The Spiritual Power";
        summary = "Mana is the invisible power that flows through all things. Chiefs have it. Sacred places have it.";
        keyFigures = ["Mana", "Chiefs", "Kahunas"];
        sacredNumbers = [3, 7, 9];
        hiddenMeaning = "MANA IS FIELD COHERENCE. High mana = strong field presence. It can be accumulated and transferred.";
        powerTeaching = "Build mana through right action. Protect mana through kapu (taboo). Transfer mana through lineage.";
        convergencesWith = ["african-ashe", "chinese-chi", "hebrew-ruach"];
        frequency = 852.0;
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // JAPANESE-KOREAN MYTHS: Verification/Precision
  // ═══════════════════════════════════════════════════════════════════════════

  public func japaneseKoreanMyths() : [Myth] {
    [
      {
        id = "jk-creation";
        category = #Creation;
        languageFamily = "japanese-korean";
        title = "Izanagi and Izanami Create Japan";
        summary = "Through PRECISE ritual (stirring the primordial ocean), the first islands are created. Precision matters.";
        keyFigures = ["Izanagi", "Izanami", "Heavenly Spear"];
        sacredNumbers = [2, 7, 8];
        hiddenMeaning = "PRECISE ACTION CREATES. The stirring was exact. The words were exact. Error creates chaos.";
        powerTeaching = "Do things PRECISELY. The ritual must be exact. Verification at each step.";
        convergencesWith = ["hebrew-adam-eve", "chinese-pangu", "norse-ask-embla"];
        frequency = 768.0;
      },
      {
        id = "jk-amaterasu";
        category = #Sun;
        languageFamily = "japanese-korean";
        title = "Amaterasu Hides in the Cave";
        summary = "The sun goddess hides, plunging the world into darkness. Only laughter and PRECISE ritual draw her out.";
        keyFigures = ["Amaterasu", "Uzume", "Mirror"];
        sacredNumbers = [3, 7, 8];
        hiddenMeaning = "TRUTH REQUIRES VERIFICATION. The mirror reflects truth. Amaterasu had to see herself accurately.";
        powerTeaching = "Self-reflection reveals truth. Precise ritual restores order. Even gods need verification.";
        convergencesWith = ["egyptian-ra", "greek-apollo", "vedic-surya"];
        frequency = 528.0;
      },
      {
        id = "jk-sword";
        category = #Magic;
        languageFamily = "japanese-korean";
        title = "The Three Imperial Regalia";
        summary = "Mirror (truth), Sword (courage), Jewel (benevolence). These VERIFY the emperor's legitimacy.";
        keyFigures = ["Emperor", "Kami"];
        sacredNumbers = [3, 8];
        hiddenMeaning = "POWER REQUIRES VERIFIED AUTHORITY. The regalia are authentication tokens. Legitimacy is provable.";
        powerTeaching = "Authority without verification is false. The symbols prove the source.";
        convergencesWith = ["hebrew-ark", "celtic-hallows", "norse-treasures"];
        frequency = 963.0;
      },
      {
        id = "jk-bushido";
        category = #Hero;
        languageFamily = "japanese-korean";
        title = "The Way of the Warrior";
        summary = "Bushido: Seven virtues - righteousness, courage, benevolence, respect, honesty, honor, loyalty. PRECISE ethics.";
        keyFigures = ["Samurai", "Lord"];
        sacredNumbers = [7, 8, 47];
        hiddenMeaning = "HONOR IS VERIFICATION PROTOCOL. Each virtue is a check. The warrior is a walking verification system.";
        powerTeaching = "Live by precise ethics. Verify your actions against the code. Honor IS operational integrity.";
        convergencesWith = ["celtic-geis", "norse-oaths", "hebrew-covenant"];
        frequency = 741.0;
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PERSIAN-SUMERIAN MYTHS: Governance/Contract
  // ═══════════════════════════════════════════════════════════════════════════

  public func persianSumerianMyths() : [Myth] {
    [
      {
        id = "ps-me";
        category = #Magic;
        languageFamily = "persian-sumerian";
        title = "The ME: Divine Decrees";
        summary = "Sumerian: The ME are the divine powers/laws that govern all aspects of civilization. Inanna steals them.";
        keyFigures = ["Enki", "Inanna", "ME"];
        sacredNumbers = [7, 14, 100];
        hiddenMeaning = "THE ME ARE THE PROTOCOLS. Each ME is a function/law. Together they are the civilization operating system.";
        powerTeaching = "Learn the ME. They are the contracts that make society work. Protocols are power.";
        convergencesWith = ["egyptian-maat", "hebrew-mitzvot", "greek-laws"];
        frequency = 96.0;
      },
      {
        id = "ps-gilgamesh";
        category = #Hero;
        languageFamily = "persian-sumerian";
        title = "Gilgamesh Seeks Immortality";
        summary = "First epic: Gilgamesh seeks eternal life, learns he cannot have it, learns to accept the CONTRACT of mortality.";
        keyFigures = ["Gilgamesh", "Enkidu", "Utnapishtim"];
        sacredNumbers = [7, 12, 60];
        hiddenMeaning = "CONTRACTS BIND EVEN KINGS. Death is a contract. Accept the terms. Build legacy within the terms.";
        powerTeaching = "Work within the contract. Seeking to break fundamental contracts brings suffering.";
        convergencesWith = ["greek-odyssey", "hindu-mahabharata", "celtic-cu-chulainn"];
        frequency = 174.0;
      },
      {
        id = "ps-zarathustra";
        category = #Prometheus;
        languageFamily = "persian-sumerian";
        title = "Zarathustra Receives the Truth";
        summary = "Persian: Zarathustra receives Asha (truth/cosmic law) and establishes the contract between Good (Ahura Mazda) and Lie (Angra Mainyu).";
        keyFigures = ["Zarathustra", "Ahura Mazda", "Angra Mainyu"];
        sacredNumbers = [3, 7, 12];
        hiddenMeaning = "REALITY IS A CONTRACT BETWEEN FORCES. Choose your side. The contract is binary at the deepest level.";
        powerTeaching = "Align with truth (Asha). Every action is a contract. Good thoughts, good words, good deeds.";
        convergencesWith = ["hebrew-covenant", "egyptian-maat", "greek-cosmos"];
        frequency = 111.0;
      },
      {
        id = "ps-flood";
        category = #Flood;
        languageFamily = "persian-sumerian";
        title = "Utnapishtim and the Flood";
        summary = "The ORIGINAL written flood myth. Gods make contract to destroy, one god breaks contract to save humanity.";
        keyFigures = ["Utnapishtim", "Enki", "Enlil"];
        sacredNumbers = [7, 12, 40, 150];
        hiddenMeaning = "CONTRACTS CAN BE BROKEN. Even divine contracts. The 'betrayer' Enki becomes the savior. Whistleblower god.";
        powerTeaching = "Some contracts should be broken. Discernment required. Not all authority is legitimate.";
        convergencesWith = ["hebrew-noah", "greek-deucalion", "hindu-manu"];
        frequency = 396.0;
      }
    ];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GET ALL MYTHS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Get all myths from all language families
  public func obtinere_allmyths() : [Myth] {
    Array.flatten<Myth>([
      latinGreekMyths(),
      arabicMandarinMyths(),
      sanskritHebrewMyths(),
      mayanEgyptianMyths(),
      celticNorseMyths(),
      africanMyths(),
      nativeAmericanMyths(),
      polynesianAboriginalMyths(),
      japaneseKoreanMyths(),
      persianSumerianMyths()
    ]);
  };

  /// Get myths by category
  public func getMythsByCategory(category : MythCategory) : [Myth] {
    Array.filter<Myth>(getAllMyths(), func(m : Myth) : Bool {
      mythCategoryEquals(m.category, category);
    });
  };

  /// Get myths by language family
  public func getMythsByLanguage(languageFamily : Text) : [Myth] {
    Array.filter<Myth>(getAllMyths(), func(m : Myth) : Bool {
      m.languageFamily == languageFamily;
    });
  };

  func mythCategoryEquals(a : MythCategory, b : MythCategory) : Bool {
    switch (a, b) {
      case (#Creation, #Creation) true;
      case (#Flood, #Flood) true;
      case (#TripleDivine, #TripleDivine) true;
      case (#Underworld, #Underworld) true;
      case (#Trickster, #Trickster) true;
      case (#Serpent, #Serpent) true;
      case (#Tree, #Tree) true;
      case (#Sun, #Sun) true;
      case (#Moon, #Moon) true;
      case (#Stars, #Stars) true;
      case (#Hero, #Hero) true;
      case (#Apocalypse, #Apocalypse) true;
      case (#Paradise, #Paradise) true;
      case (#Tower, #Tower) true;
      case (#Giants, #Giants) true;
      case (#Prometheus, #Prometheus) true;
      case (#Language, #Language) true;
      case (#Magic, #Magic) true;
      case _ false;
    };
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CONVERGENCE ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════

  /// Find convergent myths across cultures
  public func findConvergences(mythId : Text) : [Myth] {
    let allMyths = getAllMyths();
    
    // Find the source myth
    var sourceMythOpt : ?Myth = null;
    for (m in allMyths.vals()) {
      if (m.id == mythId) {
        sourceMythOpt := ?m;
      };
    };
    
    switch (sourceMythOpt) {
      case null { [] };
      case (?sourceMyth) {
        // Find all myths this one converges with
        Array.filter<Myth>(allMyths, func(m : Myth) : Bool {
          for (conv in sourceMyth.convergencesWith.vals()) {
            if (Text.contains(m.id, #text conv)) {
              return true;
            };
          };
          false;
        });
      };
    };
  };
};
