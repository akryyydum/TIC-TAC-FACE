import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs';

const ImageUploader = ({ onSelectImage, player }) => {
  const webcamRef = useRef(null);
  const [showCam, setShowCam] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [mediaSupported, setMediaSupported] = useState(true);
  const [loading, setLoading] = useState(false);
  const [faceDetected, setFaceDetected] = useState(null);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (
      typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.enumerateDevices === 'function'
    ) {
      navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
        const videoDevices = mediaDevices.filter((device) => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      });
    } else {
      setMediaSupported(false);
    }
  }, []);

  useEffect(() => {
    let interval;
    if (showCam && webcamRef.current) {
      // Start face detection polling
      interval = setInterval(async () => {
        const video = webcamRef.current.video;
        if (video && video.readyState === 4) {
          const net = await bodyPix.load();
          const segmentation = await net.segmentPerson(video, {
            internalResolution: 'low',
            segmentationThreshold: 0.7,
          });
          // If any pixel is foreground, assume face detected
          const detected = segmentation.data.some((v) => v === 1);
          setFaceDetected(detected);
        }
      }, 1000);
    } else {
      setFaceDetected(null);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showCam]);

  const capture = async () => {
    setLoading(true);
    const video = webcamRef.current.video;
    const width = video.videoWidth;
    const height = video.videoHeight;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const net = await bodyPix.load();

    const segmentation = await net.segmentPerson(video, {
      internalResolution: 'medium',
      segmentationThreshold: 0.7,
    });

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(video, 0, 0, width, height);

    const imageData = tempCtx.getImageData(0, 0, width, height);
    const data = imageData.data;

    segmentation.data.forEach((segment, i) => {
      if (segment === 0) {
        data[i * 4 + 3] = 0; // Set background alpha to 0
      }
    });

    ctx.putImageData(imageData, 0, 0);

    const finalImage = canvas.toDataURL('image/png');
    onSelectImage(finalImage);
    setCapturedImage(finalImage);
    setShowCam(false);
    setLoading(false);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const img = new window.Image();
      img.src = reader.result;
      img.onload = async () => {
        const width = img.width;
        const height = img.height;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const net = await bodyPix.load();
        const segmentation = await net.segmentPerson(img, {
          internalResolution: 'medium',
          segmentationThreshold: 0.7,
        });

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        segmentation.data.forEach((segment, i) => {
          if (segment === 0) {
            data[i * 4 + 3] = 0; // Set background alpha to 0
          }
        });
        ctx.putImageData(imageData, 0, 0);

        const finalImage = canvas.toDataURL('image/png');
        onSelectImage(finalImage);
        setCapturedImage(finalImage);
        setLoading(false);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '10px',
        width: '100%',
        maxWidth: 320,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        background: '#232e3a',
        borderRadius: 14,
        boxShadow: '0 2px 10px #0002',
        position: 'relative',
        animation: 'fadeInUp 0.7s'
      }}
    >
      {loading && (
        <div style={{
          position: 'absolute',
          zIndex: 10,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(34,46,57,0.92)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          animation: 'fadeIn 0.5s'
        }}>
          <div style={{
            color: '#2ec4b6',
            fontWeight: 700,
            fontSize: 18,
            marginBottom: 12,
            animation: 'popIn 0.6s'
          }}>
            Removing background...
          </div>
          <div style={{
            border: '4px solid #2ec4b6',
            borderTop: '4px solid #232e3a',
            borderRadius: '50%',
            width: 38,
            height: 38,
            animation: 'spin 1s linear infinite'
          }} />
          <style>
            {`
              @keyframes spin { 100% { transform: rotate(360deg); } }
              @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
              @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
            `}
          </style>
        </div>
      )}
      <p style={{
        fontWeight: 600,
        color: '#fff',
        fontSize: 16,
        margin: '10px 0 2px 0',
        letterSpacing: 0.5,
        animation: 'fadeInUp 0.7s'
      }}>
        {typeof player === 'string' ? player : `Player ${player}`}: Upload or Capture
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{
          marginBottom: 0,
          width: '100%',
          color: '#fff',
          background: '#222e39',
          border: '1px solid #2ec4b6',
          borderRadius: 8,
          padding: '7px 0 7px 7px',
          animation: 'fadeInUp 0.7s'
        }}
      />
      <button
        onClick={() => setShowCam(!showCam)}
        style={{
          margin: '8px 0',
          background: showCam ? '#ffbe3b' : '#2ec4b6',
          color: '#1a232c',
          border: 'none',
          borderRadius: 8,
          padding: '8px 18px',
          fontWeight: 700,
          fontSize: 15,
          cursor: 'pointer',
          width: '100%',
          transition: 'background 0.2s',
          animation: 'fadeInUp 0.7s'
        }}
      >
        {showCam ? 'Close Webcam' : 'Use Webcam'}
      </button>

      {!mediaSupported && (
        <div style={{
          color: '#ffbe3b',
          marginTop: 12,
          fontWeight: 500,
          fontSize: 14,
          textAlign: 'center',
          animation: 'fadeInUp 0.7s'
        }}>
          Camera not supported in this browser or connection.<br />
          Please use HTTPS and a supported browser.
        </div>
      )}

      {showCam && mediaSupported && (
        <div style={{
          marginTop: 10,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          animation: 'fadeInUp 0.7s'
        }}>
          {!isMobile && devices.length > 1 && (
            <select
              value={selectedDeviceId || ''}
              onChange={handleDeviceChange}
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: 8,
                border: '1px solid #2ec4b6',
                marginBottom: 6,
                background: '#222e39',
                color: '#fff'
              }}
            >
              {devices.map((device) => (
                <option value={device.deviceId} key={device.deviceId}>
                  {device.label || `Camera ${device.deviceId}`}
                </option>
              ))}
            </select>
          )}

          <Webcam
            ref={webcamRef}
            style={{
              width: '100%',
              maxWidth: '320px',
              borderRadius: '10px',
              marginTop: 4,
              height: 'auto',
              aspectRatio: '4/3',
              maxHeight: '60vw',
              background: '#111',
              animation: 'fadeInUp 0.7s'
            }}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
              facingMode: selectedDeviceId ? undefined : 'user',
              width: { ideal: 640 },
              height: { ideal: 480 },
            }}
          />
          {/* Face detected indicator */}
          {faceDetected === true && (
            <div style={{
              color: '#2ec4b6',
              fontWeight: 700,
              fontSize: 15,
              marginTop: 4,
              animation: 'popIn 0.5s'
            }}>
              😊 Face Detected
            </div>
          )}
          {faceDetected === false && (
            <div style={{
              color: '#ffbe3b',
              fontWeight: 700,
              fontSize: 15,
              marginTop: 4,
              animation: 'popIn 0.5s'
            }}>
              😐 No Face Detected
            </div>
          )}
          <button
            onClick={capture}
            style={{
              marginTop: 10,
              background: '#2ec4b6',
              color: '#1a232c',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              width: '100%',
              transition: 'background 0.2s',
              animation: 'fadeInUp 0.7s'
            }}
          >
            📸 Capture
          </button>
        </div>
      )}

      {capturedImage && (
        <div style={{
          marginTop: 15,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeInUp 0.7s'
        }}>
          <p style={{
            color: '#fff',
            fontWeight: 500,
            fontSize: 15,
            marginBottom: 6
          }}>Captured Photo Preview:</p>
          <img
            src={capturedImage}
            alt="Captured"
            style={{
              maxWidth: '100%',
              width: '100%',
              height: 'auto',
              maxHeight: 220,
              border: '2px solid #2ec4b6',
              borderRadius: '8px',
              objectFit: 'contain',
              background: '#111',
              animation: 'popIn 0.7s'
            }}
          />
        </div>
      )}
      <style>
        {`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        @keyframes popIn {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        `}
      </style>
    </div>
  );
};

export default ImageUploader;
