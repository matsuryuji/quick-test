import Image from "next/image";

function ImageGallery({
  images,
  mainImage,
  onSelect,
}: {
  images: string[];
  mainImage: string;
  onSelect: (img: string) => void;
}) {
  return (
    <div>
      <Image
        src={mainImage}
        alt="Produto"
        width={600}
        height={600}
        className="w-full h-auto rounded-xl object-contain"
      />
      <div className="flex space-x-2 mt-4">
        {images.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt={`Thumbnail ${idx}`}
            width={64}
            height={64}
            onClick={() => onSelect(img)}
            className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${
              mainImage === img ? "border-blue-500" : "border-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageGallery;
