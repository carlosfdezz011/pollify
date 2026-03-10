import { Song, Playlist } from '../types';

export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Mi Luz',
    artist: 'RVFV, Rels B',
    album: 'Mi Luz',
    coverUrl: 'https://picsum.photos/seed/rvfv1/300/300',
    duration: '3:15',
  },
  {
    id: '2',
    title: 'Una Locura',
    artist: 'Omar Montes, Camin',
    album: 'Una Locura',
    coverUrl: 'https://picsum.photos/seed/omar1/300/300',
    duration: '2:58',
  },
  {
    id: '3',
    title: 'Real Hasta La Muerte',
    artist: 'Anuel AA',
    album: 'Real Hasta La Muerte',
    coverUrl: 'https://picsum.photos/seed/anuel1/300/300',
    duration: '4:02',
  },
  {
    id: '4',
    title: 'Pelele',
    artist: 'Morad',
    album: 'Pelele',
    coverUrl: 'https://picsum.photos/seed/morad1/300/300',
    duration: '3:20',
  },
  {
    id: '5',
    title: 'Safera',
    artist: 'Ñengo Flow, Bad Bunny',
    album: 'YHLQMDLG',
    coverUrl: 'https://picsum.photos/seed/nengo1/300/300',
    duration: '4:55',
  },
  {
    id: '6',
    title: 'Trap Capos',
    artist: 'Noriel, Trap Capos',
    album: 'Trap Capos: Season 1',
    coverUrl: 'https://picsum.photos/seed/trap1/300/300',
    duration: '3:45',
  },
  {
    id: '7',
    title: 'Hades',
    artist: 'Hades 66',
    album: 'Hades',
    coverUrl: 'https://picsum.photos/seed/hades1/300/300',
    duration: '2:50',
  },
  {
    id: '8',
    title: 'Clarent',
    artist: 'Clarent',
    album: 'Singles',
    coverUrl: 'https://picsum.photos/seed/clarent1/300/300',
    duration: '3:10',
  },
  {
    id: '9',
    title: 'Normal',
    artist: 'Morad',
    album: 'Reinsertado',
    coverUrl: 'https://picsum.photos/seed/morad2/300/300',
    duration: '3:33',
  },
  {
    id: '10',
    title: 'Prendio',
    artist: 'RVFV',
    album: 'Prendio',
    coverUrl: 'https://picsum.photos/seed/rvfv2/300/300',
    duration: '2:45',
  }
];

export const mockPlaylists: Playlist[] = [
  {
    id: 'p1',
    name: 'Éxitos España',
    description: 'Lo más escuchado en España ahora mismo.',
    coverUrl: 'https://picsum.photos/seed/spain/300/300',
    songs: mockSongs.slice(0, 5),
  },
  {
    id: 'p2',
    name: 'Trap Latino',
    description: 'Los mejores temas de trap latino.',
    coverUrl: 'https://picsum.photos/seed/trap/300/300',
    songs: mockSongs.slice(2, 8),
  },
  {
    id: 'p3',
    name: 'AI DJ Mix: Urbano',
    description: 'Mezcla generada por IA basada en tus gustos.',
    coverUrl: 'https://picsum.photos/seed/ai/300/300',
    songs: [...mockSongs].sort(() => 0.5 - Math.random()),
  }
];
