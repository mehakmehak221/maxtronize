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
          className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-zinc-900/60"
          aria-hidden={!alt}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 border border-violet-100/80 shadow-[0_8px_20px_-6px_rgba(109,40,217,0.15)] dark:bg-violet-950/20 dark:text-violet-400 dark:border-violet-900/30 md:h-20 md:w-20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_24px_-8px_rgba(109,40,217,0.25)]">
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

