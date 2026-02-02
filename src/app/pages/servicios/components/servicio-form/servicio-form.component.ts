import { Component, effect, ElementRef, inject, linkedSignal, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

import { ServicioService } from '../../../../core/services/servicio.services';
import { ChoferService } from '../../../../core/services/chofer.service';
import { UnidadesTransporteService } from '../../../../core/services/unidades-transporte.service';
import { NotificacionService } from '../../../../core/services/notificacion.service';
import { LoaderService } from '../../../../core/loader.service';
import { Chofer } from '../../../../core/interfaces/chofer.interface';
import { UnidadTransporte } from '../../../../core/interfaces/unidades-transporte.interface';
import { EstadoOperativo } from '../../../../core/enums/estado-operativo.enum';
import { GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { WeatherService } from '../../../../core/services/weather.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
    selector: 'app-servicio-form',
    imports: [CommonModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule,
        MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule,
        MatNativeDateModule, MatIconModule, RouterModule, GoogleMapsModule, MatProgressSpinnerModule],
    templateUrl: './servicio-form.component.html',
    styleUrl: './servicio-form.component.css'
})
export class ServicioFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private servicioService = inject(ServicioService);
  private choferService = inject(ChoferService);
  private unidadesService = inject(UnidadesTransporteService);
  private notify = inject(NotificacionService);
  private loader = inject(LoaderService);
  private directionsService = inject(MapDirectionsService);
  private weatherService = inject(WeatherService);

  origenInput = viewChild<ElementRef>('origenInput');
  destinoInput = viewChild<ElementRef>('destinoInput');

  // Formularios para cada paso
  infoForm!: FormGroup;
  asignacionForm!: FormGroup;

  // Señales para los datos de los selectores
  choferes = signal<Chofer[]>([]);
  unidades = signal<UnidadTransporte[]>([]);
  apiLoaded = signal(false);
  // Señales de Mapa
  origenValido = linkedSignal({
    source: () => this.infoForm.get('puntoOrigen')?.value,
    computation: () => false
  });
  destinoValido = linkedSignal({
    source: () => this.infoForm.get('puntoDestino')?.value,
    computation: () => false
  })
  // Señal para mostrar alertas de tráfico
  alertaTrafico = signal<string | null>(null);
  // Señal para mostar el clima
  climaInfo = signal<any>(null);

  // Observable que guardará el resultado de la ruta
  directionsResults$: Observable<google.maps.DirectionsResult | undefined> = of(undefined);

  today = new Date();

  // Configuraciones del mapa
  center: google.maps.LatLngLiteral = { lat: 19.4326, lng: -99.1332 }; // CDMX por defecto
  zoom = 12;

  constructor() {
    effect(() => {
      if(this.apiLoaded()) {
        this.initAutocomplete();
      }
    })
  }

  ngOnInit() {
    this.initForms();
    this.cargarRecursos();
    this.loadGoogleMapsApi();
  }

  initForms() {
    // Paso 1: Información Básica
    this.infoForm = this.fb.group({
      puntoOrigen: ['', Validators.required],
      puntoDestino: ['', Validators.required],
      fechaHoraProgramada: ['', Validators.required],
      fechaHoraLlegadaEstimada: ['', Validators.required],
      descripcionMercancia: ['', Validators.required],
      costo: [null, [Validators.required, Validators.min(0.01)]]
    });

    // Paso 2: Asignación
    this.asignacionForm = this.fb.group({
      idChofer: [null],
      idUnidadTransporte: [null]
    });
  }

  cargarRecursos() {
    this.loader.show();
    // Cargar choferes activos
    this.choferService.getChoferes().subscribe({
      next: (data) => this.choferes.set(data.filter(c => c.active)),
      error: () => this.notify.showError('Error al cargar choferes')
    });

    // Cargar unidades disponibles
    this.unidadesService.getUnidadesByEstado(EstadoOperativo.DISPONIBLE).subscribe({
      next: (data) => this.unidades.set(data),
      error: () => this.notify.showError('Error al cargar unidades')
    });
    this.loader.hide();
  }

  loadGoogleMapsApi() {
    if (window.google?.maps && typeof window.google.maps.importLibrary === 'function') {
      this.apiLoaded.set(true);
      return;
    }

    const script = document.createElement('script');
    const params = new URLSearchParams({
      key: environment.googleMapsApiKey,
      v: 'beta',
      loading: 'async',
      libraries: 'places, marker'
    });

    (window as any).initMap = () => {};

    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if(window.google?.maps && typeof window.google.maps.importLibrary === 'function') {
        this.apiLoaded.set(true);
        console.log('Google Maps nativo cargado correctamente');
      } else {
        this.notify.showError('La API cargo pero no inicializo correctamente.')
      }
    };

    script.onerror = () => {
      this.notify.showError('No se pudo conectar con Google Maps');
    };
    document.head.appendChild(script);
  }

  async initAutocomplete() {
    // Validacioon de seguridad
    if(!this.apiLoaded() || !window.google?.maps?.importLibrary) return;
    // 1. Cargamos la librería. Usamos 'any' para evitar bloqueos de TS.
    const { PlaceAutocompleteElement } = await google.maps.importLibrary("places") as any;

    if (!PlaceAutocompleteElement) {
      console.error('PlaceAutocompleteElement no disponible en esta versión de la API');
      return;
    }

    const elOrigen = this.origenInput()?.nativeElement;
    const elDestino = this.destinoInput()?.nativeElement;

    if (!elOrigen || !elDestino) return;

    // 2. Limpiamos el contenedor antes de añadir para evitar duplicados por HMR de Angular 19
    elOrigen.innerHTML = '';
    elDestino.innerHTML = '';

    // 3. Instanciamos los componentes
    const autocompleteOrigen = new PlaceAutocompleteElement();
    const autocompleteDestino = new PlaceAutocompleteElement();

    // 4. Configuramos las restricciones (México)
    autocompleteOrigen.includedRegionCodes = ['mx'];
    autocompleteDestino.includedRegionCodes = ['mx'];

    // 5. Los añadimos al DOM
    elOrigen.appendChild(autocompleteOrigen);
    elDestino.appendChild(autocompleteDestino);

    // 6. Escuchamos el evento 'gmp-placeselect'
    autocompleteOrigen.addEventListener('gmp-placeselect', async (event: any) => {
      const place = event.place;
      if(!place) return;
      // La nueva API de Place requiere llamar a fetchFields para obtener la dirección formateada
      await place.fetchFields({ fields: ['formattedAddress', 'geometry'] });

      if (place.formattedAddress) {
        this.infoForm.patchValue({ puntoOrigen: place.formattedAddress });
        this.origenValido.set(true);
      }
    });

    autocompleteDestino.addEventListener('gmp-placeselect', async (event: any) => {
      const place = event.place;
      if(!place) return;
      await place.fetchFields({ fields: ['formattedAddress', 'geometry'] });

      if (place.formattedAddress) {
        this.infoForm.patchValue({ puntoDestino: place.formattedAddress });
        this.destinoValido.set(true);
      }
    });
  }

  /**
   * Este método se llama cuando el usuario llega al paso 3 (Confirmar)
   */
  calcularRuta() {
    const origen = this.infoForm.get('puntoOrigen')?.value;
    const destino = this.infoForm.get('puntoDestino')?.value;
    const fechaSalida = this.infoForm.get('fechaHoraProgramada')?.value;

    if (!origen || !destino) return;

    const request: google.maps.DirectionsRequest = {
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING,

      provideRouteAlternatives: true,
      drivingOptions: {
      departureTime: new Date(fechaSalida), // Usamos la fecha del formulario
      trafficModel: google.maps.TrafficModel.PESSIMISTIC // Para ser precavidos
    }
    };

    // Llamamos al servicio de Google
    this.directionsResults$ = this.directionsService.route(request).pipe(
    map(response => {
      const result = response.result;
      if (result) {
        const route = result.routes[0].legs[0];
        this.analizarRetrasos(route);

        // EXTRAEMOS COORDENADAS PARA EL CLIMA
        const lat = route.end_location.lat();
        const lng = route.end_location.lng();
        this.obtenerPronostico(lat, lng);
      }
      return result;
    })
  );
  }

  analizarRetrasos(route: google.maps.DirectionsLeg) {
  const duracionNormal = route.duration?.value || 0; // Segundos
  const duracionTrafico = route.duration_in_traffic?.value || duracionNormal;

  // Si el tráfico aumenta el tiempo en más de un 25%
  const retrasoPorcentaje = ((duracionTrafico - duracionNormal) / duracionNormal) * 100;

  if (retrasoPorcentaje > 25) {
    this.alertaTrafico.set(
      `⚠️ Alerta de Retraso: La ruta presenta congestión severa o incidentes. El tiempo estimado aumentó un ${Math.round(retrasoPorcentaje)}%. Considere cambiar el horario o la ruta.`
    );
  } else {
    this.alertaTrafico.set(null);
  }
}

