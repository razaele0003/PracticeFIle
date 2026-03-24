import { useEffect, useRef, useState, useCallback } from 'react';

// Tip landmark indices for index, middle, ring, pinky (no thumb)
const FINGER_TIPS = [8, 12, 16, 20];

/**
 * Count fingers pointing upward (tip.y < pip.y) — thumb ignored.
 * landmarks: array of 21 {x, y, z} objects (normalized 0-1, y=0 is top).
 */
function countRaisedFingers(landmarks) {
  let count = 0;
  for (const tip of FINGER_TIPS) {
    const tipLandmark = landmarks[tip];
    const pipLandmark = landmarks[tip - 2]; // PIP joint is always tip - 2
    if (tipLandmark.y < pipLandmark.y) count++;
  }
  return count;
}

/**
 * GestureMode component.
 * Props:
 *   onGestureDetected(fingerCount) — called when a stable gesture fires
 */
export default function GestureMode({ onGestureDetected }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const handsRef = useRef(null);
  const stableRef = useRef({ count: -1, since: 0 });
  const rafRef = useRef(null);
  const mountedRef = useRef(true);

  const [detected, setDetected] = useState(null); // displayed finger count
  const [status, setStatus] = useState('Starting camera…');

  // ── Process each frame ────────────────────────────────────────────────────
  const processFrame = useCallback(async () => {
    if (!mountedRef.current) return;
    const video = videoRef.current;
    if (!video || video.readyState < 2 || !handsRef.current) {
      rafRef.current = requestAnimationFrame(processFrame);
      return;
    }
    try {
      await handsRef.current.send({ image: video });
    } catch {
      // ignore frame errors
    }
    rafRef.current = requestAnimationFrame(processFrame);
  }, []);

  // ── MediaPipe result callback ──────────────────────────────────────────────
  const onResults = useCallback((results) => {
    if (!mountedRef.current) return;

    let fingerCount = 0;
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      fingerCount = countRaisedFingers(results.multiHandLandmarks[0]);
    }

    setDetected(fingerCount);

    if (fingerCount < 1 || fingerCount > 4) {
      stableRef.current = { count: -1, since: 0 };
      return;
    }

    const now = Date.now();
    if (stableRef.current.count !== fingerCount) {
      stableRef.current = { count: fingerCount, since: now };
    } else if (now - stableRef.current.since >= 1000) {
      // Stable for 1 second — fire! No cooldown.
      stableRef.current = { count: -1, since: 0 };
      onGestureDetected(fingerCount);
    }
  }, [onGestureDetected]);

  // ── Init MediaPipe + webcam ────────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      // Request webcam
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 }, audio: false });
      } catch {
        setStatus('Camera access denied');
        return;
      }
      if (!mountedRef.current) { stream.getTracks().forEach(t => t.stop()); return; }
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      // Init MediaPipe Hands
      if (!window.Hands) { setStatus('MediaPipe not loaded'); return; }
      const hands = new window.Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });
      hands.onResults(onResults);
      handsRef.current = hands;
      setStatus('Ready — show fingers!');

      // Start frame loop
      rafRef.current = requestAnimationFrame(processFrame);
    };

    init();

    return () => {
      mountedRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (handsRef.current) handsRef.current.close();
    };
  }, [onResults, processFrame]);

  // ── Render ────────────────────────────────────────────────────────────────
  const fingerLabel = detected !== null
    ? detected === 0 ? 'Fist / None' : `${detected} finger${detected !== 1 ? 's' : ''}`
    : '—';

  const fingerColor =
    detected === 1 ? '#3b82f6' :
      detected === 2 ? '#10b981' :
        detected === 3 ? '#f59e0b' :
          detected === 4 ? '#ef4444' :
            '#6b7280';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '12px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        pointerEvents: 'none',
      }}
    >
      {/* Camera preview */}
      <div
        style={{
          position: 'relative',
          width: '180px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          border: `2px solid ${fingerColor}`,
          transition: 'border-color 0.3s',
          background: '#0f172a',
        }}
      >
        <video
          ref={videoRef}
          style={{ width: '180px', height: '135px', objectFit: 'cover', display: 'block', transform: 'scaleX(-1)' }}
          playsInline
          muted
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* GESTURE MODE badge */}
        <div
          style={{
            position: 'absolute', top: '6px', left: '6px',
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            borderRadius: '6px',
            padding: '2px 7px',
            fontSize: '9px',
            fontWeight: 700,
            color: '#34d399',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          LIVE
        </div>


      </div>

      {/* Detected fingers badge */}
      <div
        style={{
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(8px)',
          border: `1.5px solid ${fingerColor}`,
          borderRadius: '999px',
          padding: '4px 12px',
          fontSize: '11px',
          fontWeight: 700,
          color: fingerColor,
          transition: 'color 0.3s, border-color 0.3s',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          boxShadow: `0 0 12px ${fingerColor}55`,
        }}
      >
        ✋ {fingerLabel}
      </div>

      {/* Status text */}
      <div
        style={{
          fontSize: '9px',
          color: '#94a3b8',
          fontWeight: 500,
          textAlign: 'center',
          maxWidth: '180px',
        }}
      >
        {status}
      </div>
    </div>
  );
}
