// ============================================
// REINO EDAS - main.js (versión final, corregida y mejorada)
// ============================================

// --- Helpers para leer datos en tiempo real ---
function getEventData() {
  return Array.isArray(window.eventData) ? window.eventData : [];
}
function getGalleryData() {
  return Array.isArray(window.galleryData) ? window.galleryData : [];
}
function getMultimediaData() {
  return Array.isArray(window.multimediaData) ? window.multimediaData : [];
}

function getEventos() {
  return getEventData().filter(e => e.activo !== false);
}
function getGaleria() {
  return getGalleryData();
}
function getMultimedia() {
  return getMultimediaData();
}

const etiquetaIndex = 'assets/emblema.png';
function getEtiquetaImage() {
  return etiquetaIndex;
}

function escapeHtml(text) {
  if (text == null) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

// Barajar array (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const CATEGORY_ICONS = {
  'Próximo Evento': 'fas fa-calendar-star',
  'Aviso Importante': 'fas fa-exclamation-triangle',
  'Noticia': 'fas fa-newspaper',
  'Galería': 'fas fa-images',
  'Otro': 'fas fa-info-circle'
};

function getIconForCategory(cat) {
  return CATEGORY_ICONS[cat] || 'fas fa-bullhorn';
}

// === BANNER DE NOTICIAS ===
let _bannerIntervalId = null;
function updateNewsBanner() {
  const el = document.querySelector('.news-content');
  if (!el) return;

  const evs = getEventos().filter(e => e.showInBanner);
  if (evs.length === 0) {
    const mm = getMultimedia();
    if (mm.length > 0) {
      let index = 0;
      el.textContent = mm[index].mensaje || mm[index].titulo || 'Novedades del reino';
      if (_bannerIntervalId) clearInterval(_bannerIntervalId);
      _bannerIntervalId = setInterval(() => {
        index = (index + 1) % mm.length;
        el.textContent = mm[index].mensaje || mm[index].titulo || '';
      }, 5000);
      return;
    }
    const all = getEventos();
    el.textContent = all.length ? `${all[0].titulo} — ${all[0].fecha || ''}` : 'No hay avisos en este momento.';
    return;
  }

  const fragment = document.createDocumentFragment();
  evs.sort((a, b) => {
    const aTime = a.fechaRaw ? new Date(a.fechaRaw).getTime() : 0;
    const bTime = b.fechaRaw ? new Date(b.fechaRaw).getTime() : 0;
    return aTime - bTime;
  });

  evs.forEach((e, idx) => {
    const span = document.createElement('span');
    span.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin-right:18px;';
    span.innerHTML = `
      <i class="${getIconForCategory(e.categoria)}" style="color:#ffd700;"></i>
      <strong>${escapeHtml(e.titulo)}</strong>${e.fecha ? ` — ${escapeHtml(e.fecha)}` : ''}
      ${e.hora ? ` a las ${escapeHtml(e.hora)}` : ''}
    `;
    fragment.appendChild(span);
    if (idx < evs.length - 1) fragment.appendChild(document.createTextNode(' | '));
  });

  if (_bannerIntervalId) clearInterval(_bannerIntervalId);
  _bannerIntervalId = null;
  el.innerHTML = '';
  el.appendChild(fragment);
}

