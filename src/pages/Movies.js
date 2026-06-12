  import React, { useState, useEffect } from 'react';
  import { useSearchParams } from 'react-router-dom';
  import { getMovies } from '../services/movieService';
  import MovieCard from '../components/MovieCard';
  import { SkeletonGrid } from '../components/LoadingSkeleton';

  const genres = ['All', 'Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi', 'Thriller', 'Romance'];
  const langs = ['All', 'Telugu', 'Hindi', 'English', 'Tamil'];
  const sorts = ['Popularity', 'Rating', 'Release Date'];

  export default function Movies() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [genre, setGenre] = useState('All');
    const [lang, setLang] = useState('All');
    const [sort, setSort] = useState('Popularity');
    const [tab, setTab] = useState(searchParams.get('tab') || 'now');
    const search = searchParams.get('search') || '';
  useEffect(() => {

    const fetchMovies = async () => {
      const data = await getMovies();
      setMovies(data);
      setLoading(false);
    };

    fetchMovies();

  }, []);
    let filtered = [...movies];
    if (search)
    filtered = filtered.filter(
      m =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.genre.toLowerCase().includes(search.toLowerCase())
    );
    if (genre !== 'All')
  filtered = filtered.filter(m => m.genre === genre);
    if (lang !== 'All') filtered = filtered.filter(m => m.language === lang);
    if (sort === 'Rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    // if (sort === 'Release Date') filtered = [...filtered].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

    return (
      <div className="page">
        <div className="section">
          {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
    <h1 className="section-title" style={{ marginBottom: '1rem' }}>
      {search ? (
        `Results for "${search}"`
      ) : (
        <>
          🎬 All <span>Movies</span>
        </>
      )}
    </h1>

    {search && (
      <p className="text-muted">
        {filtered.length} movies found
      </p>
    )}
  </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {[['now', '🎬 Now Showing'], ['trending', '🔥 Trending'], ['upcoming', '🗓 Upcoming']].map(([val, label]) => (
              <button key={val} className={`filter-chip ${tab === val ? 'active' : ''}`} onClick={() => setTab(val)}>{label}</button>
            ))}
          </div>

          <div className="flex gap-3" style={{ flexWrap: 'wrap', marginBottom: '2rem' }}>
            {/* Genre */}
            <div>
              <div className="text-xs text-muted mb-1" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Genre</div>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {genres.map(g => (
                  <button key={g} className={`filter-chip ${genre === g ? 'active' : ''}`} onClick={() => setGenre(g)}>{g}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-5" style={{ flexWrap: 'wrap' }}>
            <div>
              <div className="text-xs text-muted mb-1" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Language</div>
              <div className="flex gap-2">
                {langs.map(l => (
                  <button key={l} className={`filter-chip ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <div className="text-xs text-muted mb-1" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sort By</div>
              <div className="flex gap-2">
                {sorts.map(s => (
                  <button key={s} className={`filter-chip ${sort === s ? 'active' : ''}`} onClick={() => setSort(s)}>{s}</button>
                ))}
              </div>
            </div>
          </div>

          {loading ? <SkeletonGrid count={8} /> : filtered.length === 0 ? (
            <div className="text-center" style={{ padding: '4rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>No movies found</div>
              <div className="text-muted">Try a different filter or search term</div>
            </div>
          ) : (
            <>
              <p className="text-muted mb-4 text-sm">{filtered.length} movies</p>
              <div className="movies-grid">
                {filtered.map(m => <MovieCard key={m.id} movie={m} />)}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
