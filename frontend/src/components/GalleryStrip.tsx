import { GALLERY_IMAGE_KEYS, getImage } from '../data/images';

/** Short captions kept next to the images they describe. */
const CAPTIONS: Record<string, string> = {
  riceField: 'شالیزار و زمین‌های سبز',
  villageHouse: 'خانه‌های روستایی',
  greenSlope: 'دامنه‌ها و دشت‌های سرسبز',
  lagoon: 'مرداب و مناطق نزدیک آب',
};

export function GalleryStrip() {
  return (
    <div className="gallery">
      {GALLERY_IMAGE_KEYS.map((key) => {
        const image = getImage(key);
        return (
          <figure className="gallery__item" key={key}>
            <img src={image.url} alt={image.alt} loading="lazy" />
            <figcaption className="gallery__caption">{CAPTIONS[key] ?? image.alt}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
