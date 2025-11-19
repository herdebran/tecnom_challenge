using Microsoft.AspNetCore.Mvc;
using BoxesAppointmentApp.Api.DTOs;
using BoxesAppointmentApp.Api.Services;
using BoxesAppointmentApp.Api.Models;

namespace BoxesAppointmentApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly ILogger<AppointmentsController> _logger;

        public AppointmentsController(IAppointmentService appointmentService, ILogger<AppointmentsController> logger)
        {
            _appointmentService = appointmentService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<Appointment>> Create([FromBody] CreateAppointmentRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validación: PlaceId debe ser un taller activo
            bool isPlaceValid = await _appointmentService.ValidatePlaceIdAsync(request.PlaceId);
            if (!isPlaceValid)
            {
                ModelState.AddModelError("PlaceId", "El ID del taller no es válido o no está activo.");
                return BadRequest(ModelState);
            }

            // Comparamos la fecha del turno (en UTC) con la fecha/hora actual (en UTC)
            var currentTimeUtc = DateTime.UtcNow;
            if (request.AppointmentAt <= currentTimeUtc)
            {
                return BadRequest(new {
                    field = "AppointmentAt",
                    message = "La fecha y hora del turno debe ser en el futuro."
                });                
            }


            var appointment = new Appointment
            {
                PlaceId = request.PlaceId,
                AppointmentAt = request.AppointmentAt,
                ServiceType = request.ServiceType,
                Contact = request.Contact,
                Vehicle = request.Vehicle 
            };

            var createdAppointment = await _appointmentService.CreateAsync(appointment);
            _logger.LogInformation("Turno creado exitosamente para el taller {PlaceId} en {AppointmentAt}", request.PlaceId, request.AppointmentAt);

            return CreatedAtAction(nameof(GetById), new { id = createdAppointment.Id }, createdAppointment);
        }

        // Endpoint para obtener un turno por ID (útil para debugging o futuras features)
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetById(int id)
        {
            // Para el mock en memoria, no tenemos forma de buscar por ID directamente
            // Podríamos implementar un diccionario, pero por simplicidad, devolvemos un error.
            // En un sistema real, usaríamos una DB.
            return NotFound();
        }

        [HttpGet]
        public async Task<ActionResult<List<Appointment>>> GetAll()
        {
            var appointments = await _appointmentService.GetAllAsync();
            return Ok(appointments);
        }
    }
}