"use client";

import { X, FileText, ImageIcon, Film } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { useState, useEffect } from "react";

export function MediaPreview({ file, onRemove }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }

    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [file]);

  const getFileIcon = () => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />;
    } else if (file.type.startsWith("video/")) {
      return <Film className="h-4 w-4" />;
    } else {
      return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative group">
      <div className="w-20 h-20 rounded-md overflow-hidden border flex items-center justify-center bg-muted">
        {file.type.startsWith("image/") && preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-1">
            {getFileIcon()}
            <span className="text-xs mt-1 text-center truncate w-full">
              {file.name.length > 10
                ? `${file.name.substring(0, 7)}...`
                : file.name}
            </span>
          </div>
        )}
      </div>
      <Button
        variant="destructive"
        size="icon"
        className="h-5 w-5 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
        data-testid="remove-media-button"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
