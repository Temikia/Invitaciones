# Bitácora — semana del 2 al 8 de noviembre de 2026

## 2026-11-08 00:52 — Ciudad de México (GMT−6)

La usuaria confirmó que con la versión suave seguía igual: en su teléfono la portada mueve sus objetos y `/recuerdos` y `/album` no. La portada siempre ignoró la preferencia de movimiento reducido en su halo y runas, mientras que las otras dos páginas sí la respetaban y se quedaban quietas; titilar no se percibe como movimiento. A pedido de la usuaria, los efectos decorativos de las tres páginas se mueven siempre, como la portada, y se retiró la versión suave. El sol gira más rápido para notarse y las partículas usan `vh` en lugar de `svh` por compatibilidad. Se conserva el movimiento reducido en el visor, la película y la carga. Build y 61 pruebas; comprobado simulando la preferencia. Push a pedido de la usuaria.

## 2026-11-08 00:45 — Ciudad de México (GMT−6)

La usuaria reportó que en celular `/recuerdos` y `/album` no tenían efectos ni animaciones, igual que la portada. En emulación de teléfono las animaciones sí corrían; lo único que apagaba a la vez las tres páginas era la preferencia «movimiento reducido», que muchos teléfonos activan con el ahorro de batería. Para que la invitación no se vea inerte sin dejar de respetar esa preferencia, se cambió el apagado por una versión suave: nada se desplaza, gira ni crece, pero destellos, linternas, halos y resplandores se encienden y apagan, la portada del álbum sigue pasando fotos con fundido y los destellos de la flor aparecen en su sitio. Sin esa preferencia todo queda igual. Build y 61 pruebas; estilos comprobados simulando la preferencia. Push a pedido de la usuaria, que lo validará en su teléfono antes de decidir.

## 2026-11-08 00:50 — Ciudad de México (GMT−6)

La usuaria reportó que el botón de pantalla completa de la película y la tecla F no hacían nada. Al registrar el error que el código silenciaba, Chrome respondía «Dialog elements are invalid»: la especificación prohíbe poner en pantalla completa un `<dialog>`, y la película es uno. Por eso tampoco había funcionado nunca la entrada automática al abrir. Se envolvió todo el contenido en un contenedor interior y la pantalla completa se pide para él; los controles, el teclado y la pausa siguen igual porque el contenedor vive dentro del diálogo. Se comprobó que el contenedor pasa el filtro del navegador; la entrada real no se pudo ver porque el panel interno no la concede y Chrome no estaba conectado. Build y 61 pruebas. Push a pedido de la usuaria.

## 2026-11-08 00:25 — Ciudad de México (GMT−6)

La usuaria pidió quitar de la película la barra dorada de progreso que anticipaba cada cambio y añadir junto a la X un botón de pantalla completa, para que se sienta como una película de verdad. La barra no solo se veía: su animación marcaba el avance y se pausaba con la carga, la pestaña oculta o la barra espaciadora. Para no romper ese ritmo se conservó la misma animación en un elemento invisible (reloj del recuerdo) y se retiró todo lo visible. El botón de pantalla completa entra y sale de ella (también con la tecla F) y cambia su icono; se oculta junto con la X al dejar quieto el ratón. Antes, salir de pantalla completa cerraba la película; con el botón eso dejaba de tener sentido, así que ahora solo sale de ella. Al abrir se sigue intentando entrar sola. En iPhone, donde el navegador no permite pantalla completa de una página, el botón no se muestra. Build y 61 pruebas; revisado en navegador local en escritorio y 375 px. Sin despliegue.

## 2026-11-08 00:15 — Ciudad de México (GMT−6)

La usuaria pidió que el brillo que recorre el borde de las miniaturas del álbum use los tonos y el estilo de las fotos de la página principal. El destello del mosaico era solo dorado sobre un marco dorado tenue; los retratos de la invitación usan un haz violeta que pasa por dorado y blanco cálido, con una copia desenfocada que da resplandor, marco oscuro y halo violeta y dorado. Se llevó ese mismo degradado y estructura a cada cuadro del álbum, con una vuelta similar (4.5–6 s, desfasada para que no giren al unísono) y manteniendo la pausa fuera de pantalla para no gastar batería. Con movimiento reducido queda un degradado fijo con los mismos tonos. Build y 61 pruebas; revisado en navegador local en escritorio y 375 px. Sin despliegue.

