import { NextResponse } from 'next/server';

// Fetch Pokemon types from PokeAPI
async function fetchTypes() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/type');
    const data = await response.json();
    
    // Fetch detailed data for each type
    const typeDetails = await Promise.all(
      data.results.map(async (type) => {
        const detailResponse = await fetch(type.url);
        const detailData = await detailResponse.json();
        
        return {
          id: detailData.id,
          name: detailData.name,
          damage_relations: {
            double_damage_from: detailData.damage_relations.double_damage_from,
            double_damage_to: detailData.damage_relations.double_damage_to,
            half_damage_from: detailData.damage_relations.half_damage_from,
            half_damage_to: detailData.damage_relations.half_damage_to,
            no_damage_from: detailData.damage_relations.no_damage_from,
            no_damage_to: detailData.damage_relations.no_damage_to
          },
          game_indices: detailData.game_indices,
          generation: detailData.generation,
          move_damage_class: detailData.move_damage_class,
          names: detailData.names,
          pokemon: detailData.pokemon.map(pokemon => ({
            slot: pokemon.slot,
            pokemon: {
              name: pokemon.pokemon.name,
              url: pokemon.pokemon.url
            }
          })),
          moves: detailData.moves,
          sprites: detailData.sprites
        };
      })
    );
    
    return {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: typeDetails
    };
  } catch (error) {
    console.error('Error fetching types data:', error);
    throw error;
  }
}

// GET /api/types - Get all Pokemon types
export async function GET(request) {
  try {
    const typesData = await fetchTypes();
    
    return NextResponse.json(typesData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch types data', details: error.message },
      { status: 500 }
    );
  }
} 