// === GENERADORES HTML ===
function generateNewsCards() {
  const evs = getEventos().slice(0, 4);
  const img = getEtiquetaImage();
  if (evs.length === 0) {
    return '<p style="text-align:center; padding:1.5rem; color:#c0a885;">No hay eventos próximos.</p>';
  }
  return evs.map(e => {
    const hasImage = Array.isArray(e.imagenes) && e.imagenes[0];
    const bg = hasImage 
      ? `background: linear-gradient(to top, rgba(0,0,0,0.75), transparent), url('${e.imagenes[0]}') center/cover no-repeat;` 
      : 'background: #1a1a2e;';
    const textColor = 'color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.8);';

    let badgeBg = 'rgba(0,0,0,0.3)';
    let badgeColor = '#e6d3a7';
    if (e.categoria === 'Próximo Evento') {
      badgeBg = 'rgba(46, 139, 87, 0.85)';
      badgeColor = '#f0fff0';
    } else if (e.categoria === 'Aviso Importante') {
      badgeBg = 'rgba(245, 158, 11, 0.85)';
      badgeColor = '#1c1917';
    } else if (e.categoria === 'Noticia') {
      badgeBg = 'rgba(59, 130, 246, 0.85)';
      badgeColor = '#f0f9ff';
    }

    return `
      <div class="news-card event-news-card" data-event-id="${escapeHtml(e.id)}" style="position:relative;cursor:pointer;${bg} ${textColor}; padding:1rem; border-radius:10px; overflow:hidden; min-height:160px; display:flex; flex-direction:column; justify-content:space-between;">
        ${img ? `<img src="${img}" class="event-badge" style="width:36px;height:36px;border-radius:50%;position:absolute;top:-12px;right:-12px;border:2px solid gold;z-index:1;">` : ''}
        <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
          <span class="news-badge upcoming-badge" style="display:inline-block;padding:4px 10px;border-radius:6px;font-weight:bold;background:${badgeBg};color:${badgeColor};margin-bottom:8px;align-self:flex-start;">
            ${escapeHtml(e.categoria || 'Evento')}
          </span>
          <div style="display:flex;flex-wrap:wrap;gap:4px 8px;margin-bottom:6px;font-size:0.85rem;">
            <span style="color:#ffd700;font-weight:bold;">${escapeHtml(e.fecha || '')}</span>
            ${e.hora ? `<span style="color:#ff0800;font-weight:bold;font-size:1.125rem;">a las ${escapeHtml(e.hora)}</span>` : ''}
          </div>
          <h3 class="news-headline" style="margin:6px 0 8px;font-size:1.25rem;line-height:1.3;color:white;">
            ${escapeHtml(e.titulo)}
          </h3>
          <p class="news-summary" style="margin:0;font-size:0.9rem;color:white;">
            ${escapeHtml(e.resumen || e.descripcion || '')}
          </p>
        </div>
      </div>
    `;
  }).join('');
}

function generateEventCards() {
  const evs = getEventos();
  const img = getEtiquetaImage();
  if (evs.length === 0) {
    return '<p style="text-align:center; padding:1.5rem; color:#c0a885;">No hay eventos programados.</p>';
  }
  return evs.map(e => {
    const hasImage = Array.isArray(e.imagenes) && e.imagenes[0];
    const bg = hasImage ? `background: url('${e.imagenes[0]}') center/cover no-repeat;` : 'background: #151524ff;';
    const color = hasImage ? 'color: white; text-shadow: 0 2px 6px rgba(0,0,0,0.8);' : 'color: #e6d3a7;';
    return `
      <div class="event-item event-card" data-event-id="${escapeHtml(e.id)}" style="position:relative;cursor:pointer;${bg} ${color}; border-radius:14px; overflow:hidden; padding:1rem; margin-bottom:1rem;">
        ${img ? `<img src="${img}" class="event-badge" style="width:44px;height:44px;border-radius:50%;position:absolute;top:8px;right:8px;border:2px solid gold;z-index:1;">` : ''}
        <div style="padding:0.5rem;">
          <div class="event-date" style="font-size:0.9rem;margin-bottom:6px;">${escapeHtml(e.fecha || '')} ${e.hora ? ' a las ' + escapeHtml(e.hora) : ''}</div>
          <h3 class="event-title" style="margin:6px 0 8px;">${escapeHtml(e.titulo)}</h3>
          <p style="margin:0;">${escapeHtml(e.resumen || e.descripcion || '')}</p>
        </div>
      </div>
    `;
  }).join('');
}