## 2026-11-08 00:25 — Ciudad de México (GMT−6)

Con la música continua, al abrir un video en el visor del álbum se oían la canción y el video a la vez. La usuaria pidió pausarla. El reproductor ahora detecta cualquier video con sonido que empieza a reproducirse, pausa la canción y la reanuda cuando el video se pausa, termina o se retira (al cerrar el visor o pasar a otro recuerdo). Si la canción ya estaba en pausa, o si se toca su botón durante el video, se respeta esa decisión. Los videos silenciados de la película no la afectan. Probado en navegador local con un video simulado, porque el álbum aún no tiene videos. Build y 61 pruebas. Sin despliegue.

## 2026-11-08 00:10 — Ciudad de México (GMT−6)

La usuaria pidió que la música no se corte al cambiar de página y que su control exista en las tres páginas. Antes cada enlace recargaba el documento y el reproductor vivía dentro de la escena 3 de la invitación, así que la canción se detenía al ir al álbum o a recuerdos (los navegadores no permiten reanudarla sola en la página nueva). Ahora un único reproductor vive por encima de las páginas y los enlaces entre invitación, álbum y recuerdos, así como atrás/adelante, cambian de página sin recargar; atrás vuelve a la misma altura. El álbum y recuerdos muestran el control flotante; la invitación conserva su comportamiento (nada después del lago). Como cambiar de página ya no descarga la página, se añadió una confirmación al salir con una carga de recuerdos en curso. Build y 61 pruebas; comprobado en navegador local. Sin despliegue.

## 2026-11-08 00:03 — Ciudad de México (GMT−6)

La usuaria reportó que la película se seguía trabando: en algunas fotos la barra se congelaba a la mitad, no había fundido y tras unos segundos saltaba de golpe; otras sí pasaban bien. Causa: la película guardaba una sola «clave precargada». La foto siguiente se cargaba oculta y, al volverse la actual, dependía de esa clave porque ya no volvía a disparar `load`; en cuanto se precargaba la tercera, la clave se sobrescribía, la foto actual dejaba de contar como lista, la barra se detenía, la foto nueva se volvía transparente y reaparecía la anterior hasta que el límite de 15 s forzaba el salto. Por eso fallaba una foto sí y otra no. Se reconstruyó el estado como un reductor puro (`src/lib/albumMovie.ts`) donde cada recuerdo queda listo por su propia clave y nunca lo pierde; la capa anterior ahora se retira al terminar el fundido real y no con un temporizador. Se reprodujo el fallo con el código anterior y se comprobó la corrección en el navegador local. Build y 58 pruebas. Sin despliegue.

## 2026-11-07 23:41 — Ciudad de México (GMT−6)

Las imágenes del álbum seguían tardando en producción. Las 35 fotos profesionales pesaban 41–53 MB a 45 MP; Drive no generaba miniatura para tres de ellas y el servidor tenía que reducirlas con `sharp`. La usuaria autorizó comprimirlas al máximo sin perder calidad y reemplazarlas. Se redujeron a 4096 px de lado mayor (más que cualquier pantalla 4K en vertical) con mozjpeg calidad 88 y color completo 4:4:4: 1676 MB → 65 MB, sin diferencia visible. Se reemplazó el contenido de cada archivo en Drive para conservar ID, orden y marcador; los originales siguen intactos en `multimedia/`. Ahora todas tienen miniatura de Drive y en local responden en menos de 1 s. Build y 47 pruebas. No requiere despliegue.

## 2026-11-07 23:01 — Ciudad de México (GMT−6)

En producción el álbum mostró «Se alcanzó el límite temporal de consultas». La galería permitía 120 solicitudes por minuto por IP y cada miniatura cuenta como una, así que recorrer el álbum (o varios invitados en la misma red) lo agotaba; también fallaba cerrado si Upstash no respondía. A petición de la usuaria se retiró el límite de las tres rutas de lectura del álbum, para que todos puedan verlo sin bloqueos; las cargas mantienen sus protecciones. Build y 47 pruebas; push a `main`.

## 2026-11-07 22:53 — Ciudad de México (GMT−6)

