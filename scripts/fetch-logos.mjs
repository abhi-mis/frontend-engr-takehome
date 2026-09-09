/**
 * Builds the trusted-by logo assets.
 *
 * PROVENANCE
 *
 * Every file here comes from Propsoch's OWN CDN, the same assets their live
 * site serves in its trust strip. That matters for two reasons: the artwork is
 * the artwork they already publish rather than a lookalike sourced elsewhere,
 * and the brief forbids inventing content. The source URLs are listed in
 * `LOGOS` below so the provenance is checkable rather than asserted.
 *
 * WHY A SCRIPT AND NOT EIGHT HAND-CONVERTED FILES
 *
 * The output is committed, so this does not run at build time. It exists so the
 * conversion is reproducible and documented: someone can re-run it, change the
 * target height, and get the same result. Hand-converted binaries in a repo are
 * unreviewable.
 *
 * WHAT IT DOES TO EACH IMAGE
 *
 * 1. WHITE TO ALPHA, where the source has no alpha channel. Atlassian's asset
 *    is RGB on a solid white background, which would render as a white box on
 *    our off-white surface. The conversion is the standard un-premultiply
 *    against white: alpha = 255 - min(r,g,b), then each channel is scaled back
 *    up by that alpha. Done per pixel, so anti-aliased edges survive instead of
 *    being hard-keyed into a jagged cutout.
 *
 * 2. TRIM. The sources carry different amounts of padding (Deloitte's has
 *    ~120px of it), so trimming first is what makes a uniform target height
 *    produce optically comparable logos.
 *
 * 3. RESIZE TO 2x. Assets are rendered at TARGET_H, which is twice the CSS
 *    height they display at. Nothing is upscaled: the smallest source is 48px
 *    tall after trimming, which is exactly the target, so every logo is either
 *    1:1 or downscaled. That is what keeps them sharp on a 2x display without
 *    shipping pixels nobody sees.
 *
 * 4. WEBP, near-lossless. Flat vector-style artwork with hard edges is exactly
 *    where lossy WebP shows ringing around the letterforms, so quality is high
 *    and alphaQuality is 100. These files are small enough that the tradeoff is
 *    not worth making.
 *
 * It also writes lib/logos.generated.ts with each file's exact output
 * dimensions. The component sets width and height from that, which is what
 * reserves the box before the image arrives and keeps CLS at zero.
 *
 *   node scripts/fetch-logos.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const CDN = "https://d1zk2x7mtoyb2b.cloudfront.net/websiteAssets/logos";

/** Twice the 24px CSS height the strip renders at. */
const TARGET_H = 48;

const OUT_DIR = path.join(process.cwd(), "public", "logos");
const MANIFEST = path.join(process.cwd(), "lib", "logos.generated.ts");

/**
 * The eight employers Propsoch names. Order is theirs.
 *
 * `scale` is an OPTICAL correction, not a bug fix. Normalising logos to one
 * bounding-box height makes a compact horizontal lockup (Microsoft) look
 * heavier than a stacked one whose mark sits below the wordmark (Amazon's
 * smile). A few percent per brand is what makes a strip look level to the eye
 * rather than level to the maths.
 */
const LOGOS = [
  { id: "amazon", label: "Amazon", file: "amazon-logo.png", scale: 1.0 },
  { id: "google", label: "Google", file: "google-logo.png", scale: 0.92 },
  { id: "microsoft", label: "Microsoft", file: "microsoft-logo.png", scale: 0.85 },
  { id: "flipkart", label: "Flipkart", file: "flipkart-logo.webp", scale: 0.95 },
  // 0.62 looks severe next to the others and is not. Atlassian's asset is an
  // all-caps wordmark that fills its full box, where "amazon" is lowercase with
  // the smile below it using only about two thirds. Matching bounding boxes
  // would make ATLASSIAN's letters roughly 1.6x the size of everyone else's.
  { id: "atlassian", label: "Atlassian", file: "atlassian-logo.webp", scale: 0.62 },
  { id: "phonepe", label: "PhonePe", file: "PhonePe-Logo.webp", scale: 0.95 },
  { id: "deloitte", label: "Deloitte", file: "Deloitte-Logo.png", scale: 0.74 },
  { id: "navi", label: "Navi", file: "navi-logo.png", scale: 0.9 },
];

