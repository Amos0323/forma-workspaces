import { projects } from "./projects";
export const projectStories = [
  {
    challenge:
      "An imagined agency needs room for spontaneous exchange without turning every desk into a meeting space. The brief asks how a compact harbour-side workplace could support both conversation and concentration.",
    approach:
      "A shared social spine draws people towards the light. Enclosed meeting spaces sit along one edge, leaving a clear route between work settings. Timber and soft upholstery introduce warmth without competing with the view.",
    palette: [
      ["Natural oak", "#b99266"],
      ["Sandstone", "#d8ccb7"],
      ["Olive textile", "#687052"],
    ],
    gallery: ["/images/carter.jpg", "/images/maple.jpg"],
    location: "V&A Waterfront",
    x: 165,
    y: 165,
  },
  {
    challenge:
      "The imagined collective brings independent businesses together under one roof. Its challenge is to make shared space feel generous while protecting the identity and everyday routines of each team.",
    approach:
      "A communal table becomes the point of arrival. Smaller team settings sit beyond it, with furniture that can shift as memberships change. Charcoal details frame the space; exposed textures and timber give it an informal character.",
    palette: [
      ["Timber", "#a47d58"],
      ["Charcoal", "#363934"],
      ["Clay tone", "#b17f64"],
    ],
    gallery: ["/images/commons.jpg", "/images/riverton.jpg"],
    location: "Woodstock",
    x: 230,
    y: 205,
  },
  {
    challenge:
      "A fictional technology team moves between remote meetings, deep individual work and short project sprints. The brief is to offer choice without creating a confusing collection of disconnected rooms.",
    approach:
      "A legible circulation loop links quiet rooms, shared workbenches and a kitchen hub. Acoustic material concepts distinguish focused settings from collaborative ones. Furniture is grouped around activities rather than fixed departmental boundaries.",
    palette: [
      ["Warm ivory", "#ede9dc"],
      ["Acoustic olive", "#72775b"],
      ["Dark joinery", "#343d39"],
    ],
    gallery: ["/images/northpoint.jpg", "/images/carter.jpg"],
    location: "Century City",
    x: 310,
    y: 120,
  },
  {
    challenge:
      "An imagined professional practice wants discretion without a formal, closed atmosphere. Its concept brief calls for private conversations, comfortable waiting spaces and a calm sequence from arrival to meeting.",
    approach:
      "A soft threshold leads into a shared lounge, with meeting rooms beyond. Sandstone tones and timber establish continuity. A proposed indigenous planting palette would be selected with a local specialist for the actual light and maintenance conditions.",
    palette: [
      ["Sandstone", "#c6b494"],
      ["Natural timber", "#a28361"],
      ["Leaf green", "#747e59"],
    ],
    gallery: ["/images/ellis.jpg", "/images/northpoint.jpg"],
    location: "Stellenbosch",
    x: 650,
    y: 180,
  },
  {
    challenge:
      "The fictional refurbishment asks how an existing office could serve a changing team with fewer permanent desks and more useful shared settings. The brief prioritises adaptability over a complete visual reset.",
    approach:
      "The concept retains a clear perimeter and reorganises the centre into meeting, focus and collaboration zones. A phased sequence would be developed around occupation needs. Durable finishes and reusable furniture form the starting point of the material study.",
    palette: [
      ["Oak table", "#b08d65"],
      ["Charcoal metal", "#3f433f"],
      ["Stone grey", "#b3b2a7"],
    ],
    gallery: ["/images/riverton.jpg", "/images/commons.jpg"],
    location: "Cape Town Foreshore",
    x: 185,
    y: 195,
  },
  {
    challenge:
      "A small imagined creative team wants the comfort of a lounge and the practicality of a studio. The challenge is to keep informal settings useful for work without losing a sense of welcome.",
    approach:
      "A central gathering table anchors the plan. Soft seating creates a place to discuss work in progress, while a quiet edge supports individual tasks. Warm ivory and muted olive bring the different settings into one restrained palette.",
    palette: [
      ["Warm ivory", "#ece7da"],
      ["Olive upholstery", "#69704f"],
      ["Timber grain", "#b28c63"],
    ],
    gallery: ["/images/maple.jpg", "/images/carter.jpg"],
    location: "Claremont",
    x: 235,
    y: 320,
  },
] as const;
export function getStory(slug: string) {
  return projectStories[projects.findIndex((project) => project.slug === slug)];
}
