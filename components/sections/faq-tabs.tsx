"use client";

import { Accordion, Tabs } from "radix-ui";
import { PlusIcon } from "@/components/icons";
import { TAB_LIST_CLASS, TAB_TRIGGER_CLASS } from "@/components/tab-strip";
import type { FaqGroup } from "@/lib/faq";

/**
 * The FAQ's category tabs and answer accordion.
 *
 * WHY BOTH PANELS ARE ALWAYS IN THE DOM
 *
 * `forceMount` plus `data-[state=inactive]:hidden`, the same pattern as the
 * comparison tabs and for the same two reasons. Radix does not mount an
 * inactive panel by default, which breaks `aria-controls` (it points at an id
 * that does not exist) and hides three quarters of this content from a crawler.
 * `display: none` still removes the inactive panels from the accessibility
 * tree, so a screen reader meets one category at a time.
 *
 * That matters more here than anywhere else on the page: 32 questions is the
 * single largest block of indexable text in the build, and a FAQ that only
 * exists after JavaScript runs is a FAQ search engines never read.
 *
 * WHY THE ANSWERS START CLOSED
 *
 * A FAQ is a lookup table. Nobody reads 32 answers in order, and opening them
 * all would make the section several screens of text that everyone scrolls
 * past. Radix's Accordion gives the correct semantics for free: each trigger is
 * a button with `aria-expanded` and `aria-controls`, arrow keys move between
 * questions, and the panel is properly associated with its heading.
 *
 * `type="single" collapsible` rather than `multiple`, because comparing two
 * answers side by side is not a thing anyone does with an FAQ, and one open row
 * keeps the list scannable while you read.
 *
 * WHY THE TAB VALUE IS A SLUG AND NOT THE CATEGORY NAME
 *
 * Radix derives element ids from a tab's value. `aria-controls` is a
 * SPACE-SEPARATED list of ids, so a value of "About the Service" emits
 * aria-controls="radix-...-content-About the Service", which the browser reads
 * as three id references, none of which resolve. An accessibility audit caught
 * it; reading the code would not have, because nothing here looks wrong.
 */

interface FaqTabsProps {
  readonly groups: readonly FaqGroup[];
}

export function FaqTabs({ groups }: FaqTabsProps) {
  return (
    <Tabs.Root defaultValue={groups[0]?.slug} className="mt-10">
      {/* The strip's look lives in components/tab-strip.ts, shared with the
          comparison's. The two used to be designed separately and looked it:
          this one filled its active pill solid brand orange with a white
          label, which made a tab the loudest control on the page after the
          primary CTA and had it competing with the actual action. */}
      <Tabs.List aria-label="Question categories" className={TAB_LIST_CLASS}>
        {groups.map((group) => (
          <Tabs.Trigger
            key={group.slug}
            value={group.slug}
            className={TAB_TRIGGER_CLASS}
          >
            {group.category}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {groups.map((group) => (
        <Tabs.Content
          key={group.slug}
          value={group.slug}
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <Accordion.Root
            type="single"
            collapsible
            className="mt-8 divide-y divide-line overflow-hidden rounded-card bg-surface-raised shadow-md"
          >
            {group.items.map((item, index) => (
              <Accordion.Item
                // Keyed by position, not by question text. Their data repeated
                // one question inside a category, so the text was not unique
                // and React warned about duplicate keys. The duplicate is gone
                // from lib/faq.ts now, but a key should not depend on content
                // staying unique when nothing enforces that it will.
                key={`${group.slug}-${index}`}
                value={`${group.slug}-${index}`}
                className="group/row"
              >
                {/* The question is a real heading, so the section has an
                    outline. Radix requires the trigger to be the only child of
                    the header, which is why the h3 wraps it. */}
                <Accordion.Header asChild>
                  <h3 className="text-base font-semibold text-ink">
                    <Accordion.Trigger className="flex w-full items-start justify-between gap-5 px-5 py-5 text-left transition-colors hover:text-brand-strong sm:px-7">
                      <span>{item.question}</span>
                      {/* One icon, rotated. A plus that turns into a cross is
                          the same glyph at 45 degrees, so this costs one SVG
                          rather than two and animates rather than swapping. */}
                      <PlusIcon
                        aria-hidden
                        focusable={false}
                        className="mt-0.5 size-5 shrink-0 text-ink-muted transition-transform duration-200 group-data-[state=open]/row:rotate-45 group-data-[state=open]/row:text-brand-strong"
                      />
                    </Accordion.Trigger>
                  </h3>
                </Accordion.Header>

                <Accordion.Content className="faq-panel overflow-hidden">
                  <div className="flex flex-col gap-4 px-5 pb-6 text-[0.9375rem] leading-[1.65] text-ink-muted sm:px-7">
                    {item.blocks.map((block, i) =>
                      block.kind === "p" ? (
                        <p key={i}>{block.text}</p>
                      ) : (
                        <BlockList key={i} block={block} />
                      )
                    )}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

function BlockList({ block }: { readonly block: FaqGroup["items"][number]["blocks"][number] }) {
  const items = block.items ?? [];
  const className =
    "flex flex-col gap-2.5 " +
    (block.ordered
      ? "list-decimal marker:font-semibold marker:text-brand-strong"
      : "list-disc marker:text-brand-soft") +
    " pl-5";

  const content = items.map((entry) => (
    <li key={entry.text} className="pl-1">
      {entry.lead && (
        <strong className="font-semibold text-ink">{entry.lead}: </strong>
      )}
      {entry.text}
    </li>
  ));

  return block.ordered ? (
    <ol className={className}>{content}</ol>
  ) : (
    <ul className={className}>{content}</ul>
  );
}
