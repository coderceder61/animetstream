import React, { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';

const Watch = () => {
  const videoRef = useRef(null);
  const plyrRef = useRef(null);
  const [tracks, setTracks] = useState([]);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0); // Track the selected track index

  // Initialize Plyr instance
  useEffect(() => {
    if (videoRef.current && tracks.length) {
      // Destroy existing Plyr instance if any
      if (plyrRef.current) {
        plyrRef.current.destroy();
      }

      // Initialize Plyr
      plyrRef.current = new Plyr(videoRef.current, {
        captions: { active: true, update: true, language: 'auto' },
      });

      // Automatically select the first subtitle track
      if (tracks.length > 0) {
        const track = videoRef.current.textTracks[selectedTrackIndex];
        if (track) {
          track.mode = 'showing'; // Make sure the selected track is visible
        }
      }
    }
  }, [tracks, selectedTrackIndex]); // Re-run when tracks or selectedTrackIndex changes

  // Function to handle subtitle language change
  const switchSubtitleLanguage = (index) => {
    // Disable all tracks
    Array.from(videoRef.current.textTracks).forEach(t => t.mode = 'disabled');

    // Enable the selected track
    const track = videoRef.current.textTracks[index];
    if (track) {
      track.mode = 'showing';
    }

    // Update selected track index
    setSelectedTrackIndex(index);
  };

  // Fetch subtitle tracks and video data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('your-api-endpoint-for-tracks');
        const data = await response.json();
        setTracks(data.tracks); // Assume this returns an array of track objects
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    };
    fetchData();
  }, []); // Run only once to fetch tracks

  return (
    <div>
      <video ref={videoRef} controls>
        {tracks.map((track, index) => (
          <track
            key={index}
            src={track.url} // The subtitle file URL
            kind="subtitles"
            label={track.label}
            srcLang={track.lang || 'en'}
            default={index === selectedTrackIndex} // Set default track
          />
        ))}
      </video>

      <div>
        <h4>Choose Subtitle Language</h4>
        {tracks.map((track, index) => (
          <button key={index} onClick={() => switchSubtitleLanguage(index)}>
            {track.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Watch;
