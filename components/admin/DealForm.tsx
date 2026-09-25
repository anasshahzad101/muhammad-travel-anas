"use client";

import { useId } from "react";
import { autoTotal, pilgrims, pkr } from "@/lib/leads/staff";
import { ROOMS, SERVICES, type CrmPackage, type Deal, type Room, type Service } from "@/lib/leads/types";
import { Chips, Field, MoneyInput, Stepper, inputCls } from "./fields";

const CITIES = ["Lahore", "Karachi", "Islamabad", "Other"];
const CUSTOM = "__custom";

export function emptyDeal(): Deal {
  return { service: "package", adults: 1, children: 0, payments: [] };
}

/**
 * What they are buying: the service, the package (from the site's own price
 * list, so the price fills itself in), room, pilgrims, price, travel date and
 * city. Everything is optional; the total works itself out unless typed.
 */
export default function DealForm({ deal, onChange, packages }: { deal: Deal; onChange: (d: Deal) => void; packages: CrmPackage[] }) {
  const uid = useId();
  const set = (patch: Partial<Deal>) => onChange({ ...deal, ...patch });
  const pkg = packages.find((p) => p.slug === deal.packageSlug);
  const byDays = [...new Set(packages.map((p) => p.days))].sort((a, b) => a - b);
  const autoSum = autoTotal(deal);

  function choosePackage(slug: string) {
    if (slug === CUSTOM || !slug) return set({ packageSlug: undefined, packageName: slug === CUSTOM ? "" : undefined });
    const p = packages.find((x) => x.slug === slug);
    if (!p) return;
    // Keep their room if this package offers it, otherwise the cheapest room it has.
    const rooms = (Object.keys(ROOMS) as Room[]).filter((r) => p.prices[r]);
    const room = deal.room && p.prices[deal.room] ? deal.room : rooms.find((r) => r === "quad") ?? rooms[0];
    set({ packageSlug: p.slug, packageName: p.name, room, pricePerPerson: room ? p.prices[room] : deal.pricePerPerson });
  }

  function chooseRoom(room: Room) {
    set({ room, ...(pkg?.prices[room] && { pricePerPerson: pkg.prices[room] }) });
  }

  return (
    <div className="space-y-5">
      <Field label="What do they want?">
        <Chips
          label="Service"
          options={(Object.keys(SERVICES) as Service[]).map((id) => ({ id, label: SERVICES[id] }))}
          value={deal.service}
          onChange={(service) => set({ service, ...(service !== "package" && { packageSlug: undefined, room: undefined }) })}
        />
      </Field>

      {deal.service === "package" ? (
        <>
          <Field label="Package" htmlFor={`${uid}-pkg`}>
            <select
              id={`${uid}-pkg`}
              value={deal.packageSlug ?? (deal.packageName !== undefined ? CUSTOM : "")}
              onChange={(e) => choosePackage(e.target.value)}
              className={inputCls}
            >
              <option value="">Choose a package...</option>
              {byDays.map((d) => (
                <optgroup key={d} label={`${d} days`}>
                  {packages
                    .filter((p) => p.days === d)
                    .map((p) => {
                      const from = Math.min(...Object.values(p.prices).filter((n): n is number => !!n));
                      return (
                        <option key={p.slug} value={p.slug}>
                          {p.name} · from {pkr(from)}
                        </option>
                      );
                    })}
                </optgroup>
              ))}
              <option value={CUSTOM}>Custom package (type it in)</option>
            </select>
          </Field>
          {!deal.packageSlug && deal.packageName !== undefined && (
            <Field label="Custom package" htmlFor={`${uid}-custom`}>
              <input
                id={`${uid}-custom`}
                value={deal.packageName}
                onChange={(e) => set({ packageName: e.target.value })}
                placeholder="e.g. 18 days, 4-star Makkah, 3-star Madinah"
                className={inputCls}
              />
            </Field>
          )}
          <Field label="Room" hint={pkg ? "The price per person fills in from this package's price list." : undefined}>
            <Chips
              label="Room"
              options={(Object.keys(ROOMS) as Room[]).map((id) => ({ id, label: ROOMS[id], disabled: !!pkg && !pkg.prices[id] }))}
              value={deal.room}
              onChange={chooseRoom}
            />
          </Field>
        </>
      ) : (
        <Field label="Details" htmlFor={`${uid}-what`}>
          <input
            id={`${uid}-what`}
            value={deal.packageName ?? ""}
            onChange={(e) => set({ packageName: e.target.value })}
            placeholder={deal.service === "visa" ? "e.g. Umrah visa for 3, 1 year multiple" : deal.service === "tickets" ? "e.g. LHE to JED return, 12 Dec" : "What they asked for"}
            className={inputCls}
          />
        </Field>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Adults">
          <Stepper label="Adults" value={deal.adults} onChange={(adults) => set({ adults })} />
        </Field>
        <Field label="Children">
          <Stepper label="Children" value={deal.children} onChange={(children) => set({ children })} />
        </Field>
      </div>

      <Field label="Price per person" htmlFor={`${uid}-ppp`}>
        <MoneyInput id={`${uid}-ppp`} value={deal.pricePerPerson} onChange={(pricePerPerson) => set({ pricePerPerson })} placeholder="e.g. 285000" />
      </Field>

      <Field
        label="Total price"
        htmlFor={`${uid}-total`}
        hint={
          deal.total === undefined ? (
            autoSum ? (
              <>
                Worked out: {pilgrims(deal)} &times; {pkr(deal.pricePerPerson ?? 0)} = <strong className="text-ink-800">{pkr(autoSum)}</strong>. Type a total if you agreed a
                different price (a discount, child prices).
              </>
            ) : (
              "Worked out from the price per person, or type the agreed total."
            )
          ) : autoSum && autoSum !== deal.total ? (
            <>
              The price list works out to {pkr(autoSum)}.{" "}
              <button type="button" onClick={() => set({ total: undefined })} className="font-semibold text-ink-800 underline underline-offset-2">
                Use that instead
              </button>
            </>
          ) : undefined
        }
      >
        <MoneyInput id={`${uid}-total`} value={deal.total} onChange={(total) => set({ total })} placeholder={autoSum ? String(autoSum) : "Agreed total"} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Travel date" htmlFor={`${uid}-date`}>
          <input id={`${uid}-date`} type="date" value={deal.travelDate ?? ""} onChange={(e) => set({ travelDate: e.target.value || undefined })} className={inputCls} />
        </Field>
        <Field label="Flying from">
          <Chips small label="Flying from" options={CITIES.map((c) => ({ id: c, label: c }))} value={deal.city} onChange={(city) => set({ city })} />
        </Field>
      </div>
    </div>
  );
}