/**
 * Un-premultiply a solid-white background into an alpha channel.
 *
 * For a coloured mark on pure white, the opacity of any pixel is how far it is
 * from white, and the darkest channel is the best estimate of that:
 *
 *   a  = 255 - min(r, g, b)
 *   c' = (c - (255 - a)) * 255 / a
 *
 * The second line removes the white that was blended in, so a 50%-opacity edge
 * pixel recovers its true colour instead of staying washed out.
 */
async function whiteToAlpha(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = 255 - Math.min(r, g, b);

    if (a === 0) {
      out[i] = out[i + 1] = out[i + 2] = out[i + 3] = 0;
      continue;
    }

    const white = 255 - a;
    out[i] = Math.max(0, Math.min(255, Math.round(((r - white) * 255) / a)));
    out[i + 1] = Math.max(0, Math.min(255, Math.round(((g - white) * 255) / a)));
    out[i + 2] = Math.max(0, Math.min(255, Math.round(((b - white) * 255) / a)));
    out[i + 3] = a;
  }

  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const results = [];
  let totalBytes = 0;

  for (const logo of LOGOS) {
    const url = `${CDN}/${logo.file}`;
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`${logo.id}: HTTP ${res.status} for ${url}`);
    let buf = Buffer.from(await res.arrayBuffer());

    const meta = await sharp(buf).metadata();
    const hadAlpha = Boolean(meta.hasAlpha);
    if (!hadAlpha) buf = await whiteToAlpha(buf);

    // Trim first, so the target height measures the MARK and not its padding.
    const trimmed = await sharp(buf).trim({ threshold: 10 }).toBuffer();

    const height = Math.round(TARGET_H * logo.scale);
    const out = await sharp(trimmed)
      .resize({ height, fit: "inside", withoutEnlargement: false, kernel: "lanczos3" })
      .webp({ quality: 90, alphaQuality: 100, effort: 6 })
      .toBuffer({ resolveWithObject: true });

    const outPath = path.join(OUT_DIR, `${logo.id}.webp`);
    await writeFile(outPath, out.data);
    totalBytes += out.data.length;

    results.push({
      id: logo.id,
      label: logo.label,
      width: out.info.width,
      height: out.info.height,
      bytes: out.data.length,
      hadAlpha,
      source: meta.width + "x" + meta.height + " " + meta.format,
    });

    console.log(
      `  ${logo.id.padEnd(10)} ${String(meta.width + "x" + meta.height).padEnd(11)} -> ` +
        `${String(out.info.width + "x" + out.info.height).padEnd(9)} ` +
        `${String(out.data.length).padStart(5)}B` +
        (hadAlpha ? "" : "  (white keyed to alpha)")
    );
  }

  const ts = `/**
 * GENERATED by scripts/fetch-logos.mjs. Do not edit by hand.
 *
 * Intrinsic dimensions of the WebP files in public/logos. The component renders
 * these as the img width and height attributes so the browser reserves the
 * right box before the bytes arrive, which is what holds CLS at zero.
 *
 * The rendered height is half of what is listed here: the assets are 2x.
 */

export interface TrustLogo {
  readonly id: string;
  readonly label: string;
  readonly src: string;
  /** Intrinsic width of the 2x asset. */
  readonly width: number;
  /** Intrinsic height of the 2x asset. */
  readonly height: number;
}

export const TRUST_LOGOS: readonly TrustLogo[] = [
${results
  .map(
    (r) =>
      `  { id: "${r.id}", label: "${r.label}", src: "/logos/${r.id}.webp", width: ${r.width}, height: ${r.height} },`
  )
  .join("\n")}
] as const;
`;

  await writeFile(MANIFEST, ts, "utf8");

  console.log(`\n  ${results.length} logos, ${totalBytes} B total, manifest written to lib/logos.generated.ts\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
