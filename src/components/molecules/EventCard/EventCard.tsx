'use client';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  id: number;
  title: string;
  description?: string | null;

  // 👇 aceptar Date o string (o null)
  start?: string | Date | null;
  end?: string | Date | null;
  startTime?: string | null;
  endTime?: string | null;
  location?: string | null;

  image_url?: string | null;
};

const PLACEHOLDER = 'https://picsum.photos/800/400?blur=3';

function safeSrc(src?: string | null) {
  if (!src || typeof src !== 'string') return PLACEHOLDER;
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) return src;
  return PLACEHOLDER;
}

export default function EventCard(props: Props) {
  const {
    id, title, description, image_url,
    // start, end, startTime, endTime, location // <- si luego los muestras, ya aceptan Date|string|null
    location
  } = props;

  return (
    <Link href={`/User/Events/${id}`} className="block border rounded-xl overflow-hidden hover:shadow-md transition">
      <div className="relative w-full h-48">
        <Image
          src={safeSrc(image_url)}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-semibold line-clamp-1">{title}</h3>
        {description ? <p className="text-sm text-gray-600 line-clamp-2">{description}</p> : null}
        {location ? <p className="text-xs text-gray-500">📍 {location}</p> : null}
      </div>
    </Link>
  );
}
