# Purse It

Purse It es una página funcional que, a partir de los objetos que una
persona carga a diario (celular, laptop, botella de agua, libreta, plumas,
etc.) y del tamaño de bolsa que elige, genera al momento un diseño con un
compartimento pensado para cada objeto.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) como base de datos (guarda cada diseño generado)
- Desplegado en [Vercel](https://vercel.com)

## Requisitos

- Node.js 18 o superior
- Una cuenta de Supabase con un proyecto creado

## Setup local

1. Entra a la carpeta del proyecto:

   ```bash
   cd purse-it
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Copia el archivo de variables de entorno y llena tus propias llaves de
   Supabase (Project Settings → API en el dashboard de Supabase):

   ```bash
   cp .env.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   ```

4. Corre el script `supabase/schema.sql` en el SQL Editor de tu proyecto de
   Supabase (crea la tabla `designs` donde se guarda cada diseño generado).

5. Corre el servidor de desarrollo:

   ```bash
   npm run dev
   ```

6. Abre [http://localhost:3000](http://localhost:3000).

## Cómo funciona la herramienta

En la homepage, la persona:

1. Elige el tamaño de bolsa (mini, mediana, grande).
2. Marca los objetos que carga (o escribe otros que no estén en la lista).
3. Le da clic a "Generar diseño".

`src/lib/designEngine.ts` asigna cada objeto a una zona de la bolsa
(compartimento principal, bolsillo frontal, bolsillo lateral u organizador
interior). `src/components/BagDesigner.tsx` dibuja el diagrama de la bolsa
y guarda el diseño en Supabase (tabla `designs`) si las variables de
entorno están configuradas.

### Objetos disponibles

La lista vive en `ITEM_OPTIONS` dentro de `src/lib/designEngine.ts`.
Actualmente incluye: celular, laptop/tablet, botella de agua, libreta,
plumas y lápices, cartera, llaves, audífonos, maquillaje y cargador.

## Estructura del proyecto

```
src/
  app/
    page.tsx         Homepage + herramienta de diseño
    docs/page.tsx     Cómo funciona
    roadmap/page.tsx  Roadmap del producto
    layout.tsx        Layout raíz (incluye Navbar y Footer)
    globals.css       Estilos y paleta de colores
  components/
    Navbar.tsx
    Footer.tsx
    BagDesigner.tsx    Formulario + diagrama del diseño generado
  lib/
    designEngine.ts    Lógica que asigna objetos a zonas de la bolsa
    supabaseClient.ts  Cliente de Supabase
supabase/
  schema.sql           Tabla `designs` para guardar cada diseño generado
```

## Deploy en Vercel

1. Sube este repo a GitHub.
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio.
3. Agrega las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` en Project Settings → Environment
   Variables (los mismos valores de tu `.env.local`).
4. Deploy. Cada push a la rama principal genera un nuevo deployment.
