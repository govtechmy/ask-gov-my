import { ComponentProps, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@askgovmy/utils";
import { useTranslations } from "next-intl";
import { useAgencyForm } from "./agency-form";
import { PlusIcon } from "@askgovmy/ui";

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

interface AgencyImageInputProps extends ComponentProps<"input"> {}

const MAX_IMAGE_HEIGHT = 200;
const MAX_IMAGE_WIDTH = 200;

export function AgencyImageInput({
  className,
  ...props
}: AgencyImageInputProps) {
  const form = useAgencyForm();
  const t = useTranslations("AgencyForm");
  const [previewSrc, setPreviewSrc] = useState(
    form.getValues("logo_url") || "/jata_logo.png"
  );
  const fileInput = useRef<HTMLInputElement | null>(null);

  const handleImageSelect = async (file: File) => {
    const dataUrl = URL.createObjectURL(file);
    const { width, height } = await getHeightAndWidthFromDataURL(dataUrl);

    if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
      form.setError("logo_url", {
        type: "custom",
        message: t("error_image_exceed_size"),
      });
      if (fileInput.current) fileInput.current.value = "";
      return;
    }

    form.clearErrors("logo_url");
    form.setValue("logo_file", file, { shouldDirty: true });
    setPreviewSrc(dataUrl);
  };

  return (
    <div className={cn("w-fit relative cursor-pointer", className)}>
      <button
        type="button"
        className="w-16 aspect-square rounded-full bg-washed-100 block relative border border-outline-200 overflow-hidden focus:outline-askmygovbrand-300 hover:border-askmygovbrand-300"
        onClick={() => fileInput.current?.click()}
      >
        {previewSrc && (
          <Image
            unoptimized
            src={previewSrc}
            alt={t("agency_logo")}
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
          if (file) handleImageSelect(file);
        }}
        className="hidden"
        {...props}
      />
    </div>
  );
}