La usuaria pidió que la X de la película fuera solo el icono y apareciera al mover el ratón, que el paso entre fotos no tuviera la espera de casi un segundo y mejorar el visor: iconos sueltos, sin porcentaje, zoom mínimo de 100 % que sí amplíe, mover la foto arrastrándola, fundido al cambiar y deslizar en teléfono. La espera venía de que cada foto se cargaba y decodificaba al avanzar y de una curva de fundido que arrancaba lenta; ahora la siguiente foto espera montada y decodificada. El zoom del visor usaba la propiedad CSS `zoom`, que el tamaño máximo de la imagen anulaba; se cambió a transformaciones con arrastre, pellizco y rueda. Build y 47 pruebas; revisado en navegador local. Sin despliegue.

## 2026-11-07 22:29 — Ciudad de México (GMT−6)

La usuaria pidió acercar el sol a la cabecera en `/recuerdos` (unos 50 px, sin pegarlo) y quitar el recuadro con la fecha de apertura de la carga, que repetía lo que ya dice la cuenta regresiva. Se redujo el espacio superior de la página y se eliminaron el aviso, sus traducciones y su estilo. Build y 41 pruebas; medido en navegador local en escritorio y 375 px. Sin despliegue.

## 2026-11-07 22:17 — Ciudad de México (GMT−6)

La usuaria pidió que la carga de recuerdos se abra hasta el día y hora del evento, que el botón «Subir mis fotos» del álbum aparezca un día antes y que ambas páginas tengan las partículas doradas y más elementos de la invitación. `/recuerdos` ahora muestra solo una cuenta regresiva con texto y cambia sola a la carga a las 17:00 del 22 de noviembre (Denver); el botón del álbum depende de la fecha. Se sumaron partículas, linternas y el sol con halo, reutilizando los ornamentos existentes, para que las páginas pertenezcan a la misma historia visual. Build y 41 pruebas; revisado en navegador local simulando ambas fechas. Sin despliegue.

## 2026-11-07 19:00 — Ciudad de México (GMT−6)

La usuaria reportó que en la película algunas fotos aparecían sin fundido, que la X de cerrar solo se veía al pasar el cursor y que la portada del álbum se detenía al mover el cursor. El fundido pasó de transición a animación, porque las fotos precargadas cargaban antes del primer pintado y la transición no se disparaba. La X y las flechas van en su propia capa con más contraste (no se pudo reproducir el fallo en el panel). La portada ya no se pausa con cursor ni foco. Build y 38 pruebas. Sin despliegue.

## 2026-11-07 18:54 — Ciudad de México (GMT−6)

La usuaria notó que en la película el espacio de la foto se movía y mareaba. Ahora la foto ocupa un marco fijo con su proporción y solo la imagen se acerca o aleja dentro de él. Además, «C · XV» de la cabecera lleva a la invitación y se quitaron los enlaces «Volver a recuerdos» y «Volver a la invitación», porque la cabecera ya resuelve la navegación. Build y 38 pruebas; revisado en navegador local. Sin despliegue.

## 2026-11-07 18:47 — Ciudad de México (GMT−6)

En «Ver como película» las fotos verticales se cortaban en pantallas horizontales. A pedido de la usuaria, cada foto se muestra completa sobre su propia versión desenfocada (al revés en teléfono), con zoom que alterna dirección y un fundido cruzado para que los recuerdos se fusionen. La portada suma «Subir mis fotos» hacia `/recuerdos` y el mosaico carga de 20 en 20 con un «Ver más» violeta de borde dorado, para pedir menos miniaturas al abrir. Build y 38 pruebas; revisado en navegador local con las fotos reales. Sin despliegue.

## 2026-11-07 18:33 — Ciudad de México (GMT−6)

El mosaico descargaba originales de 41–51 MB y el álbum resultaba inutilizable. Se añadió un endpoint de miniaturas que aprovecha las de Drive y, para fotos que Drive no procesa, las reduce en el servidor con `sharp`. Mosaico, visor y película pasan a usar miniaturas (de 1.6 GB a unos pocos MB para 35 fotos). Build y 37 pruebas; verificado con las fotos reales en local. Sin despliegue.

## 2026-11-07 18:25 — Ciudad de México (GMT−6)

