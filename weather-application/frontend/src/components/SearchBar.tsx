import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, X, Loader2, Navigation } from 'lucide-react';
import { SearchBarProps } from '../types/weather.types';
import { useWeatherStore } from '../store/weatherStore';
import { weatherApi, CitySuggestion } from '../services/weatherApi';

// Country code → flag emoji helper
const countryFlag = (code: string): string => {
  if (!code || code.length !== 2) return '🌍';
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
};

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  loading,
  onLocationSearch,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { recentSearches, removeRecentSearch } = useWeatherStore();

  const debouncedQuery = useDebounce(query, 300);

  /* ── Fetch suggestions when debounced query changes ── */
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      return;
    }

    let cancelled = false;
    setSuggestionsLoading(true);

    weatherApi.getCitySuggestions(debouncedQuery).then((results) => {
      if (!cancelled) {
        setSuggestions(results);
        setSuggestionsLoading(false);
        setActiveIndex(-1);
      }
    });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  /* ── Compute what to show in dropdown ── */
  const hasQuery = query.trim().length >= 2;
  const filteredHistory = recentSearches.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  );
  const isDropdownVisible = showDropdown && isFocused && (
    hasQuery ? (suggestionsLoading || suggestions.length > 0) : filteredHistory.length > 0
  );

  // Total items for keyboard nav
  const totalItems = hasQuery ? suggestions.length : filteredHistory.length;

  /* ── Submit ── */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim() && !loading) {
        onSearch(query.trim());
        setShowDropdown(false);
        setSuggestions([]);
        inputRef.current?.blur();
      }
    },
    [query, loading, onSearch]
  );

  /* ── Select a suggestion ── */
  const handleSelectSuggestion = useCallback(
    (suggestion: CitySuggestion) => {
      setQuery(suggestion.name);
      onSearch(suggestion.name);
      setShowDropdown(false);
      setSuggestions([]);
      inputRef.current?.blur();
    },
    [onSearch]
  );

  /* ── Select from history ── */
  const handleSelectHistory = useCallback(
    (city: string) => {
      setQuery(city);
      onSearch(city);
      setShowDropdown(false);
    },
    [onSearch]
  );

  /* ── Keyboard navigation ── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isDropdownVisible) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, totalItems - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        if (hasQuery && suggestions[activeIndex]) {
          handleSelectSuggestion(suggestions[activeIndex]);
        } else if (!hasQuery && filteredHistory[activeIndex]) {
          handleSelectHistory(filteredHistory[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
        inputRef.current?.blur();
      }
    },
    [isDropdownVisible, totalItems, activeIndex, hasQuery, suggestions, filteredHistory, handleSelectSuggestion, handleSelectHistory]
  );

  /* ── Close on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} aria-label="Weather search form">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 0 3px rgba(139, 92, 246, 0.25), 0 8px 32px rgba(0,0,0,0.4)'
              : '0 8px 32px rgba(0,0,0,0.3)',
          }}
          className="relative flex items-center"
          style={{ borderRadius: '9999px' }}
        >
          {/* Search / Loading icon */}
          <div className="absolute left-5 z-10 flex items-center pointer-events-none">
            {suggestionsLoading ? (
              <Loader2
                size={20}
                className="animate-spin text-violet-400"
              />
            ) : (
              <Search
                size={20}
                className={`transition-colors duration-200 ${
                  isFocused ? 'text-violet-400' : 'text-white/50'
                }`}
              />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            id="city-search-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
              setActiveIndex(-1);
            }}
            onFocus={() => {
              setIsFocused(true);
              setShowDropdown(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setShowDropdown(false), 160);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search any city..."
            className="glass-input w-full pl-14 pr-36 py-4 text-base text-white placeholder-white/50 focus:outline-none"
            aria-label="Search for a city"
            aria-autocomplete="list"
            aria-expanded={isDropdownVisible}
            aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
            disabled={loading}
            autoComplete="off"
          />

          {/* Clear Button */}
          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  inputRef.current?.focus();
                }}
                className="absolute right-40 p-1 text-white/50 hover:text-white/80 transition-colors"
                aria-label="Clear search"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="absolute right-2 flex items-center gap-1.5">
            {onLocationSearch && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLocationSearch}
                disabled={loading}
                className="p-2.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Use current location"
                title="Use current location"
              >
                <MapPin size={18} />
              </motion.button>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading || !query.trim()}
              className="glass-button px-5 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Search weather"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Searching</span>
                </>
              ) : (
                <>
                  <Search size={15} />
                  <span>Search</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </form>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {isDropdownVisible && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full mt-2 w-full z-50 glass-card-static overflow-hidden"
            style={{ borderRadius: '1.25rem' }}
            role="listbox"
            aria-label="City suggestions"
          >
            {/* ── Suggestions section ── */}
            {hasQuery && (
              <>
                {/* Header */}
                <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                  <Navigation size={11} className="text-violet-400" />
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Suggestions
                  </span>
                </div>

                {/* Loading shimmer */}
                {suggestionsLoading && suggestions.length === 0 && (
                  <div className="px-4 pb-3 space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="skeleton w-8 h-8 rounded-xl flex-shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <div className="skeleton h-3 w-32 rounded" />
                          <div className="skeleton h-2.5 w-24 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestion items */}
                {!suggestionsLoading && suggestions.length === 0 && query.trim().length >= 2 && (
                  <div className="px-4 pb-3 text-sm text-white/40 flex items-center gap-2">
                    <Search size={14} className="opacity-50" />
                    No cities found for &ldquo;{query}&rdquo;
                  </div>
                )}

                {suggestions.map((s, i) => (
                  <motion.div
                    key={`${s.lat}-${s.lon}`}
                    id={`suggestion-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 group ${
                      activeIndex === i
                        ? 'bg-violet-500/20 border-l-2 border-violet-400'
                        : 'hover:bg-white/8 border-l-2 border-transparent'
                    }`}
                    role="option"
                    aria-selected={activeIndex === i}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectSuggestion(s);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    {/* Flag */}
                    <span
                      className="text-2xl flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 group-hover:bg-white/12 transition-colors"
                      role="img"
                      aria-label={s.country}
                    >
                      {countryFlag(s.country)}
                    </span>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-white truncate">
                          {s.name}
                        </span>
                        <span className="text-xs font-bold text-violet-300 flex-shrink-0">
                          {s.country}
                        </span>
                      </div>
                      {s.state && (
                        <span className="text-xs text-white/45 truncate block">
                          {s.state}
                        </span>
                      )}
                    </div>

                    {/* Coords hint */}
                    <span className="text-xs text-white/25 flex-shrink-0 hidden sm:block">
                      {s.lat.toFixed(1)}°, {s.lon.toFixed(1)}°
                    </span>
                  </motion.div>
                ))}

                {/* Divider before history */}
                {filteredHistory.length > 0 && suggestions.length > 0 && (
                  <div className="mx-4 border-t border-white/10 my-1" />
                )}
              </>
            )}

            {/* ── Recent searches section ── */}
            {filteredHistory.length > 0 && (
              <>
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={11} />
                    Recent
                  </span>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      useWeatherStore.getState().clearRecentSearches();
                    }}
                    className="text-xs text-white/35 hover:text-white/65 transition-colors"
                  >
                    Clear all
                  </button>
                </div>

                {filteredHistory.map((city, i) => {
                  const navIdx = hasQuery ? suggestions.length + i : i;
                  return (
                    <motion.div
                      key={city}
                      id={`suggestion-${navIdx}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all duration-150 group ${
                        activeIndex === navIdx
                          ? 'bg-white/10 border-l-2 border-white/30'
                          : 'hover:bg-white/8 border-l-2 border-transparent'
                      }`}
                      role="option"
                      aria-selected={activeIndex === navIdx}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectHistory(city);
                      }}
                      onMouseEnter={() => setActiveIndex(navIdx)}
                    >
                      <div className="flex items-center gap-3">
                        <Clock size={14} className="text-white/35 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                        <span className="text-sm text-white/75 group-hover:text-white transition-colors">
                          {city}
                        </span>
                      </div>
                      <button
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          removeRecentSearch(city);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-white/35 hover:text-white/70 transition-all"
                        aria-label={`Remove ${city} from history`}
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  );
                })}
              </>
            )}

            {/* Keyboard hint */}
            {totalItems > 0 && (
              <div className="px-4 py-2 border-t border-white/8 flex items-center gap-3 text-white/25">
                <span className="text-xs flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">↑↓</kbd>
                  navigate
                </span>
                <span className="text-xs flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">↵</kbd>
                  select
                </span>
                <span className="text-xs flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">Esc</kbd>
                  close
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
