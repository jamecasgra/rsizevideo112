import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "How does the video compression work?",
      answer: "Our video compressor uses advanced algorithms to reduce video file size while maintaining the best possible quality. It optimizes various aspects like bitrate, resolution, and encoding settings to achieve efficient compression."
    },
    {
      question: "Is there a file size limit?",
      answer: "Yes, the maximum file size for upload is 2GB. For larger files, we recommend splitting the video into smaller segments."
    },
    {
      question: "What video formats are supported?",
      answer: "We support most popular video formats including MP4, AVI, MOV, WMV, FLV, and MKV. The output will be in MP4 format for maximum compatibility."
    },
    {
      question: "Is my video data secure?",
      answer: "Yes, we take security seriously. Your videos are processed securely on our servers and automatically deleted after processing. We don't store or share your video content."
    },
    {
      question: "How long does compression take?",
      answer: "Compression time depends on the video size, length, and your internet connection. Most videos are processed within a few minutes."
    },
    {
      question: "Will compression affect video quality?",
      answer: "Our compression algorithm aims to maintain the best possible quality while reducing file size. While some quality reduction is inevitable during compression, we optimize for the best balance between size and quality."
    },
    {
      question: "Is this service free?",
      answer: "Yes, our basic video compression service is completely free. We maintain the service through non-intrusive advertisements."
    },
    {
      question: "Can I compress multiple videos at once?",
      answer: "Currently, we support processing one video at a time to ensure the best performance and quality for each compression."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-blue-400">{faq.question}</h2>
            <p className="text-gray-300">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;