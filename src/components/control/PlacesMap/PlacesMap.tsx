import { Component, ComponentChildren, ErrorInfo, createRef } from 'preact';
import '@etchteam/diamond-ui/control/Input/Input';

import '@/components/content/Icon/Icon';
import config from '@/config';
import i18n from '@/lib/i18n';
import { captureException } from '@/lib/sentry';
import { CustomElement } from '@/types/customElement';
import { Location } from '@/types/locatorApi';

import MapMarker from './marker.svg?raw';

export interface PlacesMapProps {
  /** Default starting latitude */
  readonly latitude: number;
  /** Default starting longitude */
  readonly longitude: number;
  /** Locations to turn into place markers */
  readonly locations: Location[];
  /** The location that's currently selected */
  readonly activeLocationId?: string;
  /** Static readonly map with no controls */
  readonly static?: boolean;
  /** Children will be rendered at the bottom of the map */
  readonly children?: ComponentChildren;
  /** Event handler called when the zoom level changes */
  readonly onZoom?: (zoom: number) => void;
  /** Event handler called when the user drags/pans the map */
  readonly onDrag?: (geoPoint: H.geo.Point) => void;
  /** Event handler called when the user clicks a place marker */
  readonly onMarkerClick?: (location: Location) => void;
}

/**
 * Render a map with optional interactivity
 *
 * This is a Preact component wrapping a custom element
 * - Preact component is used for prop flexibility, it allows the location data to be passed in
 * - The custom element is used for styling only
 */
export default class PlacesMap extends Component<PlacesMapProps> {
  apiKey = config.mapsPlacesKey;
  HereMaps: typeof H;
  MapInstance: H.Map;
  MarkerGroup: H.map.Group;
  elementRef = createRef<HTMLDivElement>();
  currentZoom: number;
  enableZoomEvent: boolean;

  resizeMap() {
    try {
      this.MapInstance?.getViewPort().resize();
    } catch (error) {
      // Ignore resize errors
    }
  }

  async initMap() {
    const locale = i18n.language;
    const { default: HereMaps } = await import(
      // @ts-expect-error TS can't find the maps types
      '@here/maps-api-for-javascript/bin/mapsjs.bundle'
    );
    const platform = new H.service.Platform({
      apikey: this.apiKey,
    });

    const defaultLayers = platform.createDefaultLayers(
      undefined,
      undefined,
      locale === 'cy' ? 'cy' : undefined,
    ) as any;
    const baseLayer = defaultLayers.vector.normal.map as H.map.layer.Layer;
    // Limit the zoom level so people never get a silly radius
    baseLayer.setMin(9);
    baseLayer.setMax(15);

    this.HereMaps = HereMaps;
    this.MapInstance = new H.Map(this.elementRef.current, baseLayer, {
      zoom: 5,
      center: { lat: this.props.latitude, lng: this.props.longitude },
      pixelRatio: window.devicePixelRatio ?? 1,
    });
    this.MarkerGroup = new this.HereMaps.map.Group();
    this.MapInstance.addObject(this.MarkerGroup);

    window.addEventListener('resize', this.resizeMap.bind(this));
  }

  addControls() {
    try {
      // Enable zooming and dragging
      new this.HereMaps.mapevents.Behavior(
        new this.HereMaps.mapevents.MapEvents(this.MapInstance),
      );

      // Add the zoom control
      new this.HereMaps.ui.UI(this.MapInstance).addControl(
        'zoom',
        new this.HereMaps.ui.ZoomControl({
          alignment: this.HereMaps.ui.LayoutAlignment.RIGHT_BOTTOM,
        }),
      );

      // Setup event listeners for zooming and dragging
      this.MapInstance.addEventListener('drag', () => {
        this.props?.onDrag?.(this.MapInstance.getCenter());
      });

      this.MapInstance.addEventListener('mapviewchangeend', () => {
        const currentZoom = this.currentZoom;
        const newZoom = this.MapInstance.getZoom();

        if (!currentZoom) {
          // The first call only sets the initial zoom level
          this.currentZoom = newZoom;
        } else if (newZoom !== currentZoom) {
          this.currentZoom = newZoom;
          if (this.enableZoomEvent) {
            this.props?.onZoom?.(newZoom);
          }
        }
      });
    } catch (error) {
      // Controls are an enhancement, log the error instead of reacting to it
      captureException(error, { component: 'PlacesMap control creation' });
    }
  }

  addMarker(location: Location) {
    const isActive = location.id === this.props.activeLocationId;
    const handleClick = () => {
      this.props.onMarkerClick?.(location);
    };

    const marker = new this.HereMaps.map.DomIcon(
      `
      <button
        type="button"
        aria-label="${location.name}"
        data-location-id="${location.id}"
        class="locator-places-map__marker${isActive ? ' locator-places-map__marker--active' : ''}"
        ${this.props.static ? 'disabled="disabled"' : ''}
      >
        ${MapMarker}
      <button>
    `,
      {
        onAttach(element) {
          element.addEventListener('click', handleClick);
          element.addEventListener('touchstart', handleClick);
        },
        onDetach(element) {
          element.removeEventListener('click', handleClick);
          element.removeEventListener('touchstart', handleClick);
        },
      },
    );

    const coords = { lat: location.latitude, lng: location.longitude };

    return new H.map.DomMarker(coords, { data: location, icon: marker });
  }

  addPlaceMarkers() {
    const locations = this.props.locations;

    // Remove any existing markers
    this.MarkerGroup.removeAll();

    if (locations.length > 0) {
      // Temporarily disable the zoom event to stop it firing when the lookAtData changes
      this.enableZoomEvent = false;

      // Create the markers
      this.MarkerGroup.addObjects(
        locations.map((location) => this.addMarker(location)),
      );

      // Center the map on the markers
      this.MapInstance.getViewModel().setLookAtData({
        bounds: this.MarkerGroup.getBoundingBox(),
      });

      setTimeout(() => {
        this.enableZoomEvent = true;
      }, 500);
    }
  }

  selectActiveMarker() {
    const mapElement = this.elementRef.current;
    const locationId = this.props.activeLocationId;
    const activeClass = 'locator-places-map__marker--active';

    mapElement.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
    mapElement
      .querySelector(`[data-location-id="${locationId}"]`)
      ?.classList.add(activeClass);
  }

  async componentDidMount() {
    await this.initMap();
    this.addPlaceMarkers();

    if (!this.props.static) {
      this.addControls();
    }
  }

  componentWillUnmount() {
    try {
      this.MapInstance.dispose();
      window.removeEventListener('resize', this.resizeMap);
    } catch (error) {
      // Ignore unmounting errors
    }
  }

  componentDidUpdate(previousProps: Readonly<PlacesMapProps>) {
    if (previousProps.activeLocationId !== this.props.activeLocationId) {
      this.selectActiveMarker();
    }

    if (
      previousProps.locations.length !== this.props.locations.length ||
      previousProps.latitude !== this.props.latitude ||
      previousProps.longitude !== this.props.longitude
    ) {
      this.addPlaceMarkers();
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    captureException(error, { component: 'PlacesMap' }, { errorInfo });
  }

  render() {
    return (
      <locator-places-map
        className={this.props.static ? 'locator-places-map--static' : ''}
      >
        <div className="locator-places-map__container" ref={this.elementRef} />
        <div className="locator-places-map__children">
          {this.props.children}
        </div>
      </locator-places-map>
    );
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'locator-places-map': CustomElement;
      'locator-places-map-card': CustomElement<{ padding?: 'none' }>;
      'locator-places-map-wrapper': CustomElement;
      'locator-places-map-scrim': CustomElement;
    }
  }
}
