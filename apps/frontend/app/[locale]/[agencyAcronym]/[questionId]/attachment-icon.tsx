import { ImagePngNJpgIcon, PdfIcon } from "@askgovmy/ui";
import { FileIcon } from "lucide-react";

export function AttachmentIcon({ type }: { type: string }) {
  if (type.startsWith("image")) return <ImagePngNJpgIcon />;
  if (type === "application/pdf") return <PdfIcon />;
  return <FileIcon />;
}
