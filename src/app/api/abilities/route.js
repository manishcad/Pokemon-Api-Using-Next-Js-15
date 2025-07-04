import { NextResponse } from 'next/server';

// Fetch Pokemon abilities from PokeAPI
async function fetchAbilities(limit = 20, offset = 0) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/ability?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    
    // Fetch detailed data for each ability
    const abilityDetails = await Promise.all(
      data.results.map(async (ability) => {
        const detailResponse = await fetch(ability.url);
        const detailData = await detailResponse.json();
        
        return {
          id: detailData.id,
          name: detailData.name,
          is_main_series: detailData.is_main_series,
          generation: detailData.generation,
          names: detailData.names,
          effect_entries: detailData.effect_entries.map(entry => ({
            effect: entry.effect,
            short_effect: entry.short_effect,
            language: entry.language
          })),
          flavor_text_entries: detailData.flavor_text_entries.map(entry => ({
            flavor_text: entry.flavor_text,
            language: entry.language,
            version_group: entry.version_group
          })),
          pokemon: detailData.pokemon.map(pokemon => ({
            is_hidden: pokemon.is_hidden,
            slot: pokemon.slot,
            pokemon: {
              name: pokemon.pokemon.name,
              url: pokemon.pokemon.url
            }
          }))
        };
      })
    );
    
    return {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: abilityDetails
    };
  } catch (error) {
    console.error('Error fetching abilities data:', error);
    throw error;
  }
}

// GET /api/abilities - Get Pokemon abilities
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    
    const abilitiesData = await fetchAbilities(limit, offset);
    
    return NextResponse.json(abilitiesData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch abilities data', details: error.message },
      { status: 500 }
    );
  }
} 