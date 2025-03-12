import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Share2, RefreshCw, Clock, AlertCircle } from 'lucide-react';

interface VideoData {
  id: string;
  filename: string;
  originalSize: number;
  newSize?: number;
  estimatedNewSize?: number;
  reductionPercentage?: number;
  estimatedReductionPercentage?: number;
  expiresAt: string;
  compressionTime?: number;
  status: 'processing' | 'completed' | 'expired';
  email?: string;
}

const API_KEY = 'wetrbctyrt23r672429346b8cw9b8erywueyr7123647326489bc18yw89eucr9b1287346bc1ywuerbqwyueirybcqy98r761b237489656231892erbcw89biuo12u3468sdgn01298nc8n1ndi2n8u1nw9dn3717nspskfnw9731n0237461928ubc762yuebcqiwub127934';

// Update API URLs to use absolute paths for development
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? `http://${window.location.hostname}:5000` 
  : '';

const DOWNLOAD_BASE_URL = process.env.NODE_ENV === 'development'
  ? `http://${window.location.hostname}:5001`
  : '';

const VideoDownload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkVideoStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/video-status/${id}`, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
        });

        if (!response.ok) {
          throw new Error('Video not found');
        }

        const data = await response.json();
        setVideoData({
          ...data,
          expiresAt: new Date(data.createdAt + 24 * 60 * 60 * 1000).toISOString()
        });

        // If video is still processing, continue checking
        if (data.status === 'processing') {
          setTimeout(checkVideoStatus, 5000); // Check every 5 seconds
        }
      } catch (err) {
        setError('Video not found or has expired');
      }
    };

    checkVideoStatus();
  }, [id]);

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    if (videoData) {
      const shareUrl = `${window.location.origin}/download/${videoData.id}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Download page link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const getDownloadUrl = () => {
    if (!videoData) return '';
    return `${DOWNLOAD_BASE_URL}/download-video/${videoData.id}/${videoData.filename}`;
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-[#242938] rounded-lg shadow-xl p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Video Not Found</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-[#242938] rounded-lg shadow-xl p-6 text-center">
          <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-white">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-[#242938] rounded-lg shadow-xl p-6 md:p-8">
        {videoData.status === 'processing' ? (
          <div className="text-center">
            <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-white mb-4">Processing Your Video</h2>
            <p className="text-gray-300 mb-6">
              We're working on compressing your video. This may take a few minutes.
              {videoData.email && (
                <span className="block mt-2">
                  We'll send you an email at <span className="text-blue-400">{videoData.email}</span> when it's ready.
                </span>
              )}
            </p>
            <div className="bg-[#1a1f2e] p-4 rounded-lg inline-block">
              <p className="text-gray-400 text-sm">Estimated Reduction</p>
              <p className="text-white text-lg font-semibold">
                {videoData.estimatedReductionPercentage}%
              </p>
            </div>
          </div>
        ) : videoData.status === 'expired' ? (
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Video Has Expired</h2>
            <p className="text-gray-300 mb-6">
              This video is no longer available. Videos expire after 24 hours.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Compress Another Video
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <svg className="w-32 h-32" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeDasharray={`${videoData.reductionPercentage || videoData.estimatedReductionPercentage || 0}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {videoData.reductionPercentage || videoData.estimatedReductionPercentage || 0}%
                  </span>
                </div>
              </div>
              <p className="text-blue-400 mt-2">Size Reduced</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#1a1f2e] p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Original Size</p>
                <p className="text-white text-lg font-semibold">
                  {formatFileSize(videoData.originalSize)}
                </p>
              </div>
              <div className="bg-[#1a1f2e] p-4 rounded-lg">
                <p className="text-gray-400 text-sm">New Size</p>
                <p className="text-white text-lg font-semibold">
                  {formatFileSize(videoData.newSize || videoData.estimatedNewSize || 0)}
                </p>
              </div>
              {videoData.compressionTime && (
                <div className="bg-[#1a1f2e] p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Processing Time</p>
                  <p className="text-white text-lg font-semibold">
                    {formatTime(videoData.compressionTime)}
                  </p>
                </div>
              )}
              <div className="bg-[#1a1f2e] p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Expires At</p>
                <p className="text-white text-lg font-semibold">
                  {new Date(videoData.expiresAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <a
                href={getDownloadUrl()}
                className="w-full flex justify-center items-center py-3 px-4 rounded-md text-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                download
              >
                <Download className="mr-2 h-5 w-5" />
                Download Compressed Video
              </a>
              
              <button
                onClick={handleShare}
                className="w-full flex justify-center items-center py-3 px-4 rounded-md text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Share2 className="mr-2 h-5 w-5" />
                Share Download Link
              </button>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full flex justify-center items-center py-3 px-4 mt-4 rounded-md text-lg font-medium text-white bg-gray-600 hover:bg-gray-700 transition-colors"
            >
              Compress Another Video
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoDownload;
