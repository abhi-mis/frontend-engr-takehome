"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertIcon,
  CheckCircleIcon,
  MapPinIcon,
  SearchIcon,
} from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { FOOTER, PINCODE } from "@/lib/content";
import { lookupPincode, type PincodeResult } from "@/lib/pincodes";

// Not currently rendered; kept because lib/pincodes.ts is verified and tested.
export function PincodeChecker() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<PincodeResult | null>(null);

  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const isInvalid = result?.status === "invalid";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(lookupPincode(value));
  }

  return (
    <section
      id="pincode"
      className="lazy-section bg-surface-sunken py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow={PINCODE.eyebrow}
              heading={PINCODE.heading}
              sub={PINCODE.intro}
            />

            <ul className="mt-5 flex flex-wrap gap-2">
              {FOOTER.cities.map((city) => (
                <li
                  key={city}
                  className="flex items-center gap-1.5 rounded-full bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink shadow-xs"
                >
                  <MapPinIcon
                    aria-hidden
                    className="size-3.5 text-brand-strong"
                  />
                  {city}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-surface-raised p-5 shadow-lg sm:p-8">
            <form onSubmit={handleSubmit} noValidate>
              <label
                htmlFor={inputId}
                className="block text-sm font-semibold text-ink"
              >
                {PINCODE.inputLabel}
              </label>
              <p id={hintId} className="mt-1 text-xs text-ink-muted">
                {PINCODE.hint}
              </p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <Input
                  id={inputId}
                  value={value}
                  onChange={(event) => {
                    const digitsOnly = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6);
                    setValue(digitsOnly);

                    if (result) setResult(null);
                  }}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  placeholder="560034"
                  aria-describedby={isInvalid ? `${hintId} ${errorId}` : hintId}
                  aria-invalid={isInvalid || undefined}
                  className="h-12 border-line-strong text-base tabular-nums sm:flex-1"
                />

                <Button
                  type="submit"
                  className="h-12 gap-2 border-0 bg-brand-button px-6 text-base font-semibold text-white shadow-[0_1px_2px_rgba(26,18,6,0.15)] hover:bg-brand-display active:bg-brand-strong"
                >
                  <SearchIcon aria-hidden className="size-4" />
                  {PINCODE.buttonLabel}
                </Button>
              </div>
            </form>
            <div
              role="status"
              aria-live="polite"
              aria-atomic
              className="mt-5 min-h-[72px]"
            >
              {result?.status === "covered" && (
                <div className="flex items-start gap-3 rounded-inner bg-brand-tint p-4">
                  <CheckCircleIcon
                    aria-hidden
                    className="mt-0.5 size-5 shrink-0 text-brand-strong"
                  />
                  <p className="text-base font-semibold text-ink">
                    Yes, we cover {result.area.area}, {result.area.city}.
                  </p>
                </div>
              )}

              {result?.status === "not-covered" && (
                <div className="flex items-start gap-3 rounded-inner bg-surface-sunken p-4">
                  <MapPinIcon
                    aria-hidden
                    className="mt-0.5 size-5 shrink-0 text-ink-muted"
                  />
                  <div>
                    <p className="text-base font-semibold text-ink">
                      {PINCODE.notCoveredMessage}
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {PINCODE.notCoveredHelp}
                    </p>
                  </div>
                </div>
              )}

              {isInvalid && (
                <p
                  id={errorId}
                  className="flex items-start gap-2 text-sm font-medium text-destructive"
                >
                  <AlertIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
                  {PINCODE.invalidMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
