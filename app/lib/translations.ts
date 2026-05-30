export type Lang = "en" | "es";

export const translations = {
  en: {
    nav: {
      mission: "Mission",
      founders: "Founders",
      pasalapro: "PasalaPro",
      sponsors: "Sponsors",
      founderEdition: "Founder Edition",
    },
    hero: {
      tag: "Powered by PasalaPro",
      subheadline: "One Club. One Community. One Movement.",
      body: "The future of Salvadoran football starts from zero. A new identity forged to open doors for the talents the system never noticed.",
      cta1: "Join the Movement",
      cta2: "See Founder Edition",
      stat1Label: "Founder Jerseys",
      stat2Label: "El Salvador",
      stat3Label: "Pasala",
    },
    mision: {
      tag: "Our Mission",
      headlineA: "Created to",
      headlineB: "open doors",
      body: "Harpia FC was born with a clear purpose: to create opportunities for undiscovered football talents. From the community to the pitch.",
      quote: "A new era for Salvadoran football.",
      quoteAttrib: "— Harpia FC",
      pillars: [
        {
          title: "Real Visibility",
          text: "We bring talents out of the shadows. Connecting undiscovered players with scouts, sponsors, and real opportunities.",
        },
        {
          title: "Complete Ecosystem",
          text: "Through PasalaPro, teams, players, fans and brands come together in one place. It's not just a club — it's a platform.",
        },
        {
          title: "From the Community",
          text: "Harpia FC doesn't come from the top. It comes from the pitches, the neighborhoods, and those who love Salvadoran football.",
        },
        {
          title: "Identity & Legacy",
          text: "Every jersey, every match, every step builds something bigger. Harpia FC is the start of a legacy El Salvador deserves.",
        },
      ],
    },
    fundadores: {
      sectionLabel: "OFFICIAL LIMITED COLLECTION",
      title: "Founder Collectible Edition",
      subtitle: "Only 1,000 pieces will ever exist worldwide.",
      mainCopy: [
        "This is not just a jersey.",
        "It is a collectible piece created for those who believe in the birth of Harpia FC from day one.",
        "Each Founder Edition is individually numbered and accompanied by a laser-engraved metal Certificate of Authenticity.",
        "The number on your certificate matches the number on your jersey, making it a unique piece in the history of the club.",
        "Once all 1,000 pieces have been claimed, this collection will never be produced again.",
      ],
      features: [
        "Individually numbered collectible jersey",
        "Laser-engraved metal certificate",
        "Matching jersey and certificate serial number",
        "First official Harpia FC collection",
        "Limited to 1,000 pieces",
        "No future reprints",
        "Created to mark the beginning of the movement",
      ],
      scarcity: {
        title: "A collection that will only happen once.",
        reservations: [
          { number: "#0001", owner: "PasalaPro", desc: "Official technology sponsor and co-founder of the movement.", color: "#0AAFAA" },
          { number: "#0002–0025", owner: "The Team", desc: "Reserved for the founders and core team behind Harpia FC.", color: "#C9A84C" },
          { number: "#0026–0030", owner: "Community", desc: "Reserved for key early community members.", color: "#C0C0C0" },
          { number: "#0031+", owner: "Public", desc: "Available to the world. Only 970 pieces left.", color: "#4ADE80", pulse: true },
        ],
        statements: [
          "Once all 1,000 pieces have been claimed, the collection will be permanently closed.",
          "There will never be a second Founder Edition.",
        ],
      },
      certificate: {
        title: "Collectible Certificate of Authenticity",
        body: [
          "Each jersey includes a premium metal Certificate of Authenticity engraved with laser precision.",
          "Every certificate carries the exact same unique number as its corresponding jersey.",
          "The jersey and certificate together form a single collectible piece.",
        ],
      },
      registry: {
        title: "Official Founder Registry",
        body: [
          "Each number will become part of the official Harpia FC Founder Registry.",
          "Owners may choose to appear publicly as part of the club's history or remain private.",
          "Every piece will have its own unique identity within the official collection.",
        ],
        features: [
          "Official ownership registry",
          "Unique and irreplaceable number",
          "Verifiable ownership history",
          "Permanent place in Harpia FC history",
        ],
      },
      marketplace: {
        title: "Built for collectors",
        body: [
          "In the future, Harpia FC plans to introduce an official transfer registry for collectors who wish to transfer ownership of their collectible piece.",
          "The goal is to preserve authenticity, provenance, and ownership history for every number in the collection.",
        ],
      },
      internalCta: {
        headline: "Become part of the first official Harpia FC collection.",
        body: "The first 1,000 founders will be remembered as the people who helped build the club from the very beginning. Your number will become part of that story forever.",
        button: "RESERVE MY FOUNDER EDITION",
        publicNote: "Public sales begin from piece No. 0031",
        disclaimer: "Only 1,000 Founder Edition pieces will ever exist. No reprints. No exceptions.",
      },
    },
    pasalapro: {
      tag: "Official Sponsor",
      body: "PasalaPro is the official technology platform behind Harpia FC. The engine that connects football with the modern world.",
      cardTitle: "The technology that",
      cardTitleAccent: "moves Salvadoran football",
      cardBody1: "PasalaPro is not just a sponsor. It is the operating system of Harpia FC. It connects every player, team, sponsor and fan in a digital ecosystem built for Latin American football.",
      cardBody2: "Thanks to PasalaPro, Harpia FC can discover talent, manage opportunities and build a real community around Salvadoran football — from day one.",
      stats: [
        { value: "1", label: "Unified platform" },
        { value: "4", label: "User types" },
        { value: "∞", label: "Possible connections" },
        { value: "SV", label: "Made for El Salvador" },
      ],
      features: [
        { title: "Players", desc: "Digital profile, stats and visibility to scouts and clubs." },
        { title: "Teams", desc: "Roster management, calendars, results and centralized communication." },
        { title: "Sponsors", desc: "Direct connection with clubs and players with real impact metrics." },
        { title: "Community", desc: "Fans, creators and followers connected to the club ecosystem." },
      ],
    },
    patrocinadores: {
      tag: "Sponsorship opportunities",
      headlineA: "Be the first to",
      headlineB: "bet",
      headlineC: "on us",
      body: "Sponsoring Harpia FC at this foundational stage is more than brand visibility — it's being part of a historic movement for Salvadoran football. The brands that come first will always be remembered.",
      tiers: [
        {
          name: "Gold Founder",
          perks: [
            "Logo on the official jersey",
            "Presence across all digital channels",
            "Exclusive access to player data",
            "Club events and activations",
            "Mentions in associated media",
          ],
        },
        {
          name: "Silver Sponsor",
          perks: [
            "Logo on digital materials",
            "Presence on club social media",
            "Access to club events",
            "Brand association with the movement",
          ],
        },
        {
          name: "Community Ally",
          perks: [
            "Official ally mention",
            "Presence on digital channels",
            "Connection with the Harpia community",
          ],
        },
      ],
      note: "Packages are customizable. Contact the team for details.",
      cta: "I want to sponsor",
    },
    cta: {
      headlineA: "Become part of the",
      headlineB: "birth",
      headlineC: "of Harpia FC",
      body: "The future of Salvadoran football starts from zero. The first 1,000 are the ones who write history.",
      quote: "From the community to the pitch.",
      counterTotalLabel: "Total jerseys",
      counterStartLabel: "Starts here",
      counterImpactLabel: "Impact",
      btnReserve: "Reserve my Founder Edition",
      btnContact: "Contact the team",
    },
    footer: {
      tagline: "One Club. One Community. One Movement. The future of Salvadoran football starts from zero.",
      poweredBy: "Powered by PasalaPro",
      navTitle: "Navigation",
      navLinks: [
        { label: "Home", href: "#" },
        { label: "Mission", href: "#mision" },
        { label: "Founder Edition", href: "#fundadores" },
        { label: "PasalaPro", href: "#pasalapro" },
        { label: "Sponsors", href: "#patrocinadores" },
      ],
      contactTitle: "Contact",
      copyright: "All rights reserved.",
      techBy: "Technology by",
    },
  },

  es: {
    nav: {
      mission: "Misión",
      founders: "Fundadores",
      pasalapro: "PasalaPro",
      sponsors: "Patrocinadores",
      founderEdition: "Edición Fundadores",
    },
    hero: {
      tag: "Impulsado por PasalaPro",
      subheadline: "Un club. Una comunidad. Un movimiento.",
      body: "El futuro del fútbol salvadoreño empieza desde cero. Una nueva identidad forjada para abrir oportunidades a los talentos que el sistema nunca vio.",
      cta1: "Unirme al movimiento",
      cta2: "Ver Edición Fundadores",
      stat1Label: "Jerseys Fundadores",
      stat2Label: "El Salvador",
      stat3Label: "Pasala",
    },
    mision: {
      tag: "Nuestra Misión",
      headlineA: "Creado para",
      headlineB: "abrir puertas",
      body: "Harpia FC nació con un propósito claro: crear oportunidades para talentos futbolísticos no descubiertos. De la comunidad para la cancha.",
      quote: "Una nueva era para el fútbol salvadoreño.",
      quoteAttrib: "— Harpia FC",
      pillars: [
        {
          title: "Visibilidad real",
          text: "Sacamos a los talentos de la sombra. Conectamos jugadores no descubiertos con scouts, patrocinadores y oportunidades reales.",
        },
        {
          title: "Ecosistema completo",
          text: "A través de PasalaPro, equipos, jugadores, fans y marcas se encuentran en un solo lugar. No es solo un club — es una plataforma.",
        },
        {
          title: "De la comunidad",
          text: "Harpia FC no viene de arriba. Viene de las canchas, de los barrios, de quienes aman el fútbol salvadoreño y creen en su futuro.",
        },
        {
          title: "Identidad y legado",
          text: "Cada jersey, cada partido, cada paso construye algo más grande. Harpia FC es el inicio de un legado que El Salvador merece.",
        },
      ],
    },
    fundadores: {
      sectionLabel: "COLECCIÓN OFICIAL LIMITADA",
      title: "Edición Coleccionable Fundadores",
      subtitle: "Solo existirán 1,000 piezas en todo el mundo.",
      mainCopy: [
        "Este no es solo un jersey.",
        "Es una pieza coleccionable creada para quienes creen en el nacimiento de Harpia FC desde el primer día.",
        "Cada Edición Fundadores está numerada individualmente y acompañada de un Certificado de Autenticidad metálico grabado con láser.",
        "El número en tu certificado coincide con el número en tu jersey, convirtiéndola en una pieza única en la historia del club.",
        "Una vez que las 1,000 piezas sean reclamadas, esta colección nunca volverá a producirse.",
      ],
      features: [
        "Jersey coleccionable numerado individualmente",
        "Certificado metálico grabado con láser",
        "Número de serie coincidente en jersey y certificado",
        "Primera colección oficial de Harpia FC",
        "Limitada a 1,000 piezas",
        "Sin futuras reimpresiones",
        "Creada para marcar el inicio del movimiento",
      ],
      scarcity: {
        title: "Una colección que solo ocurrirá una vez.",
        reservations: [
          { number: "#0001", owner: "PasalaPro", desc: "Patrocinador tecnológico oficial y co-fundador del movimiento.", color: "#0AAFAA" },
          { number: "#0002–0025", owner: "El Equipo", desc: "Reservadas para los fundadores y el equipo central detrás de Harpia FC.", color: "#C9A84C" },
          { number: "#0026–0030", owner: "Comunidad", desc: "Reservadas para miembros clave de la comunidad inicial.", color: "#C0C0C0" },
          { number: "#0031+", owner: "Público", desc: "Disponibles para el mundo. Solo quedan 970 piezas.", color: "#4ADE80", pulse: true },
        ],
        statements: [
          "Una vez reclamadas las 1,000 piezas, la colección quedará cerrada permanentemente.",
          "Nunca habrá una segunda Edición Fundadores.",
        ],
      },
      certificate: {
        title: "Certificado Coleccionable de Autenticidad",
        body: [
          "Cada jersey incluye un Certificado de Autenticidad metálico premium grabado con precisión láser.",
          "Cada certificado lleva exactamente el mismo número único que su jersey correspondiente.",
          "El jersey y el certificado juntos forman una sola pieza coleccionable.",
        ],
      },
      registry: {
        title: "Registro Oficial de Fundadores",
        body: [
          "Cada número formará parte del Registro Oficial de Fundadores de Harpia FC.",
          "Los propietarios pueden elegir aparecer públicamente como parte de la historia del club o permanecer en privado.",
          "Cada pieza tendrá su propia identidad única dentro de la colección oficial.",
        ],
        features: [
          "Registro oficial de propiedad",
          "Número único e irremplazable",
          "Historial de propiedad verificable",
          "Lugar permanente en la historia de Harpia FC",
        ],
      },
      marketplace: {
        title: "Construido para coleccionistas",
        body: [
          "En el futuro, Harpia FC planea introducir un registro oficial de transferencias para los coleccionistas que deseen transferir la propiedad de su pieza.",
          "El objetivo es preservar la autenticidad, la procedencia y el historial de propiedad de cada número en la colección.",
        ],
      },
      internalCta: {
        headline: "Sé parte de la primera colección oficial de Harpia FC.",
        body: "Los primeros 1,000 fundadores serán recordados como las personas que ayudaron a construir el club desde el principio. Tu número formará parte de esa historia para siempre.",
        button: "RESERVAR MI EDICIÓN FUNDADORES",
        publicNote: "Las ventas públicas comienzan desde la pieza No. 0031",
        disclaimer: "Solo existirán 1,000 piezas de la Edición Fundadores. Sin reimpresión. Sin excepciones.",
      },
    },
    pasalapro: {
      tag: "Patrocinador Oficial",
      body: "PasalaPro es la plataforma tecnológica oficial detrás de Harpia FC. El motor que conecta el fútbol con el mundo moderno.",
      cardTitle: "La tecnología que",
      cardTitleAccent: "mueve el fútbol salvadoreño",
      cardBody1: "PasalaPro no es solo un patrocinador. Es el sistema operativo de Harpia FC. Conecta a cada jugador, equipo, patrocinador y fan en un ecosistema digital pensado para el fútbol latinoamericano.",
      cardBody2: "Gracias a PasalaPro, Harpia FC puede descubrir talentos, gestionar oportunidades y crear una comunidad real alrededor del fútbol salvadoreño — desde el primer día.",
      stats: [
        { value: "1", label: "Plataforma unificada" },
        { value: "4", label: "Tipos de usuarios" },
        { value: "∞", label: "Conexiones posibles" },
        { value: "SV", label: "Hecho para El Salvador" },
      ],
      features: [
        { title: "Jugadores", desc: "Perfil digital, estadísticas y visibilidad ante reclutadores y clubes." },
        { title: "Equipos", desc: "Gestión de plantel, calendarios, resultados y comunicación centralizada." },
        { title: "Patrocinadores", desc: "Conexión directa con clubes y jugadores con métricas de impacto real." },
        { title: "Comunidad", desc: "Fans, creadores y seguidores conectados al ecosistema del club." },
      ],
    },
    patrocinadores: {
      tag: "Oportunidades de patrocinio",
      headlineA: "Sé el primero en",
      headlineB: "apostar",
      headlineC: "por nosotros",
      body: "Patrocinar Harpia FC en esta etapa fundacional es más que visibilidad de marca — es ser parte de un movimiento histórico para el fútbol salvadoreño. Las marcas que entren primero, serán recordadas siempre.",
      tiers: [
        {
          name: "Fundador de Oro",
          perks: [
            "Logo en el jersey oficial",
            "Presencia en todos los canales digitales",
            "Acceso exclusivo a datos de jugadores",
            "Eventos y activaciones del club",
            "Mención en medios asociados",
          ],
        },
        {
          name: "Patrocinador Plata",
          perks: [
            "Logo en materiales digitales",
            "Presencia en redes del club",
            "Acceso a eventos del club",
            "Asociación de marca con el movimiento",
          ],
        },
        {
          name: "Aliado Comunitario",
          perks: [
            "Mención como aliado oficial",
            "Presencia en canales digitales",
            "Conexión con la comunidad Harpia",
          ],
        },
      ],
      note: "Los paquetes son personalizables. Contacta al equipo para más detalles.",
      cta: "Quiero patrocinar",
    },
    cta: {
      headlineA: "Sé parte del",
      headlineB: "nacimiento",
      headlineC: "de Harpia FC",
      body: "El futuro del fútbol salvadoreño empieza desde cero. Los primeros 1,000 son los que escriben la historia.",
      quote: "De la comunidad para la cancha.",
      counterTotalLabel: "Jerseys totales",
      counterStartLabel: "Desde aquí",
      counterImpactLabel: "Impacto",
      btnReserve: "Reservar mi Edición Fundadores",
      btnContact: "Contactar al equipo",
    },
    footer: {
      tagline: "Un club. Una comunidad. Un movimiento. El futuro del fútbol salvadoreño empieza desde cero.",
      poweredBy: "Impulsado por PasalaPro",
      navTitle: "Navegación",
      navLinks: [
        { label: "Inicio", href: "#" },
        { label: "Misión", href: "#mision" },
        { label: "Edición Fundadores", href: "#fundadores" },
        { label: "PasalaPro", href: "#pasalapro" },
        { label: "Patrocinadores", href: "#patrocinadores" },
      ],
      contactTitle: "Contacto",
      copyright: "Todos los derechos reservados.",
      techBy: "Tecnología de",
    },
  },
} as const;

export type Translations = typeof translations;
