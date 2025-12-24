import React from 'react';
import { useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import ProductImageCarousel from '../products/ProductImageCarousel';

interface ProductsTabProps { }

const ProductsTab: React.FC<ProductsTabProps> = () => {
    const products = useAppSelector((state: RootState) => state.products.products);
    return (
        <div style={{ padding: '1rem' }}>
            <h2>Products</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginTop: '1rem'
            }}>
                {products.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888', padding: '2rem' }}>
                        No products found
                    </div>
                ) : (
                    products.map((product: any, index: number) => (
                        <div key={product.id || index} style={{
                            background: '#fff',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb',
                            opacity: product.inStock ? 1 : 0.6,
                            filter: product.inStock ? 'none' : 'grayscale(50%)'
                        }}>
                            {/* Product Image Carousel */}
                            {product.buffalo_images && product.buffalo_images.length > 0 && (
                                <ProductImageCarousel
                                    images={product.buffalo_images}
                                    breed={product.breed}
                                    inStock={product.inStock}
                                />
                            )}

                            {/* Product Details */}
                            <div style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#111' }}>
                                        {product.breed}
                                    </h3>
                                    <span style={{
                                        background: product.inStock ? '#10b981' : '#dc2626',
                                        color: 'white',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: '500'
                                    }}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>

                                <div style={{ marginBottom: '0.75rem' }}>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                                        <strong>Age:</strong> {product.age} years
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>
                                        <strong>Location:</strong> {product.location}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        <strong>ID:</strong> {product.id}
                                    </div>
                                </div>

                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#374151',
                                    lineHeight: '1.4',
                                    margin: '0 0 1rem 0',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {product.description}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111' }}>
                                            ₹{product.price?.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            Insurance: ₹{product.insurance?.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductsTab;