function generateGalleryItems() {
  const g = getGaleria();
  if (g.length === 0) {
    return '<p style="text-align:center; padding:2rem; color:#c9a87a; font-style:italic;">El libro de los héroes aún está en blanco...</p>';
  }

  // 🔁 Mostrar en orden aleatorio
  const shuffled = shuffleArray(g);

  return shuffled.map(i => {
    const imageHtml = i.imagen ? 
      `<div style="aspect-ratio: 4/3; overflow:hidden; border-radius:12px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
         <img src="${i.imagen}" alt="${escapeHtml(i.titulo)}" loading="lazy" style="width:100%; height:100%; object-fit: cover; display:block;">
       </div>` : 
      `<div style="aspect-ratio: 4/3; display:flex; align-items:center; justify-content:center; background:rgba(30,30,46,0.6); color:#a99a7c; border-radius:12px; font-style:italic;">
         Sin retrato
       </div>`;

    return `
      <div class="gallery-hero-entry" style="display:flex; gap:16px; padding:16px; border-radius:12px; background:rgba(0,0,0,0.35); margin-bottom:16px; backdrop-filter: blur(2px); border: 1px solid rgba(230,211,167,0.1);">
        <div style="width:140px; flex-shrink:0;">${imageHtml}</div>
        <div class="gallery-hero-text" style="flex:1; color:#e6d3a7;">
          <h3 class="gallery-hero-name" style="margin:0 0 8px; font-size:1.2rem; color:#ffd700;">${escapeHtml(i.titulo)}</h3>
          ${i.personaje ? `<p class="gallery-hero-role" style="margin:0 0 8px; color:#d3b37a; font-style:italic;">${escapeHtml(i.personaje)}</p>` : ''}
          <p class="gallery-hero-date" style="margin:0 0 10px; font-size:0.85rem; color:#c9a87a;">${escapeHtml(i.fecha || '')}</p>
          <p class="gallery-hero-legend" style="margin:0; line-height:1.5; color:#f5f0e1;">${escapeHtml(i.descripcion || '')}</p>
        </div>
      </div>
    `;
  }).join('');
}

function generateMultimediaItems() {
  const items = getMultimedia();
  if (items.length === 0) {
    return '<p style="text-align:center; padding:2rem; color:#c9a87a; font-style:italic;">Aún no hay crónicas visuales...</p>';
  }

  // 🔁 Barajar los elementos de multimedia
  const shuffledItems = shuffleArray(items);

  return shuffledItems.map(item => {
    let mediaHtml = '';
    if (item.tipo === 'youtube' && item.url) {
      const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = String(item.url).match(regExp);
      const videoId = (match && match[1] && match[1].length === 11) ? match[1] : null;
      if (videoId) {
        mediaHtml = `
          <div style="width:100%; max-width:700px; margin:0 auto;">
            <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
              <iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
                      style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                      title="${escapeHtml(item.titulo)}">
              </iframe>
            </div>
          </div>`;
      } else {
        mediaHtml = '<p style="color:#ff6b6b; padding:1rem; border-radius:8px; background:rgba(0,0,0,0.2);">URL de YouTube inválida</p>';
      }
    } else if ((item.tipo === 'image' || !item.tipo) && item.url) {
      mediaHtml = `
        <div style="width:100%; max-width:700px; margin:0 auto;">
          <div style="aspect-ratio: 16/9; overflow:hidden; border-radius:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
            <img src="${item.url}" alt="${escapeHtml(item.titulo)}" loading="lazy" style="width:100%; height:100%; object-fit: cover; display:block;">
          </div>
        </div>`;
    } else {
      mediaHtml = '<div style="padding:1.2rem; background:rgba(30,30,46,0.4); border-radius:10px; color:#c9a87a;">Contenido multimedia no disponible</div>';
    }

    return `
      <div class="multimedia-entry" style="margin-bottom:2rem; text-align:center;">
        <div class="multimedia-media" style="margin-bottom:1rem;">${mediaHtml}</div>
        <div class="multimedia-text" style="max-width:700px; margin:0 auto; padding:0 1rem;">
          <h3 class="multimedia-title" style="margin:0 0 8px; font-size:1.4rem; color:#ffd700; font-family:'Cinzel', serif;">${escapeHtml(item.titulo)}</h3>
          <p class="multimedia-date" style="margin:0 0 10px; color:#bfa36b; font-size:0.95rem;">${escapeHtml(item.fecha || '')}</p>
          <div class="multimedia-description" style="color:#e8e0d0; line-height:1.6; font-size:1.05rem;">${escapeHtml(item.descripcion || '')}</div>
        </div>
      </div>
    `;
  }).join('');
}

