import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileVideo, AlertCircle, Share2, RefreshCw, Download, Clock, Mail, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface ProcessResponse {
  id: string;
  filename: string;
  originalSize: number;
  newSize?: number;
  estimatedNewSize?: number;
  reductionPercentage?: number;
  estimatedReductionPercentage?: number;
  expiresAt: string;
  compressionTime?: number;
  emailNotification?: boolean;
  email?: string;
  status: 'processing' | 'completed' | 'expired';
}

interface StoredVideo {
  id: string;
  filename: string;
  originalSize: number;
  newSize?: number;
  estimatedNewSize?: number;
  reductionPercentage?: number;
  estimatedReductionPercentage?: number;
  expiresAt: string;
  compressionTime?: number;
  storedAt: number;
  emailNotification?: boolean;
  email?: string;
  status: 'processing' | 'completed' | 'expired';
}

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? `http://${window.location.hostname}:5000` 
  : '';

const API_KEY = 'wetrbctyrt23r672429346b8cw9b8erywueyr7123647326489bc18yw89eucr9b1287346bc1ywuerbqwyueirybcqy98r761b237489656231892erbcw89biuo12u3468sdgn01298nc8n1ndi2n8u1nw9dn3717nspskfnw9731n0237461928ubc762yuebcqiwub127934';

const STORAGE_KEY = 'compressed_videos';
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
const MAX_HISTORY_ITEMS = 10;

