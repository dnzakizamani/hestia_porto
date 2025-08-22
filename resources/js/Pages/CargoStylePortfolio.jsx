import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePage } from "@inertiajs/react";
import { createPortal } from "react-dom";

/* ---------- routing/hash helper ---------- */
function useRoute(projects) {
  const [route, setRoute] = useState({ name: "work", payload: null });
  const navigate = (name, payload = null) => setRoute({ name, payload });

  useEffect(() => {
    const applyFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const [name, id] = hash.split(":");
      if (name === "work") navigate("work");
      else if (name === "about") navigate("about");
      else if (name === "contact") navigate("contact");
      else if (name === "project" && id) {
        const p = projects.find((x) => String(x.id) === id);
        if (p) navigate("project", { project: p });
      }
    };
    applyFromHash();
    window.addEventListener("hashchange", applyFromHash);
    return () => window.removeEventListener("hashchange", applyFromHash);
  }, [projects]);

  useEffect(() => {
    if (route.name === "work") window.location.hash = "work";
    if (route.name === "about") window.location.hash = "about";
    if (route.name === "contact") window.location.hash = "contact";
    if (route.name === "project" && route.payload?.project?.id)
      window.location.hash = `project:${route.payload.project.id}`;
  }, [route]);

  return { route, navigate };
}

// /* ---------------------------- Mobile Sidebar Drawer ---------------------------- */
// /* ---------------------------- Mobile Sidebar Drawer ---------------------------- */
// function MobileMenu({ isOpen, onClose, onNav, current }) {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ x: -300, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           exit={{ x: -300, opacity: 0 }}
//           transition={{ duration: 0.3 }}
//           className="fixed top-0 left-0 h-full w-[250px] bg-white rounded-r-2xl shadow-2xl md:hidden flex flex-col"
//           style={{ zIndex: 1000 }}
//         >
//           <div className="flex justify-between items-center p-4 border-b">
//             <button onClick={onClose} className="text-2xl p-2">✕</button>
//           </div>
//           <nav className="p-4">
//             <button onClick={() => { onNav("work"); onClose(); }} className="block py-2">WORK</button>
//             <button onClick={() => { onNav("about"); onClose(); }} className="block py-2">ABOUT</button>
//             <button onClick={() => { onNav("contact"); onClose(); }} className="block py-2">CONTACT</button>
//           </nav>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

function DropdownMenu({ isOpen, onNav, current }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg w-screen border z-20"
        >
          <nav className="flex flex-col text-sm">
            <button
              onClick={() => onNav("work")}
              className={`px-4 py-2 text-left hover:bg-gray-100 ${
                current === "work" ? "font-semibold" : ""
              }`}
            >
              WORK
            </button>
            <button
              onClick={() => onNav("about")}
              className={`px-4 py-2 text-left hover:bg-gray-100 ${
                current === "about" ? "font-semibold" : ""
              }`}
            >
              ABOUT
            </button>
            <button
              onClick={() => onNav("contact")}
              className={`px-4 py-2 text-left hover:bg-gray-100 ${
                current === "contact" ? "font-semibold" : ""
              }`}
            >
              CONTACT
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}





/* ---------------------------- Sidebar ---------------------------- */
function Sidebar({ onNav, current }) {
  const LinkBtn = ({ label, target }) => (
    <button
      onClick={() => onNav(target)}
      className={`block mb-4 text-[13px] tracking-wide uppercase text-left ${
        current === target ? "opacity-100 font-semibold" : "opacity-80"
      }`}
    >
      {label}
    </button>
  );

  return (
    <aside
      className="hidden md:flex flex-shrink-0 bg-white h-screen p-6 flex flex-col text-black"
      style={{ width: "250px" }}
    >
      <div
        style={{ marginBottom: "30px", fontSize: "30px" }}
        className="font-bold tracking-tight"
      >
        {/* FELICITA<br />SALA  */}
        <img src={`/storage/projects/website-name.jpg`}  loading="lazy" />
      </div>
  
      <nav
        className="flex flex-col"
        style={{ gap: "20px", marginLeft: "20px" }}
      >
        <LinkBtn label="WORK" target="work" />
        <LinkBtn label="ABOUT" target="about" />
        <LinkBtn label="CONTACT" target="contact" />
      </nav>
    </aside>
  );
}