// === SECCIONES ===
function buildSections() {
  return {
    inicio: `
<div id="inicio-section" class="content-section active-section">
  <div class="intro" style="padding:1.2rem;">
    <h1 class="hero-title">🏰 Bienvenido al Reino de Edas</h1>
    <p class="hero-subtitle">Donde el honor, la sabiduría y la gloria perduran a través de los siglos.</p>
  </div>
  <div class="breaking-news-section" style="padding:1rem 1.2rem;">
    <div class="section-header" style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
      <i class="fas fa-newspaper section-icon"></i>
      <h2 class="section-title" style="margin:0;">ÚLTIMAS NOTICIAS DEL REINO</h2>
    </div>
    <div class="news-grid" id="dynamic-news-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">
      ${generateNewsCards()}
    </div>
  </div>
  <div class="multimedia-section" style="margin-top: 1.5rem;padding:1rem 1.2rem;">
    <div class="section-header" style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
      <i class="fas fa-photo-video section-icon"></i>
      <h2 class="section-title" style="margin:0;">Crónicas Visuales del Reino</h2>
    </div>
    <div class="multimedia-grid" id="dynamic-multimedia-grid">
      ${generateMultimediaItems()}
    </div>
  </div>
</div>`,
historia: `<div id="historia-section" class="content-section active-section" style="padding:1.2rem;">
  <button class="back-button">← Regresar al Inicio</button>
  <div class="history-content" style="margin-top:12px;">
    <h2 class="content-title">📜 La Gran Historia del Reino Edas</h2>
    <div class="history-timeline" style="margin-top:8px;">
      <article class="history-item" style="display:flex;gap:20px;margin-bottom:24px;align-items:flex-start;">
        
      <div style="flex:0 0 310px; 
        aspect-ratio: 3/3; overflow:hidden; 
        border-radius:12px; box-shadow: 0 5px 14px rgba(0,0,0,0.5);">

          <img src="assets/origenes.png" 
          alt="Orígenes de Edas" loading="lazy" 
          style="width:100%; height:100%; object-fit: cover; display:block;">

        </div>
        <div class="history-text" style="flex:1; color:#e6d3a7;">
          <h3>Los Orígenes</h3>
          
          <p>En la aurora de los tiempos, cuando la tierra aún despertaba 
          entre sombras y fuego, los primeros clanes se alzaron entre montañas 
          y bosques antiguos. Forjados por la lucha y el honor, comprendieron 
          que solo la unión podía resistir al caos. Así, bajo un mismo estandarte,
           sellaron un pacto eterno.De aquel juramento nació Edas, reino de valor 
           y memoria, donde el espíritu de los antiguos aún guía a sus 
           descendientes.</p>

        </div>
      </article>
      <article class="history-item" style="display:flex;gap:20px;margin-bottom:24px;align-items:flex-start;">
        
      <div style="flex:0 0 310px; 
      aspect-ratio: 3/3; overflow:hidden; 
      border-radius:12px; box-shadow: 0 5px 14px rgba(0,0,0,0.5);">

          <img src="assets/guerreros.png" alt="Guerreros de Edas" loading="lazy" style="width:100%; height:100%; object-fit: cover; display:block;">
        </div>
        <div class="history-text" style="flex:1; color:#e6d3a7;">
          <h3>Era de los Guerreros</h3>
          
<p>Los estandartes ondeaban mientras el acero cantaba con el amanecer. 
En cada choque de espadas, el destino del reino se escribía con fuego y sangre. 
Así, entre victorias y sacrificios heroicos, 
se forjó el espíritu inmortal de Edas.</p>
       
          </div>
      </article>
      <article class="history-item" style="display:flex;gap:20px;margin-bottom:24px;align-items:flex-start;">
        
      <div style="flex:0 0 310px; 
      aspect-ratio: 3/3; overflow:hidden; 
      border-radius:12px; box-shadow: 0 5px 14px rgba(0,0,0,0.5);">

          <img src="assets/renacimiento.png" alt="Renacimiento de Edas" loading="lazy" style="width:100%; height:100%; object-fit: cover; display:block;">
        </div>
        <div class="history-text" style="flex:1; color:#e6d3a7;">
          <h3>Renacimiento Cultural</h3>

<p>Con la llegada de la paz, florecieron las artes
 y el espíritu del reino resplandeció. 
 Los trovadores recorrían caminos y aldeas, 
 entonando gestas antiguas en plazas y castillos. 
 Sus melodías narraban hazañas de reyes, 
 caballeros y amores que el tiempo no pudo borrar.</p>
        
          </div>
      </article>
      <article class="history-item" style="display:flex;gap:20px;margin-bottom:24px;align-items:flex-start;">
        
      <div style="flex:0 0 310px; 
      aspect-ratio: 3/3; overflow:hidden; 
      border-radius:12px; box-shadow: 0 5px 14px rgba(0,0,0,0.5);">

          <img src="assets/moderna.png" alt="Era Moderna de Edas" loading="lazy" style="width:100%; height:100%; object-fit: cover; display:block;">
        </div>
        <div class="history-text" style="flex:1; color:#e6d3a7;">
          <h3>Era Moderna</h3>
          
<p>Edas abrió sus puertas al mundo, 
y su luz se extendió más allá de los horizontes conocidos. 
Su fama cruzó montañas y mares, llevando su legado de sabiduría, 
arte y valor a tierras lejanas. Así, 
el nombre de Edas se convirtió en sinónimo de grandeza entre los reinos.</p>

        
          </div>
      </article>
    </div>
  </div>
</div>`,

realeza: `
<div id="realeza-section" class="content-section active-section" style="padding:1.2rem;">
  <button class="back-button">← Regresar al Inicio</button>

  <div class="royalty-frame">
    <h2 class="content-title">👑 La Sagrada Realeza</h2>

    <div class="royalty-flex">
      <div class="royalty-img-frame">
        <img src="assets/rey_edas.png" alt="Rey Leomar de Edas" class="royalty-img" loading="lazy">
      </div>

      <div class="royalty-text-box">
        <h3>Leomar I de Edas, el Renaciente</h3>
        <p>
          Cuando los estandartes se consumían entre cenizas y las alianzas caían una a una,
          <strong>Leomar I</strong> emergió del silencio con la espada <em>Solaria</em>, símbolo
          del amanecer sobre la oscuridad. No buscó gloria, sino unidad.
        </p>
        <p>
          En la <em>Batalla del Alba</em>, los rayos del sol encendieron su armadura dorada,
          y las huestes enemigas creyeron ver un dios en la tierra. Ese día nació el Reino de
          <strong>Edas</strong>, y con él, una nueva era de honor.
        </p>

        <blockquote class="royalty-quote">
          “Forjé mi corona con el hierro de mis derrotas y el fuego de mi pueblo.”
          — Rey Leomar I
        </blockquote>

        <p>
          Desde entonces, su trono de piedra negra custodia la historia de los hombres y las
          leyendas de los dioses. Su nombre aún resuena en los salones donde los trovadores
          narran el destino de los fundadores.
        </p>
      </div>
    </div>
  </div>
</div>
`,


    contacto: `
<div id="contacto-section" class="content-section active-section" style="padding:1.5rem;">
  <button class="back-button" style="margin-bottom:16px;">← Regresar al Inicio</button>

  <div class="contact-main">
    <div class="contact-flex">
      <div class="contact-img">
        <img src="assets/tequiero_aqui.png" alt="¡Te queremos aquí!" loading="lazy">
      </div>
      <div class="contact-text">
        <h2>⚔️ ÚNETE AL REINO EDAS ⚔️</h2>
        <p>
          Forja tu destino junto a los guerreros del <strong>Reino Edas</strong>. 
          Cada entrenamiento es un paso hacia la gloria, cada torneo un canto a la lealtad. 
          Aquí no solo entrenas tu fuerza: <em>creas tu leyenda</em>.
        </p>
        <a href="https://wa.me/59168000869?text=¡Hola! Quiero unirme al Reino Edas ⚔️" 
           target="_blank" rel="noopener noreferrer">
           ⚔️ ¡Forjar mi destino!
        </a>
      </div>
    </div>

    <div class="contact-gallery">
      <div class="contact-card" data-text="🏹 Entrenamientos al atardecer, donde se forja la leyenda.">
        <img src="assets/contacto_entrenamiento.png" alt="Entrenamiento">
      </div>
      <div class="contact-card" data-text="⚔️ Torneos Reales: solo los valientes prevalecen.">
        <img src="assets/contacto_evento.png" alt="Evento">
      </div>
      <div class="contact-card" data-text="🛡️ Batallas Épicas: cada golpe un eco de la gloria.">
        <img src="assets/contacto_batalla.png" alt="Batalla">
      </div>
    </div>

    <div id="contact-caption"></div>
  </div>

  <style>
    .contact-main { max-width:1000px; margin:auto; color:#e6d3a7; font-family:'Cinzel', serif; }
    .contact-flex { display:flex; gap:24px; align-items:center; margin-bottom:24px; flex-wrap:wrap; }
    .contact-img img { width:100%; border:2px solid #b8860b; object-fit:cover; }
    .contact-img { flex:1; min-width:280px; max-width:400px; }
    .contact-text { flex:1; min-width:300px; }
    .contact-text h2 { font-size:2rem; color:#ffd700; margin-bottom:12px; text-shadow:0 0 8px rgba(255,215,0,0.3); }
    .contact-text p { font-size:1.05rem; line-height:1.6; margin-bottom:16px; }
    .contact-text a {
      display:inline-block; text-decoration:none; background:linear-gradient(90deg,#d4af37,#b8860b);
      color:#2a1a00; font-weight:bold; padding:12px 22px; letter-spacing:1px; border:2px solid #caa945;
      transition:transform 0.2s, box-shadow 0.2s;
    }
    .contact-text a:hover { transform:scale(1.05); box-shadow:0 0 15px rgba(212,175,55,0.7); }

    .contact-gallery { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; }
    .contact-card { position:relative; cursor:pointer; overflow:hidden; }
    .contact-card img { width:100%; height:120px; object-fit:cover; border:2px solid #8b7500; }
    .contact-card::after {
      content: attr(data-text);
      position:absolute; bottom:0; left:0; right:0;
      background:rgba(0,0,0,0.6); color:#ffd700; font-size:0.9rem; padding:6px;
      opacity:0; transition:opacity 0.3s ease;
      text-align:center;
    }
    .contact-card:hover::after { opacity:1; }

    #contact-caption { margin-top:10px; padding:10px; text-align:center; background:rgba(0,0,0,0.5);
                        color:#ffd700; border:1px solid #d4af37; display:none; }

    @media (max-width:768px) {
      .contact-flex { flex-direction:column; text-align:center; }
      .contact-img, .contact-text { max-width:100%; }
      .contact-text h2 { font-size:1.5rem; }
    }
  </style>
</div>
`,

    eventos: `<div id="eventos-section" class="content-section active-section" style="padding:1.2rem;">
  <button class="back-button">← Regresar al Inicio</button>
  <div class="events-content" style="margin-top:12px;">
    <h2 class="content-title">📅 Próximos Eventos del Reino</h2>
    <div class="events-list" id="events-list-container" style="margin-top:10px;">${generateEventCards()}</div>
  </div>
</div>`,

galeria: `<div id="galeria-section" class="content-section active-section" style="padding:1.2rem;">
    <button class="back-button">← Regresar al Inicio</button>
    <div class="gallery-content" style="margin-top:12px;">
      <h2 class="content-title">Crónica Real de Edas</h2>
      <div class="gallery-grid" id="gallery-grid-container" style="margin-top:10px;">
        ${generateGalleryItems()}
      </div> <!-- cierra gallery-grid -->
    </div> <!-- cierra gallery-content -->
  </div>`
};
}

