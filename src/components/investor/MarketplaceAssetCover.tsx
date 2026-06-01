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
  const showInfraIcon = assetType.toLowerCase().includes('infra');
  const isRemoteImage = Boolean(
    image && (image.startsWith('http://') || image.startsWith('https://')),
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          className={imageClassName}
          sizes={sizes}
          unoptimized={isRemoteImage}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#5b21b6] via-primary to-[#4c1d95]"
          aria-hidden={!alt}
        >
          {/* Subtle decorative circles for depth */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-purple-400/20 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white border border-white/20 backdrop-blur-sm shadow-lg md:h-20 md:w-20 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/20">
            {showInfraIcon ? (
              <Building className="h-8 w-8 md:h-10 md:w-10 stroke-[1.5]" />
            ) : (
              <Building2 className="h-8 w-8 md:h-10 md:w-10 stroke-[1.5]" />
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

