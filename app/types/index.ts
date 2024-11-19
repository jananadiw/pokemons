export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

export type PokemonBasicDetails = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {};
  };
  types: {
    type: {
      name: string;
    };
  }[];
};
