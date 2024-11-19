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
    <div onClick={fetchDetails}>
      <h2>{name}</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {details && (
        <div>
          <img src={details.sprites.front_default} alt={name} />
        </div>
      )}
    </div>
  );
}
