'use client';
import React, { useState, useRef, useEffect } from "react";
import { Upload, Info } from "lucide-react";

export default function ImageCompare() {
    const [images, setImages] = useState({ image1: null, image2: null });
    const [preview, setPreview] = useState({ image1: null, image2: null });
    const [metadata, setMetadata] = useState({ image1: null, image2: null });
    const [diffUrl, setDiffUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [comparisonMode, setComparisonMode] = useState("slider"); // "slider", "fade", or "difference"
    const [fadeOpacity, setFadeOpacity] = useState(50);
    const [diffThreshold, setDiffThreshold] = useState(30);
    const [diffColor, setDiffColor] = useState("#ff0000"); // Red highlight color
    const [activeTab, setActiveTab] = useState("compare"); // "compare" or "details"
    const sliderContainerRef = useRef(null);
    const canvasRef = useRef(null);
    const isDragging = useRef(false);

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            const file = files[0];
            setImages((prev) => ({ ...prev, [name]: file }));
            setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
            extractMetadata(file, name);
        }
    };

    const extractMetadata = (file, imageName) => {
        // Create image element to get dimensions
        const img = new Image();
        img.onload = () => {
            const meta = {
                fileName: file.name,
                fileType: file.type,
                fileSize: formatFileSize(file.size),
                lastModified: new Date(file.lastModified).toLocaleString(),
                dimensions: {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                },
                aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(2),
            };
            
            setMetadata(prev => ({ ...prev, [imageName]: meta }));
            
            // Extract more detailed info using canvas
            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                const canvas = document.createElement('canvas');
                canvas.width = Math.min(img.naturalWidth, 50); // Small sample for performance
                canvas.height = Math.min(img.naturalHeight, 50);
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                try {
                    // Sample pixel to determine if image has alpha
                    const pixelData = ctx.getImageData(0, 0, 1, 1).data;
                    meta.format = pixelData[3] < 255 ? 'RGB with Alpha' : 'RGB';
                    meta.colorDepth = '8-bit'; // Assuming standard 8-bit per channel
                    
                    // Update metadata with these additional properties
                    setMetadata(prev => ({ ...prev, [imageName]: meta }));
                } catch (err) {
                    console.error("Error analyzing image:", err);
                }
            }
        };
        img.src = URL.createObjectURL(file);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    };

    const handleCompare = async () => {
        if (!images.image1 || !images.image2) {
            setError("Please upload both images");
            return;
        }

        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append("images", images.image1);
        formData.append("images", images.image2);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.error) {
                setError(data.error);
            } else {
                setDiffUrl(data.diffUrl);
            }
        } catch (err) {
            setError("Error processing images");
        } finally {
            setLoading(false);
        }
    };

    const generateDifferenceHighlight = () => {
        if (!preview.image1 || !preview.image2 || !canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Create image elements
        const img1 = new Image();
        const img2 = new Image();
        
        img1.onload = () => {
            img2.onload = () => {
                // Set canvas dimensions to match images
                canvas.width = img1.width;
                canvas.height = img1.height;
                
                // Draw first image
                ctx.drawImage(img1, 0, 0);
                
                // Get image data
                const img1Data = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Draw second image
                ctx.drawImage(img2, 0, 0);
                
                // Get image data for second image
                const img2Data = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Create output image data
                const diffData = ctx.createImageData(canvas.width, canvas.height);
                
                // Parse the diff color to RGB
                const r = parseInt(diffColor.slice(1, 3), 16);
                const g = parseInt(diffColor.slice(3, 5), 16);
                const b = parseInt(diffColor.slice(5, 7), 16);
                
                // Compare pixels and highlight differences
                for (let i = 0; i < img1Data.data.length; i += 4) {
                    // Calculate difference between corresponding pixels
                    const diff = Math.abs(img1Data.data[i] - img2Data.data[i]) +
                                Math.abs(img1Data.data[i + 1] - img2Data.data[i + 1]) +
                                Math.abs(img1Data.data[i + 2] - img2Data.data[i + 2]);
                    
                    // If difference is above threshold, highlight it
                    if (diff > diffThreshold * 3) { // Multiply by 3 because we're summing 3 channels
                        // Use the highlight color for different pixels
                        diffData.data[i] = r;
                        diffData.data[i + 1] = g;
                        diffData.data[i + 2] = b;
                        diffData.data[i + 3] = 255; // Full opacity
                    } else {
                        // Use the original image for similar pixels
                        diffData.data[i] = img1Data.data[i];
                        diffData.data[i + 1] = img1Data.data[i + 1];
                        diffData.data[i + 2] = img1Data.data[i + 2];
                        diffData.data[i + 3] = img1Data.data[i + 3];
                    }
                }
                
                // Put the resulting image data back on the canvas
                ctx.putImageData(diffData, 0, 0);
            };
            img2.src = preview.image2;
        };
        img1.src = preview.image1;
    };

    // Update difference highlight when images, threshold, or color changes
    useEffect(() => {
        if (comparisonMode === 'difference') {
            generateDifferenceHighlight();
        }
    }, [preview.image1, preview.image2, diffThreshold, diffColor, comparisonMode]);

    const handleSliderMove = (clientX) => {
        if (!sliderContainerRef.current || !isDragging.current) return;
        
        const containerRect = sliderContainerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const offsetX = clientX - containerRect.left;
        
        // Calculate position as percentage (0-100)
        let newPosition = (offsetX / containerWidth) * 100;
        
        // Constrain to 0-100 range
        newPosition = Math.max(0, Math.min(100, newPosition));
        
        setSliderPosition(newPosition);
    };

    const handleMouseDown = (e) => {
        isDragging.current = true;
        handleSliderMove(e.clientX);
    };

    const handleTouchStart = (e) => {
        isDragging.current = true;
        handleSliderMove(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            handleSliderMove(e.clientX);
        };

        const handleTouchMove = (e) => {
            handleSliderMove(e.touches[0].clientX);
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        if (isDragging.current) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging.current]);

    const hasImages = preview.image1 && preview.image2;

    return (
        <div className="flex flex-col items-center gap-6 p-6">
            <h1 className="text-2xl font-bold">Image Comparison Tool</h1>
            
            {/* Upload section */}
            <div className="flex flex-wrap gap-6 justify-center">
                {["image1", "image2"].map((name, index) => (
                    <div key={name} className="w-64 h-72 border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3 p-4 text-gray-500">
                        <h2 className="font-semibold">File {index + 1}</h2>
                        {preview[name] ? (
                            <img src={preview[name]} alt={`Preview ${index + 1}`} className="w-full h-40 object-cover rounded" />
                        ) : (
                            <Upload size={32} />
                        )}
                        <p>Upload an image to compare</p>
                        <input 
                            type="file" 
                            name={name} 
                            onChange={handleFileChange} 
                            className="hidden"
                            id={name}
                            accept="image/*"
                        />
                        <label htmlFor={name} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                            Select Image
                        </label>
                    </div>
                ))}
            </div>
            
            {/* <button 
                onClick={handleCompare} 
                className="bg-green-500 text-white px-6 py-2 rounded" 
                disabled={loading}
            >
                {loading ? "Processing..." : "Compare Images"}
            </button> */}
            
            {error && <p className="text-red-500">{error}</p>}
            
            {/* Tab Selection */}
            {hasImages && (
                <div className="w-full max-w-4xl">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("compare")}
                            className={`px-4 py-2 ${activeTab === "compare" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                        >
                            Compare
                        </button>
                        <button
                            onClick={() => setActiveTab("details")}
                            className={`px-4 py-2 flex items-center gap-1 ${activeTab === "details" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                        >
                            <Info size={16} />
                            Details
                        </button>
                    </div>
                    
                    {/* Comparison Tab Content */}
                    {activeTab === "compare" && (
                        <div className="w-full pt-4">
                            {/* Comparison Mode Selection */}
                            <div className="flex flex-wrap justify-center gap-4 mb-2">
                                <button
                                    onClick={() => setComparisonMode("slider")}
                                    className={`px-4 py-2 rounded ${comparisonMode === "slider" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                >
                                    Slider Mode
                                </button>
                                <button
                                    onClick={() => setComparisonMode("fade")}
                                    className={`px-4 py-2 rounded ${comparisonMode === "fade" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                >
                                    Fade Mode
                                </button>
                                <button
                                    onClick={() => setComparisonMode("difference")}
                                    className={`px-4 py-2 rounded ${comparisonMode === "difference" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                >
                                    Highlight Differences
                                </button>
                            </div>
                            
                            {/* Controls for different modes */}
                            {comparisonMode === "fade" && (
                                <div className="w-full flex items-center gap-2 my-2">
                                    <span className="text-sm">Image 1</span>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={fadeOpacity} 
                                        onChange={(e) => setFadeOpacity(parseInt(e.target.value))}
                                        className="flex-grow"
                                    />
                                    <span className="text-sm">Image 2</span>
                                </div>
                            )}

                            {comparisonMode === "difference" && (
                                <div className="w-full flex flex-col gap-2 my-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm w-24">Sensitivity:</span>
                                        <input 
                                            type="range" 
                                            min="5" 
                                            max="100" 
                                            value={diffThreshold} 
                                            onChange={(e) => setDiffThreshold(parseInt(e.target.value))}
                                            className="flex-grow"
                                        />
                                        <span className="text-sm w-12">{diffThreshold}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm w-24">Highlight Color:</span>
                                        <input 
                                            type="color" 
                                            value={diffColor} 
                                            onChange={(e) => setDiffColor(e.target.value)}
                                            className="w-12 h-8"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Image Comparison Display */}
                            <div 
                                ref={sliderContainerRef}
                                className="relative w-full h-80 overflow-hidden border rounded-lg bg-gray-100"
                            >
                                {/* Slider Mode */}
                                {comparisonMode === "slider" && (
                                    <>
                                        {/* First image (full width) */}
                                        <div className="absolute top-0 left-0 w-full h-full">
                                            <img src={preview.image1} alt="Image 1" className="w-full h-full object-contain" />
                                        </div>
                                        
                                        {/* Second image (clipped by slider) */}
                                        <div 
                                            className="absolute top-0 left-0 h-full overflow-hidden"
                                            style={{ width: `${sliderPosition}%` }}
                                        >
                                            <img 
                                                src={preview.image2} 
                                                alt="Image 2" 
                                                className="w-full h-full object-contain" 
                                                style={{ maxWidth: 'none', width: `${100 / (sliderPosition/100)}%` }} 
                                            />
                                        </div>
                                        
                                        {/* Slider handle */}
                                        <div 
                                            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                                            style={{ left: `${sliderPosition}%` }}
                                            onMouseDown={handleMouseDown}
                                            onTouchStart={handleTouchStart}
                                        >
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md border border-gray-300 flex items-center justify-center">
                                                <div className="w-4 text-gray-400 font-bold flex items-center justify-center">
                                                    ⇄
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                
                                {/* Fade Mode */}
                                {comparisonMode === "fade" && (
                                    <>
                                        {/* Base image (Image 1) */}
                                        <div className="absolute top-0 left-0 w-full h-full">
                                            <img src={preview.image1} alt="Image 1" className="w-full h-full object-contain" />
                                        </div>
                                        
                                        {/* Overlay image (Image 2) with opacity */}
                                        <div 
                                            className="absolute top-0 left-0 w-full h-full"
                                            style={{ opacity: fadeOpacity / 100 }}
                                        >
                                            <img src={preview.image2} alt="Image 2" className="w-full h-full object-contain" />
                                        </div>
                                    </>
                                )}
                                
                                {/* Difference Highlighting Mode */}
                                {comparisonMode === "difference" && (
                                    <canvas 
                                        ref={canvasRef} 
                                        className="w-full h-full object-contain"
                                    />
                                )}
                            </div>
                            
                            {/* Difference Image (if available) */}
                            {diffUrl && (
                                <div className="mt-6">
                                    <h2 className="text-lg font-bold mb-2">Server-generated Difference:</h2>
                                    <img src={diffUrl} alt="Difference" className="w-full max-w-md object-contain border rounded-lg" />
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Details Tab Content */}
                    {activeTab === "details" && (
                        <div className="w-full pt-4">
                            <div className="flex flex-col md:flex-row gap-6">
                                {["image1", "image2"].map((name, index) => (
                                    <div key={`meta-${name}`} className="flex-1 border rounded-lg p-4">
                                        <h2 className="text-lg font-bold mb-4">Image {index + 1} Details</h2>
                                        {metadata[name] ? (
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                {Object.entries({
                                                    "File type": metadata[name].fileType?.split('/')[1]?.toUpperCase() || 'Unknown',
                                                    "Size": metadata[name].fileSize,
                                                    "Height": `${metadata[name].dimensions?.height || 0}px`,
                                                    "Width": `${metadata[name].dimensions?.width || 0}px`,
                                                    "Vertical resolution": "120 dpi", // Placeholder - can't detect from browser
                                                    "Horizontal resolution": "120 dpi", // Placeholder - can't detect from browser
                                                    "Depth": metadata[name].colorDepth || "8-bit",
                                                    "Format": metadata[name].format || "RGB with Alpha",
                                                    "Filter": "Adaptive", // Placeholder - can't detect from browser
                                                    "Interlace": "Noninterlaced" // Placeholder - can't detect from browser
                                                }).map(([label, value]) => (
                                                    <React.Fragment key={`${name}-${label}`}>
                                                        <div className="text-gray-500">{label}</div>
                                                        <div className="text-right font-medium">{value}</div>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic">No image uploaded</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}