La usuaria pidió quitar la restricción de privacidad del álbum por considerarla complejidad innecesaria. Se eliminaron el enlace secreto, la cookie firmada y el endpoint de acceso; el álbum se ve en `/album` sin sesión. Se mantienen la carpeta privada, el filtro de archivos de la app, el límite de lecturas y `noindex`. Verificado en local con las 35 fotos reales; se detectó que el mosaico descarga originales de 43–50 MB y queda lento. Sin despliegue.

## 2026-11-07 18:19 — Ciudad de México (GMT−6)

La usuaria terminó de subir sus fotos de casi 60 MB; se retiró el límite temporal (nunca se hizo commit) y se reinició el servidor local con 20 MB. A petición suya, `/recuerdos` permite quitar archivos de la selección antes de subirlos, para corregir errores sin volver a elegir todo. Build y 36 pruebas; revisado en navegador local. Sin despliegue.

## 2026-11-07 17:58 — Ciudad de México (GMT−6)

La usuaria decidió conservar los límites originales (20 MB por foto y 400 MB por video) y se revirtió el aumento a 50/500 MB. Para que pueda subir sus fotos de casi 60 MB se abrió temporalmente el límite de foto solo en local y sin commit; se restaurará al terminar la carga.

## 2026-11-07 17:48 — Ciudad de México (GMT−6)

La usuaria decidió conservar el permiso `drive.file` y subir los recuerdos desde `/recuerdos` en lugar de ampliar el acceso a Drive, para que el álbum los muestre sin cambiar la seguridad. Siguiente paso: subir contenido real y revisar el álbum con él.

## 2026-11-07 17:45 — Ciudad de México (GMT−6)

Rediseño visual del álbum, porque la usuaria lo sentía anticuado; la dirección se eligió con maquetas en navegador. Portada animada tipo «historias» con las siete fotos de la invitación al azar y sin controles visibles, mosaico tipo revista con destello dorado, filtros y «Ver más recuerdos», visor con navegación y modo película aleatorio con videos de 5 s sin sonido. Se retiró la pasarela. Build y 36 pruebas; revisión en navegador con datos simulados. Se detectó que la carpeta de Drive no tiene archivos visibles para la app (permiso `drive.file`), por eso el álbum real aparece vacío; queda como decisión de la usuaria. Sin despliegue.

## 2026-11-07 17:00 — Ciudad de México (GMT−6)

Se unificó la cabecera y se renovó el álbum privado con pasarela de fotos, cuadrícula de cinco columnas, páginas de 50 archivos y visor de solo lectura con zoom y giro visual. Build y 33 pruebas correctos; se revisaron foto y controles en escritorio y cuadrícula y visor de video en móvil. Pendientes movimiento reducido, paginado visual con más de 50 archivos y reproducción de video; el listado sigue completo y las fotos se sirven a tamaño original. Sin despliegue.

## 2026-11-07 16:43 — Ciudad de México (GMT−6)

Se añadió una cámara de Lucide a la izquierda de la cabecera para abrir el álbum privado directamente, con etiqueta accesible en ambos idiomas. Build y 31 pruebas correctos; el navegador no abrió y quedan pendientes las revisiones visuales de escritorio, móvil y movimiento reducido. Sin despliegue.

## 2026-11-07 16:16 — Ciudad de México (GMT−6)

Se separó el álbum en `/album` y se añadió «Ver álbum» debajo de la carga, conservando por decisión de la usuaria el acceso mediante enlace privado o sesión. Los enlaces anteriores se redirigen y el regreso lleva a recuerdos. Build y 31 pruebas correctos; navegador con y sin autorización y enlace inválido verificados en escritorio y móvil. Se retiraron dos líneas de claves añadidas accidentalmente al README durante la configuración previa; la usuaria había indicado que generó claves nuevas. No se verificó la revocación anterior ni se desplegó.

## 2026-11-07 15:56 — Ciudad de México (GMT−6)