// === DETALLE DE EVENTO ===
function getEventDetailSection(id) {
  if (!id) return '<p style="text-align:center;padding:2rem;">ID no especificado.</p>';
  const e = getEventos().find(ev => String(ev.id) === String(id));
  if (!e) return '<p style="text-align:center;padding:2rem;">Evento no encontrado.</p>';

  const img = getEtiquetaImage();
  const imageHtml = e.imagenes?.[0] ? 
    `<div style="width:100%; margin:0 auto 1.8rem; max-width:700px;">
       <img src="${e.imagenes[0]}" alt="${escapeHtml(e.titulo)}" loading="lazy" 
            style="width:100%; height:auto; border-radius:12px; box-shadow: 0 6px 20px rgba(0,0,0,0.5);">
     </div>` : '';

  const badgeHtml = img ? 
    `<div style="text-align:center; margin-bottom:1.4rem;">
       <img src="${img}" style="width:60px; height:60px; border-radius:50%; border:3px solid gold; box-shadow: 0 0 12px rgba(255,215,0,0.6);">
     </div>` : '';

  const mapHtml = e.localizacion?.lat && e.localizacion?.lng ? 
    `<div style="margin-top:1.6rem; text-align:center;">
       <a href="https://www.google.com/maps?q=${e.localizacion.lat},${e.localizacion.lng}" 
          target="_blank" rel="noopener noreferrer" 
          style="display:inline-block; padding:10px 20px; background:#2c2c3e; color:#ffd700; border-radius:10px; text-decoration:none; font-weight:600;">
         🗺️ Abrir en Google Maps
       </a>
     </div>` : '';

  return `
<div id="event-detail-section" class="content-section active-section" style="padding:1.4rem;">
  <button class="back-button">← Regresar</button>
  <div style="max-width:900px; margin:0 auto;">
    ${imageHtml}
    <div style="color:#f9f5e9; line-height:1.6; text-align:center;">
      ${badgeHtml}
      <h1 style="font-size:1.9rem; margin:0 0 0.7rem; color:#ffd700; font-family:'Cinzel', serif;">${escapeHtml(e.titulo)}</h1>
      <p style="color:#ffd700; font-weight:600; margin:0 0 1.2rem; font-size:1.1rem;">${escapeHtml(e.fecha || '')} ${e.hora ? ' • ' + escapeHtml(e.hora) : ''}</p>
      <p style="color:#d4af37; margin:0 0 1.4rem; font-size:1rem; display:flex; justify-content:center; align-items:center; gap:8px;">
        <i class="${getIconForCategory(e.categoria)}"></i> ${escapeHtml(e.categoria || '')}
      </p>
      <div style="white-space:pre-line; font-size:1.05rem; color:#e8e0d0; padding:0 1rem;">${escapeHtml(e.detalles || e.descripcion || '')}</div>
      ${mapHtml}
    </div>
  </div>
</div>`;
}

