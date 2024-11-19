"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PokemonListResponse } from "./types/index";

export default function Page() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const limit = 5;

  // Memoize to prevent unnecessary re-renders
  const fetchPokemons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
        { next: { revalidate: 3600 } },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch Pokemons");
      }

      let data: PokemonListResponse = await res.json();

      setPokemon((prev) => {
        const newPokemon = data.results.filter(
          (newPoke) => !prev.some((existingPoke) => existingPoke.name === newPoke.name)
        );
        return [...prev, ...newPokemon];
      });
      setHasMore(data.next !== null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prev) => prev + limit);
        }
      },
      { threshold: 0.1, rootMargin: "10px" },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading]);

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  if (error) {
    return <div>error</div>;
  }
  return (
    <div>
      <h1>Pokemons</h1>

      {pokemon.length === 0 && loading ? (
        <div>
          <p>Loading Pokemon...</p>
        </div>
      ) : (
        <div>
          {pokemon.map((item, index) => (
            <div key={item.name}>{item.name}</div>
          ))}
        </div>
      )}

      <div ref={observerTarget}>
        {loading && (
          <div>
            <div />
            <div style={{ animationDelay: "0.2s" }} />
            <div style={{ animationDelay: "0.4s" }} />
          </div>
        )}
        {!hasMore && pokemon.length > 0 && <p>No more!</p>}
      </div>
    </div>
  );
}