obtenerPronostico(lat: number, lng: number) {
  this.weatherService.getForecast(lat, lng).subscribe({
    next: (data: any) => {
      // Buscamos el pronóstico más cercano a la hora de llegada estimada
      const fechaLlegada = new Date(this.infoForm.get('fechaHoraLlegadaEstimada')?.value).getTime();

      // OpenWeather entrega una lista cada 3 horas, buscamos la más próxima
      const pronosticoCercano = data.list.reduce((prev: any, curr: any) => {
        return (Math.abs(curr.dt * 1000 - fechaLlegada) < Math.abs(prev.dt * 1000 - fechaLlegada) ? curr : prev);
      });

      this.climaInfo.set(pronosticoCercano);
    },
    error: () => this.notify.showError('No se pudo obtener el pronóstico del clima')
  });
}

  // Si el usuario borra o cambia el texto manualmente sin seleccionar de la lista
  onInputChange(campo: 'origen' | 'destino') {
    if(campo === 'origen') this.origenValido.set(false);
    if(campo === 'destino') this.destinoValido.set(false);
  }

  onStepChange(event: any) {
  // El índice 2 corresponde al tercer paso: "Confirmar"
  if (event.selectedIndex === 2) {
    this.calcularRuta();
  }
}

  onSubmit() {
    if (this.infoForm.invalid) return;

    // Combinamos los datos de ambos formularios
    const servicioData = {
      ...this.infoForm.value,
      ...this.asignacionForm.value
    };

    this.loader.show();
    this.servicioService.crearServicio(servicioData).subscribe({
      next: (res: any) => {
        this.loader.hide();
        this.notify.showSuccess(res.message);
        this.router.navigate(['/servicios']); // Redirigir a la lista
      },
      error: (err) => {
        this.loader.hide();
        // Tu backend envía mensajes claros de conflicto (ej: "Chofer ya ocupado")
        this.notify.showError(err.error?.message || 'Error al programar el servicio');
      }
    });
  }

  // Getters para el resumen
  get choferSeleccionado() {
    const id = this.asignacionForm.get('idChofer')?.value;
    return this.choferes().find(c => c.idChofer === id);
  }

  get unidadSeleccionada() {
    const id = this.asignacionForm.get('idUnidadTransporte')?.value;
    return this.unidades().find(u => u.idUnidadTransporte === id);
  }
}