// === NAVEGACIÓN ===
function loadSection(sectionName, param = null) {
  const container = document.getElementById('main-content');
  if (!container) return;

  const sections = buildSections();
  let html = '';

  if (sectionName === 'eventDetail') {
    html = getEventDetailSection(param);
  } else if (sections[sectionName]) {
    html = sections[sectionName];
  } else {
    html = sections.inicio;
    sectionName = 'inicio';
  }

  container.innerHTML = html;

  const newHash = sectionName === 'eventDetail' ? `#eventos/${param}` : `#${sectionName}`;
  if (window.location.hash !== newHash) {
    try {
      history.pushState({ section: sectionName, param }, '', newHash);
    } catch (err) {
      console.warn('pushState falló:', err);
    }
  }

  requestAnimationFrame(bindEventListeners);
}

// === EVENT LISTENERS ===
function bindEventListeners() {
  document.querySelectorAll('.back-button').forEach(btn => {
    btn.onclick = e => {
      e.preventDefault();
      loadSection('inicio');
    };
  });

  document.querySelectorAll('.nav-link, .nav-logo, .mobile-nav-link').forEach(el => {
    el.onclick = e => {
      e.preventDefault();
      const section = el.getAttribute('data-section') || 'inicio';
      loadSection(section);
      const menu = document.getElementById('mobile-menu');
      if (menu?.classList.contains('active')) menu.classList.remove('active');
    };
  });

  document.querySelectorAll('.event-card, .event-item, .event-news-card').forEach(card => {
    card.onclick = () => {
      const id = card.getAttribute('data-event-id');
      if (id) loadSection('eventDetail', id);
    };
  });

  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    toggle.onclick = e => {
      e.preventDefault();
      menu.classList.toggle('active');
    };
  }

  const caption = document.getElementById('contact-caption');
  if (caption) {
    document.querySelectorAll('#contact-gallery > div').forEach(item => {
      item.onmouseenter = () => {
        const text = item.getAttribute('data-text');
        if (text) {
          caption.textContent = text;
          caption.style.display = 'block';
        }
      };
      item.onmouseleave = () => {
        caption.style.display = 'none';
      };
    });
  }
}

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    // Mostrar splash brevemente y luego ocultar con transición
    setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, 500);
    }, 800); // muestra 800ms, luego desaparece
  }


  
  try {
    updateNewsBanner();
    setInterval(updateNewsBanner, 30000);

    const hash = window.location.hash.substring(1);
    if (hash.startsWith('eventos/')) {
      const id = hash.split('/')[1];
      loadSection('eventDetail', id);
    } else {
      const valid = ['inicio', 'historia', 'realeza', 'eventos', 'galeria', 'contacto'];
      const section = valid.includes(hash) ? hash : 'inicio';
      loadSection(section);
    }

    bindEventListeners();
  } catch (error) {
    console.error('Error crítico:', error);
    document.getElementById('main-content').innerHTML = 
      '<div style="padding:3rem;text-align:center;color:white;">⚠️ Error al cargar la aplicación.</div>';
  }
});

window.addEventListener('popstate', e => {
  const state = e.state;
  if (state?.section) {
    loadSection(state.section, state.param);
  } else {
    loadSection('inicio');
  }
});

// === UTILIDADES ===
window.ReinoEdas = window.ReinoEdas || {};
window.ReinoEdas.reloadData = function({ events, gallery, multimedia } = {}) {
  if (Array.isArray(events)) window.eventData = events;
  if (Array.isArray(gallery)) window.galleryData = gallery;
  if (Array.isArray(multimedia)) window.multimediaData = multimedia;
  updateNewsBanner();
  const hash = (window.location.hash || '').replace(/^#/, '');
  if (hash.startsWith('eventos/')) {
    loadSection('eventDetail', hash.split('/')[1]);
  } else {
    loadSection(hash || 'inicio');
  }
};