Se sustituyeron la barra y los valores visibles por un velo claro que descubre cada miniatura desde abajo conforme se envían los datos, y se retiró el aviso de carga lista. El progreso usa eventos reales de envío, reserva 100 % a la confirmación y vuelve al último bloque confirmado si hay un corte; se conserva el indicador accesible. Build y 31 pruebas correctos. Se revisaron estados inicial y final en escritorio y el inicial en móvil; una foto se subió correctamente mediante las protecciones reales. La transición se desactiva con movimiento reducido por CSS; no se emuló esa preferencia. Sin despliegue; README ajeno conservado.

## 2026-11-07 15:41 — Ciudad de México (GMT−6)

Se cambió la lista de archivos seleccionados por miniaturas locales con progreso, identificación de video y alternativa para formatos no compatibles; los nombres se conservan para lectores de pantalla. Build y 29 pruebas correctos; revisión visual de cuatro fotos en escritorio y móvil. Queda pendiente revisar video y movimiento reducido en navegador. Sin despliegue; se conservaron cambios ajenos en README.

## 2026-11-07 15:31 — Ciudad de México (GMT−6)

Se comprobaron las claves del widget local sin mostrarlas y se inició `dev:seguridad`. Turnstile completó la verificación desde navegador; la API real validó desafío y cuota en Upstash y la imagen `gallery-7.webp` llegó a 100 % en Drive. El origen ajeno y el token inválido se rechazaron con HTTP 403. Falta validar Preview, contenido real y vigencia OAuth; no se desplegó. Se preservaron cambios ajenos en README.

## 2026-11-07 15:24 — Ciudad de México (GMT−6)

Con autorización de la usuaria se creó un widget Turnstile separado para `127.0.0.1`. Se preparó `npm run dev:seguridad` para ejecutar la API de carga y Upstash reales solo desde localhost, con claves locales separadas y el interruptor activo únicamente en el proceso. Comprobado que no arranca sin dichas claves; build y 29 pruebas correctos. Falta guardar las claves locales y probar el desafío y una carga desde navegador. No se desplegó; se preservaron cambios ajenos en README.

## 2026-11-06 19:44 — Ciudad de México (GMT−6)

La usuaria guardó el token de Upstash en `.env`. Se probaron los servicios reales sin publicar: Upstash permitió cuatro intentos sintéticos, bloqueó el quinto y permitió la lectura del álbum; Cloudflare rechazó un token de prueba inválido sin indicar secreto inválido. Falta verificar el desafío completo y el par de claves desde navegador, además de Preview y pendientes operativos. No se mostraron secretos ni se desplegó. Se conservaron cambios ajenos en README.

## 2026-11-06 19:42 — Ciudad de México (GMT−6)

Con autorización de la usuaria se creó la base gratuita `camila-recuerdos` en Upstash, región Virginia. Se guardaron en `.env` la URL REST y un secreto interno aleatorio para las huellas del límite de intentos, sin mostrar su valor. El token de Upstash todavía no está guardado; falta su incorporación privada y la prueba real. Sin despliegue. Se conservan cambios ajenos en README fuera del commit.

## 2026-11-06 19:16 — Ciudad de México (GMT−6)

La usuaria confirmó que ve el álbum local. Se creó un widget Turnstile administrado para el dominio de la invitación. Tras la exposición accidental de la clave en la salida de una herramienta, la usuaria informó que generó claves nuevas y las guardó en `.env`; se corrigieron los nombres de las variables para que coincidan con el código y se verificó su presencia sin imprimir valores. No se comprobó la rotación directamente. Faltan Upstash, configuración de Preview y prueba de protecciones reales. Sin despliegue.

## 2026-11-06 19:04 — Ciudad de México (GMT−6)

Se habilitó la prueba del álbum en localhost usando sus controladores reales, secreto temporal y contador local simulado; se verificaron rechazo sin autorización o con secreto incorrecto, listado real de Drive y rangos de foto y video. Se añadieron siete pruebas de protecciones con servicios simulados; build y 29 pruebas correctos. Falta revisión visual, configurar y comprobar servicios reales y validar Preview. No se desplegó.

## 2026-11-06 19:00 — Ciudad de México (GMT−6)

Como las cargas manuales terminaban demasiado rápido para interrumpirlas, se realizó una prueba controlada con una imagen PNG válida de 9,739,098 bytes y la lógica real del cliente. Se simuló una pérdida antes del segundo bloque al 86 %, se consultó la misma sesión y se completó al 100 %; el SHA-256 descargado de Drive coincidió con el original. Quedan por comprobar la desconexión física desde navegador, video grande, álbum y protecciones. Sin despliegue.

