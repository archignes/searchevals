import React, { useState } from 'react';
import { useRouter } from 'next/router';

type ImageDisplayProps = {
    images: string[];
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const { pathname } = useRouter();

    return (
        <div className={`grid ${pathname === "/" || images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4 justify-items-center`}>
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt=""
                    className={`${pathname !== "/" && images.length === 1 ? 'w-full md:w-3/4' : 'w-full'} h-auto cursor-pointer border shadow`}
                    onClick={() => handleImageClick(image)}
                />
            ))}
            {selectedImage && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <img src={selectedImage} alt="" className="max-h-screen max-w-full" onClick={() => setSelectedImage(null)} />
                </div>
            )}
        </div>
    );
};

export default ImageDisplay;
