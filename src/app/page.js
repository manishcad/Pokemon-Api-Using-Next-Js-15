'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
export default function Home() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPokemon, setTotalPokemon] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;

  // Fetch Pokemon list
  const fetchPokemon = async (offset = 0, append = false) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/pokemon?limit=${limit}&offset=${offset}`);
      if (!response.ok) throw new Error('Failed to fetch Pokemon');
      const data = await response.json();
      
      if (append) {
        setPokemon(prev => [...prev, ...data.results]);
      } else {
        setPokemon(data.results);
      }
      
      setTotalPokemon(data.count);
      setHasMore(offset + limit < data.count);
    } catch (err) {
      setError('Failed to load Pokemon data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Search Pokemon
  const searchPokemon = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search Pokemon');
      const data = await response.json();
      setSearchResults(data.results);
    } catch (err) {
      setError('Failed to search Pokemon');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific Pokemon details
  const fetchPokemonDetails = async (idOrName) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/pokemon/${idOrName}`);
      if (!response.ok) throw new Error('Failed to fetch Pokemon details');
      const data = await response.json();
      setSelectedPokemon(data);
      setCurrentImageIndex(0); // Reset to first image when selecting new Pokemon
    } catch (err) {
      setError('Failed to load Pokemon details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 2) {
      searchPokemon(query);
    } else {
      setSearchResults([]);
    }
  };

  // Handle infinite scroll
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextOffset = pokemon.length;
      setCurrentPage(Math.floor(nextOffset / limit));
      fetchPokemon(nextOffset, true);
    }
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loading, pokemon.length]);

  // Handle image navigation
  const handleImageChange = (direction) => {
    if (!selectedPokemon) return;
    
    const images = getPokemonImages(selectedPokemon);
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Get all available Pokemon images
  const getPokemonImages = (pokemon) => {
    const images = [];
    const sprites = pokemon.sprites;
    
    // Add all available sprites
    if (sprites.front_default) images.push({ url: sprites.front_default, label: 'Front Default' });
    if (sprites.back_default) images.push({ url: sprites.back_default, label: 'Back Default' });
    if (sprites.front_shiny) images.push({ url: sprites.front_shiny, label: 'Front Shiny' });
    if (sprites.back_shiny) images.push({ url: sprites.back_shiny, label: 'Back Shiny' });
    
    // Add other sprites if available
    if (sprites.other && sprites.other['official-artwork'] && sprites.other['official-artwork'].front_default) {
      images.push({ url: sprites.other['official-artwork'].front_default, label: 'Official Artwork' });
    }
    if (sprites.other && sprites.other.dream_world && sprites.other.dream_world.front_default) {
      images.push({ url: sprites.other.dream_world.front_default, label: 'Dream World' });
    }
    if (sprites.other && sprites.other.home && sprites.other.home.front_default) {
      images.push({ url: sprites.other.home.front_default, label: 'Home' });
    }
    
    return images;
  };

  // Load initial data
  useEffect(() => {
    fetchPokemon();
  }, []);

  // Pokemon type colors
  const typeColors = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-cyan-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-700',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300'
  };

    return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Header */}
        <header className="bg-white shadow-lg">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
          <Link href="/" target='_blank'>  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
             🎮 Pokemon API Explorer
             </h1></Link>
            <p className="text-lg text-gray-600 mb-8">
              Discover and explore Pokemon data with our interactive API
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Pokemon (min 2 characters)..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((poke) => (
                <div
                  key={poke.id}
                  onClick={() => fetchPokemonDetails(poke.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4"
                >
                  <div className="text-center">
                    <Image
                      src={poke.sprites.front_default}
                      alt={poke.name}
                      className="w-24 h-24 mx-auto mb-3"
                      height={96}
                      width={96}
                      unoptimized
                    />
                    <h3 className="text-lg font-semibold text-gray-800 capitalize mb-2">
                      {poke.name}
                    </h3>
                    <div className="flex justify-center gap-2">
                      {poke.types.map((type) => (
                        <span
                          key={type.type.name}
                          className={`px-2 py-1 rounded-full text-xs font-medium text-white ${typeColors[type.type.name] || 'bg-gray-400'}`}
                        >
                          {type.type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pokemon Grid */}
        {!searchResults.length && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Pokemon Directory ({totalPokemon} total)
              </h2>
              {loading && (
                <div className="flex items-center text-blue-600">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pokemon.map((poke) => (
                <div
                  key={poke.id}
                  onClick={() => fetchPokemonDetails(poke.id)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer p-4 hover:scale-105"
                >
                  <div className="text-center">
                    <Image
                      src={poke.sprites.front_default}
                      alt={poke.name}
                      className="w-24 h-24 mx-auto mb-3"
                      height={96}
                      width={96}
                      unoptimized
                    />
                    <h3 className="text-lg font-semibold text-gray-800 capitalize mb-2">
                      #{poke.id} {poke.name}
                    </h3>
                    <div className="flex justify-center gap-2">
                      {poke.types.map((type) => (
                        <span
                          key={type.type.name}
                          className={`px-2 py-1 rounded-full text-xs font-medium text-white ${typeColors[type.type.name] || 'bg-gray-400'}`}
                        >
                          {type.type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite Scroll Sentinel */}
            <div id="scroll-sentinel" className="h-10 flex items-center justify-center mt-8">
              {loading && (
                <div className="flex items-center text-blue-600">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading more Pokemon...
                </div>
              )}
                             {!hasMore && pokemon.length > 0 && (
                 <div className="text-gray-500 text-sm">
                   You&apos;ve reached the end! ({pokemon.length} of {totalPokemon} Pokemon loaded)
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Pokemon Details Modal */}
        {selectedPokemon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-3xl font-bold text-gray-800 capitalize">
                    #{selectedPokemon.id} {selectedPokemon.name}
                  </h2>
                  <button
                    onClick={() => setSelectedPokemon(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                                 <div className="grid md:grid-cols-2 gap-6">
                   {/* Pokemon Image Carousel */}
                   <div className="text-center">
                     {(() => {
                       const images = getPokemonImages(selectedPokemon);
                       const currentImage = images[currentImageIndex];
                       
                       return (
                         <div className="relative">
                           {/* Main Image */}
                           <div className="relative mb-4">
                             <img
                               src={currentImage.url}
                               alt={selectedPokemon.name}
                               className="w-48 h-48 mx-auto"
                             />
                             
                             {/* Navigation Arrows */}
                             {images.length > 1 && (
                               <>
                                 <button
                                   onClick={() => handleImageChange('prev')}
                                   className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                                 >
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                   </svg>
                                 </button>
                                 <button
                                   onClick={() => handleImageChange('next')}
                                   className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                                 >
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                   </svg>
                                 </button>
                               </>
                             )}
                           </div>
                           
                           {/* Image Label */}
                           <div className="text-sm text-gray-600 mb-2">
                             {currentImage.label}
                           </div>
                           
                           {/* Image Dots */}
                           {images.length > 1 && (
                             <div className="flex justify-center gap-2 mb-4">
                               {images.map((_, index) => (
                                 <button
                                   key={index}
                                   onClick={() => setCurrentImageIndex(index)}
                                   className={`w-2 h-2 rounded-full transition-all ${
                                     index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'
                                   }`}
                                 />
                               ))}
                             </div>
                           )}
                           
                           {/* Type Badges */}
                           <div className="flex justify-center gap-2 mb-4">
                             {selectedPokemon.types.map((type) => (
                               <span
                                 key={type.type.name}
                                 className={`px-3 py-1 rounded-full text-sm font-medium text-white ${typeColors[type.type.name] || 'bg-gray-400'}`}
                               >
                                 {type.type.name}
                               </span>
                             ))}
                           </div>
                         </div>
                       );
                     })()}
                   </div>

                  {/* Pokemon Stats */}
                  <div>
                                         <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="bg-gray-50 p-3 rounded-lg">
                         <div className="text-sm text-gray-600">Height</div>
                         <div className="font-semibold text-black">{selectedPokemon.height / 10}m</div>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-lg">
                         <div className="text-sm text-gray-600">Weight</div>
                         <div className="font-semibold text-black">{selectedPokemon.weight / 10}kg</div>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-lg">
                         <div className="text-sm text-gray-600">Base Experience</div>
                         <div className="font-semibold text-black">{selectedPokemon.base_experience}</div>
                       </div>
                     </div>

                    {/* Abilities */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Abilities</h3>
                      <div className="space-y-2">
                        {selectedPokemon.abilities.map((ability, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {ability.ability.name}
                            </span>
                            {ability.is_hidden && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                Hidden
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Base Stats</h3>
                      <div className="space-y-2">
                        {selectedPokemon.stats.map((stat) => (
                          <div key={stat.stat.name} className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700 capitalize w-20">
                              {stat.stat.name}
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-800 w-8">
                              {stat.base_stat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