/* ------------------------- Masonry Grid (JS-driven) ------------------------- */
function GridMasonry({ projects, onOpen }) {
  const gridRef = useRef(null);

  const resizeAllGridItems = () => {
    const grid = gridRef.current;
    if (!grid) return;
    const computed = window.getComputedStyle(grid);
    const rowHeight = parseInt(computed.getPropertyValue("grid-auto-rows")) || 8;
    const rowGap = parseInt(computed.getPropertyValue("gap")) || parseInt(computed.getPropertyValue("grid-row-gap")) || 24;

    const items = Array.from(grid.children);
    items.forEach((item) => {
      const img = item.querySelector("img");
      if (!img) return;
      const titleEl = item.querySelector("h3");
      const titleH = titleEl ? titleEl.getBoundingClientRect().height + 8 : 0;
      const itemHeight = img.getBoundingClientRect().height + titleH;
      const span = Math.ceil((itemHeight + rowGap) / (rowHeight + 0.0001));
      item.style.gridRowEnd = `span ${span}`;
    });
  };

  const waitImagesLoaded = () => {
    const grid = gridRef.current;
    if (!grid) return Promise.resolve();
    const imgs = Array.from(grid.querySelectorAll("img"));
    const promises = imgs.map((img) => {
      if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
      return new Promise((res) => {
        img.addEventListener("load", res, { once: true });
        img.addEventListener("error", res, { once: true });
      });
    });
    return Promise.all(promises);
  };

  useEffect(() => {
    let mounted = true;
    const setup = async () => {
      await waitImagesLoaded();
      if (!mounted) return;
      resizeAllGridItems();
    };
    setup();

    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        resizeAllGridItems();
      }, 120);
    };
    window.addEventListener("resize", onResize);

    const ro = new MutationObserver(() => {
      waitImagesLoaded().then(resizeAllGridItems);
    });
    if (gridRef.current) ro.observe(gridRef.current, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });

    return () => {
      mounted = false;
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [projects]);

  useEffect(() => {
    waitImagesLoaded().then(resizeAllGridItems);
  }, [projects]);

  return (
    <>
      <style>{`
        .masonry-grid {
          display: grid;
          grid-template-columns: 1fr;
          grid-auto-rows: 8px;
          gap: 1px;
          align-items: start;
          padding-top: 12px;
          padding-right: 0;
        }

        @media (min-width: 640px) {
          .masonry-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0px 24px;
            padding-right: 18px;
          }
        }

        @media (min-width: 1024px) {
          .masonry-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0px 24px;
            padding-right: 18px;
          }
        }

        .masonry-item img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 3px;
        }

        .masonry-item h3 {
          margin: 8px 0 0 0;
          font-size: 13px;
          line-height: 1.1;
        }
      `}</style>

      <div ref={gridRef} className="masonry-grid">
        {projects.map((p) => (
          <motion.article
            key={p.id}
            className="masonry-item"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => onOpen(p)}
            style={{ cursor: "pointer", breakInside: "avoid", WebkitColumnBreakInside: "avoid" }}
          >
            <img src={`/storage/${p.cover_image}`} alt={p.title} loading="lazy" />
          </motion.article>
        ))}
      </div>
    </>
  );
}

