import { NextResponse } from 'next/server';

// Fetch specific Pokemon data by ID or name
async function fetchPokemonById(idOrName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName.toLowerCase()}`);
    
    if (!response.ok) {
      throw new Error(`Pokemon not found: ${idOrName}`);
    }
    
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      base_experience: data.base_experience,
      sprites: {
        front_default: data.sprites.front_default,
        front_shiny: data.sprites.front_shiny,
        back_default: data.sprites.back_default,
        back_shiny: data.sprites.back_shiny,
        other: {
          'official-artwork': data.sprites.other['official-artwork'],
          dream_world: data.sprites.other.dream_world,
          home: data.sprites.other.home
        }
      },
      types: data.types.map(type => ({
        slot: type.slot,
        type: {
          name: type.type.name,
          url: type.type.url
        }
      })),
      abilities: data.abilities.map(ability => ({
        ability: {
          name: ability.ability.name,
          url: ability.ability.url
        },
        is_hidden: ability.is_hidden,
        slot: ability.slot
      })),
      stats: data.stats.map(stat => ({
        base_stat: stat.base_stat,
        effort: stat.effort,
        stat: {
          name: stat.stat.name,
          url: stat.stat.url
        }
      })),
      moves: data.moves.map(move => ({
        move: {
          name: move.move.name,
          url: move.move.url
        },
        version_group_details: move.version_group_details
      })),
      species: {
        name: data.species.name,
        url: data.species.url
      }
    };
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    throw error;
  }
}

// GET /api/pokemon/[id] - Get specific Pokemon by ID or name
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Pokemon ID or name is required' },
        { status: 400 }
      );
    }
    
    const pokemonData = await fetchPokemonById(id);
    
    return NextResponse.json(pokemonData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Pokemon not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon data', details: error.message },
      { status: 500 }
    );
  }
} 