## 2026-11-06 18:54 — Ciudad de México (GMT−6)

Se corrigió el reintento de cargas interrumpidas: conserva sesiones y archivos completados mientras la página permanezca abierta y consulta a Drive antes de continuar; evita marcar 100 % sin confirmación. Build y 22 pruebas correctas. Drive confirmó la carga de una imagen real en dos etapas con la misma sesión. Falta probar desconexión desde navegador y considerar la caducidad; recargar o cambiar la selección descarta la sesión. Sin despliegue.

## 2026-11-06 18:50 — Ciudad de México (GMT−6)

La usuaria confirmó la reproducción del video en Drive. Al revisar la recuperación de red se detectó que una interrupción que persista durante la consulta de estado termina el intento y que al pulsar de nuevo se crean sesiones nuevas; no se ha probado su reanudación ni descartado duplicados. Siguiente paso: corregir y verificar ese caso antes de probar álbum y protecciones. Sin despliegue.

## 2026-11-06 18:49 — Ciudad de México (GMT−6)

Tras pedir la prueba de video y varios archivos, la usuaria informó que todo subió, incluso varios a la vez. Se registró su confirmación; queda comprobar la reproducción del video y la recuperación ante interrupciones, además del álbum y las protecciones. Sin despliegue.

## 2026-11-06 18:44 — Ciudad de México (GMT−6)

La usuaria confirmó que las fotos llegan a Drive y compartió una captura con la carga al 100 % desde el navegador local, después de corregir CORS. Se registró la evidencia sin afirmar que se compararon los archivos. Siguiente paso: cargar un video corto y comprobar su reproducción en Drive; después revisar lotes, reanudación, álbum y protecciones. Sin despliegue.

## 2026-11-06 18:40 — Ciudad de México (GMT−6)

La prueba desde navegador mostró `Failed to fetch`. El diagnóstico confirmó que Google aceptaba la imagen pero omitía el encabezado que permite al navegador leer la respuesta. Se agregó el origen validado al crear la sesión reanudable, en el servidor local y en la API; Google respondió HTTP 200 con el origen autorizado en una carga real. Build y 19 pruebas correctos. Queda repetir la prueba desde navegador y revisar si el intento anterior creó un duplicado; no se desplegó.

## 2026-11-06 18:35 — Ciudad de México (GMT−6)

Se preparó un servidor de prueba local separado de la API desplegada para usar la autorización de Drive existente sin configurar los servicios de protección. Una imagen mínima se subió realmente a Drive y Google respondió HTTP 200; quedan por verificar el envío desde navegador y CORS. Build y 19 pruebas correctos. No hubo despliegue. Siguiente paso: probar una foto desde `http://127.0.0.1:5188/recuerdos` y comprobarla en Drive.

## 2026-11-06 17:47 — Ciudad de México (GMT−6)

Se implementó protección contra abuso de cargas con validación server-side de Turnstile, límite de cuatro lotes por IP cada minuto y límite de consultas a la galería mediante Upstash compartido; el backend valida todos los archivos y el máximo de 20 por lote antes de crear sesiones. Se añadió el álbum privado: el secreto llega en el fragmento del enlace, se canjea por cookie firmada de 24 horas y el servidor solo lista/proxy archivos marcados dentro de la carpeta privada. Se documentaron configuración, límites y pruebas pendientes en README, pasos de Drive, decisiones, verificación y EN_CURSO. No se configuraron servicios externos, no se leyeron/generaron secretos, las cargas siguen apagadas y no hubo despliegue. Build correcto y 19 pruebas pasando. La revisión visual local quedó pendiente porque el navegador no pudo iniciarse en este entorno.

Commit local de implementación: `5084be4` — «Protege las cargas y añade álbum privado de recuerdos». Sin push ni despliegue.

Siguiente paso: configurar Turnstile, Upstash y los secretos de servidor en Preview; validar autorización OAuth vigente, cargas, CORS, video con `Range` y eliminación controlada antes de activar invitados.

## 2026-11-06 17:28 — Ciudad de México (GMT−6)

