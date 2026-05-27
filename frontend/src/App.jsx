import { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaSearch,
  FaStar,
  FaTimes,
  FaBolt,
  FaMobileAlt,
  FaFire,
  FaCheckCircle,
  FaSyncAlt,
  FaFilter,
  FaBoxOpen,
} from "react-icons/fa";

const API_BASE_URL = "http://127.0.0.1:8000";

const brands = [
  "Samsung",
  "iPhone",
  "Infinix",
  "Tecno",
  "Xiaomi",
  "Itel",
  "Oppo",
  "Vivo",
  "Huawei",
  "Nokia",
  "Realme",
  "Honor",
];

const brandLogoMap = {
  Samsung: { label: "S", color: "#1428A0" },
  iPhone: { label: "A", color: "#000000" },
  Infinix: { label: "I", color: "#00A651" },
  Tecno: { label: "T", color: "#F0572E" },
  Xiaomi: { label: "X", color: "#FF6900" },
  Itel: { label: "IT", color: "#E53935" },
  Oppo: { label: "O", color: "#3AB54A" },
  Vivo: { label: "V", color: "#0090FF" },
  Huawei: { label: "H", color: "#FF0000" },
  Nokia: { label: "N", color: "#124191" },
  Realme: { label: "R", color: "#F7C600" },
  Honor: { label: "H", color: "#7C1D40" },
};

// Hero phone sources: use the two main phone images for hero stunts.
// Prefer local assets in `/public/phones/phone1.png` and `/public/phones/phone2.png`.
const heroPhones = [
  {
    src: "/phones/phone1.png",
    fallback:
      "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg",
  },
  {
    src: "/phones/phone2.png",
    fallback:
      "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-redmi-note-13-pro-1.jpg",
  },
];

