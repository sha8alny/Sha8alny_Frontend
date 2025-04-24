import { useState } from 'react';
import Image from 'next/image';

export default function SafeImage({ src, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  return (
    <Image
      {...props}
      src={hasError ? "/placeholder.svg" : imgSrc || "/placeholder.svg"}
      alt={alt}
      onError={() => {
        if (!hasError) {
          setImgSrc("/placeholder.svg");
          setHasError(true);
        }
      }}
    />
  );
}