const VideoCompressor = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [targetSize, setTargetSize] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [storedVideos, setStoredVideos] = useState<StoredVideo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [originalSize, setOriginalSize] = useState<number>(0);

  useEffect(() => {
    const loadStoredVideos = async () => {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        try {
          const videos = JSON.parse(storedData) as StoredVideo[];
          const now = Date.now();
          
          const updatedVideos = await Promise.all(
            videos.map(async (video) => {
              if (video.status === 'processing') {
                try {
                  const response = await fetch(`${API_BASE_URL}/video-status/${video.id}`, {
                    headers: {
                      'Authorization': `Bearer ${API_KEY}`
                    }
                  });
                  if (response.ok) {
                    const status = await response.json();
                    return {
                      ...video,
                      ...status,
                      storedAt: video.storedAt
                    };
                  }
                } catch (err) {
                  console.error('Error updating video status:', err);
                }
              }
              return video;
            })
          );

          const validVideos = updatedVideos
            .filter(video => {
              const expiresAt = new Date(video.expiresAt).getTime();
              return expiresAt > now;
            })
            .sort((a, b) => b.storedAt - a.storedAt)
            .slice(0, MAX_HISTORY_ITEMS);
          
          setStoredVideos(validVideos);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(validVideos));
        } catch (err) {
          console.error('Error parsing stored videos:', err);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    };
    
    loadStoredVideos();
    const interval = setInterval(loadStoredVideos, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }
      setFile(selectedFile);
      setError(null);
      
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      setOriginalSize(fileSizeMB);
      setTargetSize(Math.floor(fileSizeMB * 0.5));
    }
  };

  const storeVideo = (video: ProcessResponse) => {
    const storedVideo: StoredVideo = {
      ...video,
      storedAt: Date.now()
    };
    
    const updatedVideos = [storedVideo, ...storedVideos]
      .sort((a, b) => b.storedAt - a.storedAt)
      .slice(0, MAX_HISTORY_ITEMS);
    
    setStoredVideos(updatedVideos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVideos));
    
    return storedVideo;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a video file');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the Terms of Service and Privacy Policy');
      return;
    }

    if (targetSize >= originalSize) {
      setError(`Target size must be smaller than the original file size (${originalSize.toFixed(2)} MB)`);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('targetSize', targetSize.toString());

    try {
      const xhr = new XMLHttpRequest();
      let lastProgress = 0;
      let startTime = Date.now();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const currentTime = Date.now();
          const elapsedTime = currentTime - startTime;
          const rawProgress = (event.loaded / event.total) * 100;
          
          const smoothProgress = Math.min(
            lastProgress + (elapsedTime / 5000) * (rawProgress - lastProgress),
            rawProgress
          );
          
          const displayProgress = Number(smoothProgress.toFixed(2));
          
          setUploadProgress(displayProgress);
          lastProgress = displayProgress;

          if (displayProgress >= 100) {
            setShowEmailInput(true);
          }
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(100);
          } else {
            setIsUploading(false);
            setError('Upload failed. Please try again.');
          }
        }
      };

      xhr.open('POST', `${API_BASE_URL}/process-video`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${API_KEY}`);
      xhr.send(formData);
    } catch (error) {
      setIsUploading(false);
      setError('Upload failed. Please try again.');
    }
  };

  const processVideo = async (useEmail: boolean) => {
    if (!file) return;
    
    setShowEmailInput(false);
    
    const formData = new FormData();
    formData.append('video', file);
    formData.append('targetSize', targetSize.toString());
    
    if (useEmail && email) {
      formData.append('email', email);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/process-video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to process video');
      }

      const responseData = await response.json();
      const storedVideo = storeVideo(responseData);

      if (useEmail) {
        navigate('/processing-email', { 
          state: { 
            email, 
            videoId: storedVideo.id 
          } 
        });
      } else {
        navigate(`/download/${storedVideo.id}`);
      }
    } catch (err) {
      setError('Failed to process video. Please try again.');
    } finally {
      setIsUploading(false);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <>
      <Helmet>
        <title>Free Online Video Compressor - Reduce Video Size</title>
        <meta name="description" content="Compress your videos online for free while maintaining quality. Perfect for social media, email sharing, and more. Fast, secure, and easy to use." />
        <meta name="keywords" content="video compressor, compress video online, reduce video size, video optimization, free video compressor" />
        <meta property="og:title" content="Free Online Video Compressor - Reduce Video Size" />
        <meta property="og:description" content="Compress your videos online for free while maintaining quality. Perfect for social media, email sharing, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rsizevideo.com" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2WSX5R6S63"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2WSX5R6S63');
          `}
        </script>
      </Helmet>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Video Size Reducer</h1>
            <p className="text-gray-400 text-lg">Reduce your video size while maintaining quality</p>
          </div>

          <div className="bg-[#242938] rounded-lg shadow-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div 
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*"
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  {file ? (
                    <FileVideo className="w-16 h-16 text-blue-500 mb-4" />
                  ) : (
                    <Upload className="w-16 h-16 text-gray-400 mb-4" />
                  )}
                  <p className="text-lg text-gray-300 mb-2">
                    {file ? file.name : 'Drag your video here or click to select'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Compatible with all major video formats
                  </p>
                  {file && (
                    <p className="text-sm text-blue-400 mt-2">
                      Size: {formatFileSize(file.size)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="targetSize" className="block text-sm font-medium text-gray-300 mb-2">
                  Target Size (MB)
                </label>
                <input
                  type="number"
                  id="targetSize"
                  value={targetSize}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value < originalSize) {
                      setTargetSize(value);
                    }
                  }}
                  className="block w-full bg-[#1a1f2e] text-white rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  max={originalSize}
                  step="0.1"
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-300">
                    I accept the <Link to="/terms" className="text-blue-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <p className="ml-3 text-sm text-red-300">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!file || isUploading || !termsAccepted}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  (!file || isUploading || !termsAccepted) && 'opacity-50 cursor-not-allowed'
                }`}
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Uploading {uploadProgress.toFixed(2)}%
                  </>
                ) : (
                  'Upload Video'
                )}
              </button>
            </form>
          </div>

          {showEmailInput && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-[#242938] rounded-lg shadow-xl p-6 max-w-md w-full">
                <h2 className="text-xl font-bold text-white mb-4">Get Email Notification</h2>
                <p className="text-gray-300 mb-6">
                  Would you like to receive an email when your video is compressed? 
                  This way you can close the browser and we'll notify you when it's ready.
                </p>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="block w-full bg-[#1a1f2e] text-white rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => processVideo(true)}
                    className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={!email.includes('@')}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Notify Me
                  </button>
                  <button
                    onClick={() => processVideo(false)}
                    className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Continue Without Email
                  </button>
                </div>
              </div>
            </div>
          )}

          {storedVideos.length > 0 && (
            <div className="mt-8 bg-[#242938] rounded-lg shadow-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Compressions</h2>
              <div className="space-y-4">
                {storedVideos.map((video, index) => (
                  <div key={index} className="bg-[#1a1f2e] p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{video.filename}</p>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {video.status === 'processing' ? (
                            video.email ? 
                              `Processing - Will notify ${video.email}` :
                              'Processing...'
                          ) : (
                            `Expires: ${new Date(video.expiresAt).toLocaleDateString()}`
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {video.status === 'processing' ? (
                        <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                      ) : (
                        <Link
                          to={`/download/${video.id}`}
                          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          <Share2 className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoCompressor;