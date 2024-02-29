import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { imageItem } from './DataContext';

type ImageDisplayProps = {
    images: imageItem[];
    type?: 'solo';
    className?: string;
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, type, className }) => {
    const [selectedImage, setSelectedImage] = useState<{ url: string; caption?: string; annotated?: boolean } | null>(null);

    const handleImageClick = (image: { url: string; caption?: string; annotated?: boolean }) => {
        setSelectedImage(image);
    };

    const { pathname } = useRouter();

    return (
        <div className={`grid ${type === 'solo' ? 'grid-cols-1' : (pathname === "/" || images.length > 1) ? 'grid-cols-2' : 'grid-cols-1'} gap-4 justify-items-center ${className}`}>
            {images.map((image, index) => (
                <div key={index} className="text-center">
                    {image.annotated && (
                        <div className="flex items-center mx-auto w-2/3 m-1 text-center text-sm text-red-500 mt-2">
                            <span className="inline-flex mr-2"><ExclamationTriangleIcon /></span>
                            <span>This image appears to contain annotation.</span>
                        </div>
                    )}
                    <img
                        src={image.url}
                        alt={image.caption} // Assuming you want to use the caption as alt text for accessibility
                        className={`${pathname !== "/" && images.length === 1 ? 'w-full md:w-3/4 mx-auto' : 'w-full'} h-auto cursor-pointer border shadow`}
                        onClick={() => handleImageClick(image)}
                    />
                    {image.caption && (
                        <div className="text-sm mt-2">{image.caption}</div>
                    )}
                </div>
            ))}
            {selectedImage && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <img src={selectedImage.url} alt={selectedImage.caption} className="max-h-screen max-w-full" onClick={() => setSelectedImage(null)} />
                    {selectedImage.caption && (
                        <div className="absolute bottom-10 text-white text-lg">{selectedImage.caption}</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageDisplay;