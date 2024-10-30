"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    walletAddress: "",
    amount: "",
  });

  const generateDialectLink = () => {
    if (!formData.walletAddress || !formData.amount) return "";
    
    const baseUrl = "https://dial.to/?action=solana-action:";
    const apiEndpoint = `${window.location.origin}/api/actions/transfer`;
    return `${baseUrl}${apiEndpoint}?to=${encodeURIComponent(formData.walletAddress)}&amount=${encodeURIComponent(formData.amount)}`;
  };

  const copyToClipboard = async () => {
    const link = generateDialectLink();
    if (!link) {
      alert("Please fill in all fields!");
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Create Payment Link</h1>
          <p className="text-gray-600">
            Generate shareable payment links for your blockchain transactions
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4 bg-white p-6 rounded-lg shadow">
          {/* Wallet Address Input */}
          <div className="space-y-2">
            <label 
              htmlFor="wallet"
              className="block text-sm font-medium text-gray-700"
            >
              Recipient Wallet Address
            </label>
            <input
              id="wallet"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter wallet address (0x...)"
              value={formData.walletAddress}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                walletAddress: e.target.value
              }))}
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label 
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              id="amount"
              type="number"
              step="0.000001"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                amount: e.target.value
              }))}
            />
          </div>

          {/* Generated Link */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Payment Link
            </label>
            <div className="flex gap-2">
              <input
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                value={generateDialectLink()}
                placeholder="Fill in the fields above to generate link"
              />
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                title="Copy to clipboard"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Preview */}
          {generateDialectLink() && (
            <div className="space-y-2 mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Preview
              </label>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={generateDialectLink()}
                  className="w-full h-[400px]"
                  title="Payment Link Preview"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}