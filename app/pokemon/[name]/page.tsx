"use client";

import { useEffect, useState } from "react";
import { PokemonBasicDetails } from "../../types/index";
import Link from "next/link";
import Image from "next/image";

export default function PokemonDetailPage({
  params,
}: {
  params: { name: string };
}) {
  const [details, setDetails] = useState<PokemonBasicDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${params.name}`,
        );

        if (!res.ok) {
          throw new Error("Failed to fetch Pokemon details");
        }

        const data: PokemonBasicDetails = await res.json();
        setDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [params.name]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link
        href="/"
        className="inline-block mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ← Back to List
      </Link>

      {details && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold capitalize mb-4 text-center">
            {details.name}
          </h1>

          <div className="flex justify-center mb-6">
            <Image
              src={details.sprites.other["official-artwork"].front_default}
              alt={details.name}
              width={400}
              height={400}
              className="w-48 h-48 object-contain"
            />
          </div>

          <div className="flex justify-center gap-2 mb-4">
            {details.types.map((type) => (
              <span
                key={type.type.name}
                className="px-4 py-1 bg-gray-200 rounded-full text-sm capitalize"
              >
                {type.type.name}
              </span>
            ))}
          </div>

          <div className="text-center">
            <p className="text-gray-600">Pokemon ID: #{details.id}</p>
          </div>
        </div>
      )}
    </div>
  );
}
