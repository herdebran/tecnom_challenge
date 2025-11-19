using BoxesAppointmentApp.Api.Models;

namespace BoxesAppointmentApp.Api.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly List<Appointment> _appointments = new List<Appointment>();
        private readonly IWorkshopService _workshopService;
        private int _nextId = 1;

        public AppointmentService(IWorkshopService workshopService)
        {
            _workshopService = workshopService;
        }

        public async Task<Appointment> CreateAsync(Appointment appointment)
        {
            appointment.Id = _nextId++;
            _appointments.Add(appointment);
            // Simulamos la operación asincrónica esperando 1 seg
            await Task.Delay(1);
            return appointment;
        }

        public async Task<List<Appointment>> GetAllAsync()
        {
            // Simulamos la operación asincrónica esperando 1 seg
            await Task.Delay(1);
            return _appointments.ToList(); 
        }

        public async Task<bool> ValidatePlaceIdAsync(int placeId)
        {
             // Obtenengo el taller con ese placeId
            var workshop = await _workshopService.GetWorkshopByIdAsync(placeId);

            // Verificar si existe y si está activo
            return workshop != null && workshop.Active;



        }
    }
}