import { cn } from "@/lib/utils";
import type {
  AssetPreviewCrop,
  AssetPreviewFrame,
  AssetPreviewOffset,
} from "@/model";

export function AssetPreview({
  accentClassName,
  className,
  imageUrl,
  previewCrop,
  previewFrame,
  previewOffset,
  previewScale,
}: {
  accentClassName: string;
  className?: string;
  imageUrl?: string;
  previewCrop?: AssetPreviewCrop;
  previewFrame?: AssetPreviewFrame;
  previewOffset?: AssetPreviewOffset;
  previewScale?: number;
}) {
  return (
    <div
      className={cn(
        "grid aspect-[16/10] place-items-center bg-[linear-gradient(135deg,#ffffff_0%,#efe7d8_48%,#d8e7df_100%)]",
        className,
      )}
    >
      {imageUrl && previewCrop ? (
        <div
          className="relative h-full max-w-full overflow-hidden"
          style={{
            aspectRatio: `${previewCrop.width} / ${previewCrop.height}`,
            transform: previewCrop.displayOffsetY
              ? `translateY(${previewCrop.displayOffsetY})`
              : undefined,
          }}
        >
          <img
            src={imageUrl}
            alt=""
            className="absolute max-w-none [image-rendering:pixelated]"
            style={{
              height: `${(previewCrop.sourceHeight / previewCrop.height) * 100}%`,
              left: `-${(previewCrop.x / previewCrop.width) * 100}%`,
              top: `-${(previewCrop.y / previewCrop.height) * 100}%`,
            }}
          />
        </div>
      ) : imageUrl && previewFrame ? (
        <div
          className={cn(
            "relative overflow-hidden",
            previewFrame.frameWidth && previewFrame.frameHeight
              ? "max-h-full"
              : "size-full",
          )}
          style={
            previewFrame.frameWidth && previewFrame.frameHeight
              ? {
                  aspectRatio: `${previewFrame.frameWidth} / ${previewFrame.frameHeight}`,
                  width: previewFrame.displayWidth ?? "100%",
                }
              : undefined
          }
        >
          <img
            src={imageUrl}
            alt=""
            className="absolute top-1/2 left-1/2 max-w-none [image-rendering:pixelated]"
            style={{
              height: `${previewFrame.rows * 100}%`,
              transform: `translate(-${((previewFrame.column + 0.5) / previewFrame.columns) * 100}%, -${((previewFrame.row + 0.5) / previewFrame.rows) * 100}%) translateX(${previewFrame.offsetX ?? 0}px)`,
            }}
          />
        </div>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="max-h-full max-w-full object-contain p-4 [image-rendering:pixelated]"
          style={
            previewOffset || previewScale !== undefined
              ? {
                  transform: `translate(${previewOffset?.x ?? "0"}, ${previewOffset?.y ?? "0"}) scale(${previewScale ?? 1})`,
                }
              : undefined
          }
        />
      ) : (
        <div className="grid size-16 grid-cols-4 grid-rows-4 gap-1 rounded-md border bg-white/70 p-2">
          {Array.from({ length: 16 }).map((_, index) => (
            <span
              key={index}
              className={cn(
                "rounded-[2px]",
                index % 3 === 0
                  ? accentClassName
                  : index % 2 === 0
                    ? "bg-muted"
                    : "bg-card",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
