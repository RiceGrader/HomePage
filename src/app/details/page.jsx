"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Details() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'rice'; // Default to rice if no type specified
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [generating, setGenerating] = useState(false);
    const pdfContentRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Determine which API to call based on the type
                const endpoint = type === 'rice' 
                    ? `/api/getsinglericedata?id=${id}`
                    : `/api/getsingledaldata?id=${id}`;
                    
                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${type} data`);
                }
                const data = await response.json();
                setItemData(data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        }
        
        if (id) {
            fetchData();
        }
    }, [id, type]);

    const generateClientPDF = async () => {
        if (!pdfContentRef.current) {
            console.error("PDF content ref is not available.");
            return;
        }
        setGenerating(true);
        try {
            const canvas = await html2canvas(pdfContentRef.current, {
                 scale: 2,
                 useCORS: true
            });
            const imgData = canvas.toDataURL('image/png');
            
            // Calculate dimensions: A4 size in points (210mm x 297mm)
            // 1 point = 1/72 inch. 1 inch = 25.4 mm
            // A4 width = 210mm * (72 / 25.4) = 595.27 points
            // A4 height = 297mm * (72 / 25.4) = 841.89 points
            const pdfWidth = 595.27;
            const pdfHeight = 841.89;

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            
            // Calculate the aspect ratio
            const ratio = imgWidth / imgHeight;
            
            let newImgWidth = pdfWidth - 20;
            let newImgHeight = newImgWidth / ratio;

            // If the image height is still too large for the page, adjust based on height
            if (newImgHeight > pdfHeight - 20) {
                newImgHeight = pdfHeight - 20;
                newImgWidth = newImgHeight * ratio;
            }
            
            const pdf = new jsPDF('p', 'pt', 'a4');
            const positionX = (pdfWidth - newImgWidth) / 2;
            const positionY = 10;

            pdf.addImage(imgData, 'PNG', positionX, positionY, newImgWidth, newImgHeight);
            pdf.save(`${type}_analysis_${id}.pdf`);
        } catch (err) {
            console.error('Error generating PDF:', err);
            alert('Error generating PDF: ' + err.message);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!itemData) return <div>No data found</div>;

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch {
            return 'N/A';
        }
    };

    return(
        <>
        <div ref={pdfContentRef}
         style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', backgroundColor: 'white' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                {type === 'rice' ? 'Rice' : 'Dal'} Analysis Report
            </h1>
            
            <div style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Basic Information</h2>
                <div>
                    <p><b>ID:</b> {itemData._id}</p>
                    <p><b>Device ID:</b> {itemData.device_id}</p>
                    <p><b>Timestamp:</b> {itemData.timestamp}</p>
                    <p><b>Created:</b> {formatDate(itemData.created_at)}</p>
                </div>
            </div>
            
            <div style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Analysis Results</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px' }}>
                    <div>
                        <p><b>Total Objects:</b> {itemData.total_objects}</p>
                        <p><b>Full Grains:</b> {itemData.full_grain_count}</p>
                        <p><b>Broken Grains:</b> {itemData.broken_grain_count}</p>
                        
                        {itemData.broken_percentages && (
                            <div style={{ marginTop: '10px' }}>
                                <p><b>Broken Percentages:</b></p>
                                <ul style={{ marginLeft: '20px', listStyleType: 'disc' }}>
                                    {Object.entries(itemData.broken_percentages).map(([key, value]) => (
                                        <li key={key}>{key}: {value}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    {type === 'rice' && (
                        <div>
                            <p><b>Chalky Count:</b> {itemData.chalky_count}</p>
                            <p><b>Black Count:</b> {itemData.black_count}</p>
                            <p><b>Yellow Count:</b> {itemData.yellow_count}</p>
                            <p><b>Brown Count:</b> {itemData.brown_count}</p>
                            <p><b>Stone Count:</b> {itemData.stone_count}</p>
                            <p><b>Husk Count:</b> {itemData.husk_count}</p>
                        </div>
                    )}
                </div>
            </div>
            
            
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
                <button
                    onClick={generateClientPDF}
                    disabled={generating}
                    style={{
                        backgroundColor: generating ? '#8bc34a' : '#4caf50',
                        color: 'white',
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: generating ? 'not-allowed' : 'pointer'
                    }}
                    >
                    {generating ? 'Generating PDF...' : 'Download PDF Report'}
                </button>
                
                <a 
                    href="/"
                    style={{
                        backgroundColor: '#2196f3',
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        display: 'inline-block'
                    }}
                    >
                    Back to Dashboard
                </a>
            </div>  
                    </>
    )
}