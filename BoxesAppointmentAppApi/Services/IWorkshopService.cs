using BoxesAppointmentApp.Api.Models;

namespace BoxesAppointmentApp.Api.Services
{
    public interface IWorkshopService
    {
        Task<List<Workshop>> GetActiveWorkshopsAsync();
        Task<Workshop?> GetWorkshopByIdAsync(int workshopId);
    }
}