"use client";

import { useState } from "react";
import { PokemonBasicDetails } from "../types/index";

interface PokemonCardProps {
  name: string;
}

export default function PokemonCard({ name }: PokemonCardProps) {
  const [details, setDetails] = useState<PokemonBasicDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    if (details) {
      setDetails(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!res.ok) throw new Error("Failed to fetch Pokemon details");
      const data: PokemonBasicDetails = await res.json();
      setDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="border p-4 rounded-lg cursor-pointer"
      onClick={fetchDetails}
    >
      <h2 className="text-xl capitalize">{name}</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {details && (
        <div className="mt-2">
          <img
            src={details.sprites.front_default}
            alt={name}
            className="w-24 h-24"
          />
          <div className="flex gap-2 mt-2">
            {details.types.map((type) => (
              <span
                key={type.type.name}
                className="px-2 py-1 bg-gray-200 rounded-full text-sm"
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
