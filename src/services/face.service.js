// src/services/face.service.js
import * as faceapi from 'face-api.js';

class FaceRecognitionService {
  constructor() {
    this.isInitialized = false;
    this.stream = null;
  }

  async initialize() {
    if (this.isInitialized) return;

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ]);

    this.isInitialized = true;
  }

  async startVideo() {
    this.stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: 640,
        height: 480,
        facingMode: 'user'
      } 
    });
    return this.stream;
  }

  async detectFace(videoElement) {
    const detection = await faceapi.detectSingleFace(
      videoElement,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceDescriptor();

    return detection;
  }

  generateFaceId(faceDescriptor) {
    // Convertir le descripteur facial en identifiant unique
    return 'FACE-' + Array.from(faceDescriptor)
      .map(n => Math.abs(n * 100).toString(16).substr(0, 2))
      .join('');
  }

  stopVideo() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}

export default new FaceRecognitionService();