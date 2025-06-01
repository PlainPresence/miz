import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [showGreeting, setShowGreeting] = useState(true);
  const [wishes, setWishes] = useState([]);
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [newWish, setNewWish] = useState('');
  const [newGuestEntry, setNewGuestEntry] = useState({ name: '', message: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedWishes = localStorage.getItem('miznah-wishes');
    const savedGuestbook = localStorage.getItem('miznah-guestbook');
    const savedPhotos = localStorage.getItem('miznah-photos');

    if (savedWishes) setWishes(JSON.parse(savedWishes));
    if (savedGuestbook) setGuestbookEntries(JSON.parse(savedGuestbook));
    if (savedPhotos) setUploadedPhotos(JSON.parse(savedPhotos));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('miznah-wishes', JSON.stringify(wishes));
  }, [wishes]);

  useEffect(() => {
    localStorage.setItem('miznah-guestbook', JSON.stringify(guestbookEntries));
  }, [guestbookEntries]);

  useEffect(() => {
    localStorage.setItem('miznah-photos', JSON.stringify(uploadedPhotos));
  }, [uploadedPhotos]);

  const addWish = () => {
    if (newWish.trim()) {
      setWishes([...wishes, { id: Date.now(), text: newWish, date: new Date().toLocaleDateString() }]);
      setNewWish('');
    }
  };

  const addGuestEntry = () => {
    if (newGuestEntry.name.trim() && newGuestEntry.message.trim()) {
      setGuestbookEntries([...guestbookEntries, { 
        id: Date.now(), 
        name: newGuestEntry.name, 
        message: newGuestEntry.message, 
        date: new Date().toLocaleDateString() 
      }]);
      setNewGuestEntry({ name: '', message: '' });
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          src: e.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      {/* Background Music */}
      <audio 
        ref={audioRef} 
        loop 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav" />
      </audio>

      {/* Music Control Button */}
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 bg-pink-400 hover:bg-pink-500 text-white p-3 rounded-full shadow-lg transition-all duration-300"
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>

      {/* Greeting Popup */}
      {showGreeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 mx-4 max-w-md text-center shadow-2xl transform animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-pink-600 mb-4">Surprise!</h1>
            <p className="text-lg text-gray-700 mb-6">
              Dear Miznah,<br />
              This special website is just for you! ✨
            </p>
            <button
              onClick={() => setShowGreeting(false)}
              className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-3 rounded-full hover:from-pink-500 hover:to-purple-600 transition-all duration-300 shadow-lg"
            >
              Enter ➡️
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div 
            className="h-80 rounded-3xl mb-8 flex items-center justify-center bg-cover bg-center relative overflow-hidden"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1626933414714-079f40681c20')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/70 to-purple-500/70"></div>
            <div className="relative z-10 text-center text-white">
              <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">✨ Miznah ✨</h1>
              <p className="text-2xl drop-shadow-md">Your Friends Love You!</p>
            </div>
          </div>
        </header>

        {/* Wishes Section */}
        <section className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">💖 Wishes for Miznah</h2>
            
            <div className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newWish}
                  onChange={(e) => setNewWish(e.target.value)}
                  placeholder="Write a beautiful wish for Miznah..."
                  className="flex-1 p-4 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addWish()}
                />
                <button
                  onClick={addWish}
                  className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-4 rounded-2xl hover:from-pink-500 hover:to-purple-600 transition-all duration-300 shadow-lg"
                >
                  ✨ Add Wish
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {wishes.map((wish) => (
                <div key={wish.id} className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl shadow-md">
                  <p className="text-gray-700 mb-2">{wish.text}</p>
                  <p className="text-sm text-pink-500">{wish.date}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guest Book Section */}
        <section className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">📖 Guest Book</h2>
            
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={newGuestEntry.name}
                onChange={(e) => setNewGuestEntry({...newGuestEntry, name: e.target.value})}
                placeholder="Your name..."
                className="p-4 border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:outline-none"
              />
              <div className="md:col-span-2">
                <textarea
                  value={newGuestEntry.message}
                  onChange={(e) => setNewGuestEntry({...newGuestEntry, message: e.target.value})}
                  placeholder="Leave a special message for Miznah..."
                  rows="3"
                  className="w-full p-4 border-2 border-purple-200 rounded-2xl focus:border-purple-400 focus:outline-none resize-none"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={addGuestEntry}
                  className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white py-4 rounded-2xl hover:from-purple-500 hover:to-pink-600 transition-all duration-300 shadow-lg"
                >
                  💌 Sign Guest Book
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {guestbookEntries.map((entry) => (
                <div key={entry.id} className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-purple-700">{entry.name}</h3>
                    <span className="text-sm text-purple-500">{entry.date}</span>
                  </div>
                  <p className="text-gray-700">{entry.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Photo Upload Section */}
        <section className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">📸 Photo Memories</h2>
            
            <div className="mb-6">
              <label className="block w-full">
                <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <div className="text-4xl mb-4">📷</div>
                  <p className="text-indigo-600 font-semibold">Click to upload photos for Miznah</p>
                  <p className="text-gray-500 text-sm mt-2">Share your favorite memories together!</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {uploadedPhotos.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {uploadedPhotos.map((photo) => (
                  <div key={photo.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl shadow-md">
                    <img
                      src={photo.src}
                      alt={photo.name}
                      className="w-full h-48 object-cover rounded-xl mb-2"
                    />
                    <p className="text-sm text-indigo-600 truncate">{photo.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center">
          <div 
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl bg-cover bg-center relative overflow-hidden"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1652038220006-70486c52c091')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-500/30"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-purple-700 mb-4">Made with 💖 just for you, Miznah!</h3>
              <p className="text-purple-600">You're amazing and loved by so many people! ✨</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;