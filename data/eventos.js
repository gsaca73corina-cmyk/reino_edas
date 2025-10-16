// data/eventos.js
window.eventData = [
  {
    id: "evt-001",
    titulo: "Sci-Fi Film Scores",
    categoria: "Próximo Evento",
    fecha: "25 de octubre, 2025",
    fechaRaw: "2025-10-25",
    hora: "19:30",
    resumen: "Concierto de la Orquesta Sinfónica Chuquiago que rinde homenaje a las icónicas bandas sonoras del cine de ciencia ficción.",
    detalles: "Disfruta de una experiencia multisensorial que fusiona música, tecnología e imaginación.\n\nAntes del concierto, a las 17:30, habrá Expo Sci-Fi con actividades interactivas. Entradas disponibles en Ticketline o WhatsApp +591 68090491.",
    imagenes: ["assets/evento1.webp"],
    activo: true,
    showInBanner: true,
    localizacion: { lat: -16.5045, lng: -68.1340 } // Coordenadas aproximadas de Chuquiago Marka
  },

{
  id: "evt-003",
  titulo: "Manual de Supervivencia Zombie",
  categoria: "Próximo Evento",
  fecha: "26 de octubre, 2025",
  fechaRaw: "2025-10-26",
  hora: "10:00",
  resumen: "Jornada de adrenalina y diversión con juegos de supervivencia zombie, cosplay, torneos y actividades terroríficas para todas las edades.",
  detalles: "Disfruta de bandas en vivo, karaoke extremo, pasarela del terror, cosplay infantil, Miss y Mister TERROR, actividades para niños y sorpresas espeluznantes en el Coliseo Don Bosco, La Paz.",
  imagenes: ["assets/evento2.jpg"],
  activo: true,
  showInBanner: true,
  localizacion: { lat: -16.5000, lng: -68.1200 } // Coordenadas aproximadas del Coliseo Don Bosco
},

{
  id: "evt-004",
  titulo: "Entrenamientoy y reunion",
  categoria: "Evento Recurrente",
  fecha: "Todos los sábados",
  fechaRaw: "", // vacío porque es recurrente
  hora: "15:00",
  resumen: "Prácticas semanales de esgrima y combate con espadas en la Plaza La Paz.",
  detalles: "Todos los sábados a las 15:00, ven y perfecciona tus habilidades con espadas. Trae tu equipo y disfruta de un entrenamiento divertido y seguro para todos los niveles.",
  imagenes: ["assets/evento3.jpg"],
  activo: true,
  showInBanner: true,
  localizacion: { lat: -16.5000, lng: -68.1500 } // Coordenadas aproximadas de Plaza La Paz
}

];