Se documentó el método reutilizable de OAuth y Google Picker para futuros proyectos: arquitectura, separación de credenciales, configuración de Cloud, contrato del autorizador, diagnóstico por etapas, operación en Windows, portabilidad y límites de producción. Se registraron la causa comprobada, las hipótesis descartadas y el alcance de las verificaciones; no se presenta la autorización local como prueba de cargas o renovación. Se corrigieron textos desactualizados sobre consentimiento pendiente y se enlazó la guía desde README, manual, decisiones y verificación. No se copiaron secretos ni se modificó código. Se comprobaron rutas locales y formato del diff. Commit de la fase: «Documenta método reutilizable de Google Drive y Picker».

Siguiente paso: protección contra abuso y consulta privada en una conversación nueva; después Preview y validación real previa autorización de despliegue.


## 2026-11-06 17:23 — Ciudad de México (GMT−6)

La usuaria confirmó con captura que Picker permitió seleccionar la carpeta, se verificó su ubicación en Mi unidad y el token quedó guardado en .env. Queda comprobada la corrección de referente del commit c1efc0c; las hipótesis anteriores sobre una clave desactualizada o una API ausente no explicaban el fallo final. Se actualizan manual y estado sin leer secretos. Siguiente fase: protección contra abuso y consulta privada, seguida de configuración y pruebas en Preview previa autorización de despliegue. Antes de invitados se debe resolver la caducidad del token en modo de pruebas.


## 2026-11-06 17:21 — Ciudad de México (GMT−6)

Se controló Chrome mediante la skill computer-use y se confirmaron ambas APIs y referentes correctos. Se corrigió el script local para enviar solo el origen como referente y declarar el origen de Picker, evitando eliminar el dato que Google necesita para validar la clave restringida. La herramienta de control detuvo la navegación al no poder verificar la URL. El servidor quedó reiniciado mediante Start-Process oculto con salida directa: el log tiene 692 bytes y el enlace existe, sin imprimir sus parámetros. Sintaxis del script válida, build y 19 pruebas correctos. Pendiente prueba real de consentimiento/selector y guardado.


## 2026-11-06 17:00 — Ciudad de México (GMT−6)

La captura de credenciales muestra la clave con una sola API permitida; la verificación local anterior confirmó que esa clave permite Google Drive API. Google Picker requiere que la restricción permita **Google Picker API**, por lo que esta es la causa probable del error persistente. Se actualizó el manual y `EN_CURSO.md` con la corrección: habilitar Picker API en el proyecto y añadirla a las APIs permitidas de la clave, manteniendo los referentes actuales. No se modificaron secretos ni se creó otra clave.

Siguiente paso: permitir Google Picker API en la clave, esperar la propagación, reiniciar el flujo local y seleccionar la carpeta.

## 2026-11-06 16:39 — Ciudad de México (GMT−6)

El error «The API developer key is invalid» sigue apareciendo aunque la usuaria repitió todos los pasos. Se verificó la clave del `.env` contra Google sin mostrar su valor: tiene el formato correcto (39 caracteres, `AIza`, sin comillas ni espacios), ninguna variable del sistema la reemplaza, Google la reconoce como existente (la clave falsa de control da `API_KEY_INVALID`), pertenece al mismo proyecto que el cliente OAuth (`appId`), acepta los referentes `http://127.0.0.1:8788/` y `https://docs.google.com/`, permite Google Drive API y bloquea APIs ajenas. Tampoco había ningún proceso viejo en el puerto 8788. Se descartan el `.env` desactualizado, los referentes, el proyecto equivocado y un proceso en caché. Queda por comprobar lo que solo se ve en la consola o desde el propio Picker: si **Google Picker API** está habilitada en el proyecto y figura en las API permitidas de la clave. No se pudo reproducir en el navegador porque la extensión de Chrome no estaba conectada.

Siguiente paso: la usuaria confirma que Picker API está habilitada en ese proyecto; como prueba de aislamiento, quita temporalmente la restricción por API (se conservan los referentes), espera unos minutos y reinicia `npm run drive:authorize`. Si con eso funciona, el problema es la lista de APIs de la clave. Si falla, revisar en DevTools → Network la petición de Picker que falla, sin compartir URLs que contengan la clave o el token.

