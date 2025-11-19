using BoxesAppointmentApp.Api.Models;

namespace BoxesAppointmentApp.Api.Services
{
    public interface IAppointmentService
    {
        Task<Appointment> CreateAsync(Appointment appointment);
        Task<List<Appointment>> GetAllAsync();
        Task<bool> ValidatePlaceIdAsync(int placeId);
    }
}