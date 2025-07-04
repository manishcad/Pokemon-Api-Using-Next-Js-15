import { NextResponse } from 'next/server';

// Search Pokemon by name
async function searchPokemon(query) {
  try {
    // First, get all Pokemon to search through
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const data = await response.json();
    
    // Filter Pokemon by name
    const filteredPokemon = data.results.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Limit results to first 20 matches
    const limitedResults = filteredPokemon.slice(0, 20);
    
    // Fetch detailed data for filtered Pokemon
    const pokemonDetails = await Promise.all(
      limitedResults.map(async (pokemon) => {
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
      query: query,
      count: pokemonDetails.length,
      results: pokemonDetails
    };
  } catch (error) {
    console.error('Error searching Pokemon:', error);
    throw error;
  }
}

// GET /api/search - Search Pokemon by name
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required. Use ?q=your_search_term' },
        { status: 400 }
      );
    }
    
    if (query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }
    
    const searchResults = await searchPokemon(query);
    
    return NextResponse.json(searchResults, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search Pokemon', details: error.message },
      { status: 500 }
    );
  }
} 