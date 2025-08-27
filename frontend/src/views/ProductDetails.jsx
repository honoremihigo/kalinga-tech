import React, { useState, useEffect } from "react";
import {
  Cpu,
  HardDrive,
  Monitor,
  Zap,
  Calendar,
  Package,
  AlertCircle,
  Loader,
  Star,
  Eye,
} from "lucide-react";
import productService from "../Services/Dispatch/productService";
import { useParams } from "react-router-dom";

const ProductDetailsPage = () => {
  const {id:productId} = useParams();
    const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) {
      setError("Product ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const productData = await productService.getProductById(productId);

      if (!productData) {
        setError("Product not found");
      } else {
        setProduct(productData);
      }
    } catch (err) {
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProduct}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const allSpecs = [
    { icon: Cpu, label: "Processor", value: product.processor },
    { icon: Zap, label: "RAM", value: product.ram },
    { icon: HardDrive, label: "Storage", value: product.storage },
    { icon: Monitor, label: "Graphics Card", value: product.graphicsCard },
    { icon: Monitor, label: "Resolution", value: product.resolution },
    { icon: Package, label: "Brand", value: product.brand },
    { icon: Package, label: "Model", value: product.model },
    { icon: Calendar, label: "Date Added", value: productService.formatProductDate(product.createdAt) },
  ].filter(spec => spec.value); // Only show specs that have values

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Section */}
          <div className="space-y-6">
            <div className=" h-[500px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              {product.productImage && !imageError ? (
                <img
                  src={productService.getFileUrl(product.productImage)}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No image available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-8">
            {/* Product Header */}
            <div>
              <div className="mb-3">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {product.brand}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Added {productService.formatProductDate(product.createdAt)}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  Model: {product.model}
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">5.0</span>
                <span className="text-gray-400">(Based on specs)</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                About this product
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            {/* Quick Specs */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Key Features
              </h3>
              <div className="text-gray-700">
                {productService.getProductSpecs(product)}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications and Product Details Section */}
        {allSpecs.length > 0 && (
          <div className="mt-16">
            <div className="max-w-8xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Product Specifications & Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allSpecs.map((spec, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl flex-shrink-0">
                        <spec.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">
                          {spec.label}
                        </h4>
                        <p className="text-gray-600 break-words">{spec.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;