## 2026-11-06 16:13 — Ciudad de México (GMT−6)

Las capturas nuevas confirman que la clave nueva está limitada a Google Picker API y Google Drive API, y contiene ambos referentes requeridos. El error persiste; lo más probable es que el proceso y `.env` sigan usando la clave anterior, porque crear/rotar una clave en Cloud no cambia la variable local. Una captura expuso el valor completo de la clave nueva, por lo que no debe reutilizarse: crear otra, restringirla igual, reemplazar `GOOGLE_PICKER_API_KEY` en `.env` y reiniciar el flujo. Se actualizaron el manual y el estado; no se leyó ni se editó `.env`.

Siguiente paso: reemplazar la clave expuesta y actualizar `.env` sin compartir el valor; reiniciar `npm run drive:authorize` y verificar que Picker permita elegir la carpeta.

## 2026-11-06 16:02 — Ciudad de México (GMT−6)

Se diagnosticó el segundo error de autorización: la cuenta regresó al callback local, pero Google Picker mostró “The API developer key is invalid”. La causa está en la configuración o restricción de `GOOGLE_PICKER_API_KEY`, no en la devolución OAuth. Se añadió a `PASOS_GOOGLE_DRIVE.md` una lista para revisar API habilitada, clave y referentes `127.0.0.1`/`docs.google.com`, y se actualizó `EN_CURSO.md`. No se leyó ni imprimió ningún secreto; no se confirmó que el token se haya guardado.

Siguiente paso: la usuaria corrige o confirma la clave y sus restricciones en Google Cloud, vuelve a ejecutar la autorización local y elige la carpeta. No compartir la dirección completa del callback: contiene un código OAuth temporal.

## 2026-11-06 15:09 — Ciudad de México (GMT−6)

Se retomó la integración de recuerdos después de que la usuaria confirmó los pasos 1 y 2 de configuración de Google. Se implementó el inicio de sesiones reanudables en Vercel, la transferencia directa por bloques desde el navegador y un flujo local de autorización con `drive.file`, `openid` y `email`; el selector valida la carpeta privada y el permiso de borrado antes de guardar el token en `.env`. El endpoint queda apagado por defecto. También se programó limpieza diaria para borrar únicamente cargas marcadas por la app desde el 7 de marzo de 2027 a las 00:00 Denver, con `CRON_SECRET`. Compilación, 19 pruebas, sintaxis y configuración pasaron. No se solicitó consentimiento OAuth ni se configuraron secretos de Vercel. No se pudo hacer la revisión visual porque el navegador de control no estuvo disponible; la vista web de consulta de la galería sigue pendiente. Commit local: `e42dab9` — «Integra cargas reanudables privadas en recuerdos».

Siguiente paso: terminar revisión del código y documentación y hacer commit. Luego la usuaria habilita Picker, registra el URI localhost y ejecuta `npm run drive:authorize`. Antes de activar cargas: agregar protección contra abuso, confirmar la ubicación y rol de la carpeta, configurar Preview y probar foto/video/reanudación y borrado en entorno controlado.

## 2026-11-06 14:35 — Ciudad de México (GMT−6)

Se documentaron los pasos necesarios para habilitar la carga de recuerdos y la galería privada con Google Drive. La guía distingue las acciones de configuración de la usuaria de la implementación, y registra las decisiones de enlace secreto, OAuth, seguridad de secretos, despliegue, acceso a cargas, conservación y validación. No se modificó la aplicación ni se expusieron credenciales.

Siguiente paso: la usuaria comparte el ID y ubicación de la carpeta, habilita Drive API y confirma la cuenta de almacenamiento y las decisiones operativas pendientes.

## 2026-11-06 14:19 — Ciudad de México (GMT−6)

Se añadió un selector de idioma **En | Es** con el estilo dorado de la invitación para que cada persona pueda leerla en el idioma que prefiera. El cambio cubre las 19 escenas, la galería, RSVP, accesibilidad y la página `/recuerdos`; la selección se conserva localmente y actualiza el idioma y los metadatos del documento. La fecha y la hora se presentan con el formato del idioma y la zona horaria del evento.

Compilación de producción verificada con `npm.cmd run build`. No se ejecutaron pruebas automatizadas. Sin push ni despliegue.
