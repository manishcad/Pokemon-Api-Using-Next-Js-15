'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BattlePage() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [battleMode, setBattleMode] = useState('select'); // 'select', 'battle', 'result'
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [enemyPokemon, setEnemyPokemon] = useState(null);
  const [enemyTeam, setEnemyTeam] = useState([]);
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
  const [battleLog, setBattleLog] = useState([]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isAITurn, setIsAITurn] = useState(false);

  // Load teams from localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem('pokemon-teams');
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
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

  // Type effectiveness chart
  const typeEffectiveness = {
    fire: { grass: 2, ice: 2, bug: 2, steel: 2, water: 0.5, rock: 0.5, dragon: 0.5 },
    water: { fire: 2, ground: 2, rock: 2, grass: 0.5, dragon: 0.5 },
    electric: { water: 2, flying: 2, grass: 0.5, ground: 0.5, dragon: 0.5 },
    grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5 },
    ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
    fighting: { normal: 2, ice: 2, rock: 2, steel: 2, dark: 2, flying: 0.5, poison: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5 },
    poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0.5 },
    ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5 },
    flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, dark: 0.5, steel: 0.5 },
    bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
    ghost: { psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0.5 },
    dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
    steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
    fairy: { fighting: 2, dragon: 2, dark: 2, poison: 0.5, steel: 0.5, fire: 0.5 }
  };

  // Calculate damage based on type effectiveness
  const calculateDamage = (attackerType, defenderType) => {
    if (!typeEffectiveness[attackerType] || !defenderType) return 1;
    return typeEffectiveness[attackerType][defenderType] || 1;
  };

  // Start battle
  const startBattle = (team) => {
    const enemyTeam = generateEnemyTeam();
    setSelectedTeam(team);
    setPlayerPokemon(team.pokemon[0]);
    setEnemyTeam(enemyTeam);
    setEnemyPokemon(enemyTeam[0]);
    setCurrentEnemyIndex(0);
    setBattleMode('battle');
    setBattleLog([]);
    setPlayerHealth(100);
    setEnemyHealth(100);
    setGameOver(false);
    setWinner(null);
    setIsAITurn(false);
  };

  // Generate random enemy team
  const generateEnemyTeam = () => {
    const enemyPokemon = [
      { id: 6, name: 'charizard', types: [{ type: { name: 'fire' } }], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' } },
      { id: 9, name: 'blastoise', types: [{ type: { name: 'water' } }], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png' } },
      { id: 3, name: 'venusaur', types: [{ type: { name: 'grass' } }], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png' } },
      { id: 25, name: 'pikachu', types: [{ type: { name: 'electric' } }], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' } },
      { id: 150, name: 'mewtwo', types: [{ type: { name: 'psychic' } }], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png' } },
      { id: 149, name: 'dragonite', types: [{ type: { name: 'dragon' } }], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png' } },
      { id: 130, name: 'gyarados', types: [{ type: { name: 'water' } }], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png' } },
      { id: 59, name: 'arcanine', types: [{ type: { name: 'fire' } }], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png' } },
      { id: 94, name: 'gengar', types: [{ type: { name: 'ghost' } }], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png' } },
      { id: 112, name: 'rhydon', types: [{ type: { name: 'ground' } }], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png' } }
    ];
    
    // Randomly select 5 Pokemon for the enemy team
    const shuffled = enemyPokemon.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  // Player attack
  const playerAttack = () => {
    if (gameOver) return;

    const damage = Math.floor(Math.random() * 30) + 20; // 20-50 damage
    const typeMultiplier = calculateDamage(playerPokemon.types[0].type.name, enemyPokemon.types[0].type.name);
    const totalDamage = Math.floor(damage * typeMultiplier);
    
    const newEnemyHealth = Math.max(0, enemyHealth - totalDamage);
    setEnemyHealth(newEnemyHealth);
    
    const effectiveness = typeMultiplier > 1 ? 'Super effective!' : typeMultiplier < 1 ? 'Not very effective...' : '';
    setBattleLog(prev => [...prev, `You attacked for ${totalDamage} damage! ${effectiveness}`]);

    if (newEnemyHealth <= 0) {
      // Check if enemy has more Pokemon to switch to
      if (currentEnemyIndex < enemyTeam.length - 1) {
        // Switch to next Pokemon
        const nextIndex = currentEnemyIndex + 1;
        setCurrentEnemyIndex(nextIndex);
        setEnemyPokemon(enemyTeam[nextIndex]);
        setEnemyHealth(100);
        setBattleLog(prev => [...prev, `Enemy ${enemyPokemon.name} fainted! Enemy switched to ${enemyTeam[nextIndex].name}!`]);
      } else {
        // No more Pokemon
        setGameOver(true);
        setWinner('player');
        setBattleLog(prev => [...prev, 'You won the battle!']);
        return;
      }
    }

    // AI turn
    setTimeout(() => {
      aiDecision();
    }, 1000);
  };

  // AI decision making
  const aiDecision = () => {
    if (gameOver) return;

    // Check if current Pokemon is low on health and should switch
    if (enemyHealth < 30 && currentEnemyIndex < enemyTeam.length - 1) {
      // Switch to next Pokemon
      const nextIndex = currentEnemyIndex + 1;
      setCurrentEnemyIndex(nextIndex);
      setEnemyPokemon(enemyTeam[nextIndex]);
      setEnemyHealth(100);
      setBattleLog(prev => [...prev, `Enemy switched to ${enemyTeam[nextIndex].name}!`]);
    } else {
      // Attack
      enemyAttack();
    }
  };

  // Enemy attack
  const enemyAttack = () => {
    if (gameOver) return;

    const damage = Math.floor(Math.random() * 25) + 15; // 15-40 damage
    const typeMultiplier = calculateDamage(enemyPokemon.types[0].type.name, playerPokemon.types[0].type.name);
    const totalDamage = Math.floor(damage * typeMultiplier);
    
    const newPlayerHealth = Math.max(0, playerHealth - totalDamage);
    setPlayerHealth(newPlayerHealth);
    
    const effectiveness = typeMultiplier > 1 ? 'Super effective!' : typeMultiplier < 1 ? 'Not very effective...' : '';
    setBattleLog(prev => [...prev, `Enemy attacked for ${totalDamage} damage! ${effectiveness}`]);

    if (newPlayerHealth <= 0) {
      // Check if player has more Pokemon to switch to
      const currentPlayerIndex = selectedTeam.pokemon.findIndex(p => p.id === playerPokemon.id);
      if (currentPlayerIndex < selectedTeam.pokemon.length - 1) {
        // Switch to next Pokemon
        const nextPokemon = selectedTeam.pokemon[currentPlayerIndex + 1];
        setPlayerPokemon(nextPokemon);
        setPlayerHealth(100);
        setBattleLog(prev => [...prev, `Your ${playerPokemon.name} fainted! You switched to ${nextPokemon.name}!`]);
      } else {
        // No more Pokemon
        setGameOver(true);
        setWinner('enemy');
        setBattleLog(prev => [...prev, 'You lost the battle!']);
      }
    }
  };

  // Switch Pokemon
  const switchPokemon = (pokemon) => {
    setPlayerPokemon(pokemon);
    setPlayerHealth(100);
    setBattleLog(prev => [...prev, `You switched to ${pokemon.name}!`]);
    
    // AI turn after switching
    setTimeout(() => {
      aiDecision();
    }, 1000);
  };

  // Reset battle
  const resetBattle = () => {
    setBattleMode('select');
    setSelectedTeam(null);
    setPlayerPokemon(null);
    setEnemyPokemon(null);
    setEnemyTeam([]);
    setCurrentEnemyIndex(0);
    setBattleLog([]);
    setPlayerHealth(100);
    setEnemyHealth(100);
    setGameOver(false);
    setWinner(null);
    setIsAITurn(false);
  };

  if (battleMode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
              ⚔️ Pokemon Battle Arena
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Choose your team and battle against wild Pokemon!
            </p>
          </div>
          {teams.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚔️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Teams Available</h2>
              <p className="text-gray-600 mb-8">
                You need to create a team first to start battling!
              </p>
              <Link 
                href="/"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Create a Team
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Select Your Battle Team</h2>
              {teams.map((team) => (
                <div key={team.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
                    <button
                      onClick={() => startBattle(team)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      ⚔️ Battle with this Team
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {team.pokemon.map((poke, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                        <Image
                          src={poke.sprites.front_default}
                          alt={poke.name}
                          className="w-16 h-16 mx-auto mb-2"
                          height={64}
                          width={64}
                          unoptimized
                        />
                        <h4 className="font-semibold text-gray-800 capitalize text-sm mb-1">
                          {poke.name}
                        </h4>
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

  if (battleMode === 'battle') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Battle Arena */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Player Pokemon */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-blue-600 mb-4">Your Pokemon</h3>
                <div className="relative">
                  <Image
                    src={playerPokemon.sprites.front_default}
                    alt={playerPokemon.name}
                    className="w-32 h-32 mx-auto mb-4"
                    height={128}
                    width={128}
                    unoptimized
                  />
                  <h4 className="text-lg font-semibold text-gray-800 capitalize mb-2">
                    {playerPokemon.name}
                  </h4>
                  <div className="flex justify-center gap-2 mb-4">
                    {playerPokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className={`px-2 py-1 rounded-full text-xs font-medium text-white ${typeColors[type.type.name] || 'bg-gray-400'}`}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                  {/* Health Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-green-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${playerHealth}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">{playerHealth}%</div>
                </div>
              </div>

              {/* Enemy Pokemon */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-red-600 mb-4">Enemy Pokemon</h3>
                <div className="relative">
                  <Image
                    src={enemyPokemon.sprites.front_default}
                    alt={enemyPokemon.name}
                    className="w-32 h-32 mx-auto mb-4"
                    height={128}
                    width={128}
                    unoptimized
                  />
                  <h4 className="text-lg font-semibold text-gray-800 capitalize mb-2">
                    {enemyPokemon.name}
                  </h4>
                  <div className="flex justify-center gap-2 mb-4">
                    {enemyPokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className={`px-2 py-1 rounded-full text-xs font-medium text-white ${typeColors[type.type.name] || 'bg-gray-400'}`}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                  {/* Health Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-red-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${enemyHealth}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">{enemyHealth}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enemy Team Status */}
          {!gameOver && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Enemy Team</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {enemyTeam.map((poke, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 ${
                      index === currentEnemyIndex
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <Image
                      src={poke.sprites.front_default}
                      alt={poke.name}
                      className={`w-12 h-12 mx-auto mb-2 ${
                        index > currentEnemyIndex ? 'opacity-50' : ''
                      }`}
                      height={48}
                      width={48}
                      unoptimized
                    />
                    <div className="text-sm font-semibold text-gray-800 capitalize text-center">
                      {poke.name}
                    </div>
                    {index === currentEnemyIndex && (
                      <div className="text-xs text-red-600 text-center mt-1">
                        Active
                      </div>
                    )}
                    {index < currentEnemyIndex && (
                      <div className="text-xs text-gray-500 text-center mt-1">
                        Fainted
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Battle Controls */}
          {!gameOver && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Battle Controls</h3>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={playerAttack}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  ⚔️ Attack
                </button>
                <button
                  onClick={() => setBattleMode('select')}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  🏃‍♂️ Run
                </button>
              </div>
            </div>
          )}

          {/* Pokemon Switch */}
          {!gameOver && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Your Team</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {selectedTeam.pokemon.map((poke, index) => {
                  const isCurrent = poke.id === playerPokemon.id;
                  const isFainted = playerHealth <= 0 && isCurrent;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => switchPokemon(poke)}
                      disabled={isCurrent || isFainted}
                      className={`p-3 rounded-lg transition-colors border-2 ${
                        isCurrent
                          ? 'bg-blue-300 border-blue-500 cursor-not-allowed'
                          : isFainted
                          ? 'bg-gray-300 border-gray-400 cursor-not-allowed opacity-50'
                          : 'bg-blue-100 hover:bg-blue-200 border-blue-200'
                      }`}
                    >
                      <Image
                        src={poke.sprites.front_default}
                        alt={poke.name}
                        className={`w-12 h-12 mx-auto mb-2 ${
                          isFainted ? 'opacity-50' : ''
                        }`}
                        height={48}
                        width={48}
                        unoptimized
                      />
                      <div className="text-sm font-semibold text-gray-800 capitalize">
                        {poke.name}
                      </div>
                      {isCurrent && (
                        <div className="text-xs text-blue-600 text-center mt-1">
                          Active
                        </div>
                      )}
                      {isFainted && (
                        <div className="text-xs text-gray-500 text-center mt-1">
                          Fainted
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Battle Log */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Battle Log</h3>
            <div className="bg-gray-100 rounded-lg p-4 h-32 overflow-y-auto">
              {battleLog.map((log, index) => (
                <div key={index} className="text-sm text-gray-700 mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Game Over */}
          {gameOver && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {winner === 'player' ? '🎉 Victory!' : '💀 Defeat!'}
              </h2>
              <p className="text-gray-600 mb-6">
                {winner === 'player' 
                  ? 'Congratulations! You won the battle!' 
                  : 'Better luck next time!'
                }
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetBattle}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  🏠 Back to Team Selection
                </button>
                <button
                  onClick={() => startBattle(selectedTeam)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  ⚔️ Battle Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
} 