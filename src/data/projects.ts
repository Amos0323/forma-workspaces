export const projects = [
  {
    slug: "the-waterfront-studio",
    name: "The Waterfront Studio",
    location: "V&A Waterfront, Cape Town, South Africa",
    year: "2026",
    category: "Creative agency",
    concept: "Harbour light, shared ideas.",
    description:
      "An imagined creative agency workplace inspired by the V&A Waterfront. Timber meeting rooms and open collaboration areas balance the energy of a shared studio with space for focused work.",
    areaSqm: 420,
    workstations: 36,
    materials: "Natural oak, sandstone tones and muted olive upholstery.",
    status: "Conceptual work — fictional design study",
    image: "/images/riverton.jpg",
    alt: "Illustrative interior: Light-filled office corridor with glass meeting rooms and a polished floor",
  },
  {
    slug: "the-woodstock-collective",
    name: "The Woodstock Collective",
    location: "Woodstock, Cape Town, South Africa",
    year: "2026",
    category: "Shared workspace",
    concept: "An industrial shell, a collaborative spirit.",
    description:
      "A conceptual shared workplace inspired by Woodstock’s creative neighbourhoods. Communal tables, adaptable meeting areas and tactile finishes support independent teams and small businesses.",
    areaSqm: 560,
    workstations: 48,
    materials: "Exposed textures, warm timber and charcoal metalwork.",
    status: "Conceptual work — fictional design study",
    image: "/images/carter.jpg",
    alt: "Illustrative interior: Contemporary meeting area with generous glazing and communal furniture",
  },
  {
    slug: "the-century-city-hub",
    name: "The Century City Hub",
    location: "Century City, Cape Town, South Africa",
    year: "2026",
    category: "Technology workplace",
    concept: "Connected teams, room to focus.",
    description:
      "An imagined technology workplace for a hybrid team in Century City. Clear circulation connects project areas, quiet rooms and a shared kitchen, offering different settings throughout the working day.",
    areaSqm: 850,
    workstations: 72,
    materials:
      "Charcoal joinery, warm ivory surfaces and olive acoustic finishes.",
    status: "Conceptual work — fictional design study",
    image: "/images/commons.jpg",
    alt: "Illustrative interior: Shared office kitchen and corridor with dark cabinetry and glass partitions",
  },
  {
    slug: "the-stellenbosch-workspace",
    name: "The Stellenbosch Workspace",
    location: "Stellenbosch, Western Cape, South Africa",
    year: "2026",
    category: "Professional services",
    concept: "A calm rhythm, rooted in place.",
    description:
      "A conceptual professional services workspace inspired by the light and landscape of Stellenbosch. Comfortable meeting spaces and a generous shared lounge create a considered balance between privacy and connection.",
    areaSqm: 380,
    workstations: 28,
    materials:
      "Timber, sandstone-inspired surfaces and a proposed indigenous planting palette.",
    status: "Conceptual work — fictional design study",
    image: "/images/maple.jpg",
    alt: "Illustrative interior: Bright workplace lounge with sculptural chairs and oversized floor lamps",
  },
  {
    slug: "the-foreshore-offices",
    name: "The Foreshore Offices",
    location: "Cape Town CBD, South Africa",
    year: "2026",
    category: "Corporate office refurbishment",
    concept: "A fresh perspective on the working day.",
    description:
      "An imagined refurbishment of a corporate office in the Foreshore area of Cape Town CBD. Flexible meeting settings and daylight-led planning explore how an existing tenancy could support a changing organisation.",
    areaSqm: 720,
    workstations: 60,
    materials:
      "Warm timber tables, charcoal detailing and durable neutral finishes.",
    status: "Conceptual work — fictional design study",
    image: "/images/northpoint.jpg",
    alt: "Illustrative interior: Sunlit meeting room with a timber table and upholstered chairs",
  },
  {
    slug: "the-claremont-studio",
    name: "The Claremont Studio",
    location: "Claremont, Cape Town, South Africa",
    year: "2026",
    category: "Boutique commercial studio",
    concept: "A softer setting for ambitious ideas.",
    description:
      "A conceptual boutique workspace in Claremont, bringing a residential sense of comfort to commercial interiors. Informal seating, focused work areas and greenery offer a welcoming setting for a small creative team.",
    areaSqm: 240,
    workstations: 18,
    materials:
      "Warm ivory, natural timber, muted olive and proposed indigenous greenery.",
    status: "Conceptual work — fictional design study",
    image: "/images/ellis.jpg",
    alt: "Illustrative interior: Quiet lounge with plants, warm timber and comfortable gathering spaces",
  },
] as const;
export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
