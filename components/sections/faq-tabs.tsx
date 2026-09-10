"use client";

import { Accordion, Tabs } from "radix-ui";
import { PlusIcon } from "@/components/icons";
import { TAB_LIST_CLASS, TAB_TRIGGER_CLASS } from "@/components/tab-strip";
import type { FaqGroup } from "@/lib/faq";

interface FaqTabsProps {
  readonly groups: readonly FaqGroup[];
}

// Every panel stays mounted so aria-controls resolves and crawlers see all 32.
export function FaqTabs({ groups }: FaqTabsProps) {
  return (
    <Tabs.Root defaultValue={groups[0]?.slug} className="mt-10">
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
                key={`${group.slug}-${index}`}
                value={`${group.slug}-${index}`}
                className="group/row"
              >
                <Accordion.Header asChild>
                  <h3 className="text-base font-semibold text-ink">
                    <Accordion.Trigger className="flex w-full items-start justify-between gap-5 px-5 py-5 text-left transition-colors hover:text-brand-strong sm:px-7">
                      <span>{item.question}</span>
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
