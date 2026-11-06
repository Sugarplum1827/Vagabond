type Level = "Bachelor's" | "Master's" | "Doctorate";
export type Requirement = {
  id: string;
  label: string;
  detail: string;
  validityMonths?: number;
  source?: string;
};

export type Opportunity = {
  id: string;
  title: string;
  organization: string;
  region: string;
  destination: string;
  levels: Level[];
  kind: "Degree program" | "Scholarship";
  field: string;
  intake: string;
  opens?: string;
  deadline: string;
  timing: string;
  funding: string;
  costs: string;
  checked: string;
  source: string;
  application: string;
  visa: string;
  requirements: Requirement[];
  steps: string[];
};

const checked = "2026-11-06";
const emai = "https://www.upf.edu/web/emai/access-admission";
const emaiFees = "https://www.upf.edu/web/emai/scholarships-fees";
const fulbright = "https://www.fulbright.org.ph/index.php/fulbright-foreign-student-program";
const mext = "https://www.ph.emb-japan.go.jp/itpr_en/11_000001_02213.html";
const mextForms = "https://www.ph.emb-japan.go.jp/itpr_en/00_000193.html";
const japanVisa = "https://www.studyinjapan.go.jp/en/planning/immigration-procedures/";

export const opportunities: Opportunity[] = [
  {
    id: "emai-2027",
    title: "Erasmus Mundus Joint Master in Artificial Intelligence",
    organization: "Universitat Pompeu Fabra and partner universities",
    region: "Europe",
    destination: "Spain and other consortium countries",
    levels: ["Master's"],
    kind: "Degree program",
    field: "Artificial intelligence, mathematics, computer science",
    intake: "2027–2029",
    opens: "2026-11-25",
    deadline: "2027-06-05",
    timing: "Worldwide self-funded round closes 5 June 2027 at 23:59 CEST.",
    funding: "The published worldwide round is self-funded. Scholarship and waiver terms on the fees page refer to an earlier cohort.",
    costs: "Confirm tuition for this cohort. Budget separately for living costs, travel and visa expenses.",
    checked,
    source: emai,
    application: emai,
    visa: "https://www.upf.edu/web/emai/practical-information",
    requirements: [
      { id: "degree", label: "Qualifying degree", detail: "Check the degree equivalency and required mathematics, programming and computing coursework." },
      { id: "transcript", label: "Academic transcript", detail: "Prepare the official course, grade and cumulative GPA record." },
      { id: "english", label: "Accepted English certificate", detail: "Check accepted tests, minimum scores and exemptions. If required, the certificate must be valid at application.", validityMonths: 24 },
      { id: "materials", label: "Application materials", detail: "Prepare your ID, CV, motivation letter and the reference required for the self-funded route. Confirm cohort-specific forms." },
      { id: "budget", label: "Funding and tuition", detail: "Check which published fees apply to your cohort and plan how to cover costs.", source: emaiFees },
    ],
    steps: ["Review the worldwide self-funded application dates and entry conditions.", "Prepare the documents and check the portal instructions for your cohort.", "Submit in the UPF portal. After acceptance, follow the enrolment and immigration guidance."],
  },
  {
    id: "fulbright-ph-2027",
    title: "Fulbright Foreign Student Program for Filipinos",
    organization: "Philippine-American Educational Foundation",
    region: "Americas",
    destination: "United States",
    levels: ["Master's", "Doctorate"],
    kind: "Scholarship",
    field: "Graduate study and research in eligible fields",
    intake: "2027–2028",
    deadline: "2026-04-30",
    timing: "The listed call closed on 30 April 2026. Use it to prepare for a future call.",
    funding: "The program lists tuition and fees, a living allowance, travel and health coverage among its benefits. Check the award terms for your track.",
    costs: "Confirm which costs are covered and any expenses you would pay directly.",
    checked,
    source: fulbright,
    application: fulbright,
    visa: "https://travel.state.gov/content/travel/en/us-visas/study/exchange.html",
    requirements: [
      { id: "eligibility", label: "Applicant eligibility", detail: "Check citizenship, academic background, work experience and eligible fields against the official call." },
      { id: "academic", label: "Academic records and statements", detail: "Prepare your transcript and the statements required for your selected track." },
      { id: "references", label: "Three references", detail: "Complete the reference waiver in the portal before registering your recommenders." },
      { id: "nbi", label: "NBI clearance", detail: "The listed call asks for clearance acquired within the previous six months.", validityMonths: 6 },
    ],
    steps: ["Confirm your study track and eligibility on the official Philippine call.", "Prepare records, statements, references and the required clearance.", "Use the official portal for the relevant call and follow the program’s instructions after selection."],
  },
  ...([
    { id: "mext-undergraduate-2027", title: "MEXT Undergraduate Scholarship", levels: ["Bachelor's"], eligibility: "Check the school completion, academic standing and age rules for the undergraduate route." },
    { id: "mext-research-2027", title: "MEXT Research Student Scholarship", levels: ["Master's", "Doctorate"], eligibility: "Check the degree, academic standing and age rules. Prepare a feasible proposal in your field or a related field." },
  ] satisfies { id: string; title: string; levels: Level[]; eligibility: string }[]).map(({ eligibility, ...track }): Opportunity => ({
    ...track,
    organization: "Embassy of Japan in the Philippines",
    region: "Asia",
    destination: "Japan",
    kind: "Scholarship",
    field: "Varies by course and track",
    intake: "2027",
    deadline: "2026-05-29",
    timing: "The Philippine Embassy call closed on 29 May 2026. Physical submission applied to that call.",
    funding: "Check the track guidelines for the stipend, tuition coverage, travel arrangements and exclusions.",
    costs: "Budget for document preparation and check the guidelines for travel and arrival expenses.",
    checked,
    source: mext,
    application: mextForms,
    visa: japanVisa,
    requirements: [
      { id: "eligibility", label: "Track eligibility", detail: eligibility },
      { id: "forms", label: "Track application packet", detail: "Use the Embassy’s current track forms and follow the checklist for academic records and supporting documents.", source: mextForms },
    ],
    steps: ["Choose the correct Embassy recommendation track.", "Download the track guidelines and assemble the forms and supporting documents.", "Follow the Embassy’s current delivery instructions and screening schedule."],
  })),
];

export function applicationStatus(opportunity: Opportunity, today: string) {
  if (today > opportunity.deadline) return "Closed";
  if (opportunity.opens && today < opportunity.opens) return "Upcoming";
  return "Check official window";
}

export function documentExpiry(issued: string, months: number) {
  const [year, month, day] = issued.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, month - 1 + months + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month - 1 + months, Math.min(day, lastDay)))
    .toISOString().slice(0, 10);
}
