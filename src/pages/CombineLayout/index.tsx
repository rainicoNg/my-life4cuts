import ActionButton from "@/components/ActionButton";
import LayoutGrid from "@/components/LayoutGrid";
// import { getAspectRatio } from "@/utils/helper";
import { type ChangeEvent, useState } from "react";

const CombineLayout = () => {
  const [finalImageSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 2268,
    height: 4032,
  });
  const [layout] = useState<{ row: number; col: number }>({
    row: 2,
    col: 2,
  });
  const [selectedImgs, setSelectedImgs] = useState<string[][]>(
    Array.from({ length: layout.row }, () => Array(layout.col).fill(""))
  );
  // const fileInputRefs = useRef<(HTMLInputElement | null)[][]>(
  //   Array.from({ length: layout.row }, () => Array(layout.col).fill(null))
  // );

  const handleImageUpload =
    (row: number, col: number) => (event: ChangeEvent<HTMLInputElement>) => {
      console.log("logs event", event.target.files?.[0]);
      const img = event.target.files?.[0];
      if (img && img.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImgs = [...selectedImgs];
          newImgs[row][col] = e.target?.result as string;
          setSelectedImgs(newImgs);
        };
        reader.readAsDataURL(img);
      }
    };

  const handleDownloadImg = async (
    width = finalImageSize.width,
    height = finalImageSize.height
  ) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    const loadImg = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    const cropAndDrawImage = (
      img: HTMLImageElement,
      x: number,
      y: number,
      targetWidth: number,
      targetHeight: number
    ) => {
      const targetAspectRatio = targetWidth / targetHeight;
      const srcAspectRatio = img.width / img.height;

      let srcX = 0,
        srcY = 0,
        srcHeight = img.height,
        srcWidth = img.width;

      if (srcAspectRatio > targetAspectRatio) {
        srcWidth = img.height * targetAspectRatio;
        srcX = (img.width - srcWidth) / 2;
      } else {
        srcHeight = img.width / targetAspectRatio;
        srcY = (img.height - srcHeight) / 2;
      }

      const r = Math.floor(Math.random() * 9);
      console.log("los r", r);
      ctx.fillStyle = `#${r}ff`;
      ctx.fillRect(x, y, targetWidth, targetHeight);
      ctx.drawImage(
        img,
        srcX,
        srcY,
        srcWidth,
        srcHeight,
        x,
        y,
        targetWidth,
        targetHeight
      );
    };

    try {
      for (let row = 0; row < layout.row; row++) {
        for (let col = 0; col < layout.col; col++) {
          const imgSrc = selectedImgs[row][col];

          if (imgSrc) {
            await loadImg(imgSrc).then((img) => {
              cropAndDrawImage(
                img,
                (width / layout.col) * col,
                (height / layout.row) * row,
                width / layout.col,
                height / layout.row
              );
            });
          }
        }
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `styled-img-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      console.error("logs err", error);
    }
  };

  /*
  const gridAspectRatio = useCallback(
    () =>
      getAspectRatio(
        finalImageSize.width / layout.row,
        finalImageSize.height / layout.col
      ),
    [finalImageSize.width, finalImageSize.height, layout.row, layout.col]
  );
  */

  const LayoutGridBoxTemp = () => {
    const gridStyle = `grid grid-cols-2 gap-px aspect-9/16 portrait:w-9/10 landscape:h-9/10`;
    const aspectRatio = `aspect-9/16`;
    return (
      <div className={gridStyle}>
        {Array.from({ length: layout.row }).map((_, row) =>
          Array.from({ length: layout.col }).map((_, col) => (
            <LayoutGrid
              key={`${row}-${col}`}
              position={{ row, col }}
              content={selectedImgs[row][col]}
              onUpload={handleImageUpload(row, col)}
              className={aspectRatio}
            />
          ))
        )}
      </div>
    );
  };

  /* dynamic grid wip
  const LayoutGridBox = () => {
    const gridStyle = `grid grid-cols-${
      layout.col
    } grid-cols-[200px_minmax(900px,_1fr)_100px]  gap-px aspect-${getAspectRatio(
      finalImageSize.width,
      finalImageSize.height
    )} portrait:w-4/5 landscape:h-4/5`;
    const flexStyle = `flex flex-col items-center aspect-${getAspectRatio(
      finalImageSize.width,
      finalImageSize.height
    )} portrait:w-4/5 landscape:h-4/5`;
    const aspectRatio = `aspect-${gridAspectRatio()}`;
    return (
      <div className={gridStyle}>
        {Array.from({ length: layout.row }).map((_, row) =>
          Array.from({ length: layout.col }).map((_, col) => (
            <LayoutGrid
              key={`${row}-${col}`}
              position={{ row, col }}
              content={selectedImgs[row][col]}
              onUpload={handleImageUpload(row, col)}
              className={aspectRatio}
            />
          ))
        )}
      </div>
    );
  };
  */

  return (
    <div className="w-full h-full">
      <div className="h-full flex flex-col items-center gap-4">
        <LayoutGridBoxTemp />

        {selectedImgs.flat().some((img) => img) && (
          <ActionButton
            onClick={async () => {
              await handleDownloadImg();
            }}
            label="Download"
          />
        )}
      </div>
    </div>
  );
};

export default CombineLayout;
