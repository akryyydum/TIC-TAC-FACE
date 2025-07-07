import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs'; // Only import once in app

const ImageUploader = ({ onSelectImage, player }) => {
  const webcamRef = useRef(null);
  const [showCam, setShowCam] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    // Get available video input devices (cameras)
    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    });
  }, []);

const capture = async () => {
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

  // Draw the video frame onto a temp canvas
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(video, 0, 0, width, height);

  const imageData = tempCtx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Apply alpha transparency to background
  segmentation.data.forEach((segment, i) => {
    if (segment === 0) {
      // Not part of the person
      data[i * 4 + 3] = 0; // Set alpha to 0 (transparent)
    }
  });

  // Put the updated imageData on the final canvas
  ctx.putImageData(imageData, 0, 0);

  // Export transparent image
  const finalImage = canvas.toDataURL('image/png');
  onSelectImage(finalImage);
  setCapturedImage(finalImage);
  setShowCam(false);
};

  const handleFile = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => onSelectImage(reader.result);
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };

  return (
    <div>
      <p>Player {player}: Upload or Capture</p>
      <input type="file" accept="image/*" onChange={handleFile} />
      <button onClick={() => setShowCam(!showCam)}>Use Webcam</button>
      {showCam && (
        <div>
          {devices.length > 1 && (
            <select value={selectedDeviceId || ''} onChange={handleDeviceChange}>
              {devices.map((device) => (
                <option value={device.deviceId} key={device.deviceId}>
                  {device.label || `Camera ${device.deviceId}`}
                </option>
              ))}
            </select>
          )}
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
            }}
          />
          <button onClick={capture}>Capture</button>
        </div>
      )}
      {capturedImage && (
        <div>
          <p>Captured Photo Preview:</p>
          <img src={capturedImage} alt="Captured" style={{ maxWidth: '100%', maxHeight: 300 }} />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;