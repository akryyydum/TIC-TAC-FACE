import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

const ImageUploader = ({ onSelectImage, player }) => {
  const webcamRef = useRef(null);
  const [showCam, setShowCam] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

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

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onSelectImage(imageSrc);
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
    </div>
  );
};

export default ImageUploader;