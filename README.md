# pix4d-homework

### Design choices

I designed the app so we could easily add new features and display other things on the map.

The idea is every layer on the map extends the **module** mixin, which links it with the maps events
and the load/save events.
**map-pointer-events** mixin is separate from the **module** mixin because we could imagine something that is displayed on the map without being a module

- eg: a tooltip to show the mouse pointer position.

The **Map** component is special because it is both the emmiter of the mapEvents and also a receiver. I would have liked to separate this but the way **vue-leaflet** is done does not allow it.

##### Why two events bus ?

There is the general eventBus in **js/event-bus** which should trigger any event that concerns the whole app

- eg: when pushing save, the **App.vue** saves and load the global store.

And the **mapEventsBus** in the **map-pointer-event** mixin which triggers only map pointer related events.

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```
