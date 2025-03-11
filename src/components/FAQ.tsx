import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
      answer: "Yes, we take security seriously. Your videos are processed securely on our servers and automatically deleted after 24 hours. We don't store or share your video content."
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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <HelpCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4 text-white">Frequently Asked Questions</h1>
        <p className="text-gray-400 text-lg">Find answers to common questions about our video compression service</p>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`bg-[#242938] rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              onClick={() => toggleFaq(index)}
            >
              <h2 className="text-xl font-semibold text-blue-400">{faq.question}</h2>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-blue-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-400" />
              )}
            </button>
            
            <div 
              className={`px-6 pb-4 transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <p className="text-gray-300">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;