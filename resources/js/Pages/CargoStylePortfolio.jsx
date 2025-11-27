import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePage } from "@inertiajs/react";
import { createPortal } from "react-dom";
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

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
        style={{ marginBottom: "30px",marginLeft:"20px", fontSize: "30px" }}
        className="font-bold tracking-tight"
      >
        {/* FELICITA<br />SALA  */}
        <img
          src={`/storage/projects/website-name.jpg`}
          loading="lazy"
          className="w-auto h-18 object-contain"
        />
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

/* ------------------------- Masonry Grid (Masonry Library) ------------------------- */
function GridMasonry({ projects, onOpen }) {
  const gridRef = useRef(null);
  const masonryInstance = useRef(null);

  useEffect(() => {
    if (!gridRef.current || !projects?.length) return;

    const container = gridRef.current;

    // Wait for all images to load before initializing Masonry
    imagesLoaded(container, () => {
      // Destroy existing instance if it exists
      if (masonryInstance.current) {
        masonryInstance.current.destroy();
      }

      // Initialize Masonry with options
      masonryInstance.current = new Masonry(container, {
        itemSelector: '.masonry-item',
        columnWidth: '.grid-sizer', // Use grid sizer for responsive column width
        percentPosition: true,
        horizontalOrder: true,
        gutter: 0 // We handle all spacing in CSS
      });

      // Layout after initialization
      masonryInstance.current.layout();
    });

    // Clean up on unmount or when projects change
    return () => {
      if (masonryInstance.current) {
        masonryInstance.current.destroy();
        masonryInstance.current = null;
      }
    };
  }, [projects]);

  return (
    <>
      <style>{`
        .masonry-grid {
          position: relative;
        }

        .grid-sizer,
        .masonry-item {
          width: calc(50% - 4px); /* 2 columns with horizontal gap of 8px total */
        }

        .masonry-item {
          position: absolute; /* Masonry will position these */
          left: 0;
          top: 0;
          padding-right: 8px; /* Horizontal gap */
          margin-bottom: 8px; /* Vertical gap - matching horizontal */
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

        @media (min-width: 1024px) {
          .grid-sizer,
          .masonry-item {
            width: calc(33.333% - 8px); /* 3 columns with horizontal gap of 12px total */
          }
          .masonry-item {
            padding-right: 12px; /* Desktop horizontal gap */
            margin-bottom: 12px; /* Desktop vertical gap - matching horizontal */
          }
        }
      `}</style>

      <div ref={gridRef} className="masonry-grid">
        <div className="grid-sizer"></div> {/* Helper element for column width */}
        {projects.map((p) => (
          <motion.article
            key={p.id}
            className="masonry-item"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => onOpen(p)}
            style={{ cursor: "pointer" }}
          >
            <img src={p.cover_image_url || `/storage/${p.cover_image}`} alt={p.title} loading="lazy" />
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
            src={project.cover_image_url || `/storage/${project.cover_image}`}
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
                    src={art.image_url || `/storage/${art.image_path}`}
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
  const { activeArtist } = usePage().props;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-8 items-center">
      {/* Gambar atau Avatar */}
      <div className="flex justify-center md:justify-start">
        {activeArtist?.profile_picture ? (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
            <img
              src={`/storage/${activeArtist.profile_picture}`}
              alt={activeArtist.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* Teks */}
      <div className="space-y-6 mt-6 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          {activeArtist?.name || "About Me"}
        </h1>
        {activeArtist?.bio && (
          <p className="text-gray-700 text-lg md:text-xl font-medium leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1">
            {activeArtist.bio}
          </p>
        )}
        {activeArtist?.about_me && (
          <div className="text-gray-700 text-base md:text-lg leading-relaxed space-y-3">
            {activeArtist.about_me
              .split('\n')
              .map(paragraph => paragraph.trim())
              .filter(paragraph => paragraph.length > 0)
              .map((paragraph, i) => (
              <p key={i} className="mb-3">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function Contact() {
  const { activeArtist } = usePage().props;

  const isEmail = (platform) =>
    platform?.toLowerCase().includes("email") || platform?.toLowerCase().includes("mail");

  const normalizeLink = (contact) => {
    if (isEmail(contact.platform)) return `mailto:${contact.value}`;
    return contact.value.startsWith("http") ? contact.value : `https://${contact.value}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-16">
      {/* Header */}
      <div className="text-start max-w-3xl mx-auto space-y-1 mb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Get In Touch
        </h1>
        <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
          Interested in collaborating or just want to say hello? Feel free to reach out through any platform below.
        </p>
      </div>

      {/* Artist Info */}
      {activeArtist && (
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 text-center space-y-1 mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            {activeArtist.name}
          </h2>
          <p className="text-gray-700 italic text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-2">
            {activeArtist.bio}
          </p>
        </div>
      )}

      {/* Contact Cards */}
      {activeArtist?.contacts?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeArtist.contacts.map((contact, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col text-center"
            >
              <div className="flex flex-col items-center space-y-3 flex-1">
                {/* Icon */}
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                  {contact.remix_icon ? (
                    <i className={`ri-${contact.remix_icon} text-2xl text-amber-600`}></i>
                  ) : (
                    <span className="text-amber-600 font-bold text-xl">
                      {contact.platform?.charAt(0) ?? "?"}
                    </span>
                  )}
                </div>

                {/* Platform Name */}
                <h3 className="font-semibold text-gray-900 text-lg">
                  {contact.platform || "Platform"}
                </h3>

                {/* Value */}
                <p className="text-gray-700 text-sm break-all">
                  {contact.value || "No value"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center space-y-4 py-16">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
            <i className="ri-contacts-book-2-line text-2xl text-gray-500"></i>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">No Contact Information</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Please check back later or try another way to reach out.
          </p>
        </div>
      )}

      {/* CTA Section */}
      {/* <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-3xl p-10 text-center border border-amber-200 space-y-4 shadow-inner mt-4">
        <h3 className="text-2xl font-bold text-gray-900">Prefer Direct Communication?</h3>
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Send an email directly to discuss potential projects, collaborations, or simply to say hello.
        </p>

        <button
          onClick={() => (window.location.href = "mailto:hestia@example.com")}
          className="px-8 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors shadow-lg text-base font-medium"
        >
          Send Email
        </button>
      </div> */}
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
          {/* <img
            src={`/storage/projects/website-name.jpg`}
            alt="Website Logo"
            loading="lazy"
            className="w-10 h-10 object-contain"
          /> */}
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
        <div className="md:hidden sticky top-0 z-30 bg-white">
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
        <main className="pt-20 md:pt-8 max-w-5xl mx-auto p-4">
          <img
            src={`/storage/projects/website-name.jpg`}
            alt="Website Logo"
            loading="lazy"
            className="w-auto h-16 object-contain md:hidden"
          />
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
