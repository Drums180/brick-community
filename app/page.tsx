const FORMSPREE_ENDPOINT = "https://formspree.io/f/mojzraqk";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans text-zinc-900">
      {/* Hero */}
      <header className="bg-gradient-to-b from-yellow-400 via-yellow-300 to-zinc-50 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 inline-block rounded-full bg-red-600 px-4 py-1 text-sm font-bold text-white">
            Próximamente en México 🇲🇽
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
            Toma una foto. Publica tus LEGO al instante.
          </h1>
          <p className="mt-6 text-lg text-zinc-700">
            Brick Community reconoce automáticamente tus minifiguras y sets de
            LEGO a partir de una foto, y los publica en tu perfil para vender
            o intercambiar. Sin descripciones eternas, sin complicaciones.
          </p>
          <a
            href="#signup"
            className="mt-8 inline-block rounded-lg bg-blue-700 px-8 py-3 text-lg font-bold text-white shadow-md transition hover:bg-blue-800"
          >
            Quiero probarlo primero
          </a>
        </div>
      </header>

      {/* Selling/trading modes */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-zinc-900">
            ¿Cómo te gustaría vender o intercambiar?
          </h2>
          <p className="mt-3 text-zinc-600">
            Estamos diseñando varios modos para adaptarnos a la forma en que
            ya te gusta comprar y vender LEGO.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl">🔴</div>
              <h3 className="text-lg font-bold">Modo Whatnot</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Vende en vivo, estilo subasta, igual que en tus apps de live
                selling favoritas.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl">🟡</div>
              <h3 className="text-lg font-bold">Intercambio</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Conecta con otros coleccionistas y haz trueque de piezas, sets
                o minifiguras.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-3 text-3xl">🔵</div>
              <h3 className="text-lg font-bold">Mi Inventario</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Publica tu colección completa y vende directamente desde tu
                catálogo personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wishlist / notifications */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-zinc-900">
            Crea tu lista de deseos
          </h2>
          <p className="mt-4 text-zinc-600">
            Agrega las minifiguras o sets que estás buscando y te
            notificaremos en cuanto alguien cerca de ti quiera venderlos o
            intercambiarlos. Olvídate de revisar grupos de Facebook todos los
            días.
          </p>
          <div className="mt-8 rounded-xl bg-zinc-50 p-6 text-left text-sm text-zinc-600 sm:mx-auto sm:max-w-md">
            <p className="font-semibold text-zinc-900">Ejemplo:</p>
            <p className="mt-2">
              🔔 &quot;Alguien en Guadalajara quiere intercambiar la
              minifigura de Boba Fett (edición 1997) que tienes en tu lista de
              deseos.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Signup form */}
      <section id="signup" className="px-6 py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="text-center text-2xl font-bold text-zinc-900">
            Sé de los primeros en probarlo
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600">
            Déjanos tu correo y cuéntanos qué te interesa más. Es gratis y
            solo toma un minuto.
          </p>

          <form
            action={FORMSPREE_ENDPOINT}
            method="POST"
            className="mt-6 flex flex-col gap-4"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tucorreo@ejemplo.com"
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-zinc-700">
                ¿Qué modo te interesa más?
              </legend>
              <div className="flex flex-col gap-2 text-sm text-zinc-700">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="modo_favorito"
                    value="whatnot"
                    className="h-4 w-4"
                  />
                  Modo Whatnot (venta en vivo)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="modo_favorito"
                    value="intercambio"
                    className="h-4 w-4"
                  />
                  Intercambio
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="modo_favorito"
                    value="inventario"
                    className="h-4 w-4"
                  />
                  Vender mi inventario
                </label>
              </div>
            </fieldset>

            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                name="lista_deseos"
                value="si"
                className="h-4 w-4"
              />
              Me interesa crear una lista de deseos y recibir notificaciones
            </label>

            <button
              type="submit"
              className="mt-2 rounded-lg bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Avísame cuando esté disponible
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 px-6 py-8 text-center text-sm text-zinc-500">
        <p>Brick Community · Hecho con 🧱 para la comunidad LEGO de México</p>
        <p className="mt-1">Próximamente</p>
      </footer>
    </div>
  );
}
