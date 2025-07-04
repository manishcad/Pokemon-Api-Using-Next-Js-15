'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load teams from localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem('pokemon-teams');
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
    setLoading(false);
  }, []);

  // Delete a team
  const deleteTeam = (teamId) => {
    const updatedTeams = teams.filter(team => team.id !== teamId);
    setTeams(updatedTeams);
    localStorage.setItem('pokemon-teams', JSON.stringify(updatedTeams));
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex items-center text-blue-600">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading teams...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <Link href="/">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                🏆 Pokemon Teams
              </h1>
            </Link>
            <p className="text-lg text-gray-600 mb-8">
              View and manage your Pokemon teams
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {teams.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Teams Yet</h2>
            <p className="text-gray-600 mb-8">
              You haven&apos;t created any Pokemon teams yet. Go back to the main page to build your first team!
            </p>
            <Link 
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Create Your First Team
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {teams.map((team) => (
              <div key={team.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{team.name}</h2>
                    <p className="text-gray-600">Created on {new Date(team.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    Delete Team
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {team.pokemon.map((poke, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                      <Image
                        src={poke.sprites.front_default}
                        alt={poke.name}
                        className="w-16 h-16 mx-auto mb-2"
                        height={64}
                        width={64}
                        unoptimized
                      />
                      <h3 className="font-semibold text-gray-800 capitalize text-sm mb-1">
                        #{poke.id} {poke.name}
                      </h3>
                      <div className="flex justify-center gap-1">
                        {poke.types.map((type) => (
                          <span
                            key={type.type.name}
                            className={`px-1 py-0.5 rounded-full text-xs font-medium text-white ${typeColors[type.type.name] || 'bg-gray-400'}`}
                          >
                            {type.type.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 