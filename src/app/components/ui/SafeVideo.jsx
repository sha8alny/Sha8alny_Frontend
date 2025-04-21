import { useState } from 'react';

export default function SafeVideo({ src, className, ...props }) {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div 
        className={`${className} bg-gray-200 flex items-center justify-center rounded-2xl`}
      >
        <div className="text-center p-4">
          <div className="text-lg font-medium text-gray-500 mb-2">
            Video unavailable.
          </div>
          <p className="text-sm text-gray-400">
            This media could not be loaded.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <video
      src={src}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}