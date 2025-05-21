"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { format } from 'date-fns';
export default function Home() {
  const [grainData, setGrainData] = useState([]);
  const [dalData, setDalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('rice'); // 'rice' or 'dal'

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch rice data
        const riceResponse = await fetch('/api/getricedata');
        if (!riceResponse.ok) {
          throw new Error('Failed to fetch rice data');
        }
        const riceData = await riceResponse.json();
        setGrainData(riceData.data);
        
        // Fetch dal data
        const dalResponse = await fetch('/api/getdaldata');
        if (!dalResponse.ok) {
          throw new Error('Failed to fetch dal data');
        }
        const dalData = await dalResponse.json();
        setDalData(dalData.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatTimestamp = (timestamp) => {
    // Parse timestamp in format "20250516_150253_826037"
    if (!timestamp) return 'N/A';
    
    try {
      const year = timestamp.substring(0, 4);
      const month = timestamp.substring(4, 6);
      const day = timestamp.substring(6, 8);
      const hour = timestamp.substring(9, 11);
      const minute = timestamp.substring(11, 13);
      const second = timestamp.substring(13, 15);
      
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    } catch (e) {
      return timestamp;
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
    } catch {
      return 'N/A';
    }
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          dataType: activeTab // Include the active tab to generate appropriate report
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      const data = await response.json();
      
      // Open PDF in a new tab
      window.open(data.pdfUrl, '_blank');
    } catch (err) {
      alert('Error generating PDF: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="container mx-auto p-4"><p>Loading...</p></div>;
  if (error) return <div className="container mx-auto p-4"><p>Error: {error}</p></div>;

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Grain Quality Analysis</title>
        <meta name="description" content="Grain quality analysis dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold mb-6">Grain Quality Analysis Dashboard</h1>
        
        <div className="mb-6 bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Generate Report</h2>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End Date</label>
              <input
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded p-2"
              />
            </div>
            {/* <div className="flex items-end">
              <button
                onClick={generatePDF}
                disabled={generating}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {generating ? 'Generating...' : 'Generate PDF Report'}
              </button>
            </div> */}
          </div>
        </div>
        
        {/* Tab navigation */}
        <div className="mb-4 border-b">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                className={`inline-block p-4 ${activeTab === 'rice' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab('rice')}
              >
                Rice Analysis
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 ${activeTab === 'dal' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'hover:text-gray-600 hover:border-gray-300'}`}
                onClick={() => setActiveTab('dal')}
              >
                Dal Analysis
              </button>
            </li>
          </ul>
        </div>
        
        {activeTab === 'rice' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 border text-left">Date and Time</th>
                  <th className="py-2 px-3 border text-left">Device ID</th>
                  <th className="py-2 px-3 border text-left">Get Info</th>
                </tr>
              </thead>
              <tbody>
                {grainData.map((data) => (
                  <tr key={data._id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 border">{formatDate(data.created_at)}</td>
                    <td className="py-2 px-3 border">{data.device_id}</td>
                    <td className="py-2 px-3 border">
                      <Link href={`/details?id=${data._id}&type=rice`} className="text-blue-500 hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'dal' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 border text-left">Date and Time</th>
                  <th className="py-2 px-3 border text-left">Device ID</th>
                  <th className="py-2 px-3 border text-left">Get Info</th>
                </tr>
              </thead>
              <tbody>
                {dalData.map((data) => (
                  <tr key={data._id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 border">{formatDate(data.created_at)}</td>
                    <td className="py-2 px-3 border">{data.device_id}</td>
                    <td className="py-2 px-3 border">
                      <Link href={`/details?id=${data._id}&type=dal`} className="text-blue-500 hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="fixed top-[-250%] left-[-250%] border ">
              hello<br/>
              hello<br/>
              hello<br/>
              hello<br/>
              hello<br/>
        </div>
      </main>
    </div>
  );
}
