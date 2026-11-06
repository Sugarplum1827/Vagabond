"use client";

import { useEffect, useState } from "react";
import { applicationStatus, documentExpiry, type Opportunity } from "@/lib/opportunities";

const stages = ["Preparing", "Submitted", "Awaiting decision", "Accepted", "Declined"] as const;
type Plan = {
  saved?: boolean;
  stage?: typeof stages[number];
  date?: string;
  ready?: string[];
  issued?: Record<string, string>;
};
const storageKey = "vagabond-application-plans-v1";
const control = "border border-[var(--ink-pale)] rounded p-2 bg-[var(--parch-light)]";
const card = "border border-[var(--ink-pale)] p-5 rounded bg-[var(--parch-light)]";

export default function ApplicationPlanner({ opportunities }: { opportunities: Opportunity[] }) {
  const [plans, setPlans] = useState<Record<string, Plan>>({});
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [region, setRegion] = useState("");
  const [level, setLevel] = useState("");
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Manila" }).format(new Date()));
    try {
      setPlans(JSON.parse(localStorage.getItem(storageKey) ?? "{}") ?? {});
    } catch {
      setStorageError(true);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(plans));
    } catch {
      setStorageError(true);
    }
  }, [loaded, plans]);

  function update(id: string, change: (plan: Plan) => Plan) {
    setPlans((previous) => ({ ...previous, [id]: change(previous[id] ?? {}) }));
  }

  const visible = opportunities.filter((item) =>
    (!region || item.region === region) &&
    (!level || item.levels.some((value) => value === level)) &&
    (!savedOnly || plans[item.id]?.saved) &&
    [item.title, item.field, item.destination].join(" ").toLowerCase().includes(query.trim().toLowerCase())
  );
  const saved = opportunities.filter((item) => plans[item.id]?.saved).sort((left, right) =>
    (plans[left.id]?.date || left.deadline).localeCompare(plans[right.id]?.date || right.deadline)
  );

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3 mb-5">
        <label className="grid gap-1">Search<input className={control} value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <label className="grid gap-1">Region<select className={control} value={region} onChange={(event) => setRegion(event.target.value)}>
          <option value="">All regions</option>{[...new Set(opportunities.map((item) => item.region))].map((value) => <option key={value}>{value}</option>)}
        </select></label>
        <label className="grid gap-1">Degree level<select className={control} value={level} onChange={(event) => setLevel(event.target.value)}>
          <option value="">All levels</option>{[...new Set(opportunities.flatMap((item) => item.levels))].map((value) => <option key={value}>{value}</option>)}
        </select></label>
      </div>
      <label className="flex items-center gap-2 mb-6"><input type="checkbox" checked={savedOnly} onChange={(event) => setSavedOnly(event.target.checked)} /> Show my shortlist ({saved.length})</label>
      {storageError && <p role="status" className="mb-4">Browser storage was unavailable or unreadable. Check that your progress survives a reload.</p>}
      {saved.length > 0 && <section className="mb-8 overflow-x-auto" aria-label="Shortlist comparison">
        <h2 className="font-cinzel text-xl mb-3">Compare your shortlist</h2>
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b"><th className="p-2">Opportunity</th><th className="p-2">Intake</th><th className="p-2">Deadline</th><th className="p-2">Funding</th><th className="p-2">Progress</th></tr></thead>
          <tbody>{saved.map((item) => <tr key={item.id} className="border-b">
            <th scope="row" className="p-2"><a href={"#" + item.id} onClick={() => { setRegion(""); setLevel(""); setQuery(""); }}>{item.title}</a></th>
            <td className="p-2">{item.intake}</td><td className="p-2">{item.deadline}</td><td className="p-2">{item.funding}</td>
            <td className="p-2">{plans[item.id]?.stage ?? "Preparing"} · {plans[item.id]?.ready?.length ?? 0}/{item.requirements.length} items
              {plans[item.id]?.date && <span className="block text-sm">Plan to submit {plans[item.id].date}</span>}
            </td>
          </tr>)}</tbody>
        </table>
      </section>}
      {visible.length === 0 && <p role="status">No opportunities match these filters.</p>}
      <div className="grid gap-5">
        {visible.map((item) => {
          const plan = plans[item.id] ?? {};
          return (
            <article className={card} key={item.id} id={item.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[var(--red)]">{item.kind} · {item.region} · {item.levels.join(" / ")} · {today ? applicationStatus(item, today) : "Check official window"}</p>
                  <h2 className="font-cinzel text-xl font-bold mt-2">{item.title}</h2>
                  <p>{item.organization} · {item.destination} · Intake {item.intake}</p>
                </div>
                <button type="button" disabled={!loaded} aria-pressed={!!plan.saved} className="btn-outline"
                  onClick={() => update(item.id, (current) => ({ ...current, saved: !current.saved }))}>
                  {plan.saved ? "Remove from shortlist" : "Save to shortlist"}
                </button>
              </div>
              <p className="mt-4">{item.timing}</p>
              <p className="mt-2"><strong>Funding</strong> {item.funding}</p>
              <p className="mt-2"><strong>Costs to check</strong> {item.costs}</p>
              <p className="mt-2"><a className="underline" href={item.source}>Official listing</a> · Reviewed {item.checked}</p>
              <details className="mt-5 border-t pt-4">
                <summary className="cursor-pointer font-semibold">Requirements and application steps</summary>
                <ol className="list-decimal pl-5 my-4 space-y-1">{item.steps.map((step) => <li key={step}>{step}</li>)}</ol>
                <label className="flex flex-wrap items-center gap-2 my-3">Application stage
                  <select className={control} value={plan.stage ?? "Preparing"} disabled={!loaded}
                    onChange={(event) => {
                      const stage = stages.find((value) => value === event.target.value);
                      update(item.id, (current) => ({ ...current, stage }));
                    }}>
                    {stages.map((stage) => <option key={stage}>{stage}</option>)}
                  </select>
                </label>
                <label className="flex flex-wrap items-center gap-2 my-3">Planned submission date
                  <input type="date" className={control} value={plan.date ?? ""} disabled={!loaded}
                    onChange={(event) => update(item.id, (current) => ({ ...current, date: event.target.value }))} />
                </label>
                {plan.date && ((item.opens && plan.date < item.opens) || plan.date > item.deadline) &&
                  <p className="mb-3 text-[var(--red)]">Your planned date is outside the listed application window.</p>}
                <p className="text-sm mb-3">Mark items you have reviewed and prepared. This checklist records your progress. The institution decides eligibility.</p>
                <ul className="space-y-4">
                  {item.requirements.map((requirement) => {
                    const issued = plan.issued?.[requirement.id] ?? "";
                    const expiry = issued && requirement.validityMonths ? documentExpiry(issued, requirement.validityMonths) : "";
                    return <li key={requirement.id}>
                      <label className="flex items-center gap-2 font-semibold">
                        <input type="checkbox" checked={plan.ready?.includes(requirement.id) ?? false} disabled={!loaded}
                          onChange={(event) => update(item.id, (current) => ({
                            ...current, ready: event.target.checked ? [...(current.ready ?? []), requirement.id] :
                              (current.ready ?? []).filter((id) => id !== requirement.id),
                          }))} />
                        {requirement.label}
                      </label>
                      <p className="ml-5">{requirement.detail} <a className="underline" href={requirement.source ?? item.source}>Source</a></p>
                      {requirement.validityMonths && <div className="ml-5 mt-2 text-sm">
                        <label className="flex flex-wrap items-center gap-2">Issue or test date
                          <input type="date" className={control} value={issued} disabled={!loaded}
                            onChange={(event) => update(item.id, (current) => ({
                              ...current, issued: { ...current.issued, [requirement.id]: event.target.value },
                            }))} />
                        </label>
                        {expiry && <p className="mt-1">Estimated validity boundary {expiry}.
                          {plan.date && (plan.date < issued ? " The document is dated after your submission." :
                            plan.date >= expiry ? " Check validity before submitting on your planned date." :
                              " Your planned date falls inside the estimated window.")}</p>}
                      </div>}
                    </li>;
                  })}
                </ul>
                <div className="mt-5 flex flex-wrap gap-4">
                  <a className="underline" href={item.application}>Official application instructions</a>
                  <a className="underline" href={item.visa}>Visa and immigration guidance</a>
                </div>
              </details>
            </article>
          );
        })}
      </div>
    </>
  );
}
