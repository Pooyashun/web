/**
 * Curated Gilan imagery, hot-linked from Wikimedia Commons and credited in the
 * footer (see README → Images). Replace the URLs here to use your own photos.
 *
 * `Special:FilePath` resolves a file by name and `?width=` asks Commons for a
 * resized copy, so we never hardcode a fragile upload.wikimedia.org path.
 */

export interface SiteImage {
  url: string;
  alt: string;
  /** Commons file page, linked from the footer credit. */
  source: string;
  artist: string;
  license: string;
}

const filePath = (file: string, width: number): string =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`;

export const IMAGES: Record<string, SiteImage> = {
  hero: {
    url: filePath('Masouleh_(Gilan,_Iran)_004.jpg', 1600),
    alt: 'خانه‌های پلکانی روستای ماسوله در گیلان',
    source: 'https://commons.wikimedia.org/wiki/File:Masouleh_(Gilan,_Iran)_004.jpg',
    artist: 'Petr Adam Dohnálek',
    license: 'CC BY-SA 3.0',
  },
  riceField: {
    url: filePath('Panorama_of_Rice_Paddies_in_Iran.jpg', 1600),
    alt: 'چشم‌انداز شالیزارهای سرسبز شمال ایران',
    source: 'https://commons.wikimedia.org/wiki/File:Panorama_of_Rice_Paddies_in_Iran.jpg',
    artist: 'Adam Jones',
    license: 'CC BY-SA 2.0',
  },
  villageHouse: {
    url: filePath('Masouleh_(Gilan,_Iran)_006.jpg', 1200),
    alt: 'خانه‌های روستایی و کوچه‌های ماسوله',
    source: 'https://commons.wikimedia.org/wiki/File:Masouleh_(Gilan,_Iran)_006.jpg',
    artist: 'Petr Adam Dohnálek',
    license: 'CC BY-SA 3.0',
  },
  greenSlope: {
    url: filePath('Tea_Gardens,_Gilan,_Iran.jpg', 1200),
    alt: 'باغ‌های چای سرسبز در دامنه‌های گیلان',
    source: 'https://commons.wikimedia.org/wiki/File:Tea_Gardens,_Gilan,_Iran.jpg',
    artist: 'M@mad',
    license: 'CC BY 2.0',
  },
  lagoon: {
    url: filePath('Anzali_Lagoon.jpg', 1600),
    alt: 'مرداب انزلی و پوشش گیاهی اطراف آن',
    source: 'https://commons.wikimedia.org/wiki/File:Anzali_Lagoon.jpg',
    artist: 'Hamid Hajihusseini',
    license: 'CC BY 3.0',
  },
  cityEdge: {
    url: filePath('Bandar-e_Anzali_Gilan_Iran.jpg', 1600),
    alt: 'نمایی از شهر و بندر انزلی در گیلان',
    source: 'https://commons.wikimedia.org/wiki/File:Bandar-e_Anzali_Gilan_Iran.jpg',
    artist: 'ArminAmirian',
    license: 'CC BY-SA 4.0',
  },
  forestRoad: {
    url: filePath('Rudkhan_Castle.jpg', 1600),
    alt: 'قلعه رودخان در دل جنگل‌های گیلان',
    source: 'https://commons.wikimedia.org/wiki/File:Rudkhan_Castle.jpg',
    artist: 'ninara',
    license: 'CC BY-SA 2.0',
  },
};

/** Images shown in the landing-page gallery strip. */
export const GALLERY_IMAGE_KEYS: string[] = [
  'riceField',
  'villageHouse',
  'greenSlope',
  'lagoon',
];

/** Never throws: an unknown key falls back to the hero image. */
export function getImage(key: string): SiteImage {
  return IMAGES[key] ?? IMAGES.hero;
}

export interface ImageCredit {
  source: string;
  artist: string;
  license: string;
}

/** Unique credits for every image used above. */
export const IMAGE_CREDITS: ImageCredit[] = [
  {
    source: 'https://commons.wikimedia.org/wiki/File:Masouleh_(Gilan,_Iran)_004.jpg',
    artist: 'Petr Adam Dohnálek',
    license: 'CC BY-SA 3.0',
  },
  {
    source: 'https://commons.wikimedia.org/wiki/File:Masouleh_(Gilan,_Iran)_006.jpg',
    artist: 'Petr Adam Dohnálek',
    license: 'CC BY-SA 3.0',
  },
  {
    source: 'https://commons.wikimedia.org/wiki/File:Panorama_of_Rice_Paddies_in_Iran.jpg',
    artist: 'Adam Jones',
    license: 'CC BY-SA 2.0',
  },
  {
    source: 'https://commons.wikimedia.org/wiki/File:Tea_Gardens,_Gilan,_Iran.jpg',
    artist: 'M@mad',
    license: 'CC BY 2.0',
  },
  {
    source: 'https://commons.wikimedia.org/wiki/File:Anzali_Lagoon.jpg',
    artist: 'Hamid Hajihusseini',
    license: 'CC BY 3.0',
  },
  {
    source: 'https://commons.wikimedia.org/wiki/File:Bandar-e_Anzali_Gilan_Iran.jpg',
    artist: 'ArminAmirian',
    license: 'CC BY-SA 4.0',
  },
  {
    source: 'https://commons.wikimedia.org/wiki/File:Rudkhan_Castle.jpg',
    artist: 'ninara',
    license: 'CC BY-SA 2.0',
  },
];
