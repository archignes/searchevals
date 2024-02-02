import React, { useState } from 'react';

type ImageDisplayProps = {
    images: string[];
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt=""
                    className="w-full h-auto cursor-pointer border shadow"
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
