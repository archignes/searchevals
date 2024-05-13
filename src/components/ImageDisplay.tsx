import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { imageItem } from '@/src/types/evalItem';

type ImageDisplayProps = {
    images: imageItem[];
    type?: 'solo';
    className?: string;
    showWarnings?: boolean;
    evalUrl?: string;
    clickAction?: 'expandImage' | 'openEval';
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ images, type, className="", showWarnings = true, clickAction = 'expandImage', evalUrl }) => {
    const [selectedImage, setSelectedImage] = useState<{ url: string; caption?: string; annotated?: boolean } | null>(null);
    const { pathname } = useRouter();

    const handleImageClick = (image: { url: string; caption?: string; annotated?: boolean }) => {
        if (clickAction === 'expandImage') {
            setSelectedImage(image);
        } else if (clickAction === 'openEval') {
            return
        }
    };
    
    return (
        <div className={`${type === 'solo' || images.length <= 1 ? '' : 'grid grid-cols-2 gap-4'} ${className}`}>
            {images.map((image, index) => (
                <div key={index}>
                    {(image.annotated || image.extension_modified) && showWarnings && (
                        <div className="flex items-center mx-auto w-2/3 m-1 text-center text-sm text-red-500 mt-2">
                            <span className="inline-flex mr-2"><ExclamationTriangleIcon /></span>
                            {image.annotated && <span>This image appears to contain annotation.</span>}
                            {image.extension_modified && <span>This image appears include browser extension modifications.</span>}
                        </div>
                    )}
                    {evalUrl && clickAction === 'openEval' ? (
                        <Link href={evalUrl}>
                                <img
                                    src={image.url}
                                    alt={image.caption}
                                    className="cursor-pointer border shadow object-cover object-top overflow-hidden"
                                    onClick={() => handleImageClick(image)}
                                />
                        </Link>
                    ) : (
                    <img
                        src={image.url}
                        alt={image.caption} // Assuming you want to use the caption as alt text for accessibility
                        className={`${pathname !== "/" && images.length === 1 ? 'w-full md:w-3/4 mx-auto' : 'w-full'} h-auto cursor-pointer border shadow`}
                            onClick={() => handleImageClick(image)}
                        />
                    )}
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