"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ArticleImage {
    url: string;
    alt: string;
    caption: string;
}

interface ArticleImageGalleryProps {
    images: ArticleImage[];
}

export function ArticleImageGallery({ images }: ArticleImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<ArticleImage | null>(null);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <>
            <div className="my-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    Article Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                            onClick={() => setSelectedImage(image)}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {image.caption && (
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-white text-xs line-clamp-2">{image.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Full-size image modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="h-8 w-8" />
                    </button>
                    <div className="max-w-6xl w-full">
                        <div className="relative aspect-video w-full">
                            <Image
                                src={selectedImage.url}
                                alt={selectedImage.alt}
                                fill
                                className="object-contain"
                            />
                        </div>
                        {selectedImage.caption && (
                            <p className="text-white text-center mt-4 text-lg">
                                {selectedImage.caption}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
