import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaTimes, FaBars, FaUser, FaUserPlus, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useDebounce } from '../hooks/useDebounce';

interface HeaderProps {
  cartCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ cartCount, searchQuery, onSearchChange }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });
  const { pathname } = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearch(e.target.value);
    },
    []
  );

  const clearSearch = useCallback(() => {
    setLocalSearch('');
    onSearchChange('');
  }, [onSearchChange]);

  const isHomePage = pathname === '/';

  return (
    <>
      <header className={'header-container ' + (isScrolled ? 'scrolled' : '')} role="banner">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="header-top">
            <Link to="/" className="header-logo" aria-label="Zomato Clone Home">
              <span className="header-logo-icon" aria-hidden="true">🍔</span>
              <span className="header-logo-text">Zomato</span>
            </Link>

            {isHomePage && (
              <div className="header-search" role="search">
                <FaSearch className="text-gray-400 shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines..."
                  className="flex-1"
                  value={localSearch}
                  onChange={handleSearchChange}
                  aria-label="Search restaurants and cuisines"
                />
                {localSearch && (
                  <button onClick={clearSearch} className="text-gray-400 hover:text-gray-600" aria-label="Clear search">
                    <FaTimes size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Mobile: Hamburger dropdown */}
            {isMobile && (
              <div className="relative" ref={mobileMenuRef}>
                <button
                  className="text-white p-2 shrink-0"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>

                {mobileMenuOpen && (
                  <div className="mobile-dropdown-card animate-fade-in-scale">
                    <Link
                      to="/login"
                      className="desktop-dropdown-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaUser size={16} aria-hidden="true" />
                      <span>Login</span>
                    </Link>

                    <Link
                      to="/register"
                      className="desktop-dropdown-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaUserPlus size={16} aria-hidden="true" />
                      <span>Register</span>
                    </Link>

                    <Link
                      to="/cart"
                      className="desktop-dropdown-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FaShoppingCart size={16} aria-hidden="true" />
                      <span>Cart ({cartCount})</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Desktop nav */}
            {!isMobile && (
              <nav className="flex items-center gap-4" aria-label="Main navigation">
                {/* User menu dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors p-2"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label={userMenuOpen ? 'Close user menu' : 'Open user menu'}
                    aria-expanded={userMenuOpen}
                  >
                    <FaUserCircle size={22} aria-hidden="true" />
                  </button>

                  {userMenuOpen && (
                    <div className="desktop-dropdown animate-fade-in-scale">
                      <Link
                        to="/login"
                        className="desktop-dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FaUser size={16} aria-hidden="true" />
                        <span>Login</span>
                      </Link>
                      <Link
                        to="/register"
                        className="desktop-dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FaUserPlus size={16} aria-hidden="true" />
                        <span>Register</span>
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/cart"
                  className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors relative"
                  aria-label={`Shopping cart with ${cartCount} items`}
                >
                  <FaShoppingCart size={18} aria-hidden="true" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </nav>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

