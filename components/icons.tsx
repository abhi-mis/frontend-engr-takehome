/**
 * The site's icon set, in one place.
 *
 * Every icon comes from `react-icons`, imported individually from the Feather
 * subpath (`react-icons/fi`) rather than from the package root. That matters:
 * importing from `react-icons` pulls the barrel, while `react-icons/fi` lets the
 * bundler tree-shake down to only the icons actually referenced.
 *
 * Re-exporting through this file rather than importing `react-icons/fi` directly
 * in each component buys two things:
 *
 *   1. One consistent family. Mixing icon sets is the fastest way to make an
 *      interface look assembled rather than designed, and a single import site
 *      makes that impossible to do by accident.
 *   2. A single swap point. Changing the whole site's icon family, or replacing
 *      react-icons entirely, is an edit to this file and nothing else.
 *
 * Performance note: icons rendered inside Server Components are serialised to
 * static SVG markup at build time and cost zero client JavaScript. Only the ones
 * used inside the three client islands ship any JS, which is why the set below
 * is deliberately small.
 */

export {
  FiCheck as CheckIcon,
  FiX as CrossIcon,
  FiArrowRight as ArrowRightIcon,
  FiMapPin as MapPinIcon,
  FiSearch as SearchIcon,
  FiInfo as InfoIcon,
  FiAlertCircle as AlertIcon,
  FiCheckCircle as CheckCircleIcon,
  FiMenu as MenuIcon,
  FiHeart as HeartIcon,
  FiShare2 as ShareIcon,
  FiPlay as PlayIcon,
  FiPlus as PlusIcon,
} from "react-icons/fi";
