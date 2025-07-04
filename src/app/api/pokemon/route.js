import { NextResponse } from 'next/server';

// Fetch Pokemon data from PokeAPI
async function fetchPokemonData(limit = 20, offset = 0) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    
    // Fetch detailed data for each Pokemon
    const pokemonDetails = await Promise.all(
      data.results.map(async (pokemon) => {
        const detailResponse = await fetch(pokemon.url);
        const detailData = await detailResponse.json();
        
        return {
          id: detailData.id,
          name: detailData.name,
          height: detailData.height,
          weight: detailData.weight,
          base_experience: detailData.base_experience,
          sprites: {
            front_default: detailData.sprites.front_default,
            front_shiny: detailData.sprites.front_shiny,
            back_default: detailData.sprites.back_default,
            back_shiny: detailData.sprites.back_shiny,
          },
          types: detailData.types.map(type => ({
            slot: type.slot,
            type: {
              name: type.type.name,
              url: type.type.url
            }
          })),
          abilities: detailData.abilities.map(ability => ({
            ability: {
              name: ability.ability.name,
              url: ability.ability.url
            },
            is_hidden: ability.is_hidden,
            slot: ability.slot
          })),
          stats: detailData.stats.map(stat => ({
            base_stat: stat.base_stat,
            effort: stat.effort,
            stat: {
              name: stat.stat.name,
              url: stat.stat.url
            }
          }))
        };
      })
    );
    
    return {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: pokemonDetails
    };
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    throw error;
  }
}

// GET /api/pokemon - Get list of Pokemon
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    
    const pokemonData = await fetchPokemonData(limit, offset);
    
    return NextResponse.json(pokemonData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon data', details: error.message },
      { status: 500 }
    );
  }
} 