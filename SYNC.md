# Supabase Free + Continuar con Google

## Proyecto de desarrollo conectado

La URL y la clave pública recibidas ya están en `.env.local`, excluido de Git. Proyecto: `https://mmtfatmoathubfymjepk.supabase.co`. Todavía no hay dominio de producción.

Configuración exacta para este proyecto:

- Google Auth Platform, cliente OAuth Web, URI de redirección autorizada: `https://mmtfatmoathubfymjepk.supabase.co/auth/v1/callback`.
- Supabase Authentication / URL Configuration, Site URL de desarrollo: `http://localhost:8081`.
- Supabase Redirect URLs: `http://localhost:8081/auth/callback` y `mi-vetec://auth/callback`.
- Si Expo usa otro puerto, añade el retorno con ese puerto. El retorno localhost se prueba en el navegador de la computadora; la app instalada usa el esquema móvil.
- En Google, mantén la audiencia en Testing durante el desarrollo y añade como usuarios de prueba los correos que usarás.

Verificación del proyecto: la API de autenticación respondió correctamente y aceptó la clave pública; Google está desactivado. La API de datos respondió PGRST205: no encuentra `public.records` en el esquema expuesto. Ejecuta `supabase/schema.sql` y activa Google. La clave pública no concede permisos para administrar esas opciones ni consultar la facturación. Selecciona Free en el panel; la aplicación no contrata planes.

## Datos de conexión

- URL del proyecto Supabase: https://xxxxxxxx.supabase.co.
- Clave publishable (sb_publishable_...) o clave pública anon del mismo proyecto.
- URL de la web si ya existe; si todavía no existe, basta indicarlo.
- Confirmación de que ejecutaste supabase/schema.sql y activaste Google según los pasos siguientes.

No envíes contraseñas, claves secret/service_role, contraseña de la base de datos ni el secreto OAuth de Google. Ese secreto se introduce directamente en el panel de Supabase, nunca en el código ni en el chat.

## Configuración en tus cuentas

1. Crea una organización/proyecto en el plan Free de Supabase. No contrates Pro ni complementos. El plan se selecciona en el panel, no desde el código.
2. Ejecuta supabase/schema.sql en SQL Editor. Crea records, la relación con auth.users y las políticas RLS. Supabase Auth crea automáticamente el usuario en su primer acceso con Google.
3. En Google Cloud / Google Auth Platform, configura nombre de la app, correo de soporte y audiencia. Crea un cliente OAuth de tipo Web application. Este flujo usa el navegador del sistema y Supabase como intermediario tanto en Android como en web.
4. En ese cliente, autoriza la URI https://TU-PROYECTO.supabase.co/auth/v1/callback. Copia el valor exacto del proveedor Google de Supabase. No pongas el retorno móvil en este campo de Google.
5. Activa Google en Supabase Authentication / Providers e introduce allí el Client ID y Client Secret de Google. El secreto queda solo en Supabase. Si Google está en modo Testing, añade los correos de prueba; antes de usarlo con el público de Google Play, publica la configuración OAuth y completa los requisitos que indique Google.
6. En Supabase Authentication / URL Configuration, añade estos Redirect URLs:
   - mi-vetec://auth/callback para Android/iOS.
   - http://localhost:8081/auth/callback para desarrollo web (ajusta el puerto si Expo usa otro).
   - https://TU-WEB/auth/callback para la web publicada. Configura Site URL con tu web cuando exista. Su alojamiento debe servir la aplicación al abrir /auth/callback o /cuenta directamente.
7. Copia .env.example a .env.local y completa URL y clave pública. Reinicia con npx expo start --clear. Configura las mismas variables al compilar Android y web.

Este flujo por navegador no necesita credenciales OAuth Android ni huellas SHA. Para probar en el teléfono usa una compilación de desarrollo o una app instalada con el esquema mi-vetec. Expo Go no admite este retorno OAuth. Los módulos nuevos requieren recompilar la aplicación instalada.

Google no necesita que Supabase envíe correos de confirmación. La alternativa de correo y contraseña sigue disponible, pero sus correos de confirmación para usuarios públicos requieren configurar SMTP propio.

## Guardados y aislamiento de cuentas

