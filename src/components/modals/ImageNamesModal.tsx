import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import { setProofModal } from '../../store/slices/uiSlice';

interface ImageNamesModalProps { }

const ImageNamesModal: React.FC<ImageNamesModalProps> = () => {
    const dispatch = useAppDispatch();
    const { isOpen, data } = useAppSelector((state: RootState) => state.ui.modals.proof);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onClose = () => {
        dispatch(setProofModal({ isOpen: false }));
    };

    if (!isOpen || !data) return null;

    const isImage = (key: string, value: any) => {
        if (typeof value !== 'string') return false;
        const lowerKey = key.toLowerCase();
        const lowerValue = value.toLowerCase();
        return (
            lowerKey.includes('image') ||
            lowerKey.includes('photo') ||
            lowerKey.includes('proof') ||
            lowerKey.includes('card') ||
            lowerValue.match(/\.(jpeg|jpg|png|gif|webp)(\?.*)?$/)
        );
    };

    const imageFields: [string, any][] = [];

    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            if (isImage(key, value)) {
                imageFields.push([key, value]);
            }
        });

        if (data.transaction && typeof data.transaction === 'object') {
            Object.entries(data.transaction).forEach(([key, value]) => {
                if (isImage(key, value)) {
                    imageFields.push([`Transaction: ${key} `, value]);
                }
            });
        }
    }

    const handleClose = () => {
        setViewingImage(null);
        setIsLoading(false);
        onClose();
    };

    const handleViewImage = (url: string) => {
        setViewingImage(url);
        setIsLoading(true);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }} onClick={handleClose}>
            <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '24px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                minHeight: viewingImage ? '500px' : 'auto',
                transition: 'min-height 0.3s ease'
            }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#666',
                        zIndex: 10
                    }}
                >
                    ×
                </button>

                {viewingImage ? (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '450px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                            View Document
                        </h3>

                        <div style={{
                            flex: 1,
                            overflow: 'auto',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            background: '#f3f4f6',
                            borderRadius: '4px',
                            marginBottom: '16px',
                            position: 'relative',
                            minHeight: '400px'
                        }}>
                            {isLoading && (
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <div className="spinner" style={{
                                        width: '40px',
                                        height: '40px',
                                        border: '4px solid #e5e7eb',
                                        borderTop: '4px solid #3b82f6',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }} />
                                    <span style={{ color: '#6b7280', fontSize: '14px' }}>Loading...</span>
                                    <style>{`
@keyframes spin {
    0 % { transform: rotate(0deg); }
    100 % { transform: rotate(360deg); }
}
`}</style>
                                </div>
                            )}
                            <img
                                src={viewingImage}
                                alt="ID Proof"
                                onLoad={() => setIsLoading(false)}
                                onError={() => setIsLoading(false)}
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    opacity: isLoading ? 0 : 1,
                                    transition: 'opacity 0.3s ease'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                onClick={() => setViewingImage(null)}
                                style={{
                                    padding: '8px 16px',
                                    background: '#f3f4f6',
                                    color: '#374151',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                &larr; Back to List
                            </button>
                            <a
                                href={viewingImage}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    padding: '8px 16px',
                                    background: '#2563eb',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 500,
                                    fontSize: '14px'
                                }}
                            >
                                Open Original
                            </a>
                        </div>
                    </div>
                ) : (
                    <>
                        <h3 style={{ marginTop: 0, marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                            Payment Proof Files: {data.name}
                        </h3>

                        {imageFields.length === 0 ? (
                            <p style={{ color: '#666', textAlign: 'center' }}>No Payment proof documents found.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {imageFields.map(([key, value]) => (
                                    <div key={key} style={{
                                        padding: '12px',
                                        background: '#f9fafb',
                                        borderRadius: '6px',
                                        border: '1px solid #e5e7eb',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                                            {key}
                                        </div>
                                        <button
                                            onClick={() => handleViewImage(String(value))}
                                            style={{
                                                fontSize: '12px',
                                                color: '#2563eb',
                                                textDecoration: 'underline',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0
                                            }}
                                        >
                                            View
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleClose}
                                style={{
                                    padding: '8px 16px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageNamesModal;
