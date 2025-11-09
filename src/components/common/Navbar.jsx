import React, { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

const slugify = (str = "") =>
  String(str).trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export default function Navbar() {
  const token = useSelector((s) => s.auth?.token ?? null);
  const user = useSelector((s) => s.profile?.user ?? null);
  const totalItems = useSelector((s) => s.cart?.totalItems ?? 0);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mobile toggle
  const [catalogOpen, setCatalogOpen] = useState(false);
  // Desktop hover state (keeps dropdown open while mouse is inside trigger or dropdown)
  const [hoveringCatalog, setHoveringCatalog] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        const cats = res?.data?.data ?? res?.data ?? [];
        if (mounted) setSubLinks(Array.isArray(cats) ? cats : []);
      } catch (err) {
        console.error("Could not fetch categories:", err);
        if (mounted) setSubLinks([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const matchRoute = (route) => matchPath({ path: route }, location.pathname);

  // show dropdown on desktop when hoveringCatalog === true
  const showDropdownDesktop = hoveringCatalog;

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, idx) => (
              <li key={idx}>
                {link.title === "Catalog" ? (
                  // Add onMouseEnter/Leave to the wrapper so hoveringCatalog stays true
                  <div
                    className={`relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25"
                    }`}
                    onMouseEnter={() => setHoveringCatalog(true)}
                    onMouseLeave={() => setHoveringCatalog(false)}
                  >
                    <p>{link.title}</p>
                    <BsChevronDown />

                    {/* Dropdown: positioned directly under trigger with no gap (top-full + mt-2) */}
                    <div
                      className={`absolute left-1/2 top-full z-[1000] w-[220px] -translate-x-1/2 mt-2 flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 transition-all duration-150 ${
                        showDropdownDesktop ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-1"
                      } lg:w-[300px]`}
                      // also allow the dropdown to keep hover state if mouse enters dropdown itself
                      onMouseEnter={() => setHoveringCatalog(true)}
                      onMouseLeave={() => setHoveringCatalog(false)}
                    >
                      <div className="absolute left-1/2 top-0 -z-10 h-4 w-4 -translate-x-1/2 -translate-y-2 rotate-45 bg-richblack-5" />

                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks?.length > 0 ? (
                        subLinks
                          .filter((s) => {
                            if (!s) return false;
                            if (Array.isArray(s.courses)) return s.courses.length > 0;
                            return true;
                          })
                          .map((s, i) => {
                            const name = s?.name ?? s?.title ?? `category-${i}`;
                            return (
                              <Link
                                key={s?._id ?? name}
                                to={`/catalog/${slugify(name)}`}
                                className="block rounded-lg bg-transparent py-3 px-2 hover:bg-richblack-50"
                              >
                                <p>{name}</p>
                              </Link>
                            );
                          })
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side (desktop) */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {!token && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {!token && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token && <ProfileDropdown />}
        </div>

        {/* Mobile button */}
        <div className="flex items-center gap-2 md:hidden">
          <button className="mr-2" onClick={() => setCatalogOpen((p) => !p)} aria-expanded={catalogOpen}>
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {catalogOpen && (
        <div className="absolute top-[3.5rem] left-0 right-0 z-50 bg-richblack-800/95 p-4 md:hidden">
          <ul className="flex flex-col gap-2">
            {loading ? (
              <li>Loading...</li>
            ) : subLinks?.length > 0 ? (
              subLinks.map((s, i) => (
                <li key={s?._id ?? i}>
                  <Link to={`/catalog/${slugify(s?.name ?? s?.title ?? `category-${i}`)}`} className="block py-2 px-3">
                    {s?.name ?? s?.title ?? `Category ${i + 1}`}
                  </Link>
                </li>
              ))
            ) : (
              <li>No categories found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
 