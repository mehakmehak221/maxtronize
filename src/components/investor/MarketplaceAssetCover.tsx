'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { Building2, Building } from 'lucide-react';

type MarketplaceAssetCoverProps = {
  image: string | null;
  alt: string;
  assetType?: string;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
  priority?: boolean;
  sizes?: string;
};

export function MarketplaceAssetCover({
  image,
  alt,
  assetType = '',
  className = '',
  imageClassName = 'object-cover transition-transform duration-500 group-hover:scale-[1.03]',
  children,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
}: MarketplaceAssetCoverProps) {
  const displayImage = image || '/images/assets.webp';
  const isRemoteImage = displayImage.startsWith('http://') || displayImage.startsWith('https://');

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={displayImage}
        alt={alt}
        fill
        priority={priority}
        className={imageClassName}
        sizes={sizes}
        unoptimized={isRemoteImage}
      />
      {children}
    </div>
  );
}

