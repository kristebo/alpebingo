<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuth } from '@clerk/vue';
import { useKartStore } from '@/stores/kart';
import { useBingoStore } from '@/stores/bingo';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { isSignedIn } = useAuth();
const kartStore = useKartStore();
const bingoStore = useBingoStore();

const mapContainer = ref<HTMLElement | null>(null);
const map = ref<L.Map | null>(null);
const posisjonMarkør = ref<L.Marker | null>(null);
const aktivLøypePolyline = ref<L.Polyline | null>(null);
const historiskeLøypePolylines = ref<L.Polyline[]>([]);
const bingoMarkørerLayer = ref<L.LayerGroup | null>(null);
const visVelgBingoModal = ref(false);
const følgBruker = ref(true);

// Leaflet icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const bingoIcon = L.divIcon({
  className: 'bingo-marker',
  html: '<div class="bingo-marker-inner">🎿</div>',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

onMounted(() => {
  if (mapContainer.value) {
    // Standard posisjon: Tryvann skisenter
    map.value = L.map(mapContainer.value).setView([59.9833, 10.6667], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.value as L.Map);

    bingoMarkørerLayer.value = L.layerGroup().addTo(map.value as L.Map);

    // Prøv å finne brukerens posisjon
    if (kartStore.harGpsTilgang) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map.value?.setView([pos.coords.latitude, pos.coords.longitude], 15);
        },
        () => {
          // Bruk standard posisjon hvis GPS feiler
        }
      );
    }
  }
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
  }
});

