# Planilla de Asistencias Zapataye FC (React + Google Sheets)

## Descripción

Aplicación web progresiva (PWA) para gestionar la asistencia y los pagos mensuales de jugadores del equipo deportivo Zapataye FC. Permite llevar un registro detallado por mes, visualizar rankings, estados de pago y gestionar la lista de jugadores y los días de entrenamiento. Los datos se almacenan y se leen desde una hoja de cálculo de Google Sheets a través de un backend implementado con Google Apps Script.

Construido con React y estilizado con Tailwind CSS. Utiliza SweetAlert2 para notificaciones y modales.

## Funcionalidades Principales

* **Vista Mensual:** Muestra una tabla con los jugadores y los días de entrenamiento del mes seleccionado.
* **Registro de Asistencia:** Permite marcar/desmarcar la asistencia de cada jugador a cada entrenamiento.
* **Registro de Pagos:** Permite marcar/desmarcar el estado del pago mensual de cada jugador.
* **Suspensión de Entrenamientos:** Permite marcar/desmarcar un día de entrenamiento completo como "Suspendido" (no cuenta para estadísticas).
* **Gestión de Jugadores:**
    * **Agregar:** Añade nuevos jugadores a la lista maestra ("Jugadores") y a las planillas mensuales desde el mes actual en adelante. Usa UUIDs para IDs únicos.
    * **Eliminar:** Elimina jugadores de la lista maestra y de todas las planillas mensuales.
    * **Editar Nombre:** Modifica el nombre de un jugador en la lista maestra (se refleja en todas partes).
* **Gestión de Entrenamientos:**
    * **Agregar Fecha:** Añade una nueva columna de fecha de entrenamiento al mes actual, insertándola en orden cronológico.
    * **Eliminar Fecha:** Elimina una columna de fecha de entrenamiento existente del mes actual.
* **Reportes:**
    * **Ranking de Asistencia:** Muestra un ranking general de jugadores ordenado por mayor asistencia (considera días suspendidos y solo fechas pasadas/presentes).
    * **Estado de Pagos:** Muestra una lista de jugadores con meses pendientes de pago y cuáles son esos meses.
* **Selección de Mes:** Permite navegar entre los diferentes meses disponibles (hasta el mes actual).
* **Interfaz Responsiva:** Diseñada para funcionar en diferentes tamaños de pantalla.
* **PWA (Progressive Web App):**
    * Instalable en la pantalla de inicio del dispositivo móvil/escritorio.

## Tech Stack

* **Frontend:** React (con Hooks), Tailwind CSS, SweetAlert2
* **Backend/API:** Google Apps Script (desplegado como Web App)
* **Base de Datos:** Google Sheets


## Creado por Matias Gonzalez Autelli (matutegon97@gmail.com)