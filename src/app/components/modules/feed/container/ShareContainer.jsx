"use client";

import Dialog from "@/app/components/ui/DialogMod";
import SharePresentation from "../presentation/SharePresentation";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { IosShare } from "@mui/icons-material";

export default function ShareContainer({
  fontSize,
  onPost = false,
  username,
  postId,
  shareModalOpen,
  setShareModalOpen,
}) {
  const pathName = usePathname();
  const shareUrl = onPost
    ? `https://sha8alny.com${pathName}`
    : `https://sha8alny.com/u/${username}/post/${postId}`;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedUrl = encodeURIComponent(shareUrl);

  return (
    <Dialog
      open={shareModalOpen}
      onOpenChange={setShareModalOpen}
      variant="ghost"
      size="sm"
      buttonData={<IosShare sx={{ fontSize: fontSize }} />}
      buttonClass="cursor-pointer flex items-center text-primary rounded-md hover:bg-primary/10"
      className="min-w-max"
      AlertContent={
        <SharePresentation
          copyToClipboard={copyToClipboard}
          copied={copied}
          shareUrl={encodedUrl}
        />
      }
    />
  );
}
