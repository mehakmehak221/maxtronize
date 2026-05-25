'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { BuildingIcon, InvestorHub } from '@/app/VectorImages';

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
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center bg-ui-muted-deep"
          aria-hidden={!alt}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300 md:h-20 md:w-20">
            {showInfraIcon ? (
              <BuildingIcon className="h-8 w-8 md:h-10 md:w-10" />
            ) : (
              <InvestorHub className="h-8 w-8 md:h-10 md:w-10" />
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
