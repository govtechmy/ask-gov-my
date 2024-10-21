import PlusIcon from "@/icons/plusicon";
import { ComponentProps, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@askgovmy/utils";

const getHeightAndWidthFromDataURL = (
  dataURL: string
): Promise<{ height: number; width: number }> =>
  new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width,
      });
    };
    img.src = dataURL;
  });

export interface AgencyImageInputProps extends ComponentProps<"input"> {
  defaultSrc?: string | null;
  onSelectImage: (
    file: File,
    imgSize: { width: number; height: number }
  ) => void;
}

export function AgencyImageInput({
  onSelectImage,
  defaultSrc,
  className,
  ...props
}: AgencyImageInputProps) {
  const [previewSrc, setPreviewSrc] = useState(defaultSrc);
  const fileInput = useRef<HTMLInputElement | null>(null);
  return (
    <div className={cn("w-fit relative cursor-pointer", className)}>
      <button
        type="button"
        className="w-16 aspect-square rounded-full bg-washed-100 block relative border border-outline-200 overflow-hidden focus:outline-askmygovbrand-300 hover:border-askmygovbrand-300"
        onClick={() => fileInput.current?.click()}
      >
        {previewSrc && (
          <Image
            src={previewSrc}
            alt="Agency's logo"
            fill
            className="object-contain"
          />
        )}
      </button>
      <div
        className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-askmygovbrand-600 text-white grid place-items-center"
        aria-hidden="true"
      >
        <PlusIcon className="stroke-white-forcewhite" width="10" height="10" />
      </div>
      <input
        type="file"
        ref={fileInput}
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const dataURL = URL.createObjectURL(file);
          setPreviewSrc(dataURL);
          const { width, height } = await getHeightAndWidthFromDataURL(dataURL);
          onSelectImage(file, { width, height });
        }}
        className="hidden"
        {...props}
      />
    </div>
  );
}
