"use client";

import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Button } from "@/app/components/ui/Button";
import { useState, useEffect } from "react";

// Determine which icon to display based on file type
const getFileIcon = (fileType) => {
  if (fileType.startsWith("image/")) {
    return <ImageIcon className="h-4 w-4" />;
  } else if (fileType.startsWith("video/")) {
    return <VideocamIcon className="h-4 w-4" />;
  } else if (fileType.startsWith("application/pdf")) {
    return <DescriptionIcon className="h-4 w-4 text-destructive" />;
  } else {
    return <InsertDriveFileIcon className="h-4 w-4" />;
  }
};

export function MediaPreview({ file, onRemove }) {
  const [preview, setPreview] = useState(null);

  // Generate preview for image files
  useEffect(() => {
    if (!file) return;
    
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

  if (!file) return null;

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
            {getFileIcon(file.type)}
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
        <CloseIcon className="h-3 w-3" />
      </Button>
    </div>
  );
}
