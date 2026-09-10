/**
 * Builds the master-plan comparison images and the process testimonial avatar.
 *
 * PROVENANCE
 *
 * All three files come from Propsoch's own CDN, the same assets their live site
 * serves in these same two places. Source URLs are in SOURCES below.
 *
 * THE ONE THING THAT MATTERS FOR A COMPARISON SLIDER
 *
 * The two plan images MUST end up at identical pixel dimensions. Their sources
 * are not: 989x682 and 987x692, which is a 1.450 aspect against a 1.426. Left
 * alone, the reveal edge would wipe across two subtly different framings and
 * the whole illusion of one place seen two ways falls apart. Both are therefore
 * cover-cropped to exactly 3:2 at each width, from the centre.
 *
 * TWO WIDTHS, AND WHY THIS IS THE REAL OPTIMISATION
 *
 * These are the heaviest images on the site by a distance: the sources are a
 * 1.17 MB and a 782 KB PNG. Encoded to WebP at 990px the pair is still 121.5 KB,
 * which would make this section the single largest thing on the page.
 *
 * So each is emitted at 660w and 990w and the markup carries a srcset with a
 * sizes hint. A phone, where the image occupies about 330 CSS px, takes the
 * 660w pair at 73.8 KB. An ordinary 1x desktop, where it is about 600 CSS px,
 * also takes 660w. Only a high-DPI desktop pulls the 990w pair. Most visitors
 * therefore download 74 KB rather than 122 KB, for two extra files and a few
 * bytes of markup.
 *
 * Quality 75 was picked by encoding the pair at 70, 75 and 82 and taking the
 * knee. The "after" image is a line drawing with small annotations, which is
 * exactly the content lossy WebP handles worst, so this is deliberately not
 * pushed lower.
 *
 * Both are lazy and below the fold, so none of this weight is on the critical
 * path, and every file's exact dimensions are emitted so the boxes are reserved
 * before the bytes land.
 *
 *   node scripts/fetch-plan-media.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const CDN = "https://d1zk2x7mtoyb2b.cloudfront.net/websiteAssets";

const SOURCES = {
  broker: `${CDN}/product-page/pom-master-plan-before.png`,
  propsoch: `${CDN}/product-page/pom-master-plan-after.png`,
  avatar: `${CDN}/testimonial/roshik-shenoy.png`,
};

/** Both plan images, at both widths, cover-cropped to this ratio. */
const PLAN_RATIO = 3 / 2;
const PLAN_WIDTHS = [660, 990];
const PLAN_QUALITY = 75;

/** 2x of the 48px the avatar renders at. */
const AVATAR_PX = 96;

const OUT_DIR = path.join(process.cwd(), "public", "plan");
const MANIFEST = path.join(process.cwd(), "lib", "plan-media.generated.ts");

async function get(url) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  let total = 0;
  const plans = {};

  for (const key of ["broker", "propsoch"]) {
    const src = await get(SOURCES[key]);
    const meta = await sharp(src).metadata();
    const variants = [];

    for (const width of PLAN_WIDTHS) {
      const height = Math.round(width / PLAN_RATIO);
      const out = await sharp(src)
        .resize({ width, height, fit: "cover", position: "centre", kernel: "lanczos3" })
        // FLATTEN, and this is not optional here.
        //
        // The broker source is 100% SEMI-TRANSPARENT: every pixel in it has an
        // alpha below 250. Encoded to WebP with that alpha intact, the layer on
        // top of the comparison never fully covers the one underneath, so the
        // technical drawing ghosts through the marketing render and both
        // annotations and site plan are visible at once. It looked like a
        // blend-mode bug and it was an alpha channel nobody had checked.
        //
        // Both plans are artwork on white, so compositing onto white is exactly
        // what a browser would do against a white page anyway. It also drops
        // the alpha channel, which makes the files smaller.
        .flatten({ background: "#ffffff" })
        .webp({ quality: PLAN_QUALITY, effort: 6, alphaQuality: 100 })
        .toBuffer({ resolveWithObject: true });

      const file = `${key}-${width}.webp`;
      await writeFile(path.join(OUT_DIR, file), out.data);
      total += out.data.length;
      variants.push({ file, width: out.info.width, height: out.info.height, bytes: out.data.length });
    }

    plans[key] = variants;
    console.log(
      `  ${key.padEnd(9)} ${meta.width}x${meta.height} -> ` +
        variants.map((v) => `${v.width}x${v.height} ${(v.bytes / 1024).toFixed(1)}KB`).join(", ")
    );
  }

  // The avatar. Square cover-crop first, because the source is 98x87 and a
  // round mask over a non-square image squashes the face.
  const avatarSrc = await get(SOURCES.avatar);
  const avatarMeta = await sharp(avatarSrc).metadata();
  const avatar = await sharp(avatarSrc)
    .resize({ width: AVATAR_PX, height: AVATAR_PX, fit: "cover", position: "centre", kernel: "lanczos3" })
    .webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toBuffer({ resolveWithObject: true });

  await writeFile(path.join(OUT_DIR, "roshik-shenoy.webp"), avatar.data);
  total += avatar.data.length;
  console.log(
    `  avatar    ${avatarMeta.width}x${avatarMeta.height} -> ` +
      `${avatar.info.width}x${avatar.info.height} ${(avatar.data.length / 1024).toFixed(1)}KB`
  );

  const srcset = (key) =>
    plans[key].map((v) => `/plan/${v.file} ${v.width}w`).join(", ");

  const ts = `/**
 * GENERATED by scripts/fetch-plan-media.mjs. Do not edit by hand.
 *
 * The two plan images are emitted at two widths each and described here as a
 * ready-made srcset. Both share identical dimensions at each width, which is
 * what lets the comparison slider wipe between them without the framing
 * shifting. width and height are the LARGEST variant, used to give the box its
 * aspect ratio so nothing shifts while the image loads.
 */

export interface PlanImage {
  readonly src: string;
  readonly srcSet: string;
  readonly width: number;
  readonly height: number;
}

export const PLAN_IMAGES: Readonly<Record<"broker" | "propsoch", PlanImage>> = {
${["broker", "propsoch"]
  .map((key) => {
    const largest = plans[key][plans[key].length - 1];
    return `  ${key}: {
    src: "/plan/${largest.file}",
    srcSet: "${srcset(key)}",
    width: ${largest.width},
    height: ${largest.height},
  },`;
  })
  .join("\n")}
};

export const PROCESS_AVATAR = {
  src: "/plan/roshik-shenoy.webp",
  width: ${avatar.info.width},
  height: ${avatar.info.height},
} as const;
`;

  await writeFile(MANIFEST, ts, "utf8");
  console.log(`\n  ${(total / 1024).toFixed(1)} KB written, manifest at lib/plan-media.generated.ts\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
