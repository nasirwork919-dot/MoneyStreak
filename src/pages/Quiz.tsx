import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Quiz() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Quiz</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">Quiz content will be implemented here.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}