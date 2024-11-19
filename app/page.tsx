"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PokemonListResponse } from "./types/index";
import PokemonCard from "./components/PokemonCard";

export default function Page() {
  const [pokemon, setPokemon] = useState<PokemonListResponse["results"]>([]);
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
          (newPoke) =>
            !prev.some((existingPoke) => existingPoke.name === newPoke.name),
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchPokemons();
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Pokemon Directory</h1>

      {pokemon.length === 0 && loading ? (
        <div className="flex justify-center">
          <p>Loading Pokemon...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pokemon.map((item) => (
            <PokemonCard key={item.name} name={item.name} />
          ))}
        </div>
      )}

      <div
        ref={observerTarget}
        className="h-20 flex items-center justify-center mt-4"
      >
        {loading && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        )}
        {!hasMore && pokemon.length > 0 && (
          <p className="text-gray-500">You've caught them all! 🎉</p>
        )}
      </div>
    </div>
  );
}
