'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface fetchProps {
  offset: number;
  query: string;
}

interface imagesProps {
  fixed_width: {
    url: string;
  };
}

interface dataProps {
  id: string;
  images: imagesProps;
  alt_text: string;
}

export default function Home() {
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<dataProps[]>([]);

  const SEARCH_LIMIT = 20;
  const OFFSET_INCREASE = 20;

  const fetchData = ({ offset, query }: fetchProps) => {
    fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=pLURtkhVrUXr3KG25Gy5IvzziV5OrZGa&offset=${offset}&q=${query}&limit=${SEARCH_LIMIT}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => setData((prev) => [...prev, ...data.data]));
  };

  const increaseOffset = () => {
    setOffset((prev) => prev + OFFSET_INCREASE);
  };

  const clearSearch = () => {
    setSearch('');
    setData([]);
    setOffset(0);
  };

  useEffect(() => {
    fetchData({ offset, query: search });
  }, [search, offset]);

  useEffect(() => {
    const onscroll = () => {
      const scrolledTo = window.scrollY + window.innerHeight;
      const isReachBottom = document.body.scrollHeight === scrolledTo;
      if (isReachBottom) increaseOffset();
    };
    window.addEventListener('scroll', onscroll);
    return () => {
      window.removeEventListener('scroll', onscroll);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex gap-2">
        <button onClick={clearSearch}>X</button>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3 mt-4 pb-8">
        {data.length > 0 &&
          data.map((gif) => (
            <Image
              key={gif.id}
              src={gif.images.fixed_width.url}
              width={200}
              height={200}
              alt={gif.alt_text}
            />
          ))}
      </div>
    </main>
  );
}