// Oppdater posisjon på kartet
watch(() => kartStore.gjeldendePosisjon, (pos) => {
  if (!map.value || !pos) return;

  if (posisjonMarkør.value) {
    posisjonMarkør.value.setLatLng([pos.lat, pos.lng]);
  } else {
    posisjonMarkør.value = L.marker([pos.lat, pos.lng], {
      icon: L.divIcon({
        className: 'current-position-marker',
        html: '<div class="pulse-marker"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    }).addTo(map.value as L.Map);
  }

  // Følg bruker hvis sporing er aktiv og følg-modus er på
  if (kartStore.sporerGps && følgBruker.value) {
    map.value.panTo([pos.lat, pos.lng]);
  }

  // Oppdater aktiv løype-linje i sanntid
  if (kartStore.sporerGps && kartStore.aktivLøype) {
    const punkter = kartStore.aktivLøype.punkter;
    if (punkter.length >= 2) {
      const latLngs = punkter.map((p) => [p.lat, p.lng] as L.LatLngExpression);
      
      if (aktivLøypePolyline.value) {
        aktivLøypePolyline.value.setLatLngs(latLngs);
      } else {
        aktivLøypePolyline.value = L.polyline(latLngs, {
          color: '#e63946',
          weight: 5,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map.value as L.Map);
      }
    }
  }
}, { deep: true });

// Vis/skjul historiske løyper
watch(() => kartStore.løyper, (løyper) => {
  if (!map.value) return;

  // Fjern gamle polylines
  historiskeLøypePolylines.value.forEach((pl) => pl.remove());
  historiskeLøypePolylines.value = [];

  // Tegn alle historiske løyper
  løyper.forEach((løype, index) => {
    if (løype.punkter.length >= 2) {
      const latLngs = løype.punkter.map((p) => [p.lat, p.lng] as L.LatLngExpression);
      const farger = ['#457b9d', '#2a9d8f', '#e9c46a', '#f4a261', '#264653'];
      const polyline = L.polyline(latLngs, {
        color: farger[index % farger.length],
        weight: 4,
        opacity: 0.7,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map.value as L.Map);
      
      polyline.bindPopup(`
        <strong>${løype.navn}</strong><br>
        Distanse: ${kartStore.formaterDistanse(løype.totalDistanse)}<br>
        Dato: ${løype.startTid.toLocaleDateString('nb-NO')}
      `);
      
      historiskeLøypePolylines.value.push(polyline);
    }
  });
}, { deep: true, immediate: true });

// Rydd opp aktiv løype når sporing stoppes
watch(() => kartStore.sporerGps, (sporer) => {
  if (!sporer && aktivLøypePolyline.value) {
    aktivLøypePolyline.value.remove();
    aktivLøypePolyline.value = null;
  }
});

// Tegn bingo-markører
watch(() => kartStore.bingoMarkører, (markører) => {
  if (!bingoMarkørerLayer.value) return;

  bingoMarkørerLayer.value.clearLayers();

  markører.forEach((m) => {
    const marker = L.marker([m.posisjon.lat, m.posisjon.lng], { icon: bingoIcon })
      .bindPopup(`<strong>${m.tekst}</strong><br><small>${m.tidspunkt.toLocaleTimeString('nb-NO')}</small>`);
    bingoMarkørerLayer.value?.addLayer(marker);
  });
}, { deep: true });

function toggleSporing() {
  if (kartStore.sporerGps) {
    kartStore.stoppSporing();
  } else {
    kartStore.startSporing();
  }
}

function åpneBingoVelger() {
  if (!kartStore.gjeldendePosisjon) {
    alert('Ingen GPS-posisjon tilgjengelig. Start GPS-sporing først.');
    return;
  }
  visVelgBingoModal.value = true;
}

function velgBingoFelt(feltId: string, tekst: string) {
  kartStore.leggTilBingoMarkør(feltId, tekst);
  visVelgBingoModal.value = false;
}
</script>

<template>
  <div class="kart-side">
    <template v-if="!isSignedIn">
      <div class="ikke-innlogget">
        <h2>Du må logge inn for å bruke kartet</h2>
        <p>Gå til <router-link to="/logginn">Logg inn</router-link> for å starte.</p>
      </div>
    </template>

    <template v-else>
      <div class="kart-kontroller">
        <button 
          @click="toggleSporing" 
          :class="['knapp', kartStore.sporerGps ? 'knapp-fare' : 'knapp-primær']"
          :disabled="!kartStore.harGpsTilgang"
        >
          {{ kartStore.sporerGps ? '⏹️ Stopp sporing' : '▶️ Start GPS' }}
        </button>

        <button 
          v-if="!kartStore.sporerGps"
          @click="kartStore.startSimulering()" 
          class="knapp knapp-sekundær"
        >
          🎮 Simuler (test)
        </button>

        <button 
          v-if="kartStore.sporerGps"
          @click="følgBruker = !følgBruker" 
          :class="['knapp', følgBruker ? 'knapp-aktiv' : 'knapp-sekundær']"
        >
          {{ følgBruker ? '🎯 Følger deg' : '🗺️ Fri navigering' }}
        </button>

        <button 
          @click="åpneBingoVelger" 
          class="knapp knapp-sekundær"
          :disabled="!kartStore.gjeldendePosisjon"
        >
          📍 Marker bingo her
        </button>
      </div>

      <div v-if="kartStore.gpsFeil" class="gps-feil">
        ⚠️ {{ kartStore.gpsFeil }}
      </div>

      <div v-if="kartStore.sporerGps" class="sporing-info">
        <div class="sporing-indikator">
          <span class="pulserende-punkt"></span>
          <span>Sporer løype...</span>
        </div>
        <div class="info-boks">
          <span class="info-label">Distanse:</span>
          <span class="info-verdi">{{ kartStore.formaterDistanse(kartStore.aktivLøype?.totalDistanse || 0) }}</span>
        </div>
        <div class="info-boks">
          <span class="info-label">Punkter:</span>
          <span class="info-verdi">{{ kartStore.aktivLøype?.punkter?.length || 0 }}</span>
        </div>
        <div v-if="kartStore.gjeldendePosisjon?.altitude" class="info-boks">
          <span class="info-label">Høyde:</span>
          <span class="info-verdi">{{ Math.round(kartStore.gjeldendePosisjon.altitude) }} m</span>
        </div>
        <div v-if="kartStore.gjeldendePosisjon?.speed" class="info-boks">
          <span class="info-label">Fart:</span>
          <span class="info-verdi">{{ Math.round(kartStore.gjeldendePosisjon.speed * 3.6) }} km/t</span>
        </div>
      </div>

      <div ref="mapContainer" class="kart-container"></div>

      <div v-if="kartStore.løyper.length > 0" class="løype-historikk">
        <h3>Mine løyper</h3>
        <ul class="løype-liste">
          <li v-for="løype in kartStore.løyper" :key="løype.id" class="løype-item">
            <div class="løype-info">
              <strong>{{ løype.navn }}</strong>
              <span>{{ kartStore.formaterDistanse(løype.totalDistanse) }}</span>
              <small>{{ løype.startTid.toLocaleDateString('nb-NO') }}</small>
            </div>
            <button @click="kartStore.slettLøype(løype.id)" class="knapp-liten knapp-fare">🗑️</button>
          </li>
        </ul>
      </div>

      <div v-if="kartStore.bingoMarkører.length > 0" class="bingo-markør-liste">
        <h3>Bingo-markeringer</h3>
        <ul>
          <li v-for="markør in kartStore.bingoMarkører" :key="markør.id">
            🎿 {{ markør.tekst }}
            <small>({{ markør.tidspunkt.toLocaleTimeString('nb-NO') }})</small>
            <button @click="kartStore.fjernBingoMarkør(markør.id)" class="knapp-liten">❌</button>
          </li>
        </ul>
      </div>

      <!-- Modal for å velge bingo-felt -->
      <div v-if="visVelgBingoModal" class="modal-backdrop" @click="visVelgBingoModal = false">
        <div class="modal" @click.stop>
          <h3>Velg bingo-hendelse å markere</h3>
          <div v-if="bingoStore.kort" class="bingo-velger">
            <template v-for="rad in bingoStore.kort.felt" :key="rad[0]?.id">
              <button 
                v-for="felt in rad"
                :key="felt.id"
                @click="velgBingoFelt(felt.id, felt.tekst)"
                class="bingo-felt-knapp"
                :class="{ 'allerede-krysset': bingoStore.kort.kryssedeFelt.includes(felt.id) }"
              >
                {{ felt.tekst }}
              </button>
            </template>
          </div>
          <div v-else class="ingen-kort">
            <p>Last inn bingokort først</p>
            <router-link to="/bingo" class="knapp knapp-primær">Gå til bingo</router-link>
          </div>
          <button @click="visVelgBingoModal = false" class="knapp knapp-sekundær lukk-knapp">Lukk</button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.kart-side {
  display: flex;
  flex-direction: column;
  gap: var(--mellomrom-md);
  height: calc(100vh - 80px);
}

.ikke-innlogget {
  text-align: center;
  padding: var(--mellomrom-xl);
  background: var(--farge-bakgrunn-sekundær);
  border-radius: var(--radius-lg);
}

.kart-kontroller {
  display: flex;
  gap: var(--mellomrom-md);
  flex-wrap: wrap;
}

.gps-feil {
  padding: var(--mellomrom-md);
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: var(--radius-md);
  color: #856404;
}

.sporing-info {
  display: flex;
  gap: var(--mellomrom-lg);
  padding: var(--mellomrom-md);
  background: var(--farge-bakgrunn-sekundær);
  border-radius: var(--radius-md);
  flex-wrap: wrap;
  align-items: center;
}

.sporing-indikator {
  display: flex;
  align-items: center;
  gap: var(--mellomrom-sm);
  color: #e63946;
  font-weight: bold;
}

.pulserende-punkt {
  width: 12px;
  height: 12px;
  background: #e63946;
  border-radius: 50%;
  animation: pulse-dot 1.5s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.knapp-aktiv {
  background: var(--farge-suksess);
  color: white;
}

.info-boks {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.75rem;
  color: var(--farge-tekst-dempet);
}

.info-verdi {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--farge-primær);
}

.kart-container {
  flex: 1;
  min-height: 400px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 2px solid var(--farge-kantlinje);
}

.løype-historikk,
.bingo-markør-liste {
  background: var(--farge-bakgrunn-sekundær);
  padding: var(--mellomrom-md);
  border-radius: var(--radius-md);
}

.løype-liste {
  list-style: none;
  padding: 0;
  margin: 0;
}

.løype-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--mellomrom-sm) 0;
  border-bottom: 1px solid var(--farge-kantlinje);
}

.løype-info {
  display: flex;
  gap: var(--mellomrom-md);
  align-items: center;
}

.knapp-liten {
  padding: var(--mellomrom-xs) var(--mellomrom-sm);
  font-size: 0.875rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--farge-bakgrunn);
  padding: var(--mellomrom-lg);
  border-radius: var(--radius-lg);
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  width: 90%;
}

.bingo-velger {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--mellomrom-sm);
  margin: var(--mellomrom-md) 0;
}

.bingo-felt-knapp {
  padding: var(--mellomrom-sm);
  font-size: 0.75rem;
  background: var(--farge-bakgrunn-sekundær);
  border: 1px solid var(--farge-kantlinje);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.bingo-felt-knapp:hover {
  background: var(--farge-primær);
  color: white;
}

.bingo-felt-knapp.allerede-krysset {
  background: var(--farge-suksess);
  color: white;
}

.lukk-knapp {
  width: 100%;
  margin-top: var(--mellomrom-md);
}

/* Leaflet marker styles */
:global(.current-position-marker) {
  background: transparent;
}

:global(.pulse-marker) {
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  animation: pulse 2s infinite;
}

:global(.bingo-marker) {
  background: transparent;
}

:global(.bingo-marker-inner) {
  font-size: 24px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}
</style>
