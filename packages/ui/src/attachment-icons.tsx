import { FileIcon } from "lucide-react";
import { ImagePngNJpgIcon, PdfIcon } from "./icons";

export function AttachmentIcon({ type }: { type: string }) {
  if (type.startsWith("image")) return <ImagePngNJpgIcon />;
  if (type === "application/pdf") return <PdfIcon />;
  return <FileIcon />;
}