/* --------------------------- Details / Pages --------------------------- */
function ProjectDetail({ project, onBack }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <header className="mb-12" style={{marginTop:"10px"}}>
        <div className="mb-8">
          {/* <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
              {project.category?.name}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-xs font-medium">
              {project.published_at
                ? new Date(project.published_at).getFullYear()
                : ""}
            </span>
          </div> */}
          {/* <span className="inline-block px-3 py-1 mb-5 bg-orange-100 text-orange-800 !text-orange-800 rounded-full text-xs font-medium">
            {project.category?.name}
          </span> */}


          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            {project.title}
          </h1>

        </div>
        
        {project.description && (
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-gray-700 leading-relaxed">
              {project.description}
            </p>
          </div>
        )}
      </header>

      {/* Cover Image */}
      <div className="mb-8">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <img
            src={`/storage/${project.cover_image}`}
            alt={project.title}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      {/* Artworks */}      
      {project.artworks?.length > 0 && (
        <section style={{ marginTop:"20px" }}>
          {/* <div className="text-center" style={{marginBottom:"10px"}}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Artworks
            </h2>
            <div className="w-20 h-1 bg-gray-900 mx-auto"></div>
          </div> */}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
            {project.artworks.map((art) => (
              <motion.div 
                key={art.id} 
                className="group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <img
                    src={`/storage/${art.image_path}`}
                    alt={art.title}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {art.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-sm">
                        {art.title}
                      </h3>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Footer Actions */}
      <div className="text-center py-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg shadow-lg hover:bg-gray-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}


function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-8 items-center">
      
      {/* Gambar atau Avatar */}
      <div className="flex justify-center md:justify-start">
        <img 
          src="/storage/projects/single.jpg"
          alt="My Avatar"
          className="w-48 h-48 md:w-56 md:h-56 rounded-xl object-cover shadow-lg hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Teks */}
      <div className="space-y-4 mt-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          About Me
        </h1>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        <br />
        <br />
        Why do we use it?
        <br />
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
        <br />
        <br />

        Where does it come from?
        <br />
        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
        <br />
        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
        </p>
      </div>

    </div>
  );
}


function Contact() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-[18px] md:text-[22px] leading-snug">Contact</h1>
      <div className="text-[14px] md:text-[16px] space-y-1">
        <p>Email: hello@example.com</p>
        <p>Instagram: @yourhandle</p>
        <p>Behance / ArtStation: yourpage</p>
      </div>
    </div>
  );
}

/* -------------------------- Main Component -------------------------- */
export default function CargoStylePortfolio() {
  const { projects } = usePage().props;
  const { route, navigate } = useRoute(projects);
  const data = useMemo(() => projects || [], [projects]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black relative flex">
      
      {/* Sidebar – hanya tampil di laptop */}
      <div className="hidden md:flex">
        <Sidebar onNav={navigate} current={route.name} />
      </div>

      <div className="flex-1">
        {/* Header Mobile */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b p-4 flex justify-between items-center shadow-lg z-20">
          {/* <div className="font-bold text-lg">FELICITA SALA</div> */}
          <img 
            src={`/storage/projects/website-name.jpg`}  
            alt="Website Logo"
            loading="lazy" 
            className="h-auto object-contain" 
            style={{width:"5rem"}}
          />
          <button
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            className="p-2 relative z-30"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Dropdown menu – hanya tampil di mobile */}
        <div className="md:hidden relative">
          <DropdownMenu
            isOpen={isMobileMenuOpen}
            onNav={(name) => {
              navigate(name);
              setIsMobileMenuOpen(false);
            }}
            current={route.name}
          />
        </div>

        {/* Konten utama */}
        <main className="pt-20 md:pt-8 max-w-3xl mx-auto p-4">
          <AnimatePresence mode="wait">
            {route.name === "work" && (
              <motion.section key="work" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GridMasonry projects={data} onOpen={(p) => navigate("project", { project: p })} />
              </motion.section>
            )}
            {route.name === "project" && (
              <motion.section key="project" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProjectDetail project={route.payload.project} onBack={() => navigate("work")} />
              </motion.section>
            )}
            {route.name === "about" && (
              <motion.section key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <About />
              </motion.section>
            )}
            {route.name === "contact" && (
              <motion.section key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Contact />
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