Al abrir sin sesión aparece el acceso por correo, Google o la opción explícita de invitado. Las rutas de herramientas y sus enlaces directos quedan protegidos hasta elegir un modo. La elección de invitado solo vive en memoria y no crea una sesión anónima en Supabase.

El registro por correo exige un nombre de 2 a 80 caracteres, que se guarda en user_metadata.app_name. Después del primer acceso con Google, o en cuentas anteriores sin ese dato, se exige confirmar el nombre antes de entrar. El nombre de Google puede aparecer como sugerencia, pero se debe confirmar. Se usa updateUser y la sesión persistida conserva el nombre para posteriores accesos sin conexión. No hace falta ejecutar SQL adicional para este campo.

Los resultados completos de dosis y Pearson y cada cambio de una tarjeta Kardex con movimientos se guardan automáticamente, sin pulsar Guardar. El botón se conserva para reintentar si falla el almacenamiento. Los formularios incompletos no se guardan como borradores. Cada registro usa el UUID de Supabase; no se toma el propietario de un correo escrito manualmente. Se comprueba la cuenta actual y se rechaza la operación si cambia mientras se procesa. Primero se escribe localmente; los pendientes conservan ese propietario sin conexión.

La subida comprueba la sesión y solo envía pendientes del mismo UUID. Supabase valida el JWT y RLS impide leer registros ajenos o insertar con el UUID de otra persona, incluso mediante la API. No se incluyen claves administrativas en la aplicación. Los registros son instantáneas inmutables: se consultan e imprimen, pero no reabren formularios.

Cerrar sesión oculta los registros de esa cuenta sin trasladarlos a otra y vuelve al acceso inicial. Al cambiar entre cuentas o salir del modo invitado, las herramientas se reinician para evitar transferir cálculos entre personas. El invitado no escribe registros locales ni remotos, tampoco al imprimir. No se muestran ni se vinculan antiguos registros sin cuenta. El intercambio OAuth usa PKCE y un verificador persistido por el SDK; la contraseña de Google no pasa por la app.

Se reintenta al guardar, iniciar sesión, recuperar conexión, volver a la app y cada 30 segundos mientras está activa. Con la app cerrada, el reintento ocurre al abrirla. Los IDs estables evitan duplicados y se descarga el historial por páginas.

Solo lo marcado En línea se puede recuperar tras desinstalar o desde otro dispositivo. Los formularios sin guardar y los pendientes solo existen localmente. AsyncStorage no cifra los datos ni la sesión almacenada; no protege frente a alguien con acceso al almacenamiento del dispositivo.

## Plan gratuito

El código no contrata ni cambia planes. Free tiene límites de base de datos, transferencia y usuarios y puede pausarse por inactividad. Revisa Usage en el panel. La web necesita alojamiento aparte, pero no requiere comprar un dominio para probar.

## Validación cuando esté conectado

- Entrar con Google como A en Android instalado y web. Verificar que aparece en Authentication / Users. Guardar dosis, Pearson y Kardex y esperar En línea.
- Cancelar Google: no debe crearse una sesión ni modificarse el historial.
- Guardar sin conexión con la sesión A conservada, reiniciar y recuperar conexión. Comprobar subida sin duplicados.
- Cerrar sesión y entrar como B: no debe verse ningún registro de A. Con el JWT de B, consultar un ID de A debe devolver cero filas e insertar con user_id de A debe fallar por RLS.
- Entrar como A en otro equipo o tras reinstalar: recuperar su historial ya sincronizado.
- Abrir sin sesión o entrar con un enlace directo a una herramienta: debe aparecer el acceso. Elegir invitado, calcular e imprimir: no deben generarse registros locales ni remotos. Al salir o recargar vuelve al acceso y no se recupera la actividad de invitado.
- Registrarse por correo exige nombre. Un primer acceso con Google debe pedir confirmarlo. Sin ese paso no se puede acceder a las herramientas, aunque se use su URL directa.
- Con sesión y nombre, realizar cálculos y movimientos sin pulsar Guardar: deben aparecer automáticamente en el historial propio. Cerrar sesión y cambiar de cuenta debe reiniciar los formularios.

Referencias oficiales:
- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/docs/guides/auth/native-mobile-deep-linking
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/pricing