export default function App() {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const searchTimeout = useRef(null);

  // =========================================
  // FETCH PRODUCTS
  // =========================================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/products`
      );

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setProducts(data);
      setAllProducts(data);
    } catch (error) {
      console.error(error);

      setError(
        "Failed to fetch products. Make sure your backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // SEARCH PRODUCTS
  // =========================================
  const searchProducts = async (keyword) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/products/search`,
        {
          params: {
            keyword,
          },
        }
      );

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setProducts(data);
    } catch (error) {
      console.error(error);

      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    return () => {
      clearTimeout(searchTimeout.current);
    };
  }, []);

  // =========================================
  // SEARCH HANDLER
  // =========================================
  const handleSearch = (value) => {
    setSearch(value);

    clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      if (value.trim().length > 1) {
        searchProducts(value);
      } else {
        setProducts(allProducts);
      }
    }, 500);
  };

  // =========================================
  // FILTER PRODUCTS
  // =========================================
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // BRAND FILTER
    if (selectedBrand !== "All") {
      filtered = filtered.filter((product) => {
        const brand =
          product.brand ||
          product.name ||
          "";

        return brand
          .toLowerCase()
          .includes(selectedBrand.toLowerCase());
      });
    }

    // SORTING
    if (sortBy === "low") {
      filtered.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sortBy === "high") {
      filtered.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sortBy === "rating") {
      filtered.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    return filtered;
  }, [products, selectedBrand, sortBy]);

  // =========================================
  // CLEAN PRODUCT NAME
  // =========================================
  const cleanName = (name = "") => {
    return name
      .replace(/\d{6,}/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // =========================================
  // SHORT NAME
  // =========================================
  const shortName = (name = "") => {
    const cleaned = cleanName(name);

    if (cleaned.length > 65) {
      return cleaned.substring(0, 65) + "...";
    }

    return cleaned;
  };

  // =========================================
  // FORMAT PRICE
  // =========================================
  const formatPrice = (price) => {
    const numericPrice = Number(price || 0);

    return numericPrice.toLocaleString();
  };

  const marqueeBrands = [...brands, ...brands];

  return (
    <div className="min-h-screen bg-[#f5f5f5] overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-[100] w-full bg-[#F68B1E] shadow-2xl border-b border-orange-400">

        {/* TOP BRAND RIBBON */}
        <div className="bg-[#151515] overflow-hidden py-3 border-b border-white/10 relative">

          {/* subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"></div>

          <div className="relative mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:px-10">

            <div className="hidden md:flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/90">
                Featured Brands
              </div>
              <p className="text-sm text-white/60">
                Premium phones from top mobile makers.
              </p>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-full border border-white/10 bg-[#0A0A0A]/95 py-2">
              <motion.div
                className="flex items-center gap-4 px-4"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: 32,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                }}
                style={{
                  minWidth: "max-content",
                  willChange: "transform",
                }}
              >
                {marqueeBrands.map((brand, index) => (
                  <span
                    key={`${brand}-${index}`}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-white/85 shadow-[0_8px_30px_rgba(255,255,255,0.04)]"
                  >
                    {brand}
                  </span>
                ))}
              </motion.div>

              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0A0A0A] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0A0A0A] to-transparent" />
            </div>

          </div>

        </div>

        {/* MAIN NAV */}
        <div className="w-full px-5 lg:px-10">

          <div className="min-h-[92px] py-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-4">

              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-md"
              >
                <FaMobileAlt className="text-[#F68B1E] text-2xl" />
              </motion.div>

              <div className="ml-2">

                <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-none">
                  Jumia Intelligence
                </h1>

                <p className="text-orange-100 mt-1 text-sm md:text-base tracking-wide">
                  Smart Phone Discovery Platform
                </p>

              </div>

            </div>

            {/* SEARCH */}
            <div className="flex flex-1 justify-center w-full lg:px-6">

              <div className="relative w-full max-w-3xl">

                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />

                <input
                  type="text"
                  placeholder="Search Samsung Galaxy, Infinix, iPhone..."
                  value={search}
                  onChange={(e) =>
                    handleSearch(e.target.value)
                  }
                  className="
                    w-full
                    py-4
                    pl-14
                    pr-28
                    md:pr-36
                    rounded-2xl
                    outline-none
                    text-base md:text-lg
                    bg-white
                    shadow-2xl
                    border-2
                    border-transparent
                    focus:border-black
                    transition-all
                  "
                />

                <button
                  onClick={() => {
                    if (search.trim()) {
                      searchProducts(search);
                    }
                  }}
                  className="
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    bg-[#1A1A1A]
                    hover:bg-black
                    text-white
                    px-4 sm:px-6
                    py-2.5
                    rounded-xl
                    font-bold
                    transition-all
                    duration-300
                  "
                >
                  Search
                </button>

              </div>

            </div>

            {/* STATS */}
            <div className="hidden md:flex items-center gap-4">

              <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-2xl px-5 py-3 shadow-xl">

                <p className="text-white text-sm">
                  Phones
                </p>

                <h2 className="text-white text-2xl font-black">
                  {filteredProducts.length}
                </h2>

              </div>

            </div>

          </div>

          <div className="mt-4 flex items-center justify-center gap-4 md:hidden">
            <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-3 shadow-xl text-center w-full max-w-xs">
              <p className="text-white text-sm">Phones</p>
              <h2 className="text-white text-2xl font-black">{filteredProducts.length}</h2>
            </div>
          </div>

        </div>

      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-r from-[#F68B1E] via-orange-500 to-[#ff7a00] overflow-hidden relative">

        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full border border-white/10"
        />

        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-300/10 rounded-full blur-3xl"></div>

        {/* FLOATING PARTICLES */}
        <div className="absolute inset-0 overflow-hidden">

          {[...Array(30)].map((_, index) => (

            <motion.div
              key={index}
              animate={{
                y: [0, -50, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.6, 1],
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute rounded-full bg-orange-100/30"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />

          ))}

        </div>

        <div className="w-full px-5 lg:px-10 py-16 relative z-10">

          <div className="grid grid-cols-1 gap-10 items-center lg:grid-cols-2">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >

              <div className="flex items-center gap-3 mb-6">

                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(255,255,255,0.2)",
                      "0 0 30px rgba(255,255,255,0.5)",
                      "0 0 0 rgba(255,255,255,0.2)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-lg"
                >
                  <FaBolt className="text-yellow-300" />

                  <span className="text-white font-semibold text-sm">
                    Live Phone Intelligence
                  </span>
                </motion.div>

              </div>

              <motion.h2
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight max-w-4xl"
              >
                Discover The Best Smartphones
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-base sm:text-lg text-orange-100 max-w-2xl leading-8"
              >
                Compare smartphone prices, discover top deals,
                search phones instantly and analyze mobile trends
                across Jumia Kenya.
              </motion.p>

              {/* QUICK STATS */}
              <div className="flex flex-wrap gap-5 mt-10">

                <motion.div
                  whileHover={{
                    scale: 1.08,
                    y: -5,
                  }}
                  className="bg-white/15 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20"
                >
                  <h3 className="text-white text-3xl font-black">
                    {filteredProducts.length}+
                  </h3>

                  <p className="text-orange-100">
                    Phones Indexed
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{
                    scale: 1.08,
                    y: -5,
                  }}
                  className="bg-white/15 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/20"
                >
                  <h3 className="text-white text-3xl font-black">
                    Live
                  </h3>

                  <p className="text-orange-100">
                    Price Monitoring
                  </p>
                </motion.div>

              </div>

            </motion.div>

            {/* RIGHT */}
            <div
              className="relative flex justify-center items-center h-[420px] md:h-[520px]"
              style={{ perspective: 1800 }}
            >

              {/* GLOW */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                }}
                className="absolute w-[360px] h-[360px] rounded-full bg-white/20 blur-3xl"
              />

              {heroPhones.map((phone, index) => {
                const placementClass =
                  index === 0
                    ? "w-56 sm:w-72 left-0 top-8 sm:top-10 z-40"
                    : "w-52 sm:w-64 right-0 top-12 sm:top-16 z-30";

                return (
                  <motion.img
                    key={index}
                    src={phone.src}
                    onError={(e) =>
                      (e.currentTarget.src =
                        phone.fallback)
                    }
                    alt={`phone-${index}`}
                    initial={false}
                    animate={{
                      y: [0, -16, 16],
                      rotateY: [0, 12, -12],
                      rotateZ: [0, 2, -2],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3.2,
                      times: [0, 0.12, 0.55, 1],
                      repeat: Infinity,
                      ease: "linear",
                      repeatType: "mirror",
                    }}
                    whileHover={{
                      scale: 1.12,
                      rotateY: 15,
                      z: 100,
                    }}
                    className={`absolute object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.45)] ${placementClass}`}
                    style={{
                      willChange: "transform",
                      transformStyle:
                        "preserve-3d",
                    }}
                  />
                );
              })}

            </div>

          </div>

        </div>

      </section>

      {/* MAIN */}
      <div className="w-full px-5 sm:px-6 lg:px-10 py-10 flex flex-col gap-8 lg:flex-row">

        {/* SIDEBAR */}
        <aside className="hidden lg:block w-[280px] shrink-0 relative">

          <div className="sticky top-[140px]">

            <div className="bg-white rounded-3xl p-6 shadow-xl">

              <div className="flex items-center gap-3 mb-7">

                <div className="bg-orange-100 p-3 rounded-2xl">
                  <FaFire className="text-[#F68B1E]" />
                </div>

                <h2 className="text-2xl font-black">
                  Filters
                </h2>

              </div>

              {/* SORT */}
              <div className="mb-8">

                <label className="font-bold text-gray-700 block mb-3">
                  Sort Products
                </label>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="
                    w-full
                    border-2
                    border-gray-200
                    rounded-2xl
                    px-4
                    py-4
                    outline-none
                    focus:border-[#F68B1E]
                  "
                >
                  <option value="default">
                    Default
                  </option>

                  <option value="low">
                    Lowest Price
                  </option>

                  <option value="high">
                    Highest Price
                  </option>

                  <option value="rating">
                    Highest Rated
                  </option>

                </select>

              </div>

              <button
                onClick={fetchProducts}
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-3
                  bg-black
                  hover:bg-[#1a1a1a]
                  text-white
                  py-4
                  rounded-2xl
                  font-bold
                  transition-all
                  mb-5
                "
              >
                <FaSyncAlt />
                Refresh Products
              </button>

              {/* INFO */}
              <div className="bg-[#F68B1E] rounded-3xl p-5 text-white">

                <div className="flex items-center gap-3 mb-3">
                  <FaCheckCircle />
                  <h3 className="font-black">
                    Smart Scraping
                  </h3>
                </div>

                <p className="text-sm text-orange-100 leading-7">
                  Prices, stock availability and new phones
                  auto update from Jumia using scheduled scraping.
                </p>

              </div>

            </div>

          </div>

        </aside>

        {/* CONTENT */}
        <main className="flex-1 min-w-0">

          {/* MOBILE FILTER BUTTON */}
          <div className="lg:hidden mb-5">

            <button
              onClick={() =>
                setMobileFiltersOpen(
                  !mobileFiltersOpen
                )
              }
              className="
                flex
                w-full
                items-center
                justify-center
                gap-3
                bg-[#F68B1E]
                text-white
                px-5
                py-3
                rounded-2xl
                font-bold
              "
            >
              <FaFilter />
              Filters
            </button>

          </div>

          {/* MOBILE FILTERS */}
          <AnimatePresence>

            {mobileFiltersOpen && (

              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="lg:hidden bg-white rounded-3xl p-5 mb-6 shadow-xl overflow-hidden"
              >

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value)
                  }
                  className="
                    w-full
                    border-2
                    border-gray-200
                    rounded-2xl
                    px-4
                    py-4
                    outline-none
                  "
                >
                  <option value="default">
                    Default
                  </option>

                  <option value="low">
                    Lowest Price
                  </option>

                  <option value="high">
                    Highest Price
                  </option>

                  <option value="rating">
                    Highest Rated
                  </option>

                </select>

              </motion.div>

            )}

          </AnimatePresence>

          {/* BRANDS */}
          <div className="flex gap-3 overflow-x-auto pb-5 mb-6 px-1">

            {["All", ...brands].map((brand) => (

              <motion.button
                whileTap={{ scale: 0.95 }}
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`
                  whitespace-nowrap
                  px-6
                  py-3
                  rounded-full
                  font-bold
                  transition-all
                  duration-300
                  ${
                    selectedBrand === brand
                      ? "bg-[#F68B1E] text-white shadow-xl scale-105"
                      : "bg-white hover:bg-orange-50 shadow"
                  }
                `}
              >
                {brand}
              </motion.button>

            ))}

          </div>

          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-4xl font-black text-[#1A1A1A]">
                Smartphones
              </h2>

              <p className="text-gray-500 mt-2">
                {filteredProducts.length} products available
              </p>

            </div>

          </div>

          {/* ERROR */}
          {error && (

            <div className="bg-red-100 border border-red-300 text-red-700 px-5 py-4 rounded-2xl mb-6">
              {error}
            </div>

          )}

          {/* LOADING */}
          {loading && (

            <div className="flex justify-center py-16">

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <FaSyncAlt className="text-5xl text-[#F68B1E]" />
              </motion.div>

            </div>

          )}

          {/* EMPTY */}
          {!loading &&
            filteredProducts.length === 0 && (

              <div className="bg-white rounded-3xl shadow-xl py-20 px-6 text-center">

                <FaBoxOpen className="mx-auto text-6xl text-gray-300 mb-6" />

                <h3 className="text-3xl font-black text-gray-700">
                  No Products Found
                </h3>

                <p className="text-gray-500 mt-3">
                  Try searching another phone brand.
                </p>

              </div>

            )}

          {/* PRODUCTS */}
          {!loading &&
            filteredProducts.length > 0 && (

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">

                {filteredProducts.map(
                  (product, index) => (

                    <motion.div
                      key={
                        product.id || index
                      }
                      initial={{
                        opacity: 0,
                        y: 40,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.02,
                      }}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                      }}
                      className="
                        bg-white
                        rounded-3xl
                        overflow-hidden
                        shadow-md
                        hover:shadow-2xl
                        transition-all
                        duration-300
                        group
                        cursor-pointer
                        flex
                        flex-col
                      "
                      onClick={() =>
                        setSelectedProduct(
                          product
                        )
                      }
                    >

                      {/* IMAGE */}
                      <div className="h-52 bg-[#fafafa] flex items-center justify-center overflow-hidden p-5 sm:p-6">

                        <img
                          src={
                            product.image_url
                          }
                          alt={
                            product.name
                          }
                          className="
                            h-full
                            object-contain
                            group-hover:scale-110
                            transition
                            duration-500
                          "
                        />

                      </div>

                      {/* CONTENT */}
                      <div className="p-4 sm:p-5 flex flex-col flex-1">

                        <div className="flex justify-between items-center mb-3">

                          <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                            {product.discount ||
                              "HOT"}
                          </span>

                          <span className="text-green-600 text-sm font-semibold">
                            {product.availability ||
                              "Available"}
                          </span>

                        </div>

                        <h3 className="font-bold text-gray-800 text-[15px] leading-6 min-h-[88px]">
                          {shortName(
                            product.name
                          )}
                        </h3>

                        <div className="mt-4">

                          <p className="text-3xl font-black text-[#F68B1E]">
                            KSh{" "}
                            {formatPrice(
                              product.price
                            )}
                          </p>

                        </div>

                        <div className="flex items-center gap-2 mt-4">

                          <FaStar className="text-yellow-400" />

                          <span className="font-semibold">
                            {product.rating ||
                              "4.5"}
                          </span>

                          <span className="text-gray-400 text-sm">
                            (
                            {product.reviews ||
                              0}
                            )
                          </span>

                        </div>

                        <button
                          className="
                            mt-auto
                            w-full
                            bg-[#F68B1E]
                            hover:bg-orange-600
                            text-white
                            py-3
                            rounded-2xl
                            font-bold
                            transition-all
                            duration-300
                            mt-5
                          "
                        >
                          View Details
                        </button>

                      </div>

                    </motion.div>

                  )
                )}

              </div>

            )}

        </main>

      </div>

      {/* MODAL */}
      <AnimatePresence>

        {selectedProduct && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              bg-black/70
              z-50
              flex
              items-center
              justify-center
              p-4
              overflow-y-auto
            "
          >

            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              className="
                bg-white
                rounded-3xl
                w-full
                max-w-4xl
                max-h-[90vh]
                overflow-y-auto
                relative
                shadow-2xl
              "
            >

              {/* CLOSE */}
              <button
                onClick={() =>
                  setSelectedProduct(null)
                }
                className="
                  absolute
                  top-4
                  right-4
                  bg-gray-100
                  hover:bg-gray-200
                  p-3
                  rounded-full
                  z-10
                "
              >
                <FaTimes />
              </button>

              <div className="grid md:grid-cols-2 gap-6 p-6">

                {/* IMAGE */}
                <div className="bg-[#fafafa] rounded-3xl p-6 flex items-center justify-center">

                  <img
                    src={
                      selectedProduct.image_url
                    }
                    alt={
                      selectedProduct.name
                    }
                    className="max-h-[320px] object-contain"
                  />

                </div>

                {/* DETAILS */}
                <div>

                  <div className="flex items-center gap-3 mb-4 flex-wrap">

                    <span className="bg-[#F68B1E] text-white px-4 py-2 rounded-full text-sm font-bold">
                      {selectedProduct.brand ||
                        "Smartphone"}
                    </span>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                      {selectedProduct.availability ||
                        "Available"}
                    </span>

                  </div>

                  <h2 className="text-3xl font-black text-[#1A1A1A] leading-tight">
                    {cleanName(
                      selectedProduct.name
                    )}
                  </h2>

                  <div className="flex items-center gap-3 mt-5">

                    <FaStar className="text-yellow-400 text-xl" />

                    <span className="font-bold text-lg">
                      {selectedProduct.rating ||
                        "4.5"}
                    </span>

                    <span className="text-gray-500">
                      (
                      {selectedProduct.reviews ||
                        0}{" "}
                      reviews)
                    </span>

                  </div>

                  <div className="mt-7">

                    <p className="text-5xl font-black text-[#F68B1E]">
                      KSh{" "}
                      {formatPrice(
                        selectedProduct.price
                      )}
                    </p>

                  </div>

                  <div className="mt-8 space-y-4">

                    <div className="flex justify-between border-b pb-3">
                      <span className="text-gray-500">
                        Seller
                      </span>

                      <span className="font-bold">
                        {selectedProduct.seller ||
                          "Jumia"}
                      </span>
                    </div>

                    <div className="flex justify-between border-b pb-3">
                      <span className="text-gray-500">
                        Discount
                      </span>

                      <span className="font-bold text-red-500">
                        {selectedProduct.discount ||
                          "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between border-b pb-3">
                      <span className="text-gray-500">
                        Category
                      </span>

                      <span className="font-bold">
                        {selectedProduct.category ||
                          "Phones"}
                      </span>
                    </div>

                  </div>

                  <a
                    href={
                      selectedProduct.product_url ||
                      "#"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="
                      block
                      mt-8
                      bg-[#F68B1E]
                      hover:bg-orange-600
                      text-white
                      text-center
                      py-4
                      rounded-2xl
                      font-black
                      text-lg
                      transition-all
                      duration-300
                    "
                  >
                    Open On Jumia
                  </a>

                </div>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}