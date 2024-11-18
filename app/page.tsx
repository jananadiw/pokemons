"use client";

import React, { useState, useEffect } from "react";
import { PokemonListResponse } from "./types/index";

export default function Page() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      let res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
      );
      if (!res.ok) throw new Error("Failed to fetch Pokemons");

      let data: PokemonListResponse = await res.json();

      setPokemon((prev) => [...prev, ...data.results]);
      setHasMore(data.next !== null);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, [offset]);

  if (error) {
    return <div>error</div>;
  }
  return (
    <div>
      <h1>Pokemons</h1>
      <ul>
        {pokemon.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>

      {loading && <p>Loading More..</p>}
      {!hasMore && <p>No More to load</p>}
    </div>
  );
}
