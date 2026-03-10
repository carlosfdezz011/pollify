import { Song } from '../types';

const ARTISTS = ['RVFV', 'Omar Montes', 'Anuel AA', 'Morad', 'Ñengo Flow', 'Hades 66', 'JC Reyes', 'Camin', 'Clarent', 'Trap Capos', 'Jabecia', 'JPFernandez'];

export async function fetchSongs(): Promise<Song[]> {
  try {
    const promises = ARTISTS.map(artist =>
      fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=song&limit=15`)
        .then(res => res.json())
    );

    const results = await Promise.all(promises);
    const songs: Song[] = [];
    const seenIds = new Set<string>();

    results.forEach(result => {
      if (result.results) {
        result.results.forEach((track: any) => {
          const trackId = track.trackId.toString();
          if (track.previewUrl && !seenIds.has(trackId)) {
            seenIds.add(trackId);
            songs.push({
              id: trackId,
              title: track.trackName,
              artist: track.artistName,
              album: track.collectionName,
              coverUrl: track.artworkUrl100.replace('100x100', '500x500'), // Higher quality for Now Playing
              duration: formatDuration(track.trackTimeMillis),
              durationMs: track.trackTimeMillis || 180000, // Real duration for full playback simulation
              audioUrl: track.previewUrl,
            });
          }
        });
      }
    });

    // Shuffle songs to make it feel like a fresh mix
    return songs.sort(() => 0.5 - Math.random());
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}

function formatDuration(millis: number) {
  if (!millis) return "3:00";
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
}
