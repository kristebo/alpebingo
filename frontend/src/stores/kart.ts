import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface GpsPoint {
  lat: number;
  lng: number;
  timestamp: Date;
  altitude?: number;
  speed?: number;
}

export interface Løype {
  id: string;
  navn: string;
  punkter: GpsPoint[];
  startTid: Date;
  sluttTid?: Date;
  totalDistanse: number;
}

export interface BingoMarkør {
  id: string;
  feltId: string;
  tekst: string;
  posisjon: { lat: number; lng: number };
  tidspunkt: Date;
}

export const useKartStore = defineStore('kart', () => {
  const aktivLøype = ref<Løype | null>(null);
  const løyper = ref<Løype[]>([]);
  const bingoMarkører = ref<BingoMarkør[]>([]);
  const sporerGps = ref(false);
  const gjeldendePosisjon = ref<GpsPoint | null>(null);
  const watchId = ref<number | null>(null);
  const gpsFeil = ref<string | null>(null);
  const simuleringsId = ref<number | null>(null);

  const harGpsTilgang = computed(() => 'geolocation' in navigator);

  function startSporing() {
    if (!harGpsTilgang.value || sporerGps.value) return;

    gpsFeil.value = null;
    aktivLøype.value = {
      id: crypto.randomUUID(),
      navn: `Løype ${løyper.value.length + 1}`,
      punkter: [],
      startTid: new Date(),
      totalDistanse: 0,
    };

    sporerGps.value = true;

    watchId.value = navigator.geolocation.watchPosition(
      (position) => {
        gpsFeil.value = null;
        const punkt: GpsPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date(),
          altitude: position.coords.altitude ?? undefined,
          speed: position.coords.speed ?? undefined,
        };

        gjeldendePosisjon.value = punkt;

        if (aktivLøype.value) {
          const forrigePunkt = aktivLøype.value.punkter[aktivLøype.value.punkter.length - 1];
          if (forrigePunkt) {
            aktivLøype.value.totalDistanse += beregnAvstand(forrigePunkt, punkt);
          }
          aktivLøype.value.punkter.push(punkt);
        }
      },
      (error) => {
        console.warn('GPS-feil:', error.message);
        if (error.code === 1) {
          gpsFeil.value = 'GPS-tilgang nektet. Sjekk nettleserinnstillinger.';
          stoppSporing();
        } else if (error.code === 2) {
          gpsFeil.value = 'GPS ikke tilgjengelig på denne enheten.';
          stoppSporing();
        } else if (error.code === 3) {
          gpsFeil.value = 'GPS-timeout. Prøver igjen...';
          // Ikke stopp - fortsett å prøve
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 30000,
      }
    );
  }

  // Simuleringsmodus for testing uten ekte GPS
  function startSimulering(startLat = 59.9833, startLng = 10.6667) {
    if (sporerGps.value) return;

    gpsFeil.value = null;
    aktivLøype.value = {
      id: crypto.randomUUID(),
      navn: `Simulert løype ${løyper.value.length + 1}`,
      punkter: [],
      startTid: new Date(),
      totalDistanse: 0,
    };

    sporerGps.value = true;
    let lat = startLat;
    let lng = startLng;
    let retning = Math.random() * Math.PI * 2;

    simuleringsId.value = window.setInterval(() => {
      // Simuler bevegelse - ca 10-30 meter per sekund (ski-hastighet)
      const hastighet = 15 + Math.random() * 15; // m/s
      const avstand = hastighet; // Per sekund
      
      // Varier retning litt
      retning += (Math.random() - 0.5) * 0.3;
      
      lat += (Math.cos(retning) * avstand) / 111000; // Ca 111km per grad
      lng += (Math.sin(retning) * avstand) / (111000 * Math.cos(lat * Math.PI / 180));

      const punkt: GpsPoint = {
        lat,
        lng,
        timestamp: new Date(),
        altitude: 500 + Math.random() * 100,
        speed: hastighet,
      };

      gjeldendePosisjon.value = punkt;

      if (aktivLøype.value) {
        const forrigePunkt = aktivLøype.value.punkter[aktivLøype.value.punkter.length - 1];
        if (forrigePunkt) {
          aktivLøype.value.totalDistanse += beregnAvstand(forrigePunkt, punkt);
        }
        aktivLøype.value.punkter.push(punkt);
      }
    }, 1000);
  }

  function stoppSporing() {
    if (watchId.value !== null) {
      navigator.geolocation.clearWatch(watchId.value);
      watchId.value = null;
    }

    if (simuleringsId.value !== null) {
      clearInterval(simuleringsId.value);
      simuleringsId.value = null;
    }

    if (aktivLøype.value) {
      aktivLøype.value.sluttTid = new Date();
      løyper.value.push(aktivLøype.value);
      aktivLøype.value = null;
    }

    sporerGps.value = false;
  }

  function leggTilBingoMarkør(feltId: string, tekst: string) {
    if (!gjeldendePosisjon.value) {
      console.warn('Ingen GPS-posisjon tilgjengelig');
      return null;
    }

    const markør: BingoMarkør = {
      id: crypto.randomUUID(),
      feltId,
      tekst,
      posisjon: {
        lat: gjeldendePosisjon.value.lat,
        lng: gjeldendePosisjon.value.lng,
      },
      tidspunkt: new Date(),
    };

    bingoMarkører.value.push(markør);
    return markør;
  }

  function fjernBingoMarkør(id: string) {
    bingoMarkører.value = bingoMarkører.value.filter((m) => m.id !== id);
  }

  function slettLøype(id: string) {
    løyper.value = løyper.value.filter((l) => l.id !== id);
  }

  // Haversine formel for å beregne avstand mellom to punkter
  function beregnAvstand(p1: GpsPoint, p2: GpsPoint): number {
    const R = 6371e3; // Jordens radius i meter
    const φ1 = (p1.lat * Math.PI) / 180;
    const φ2 = (p2.lat * Math.PI) / 180;
    const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
    const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  function formaterDistanse(meter: number): string {
    if (meter < 1000) {
      return `${Math.round(meter)} m`;
    }
    return `${(meter / 1000).toFixed(2)} km`;
  }

  return {
    aktivLøype,
    løyper,
    bingoMarkører,
    sporerGps,
    gjeldendePosisjon,
    harGpsTilgang,
    gpsFeil,
    startSporing,
    startSimulering,
    stoppSporing,
    leggTilBingoMarkør,
    fjernBingoMarkør,
    slettLøype,
    formaterDistanse,
  };
});
