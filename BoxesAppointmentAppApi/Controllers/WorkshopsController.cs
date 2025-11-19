using Microsoft.AspNetCore.Mvc;
using BoxesAppointmentApp.Api.Services;

namespace BoxesAppointmentApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkshopsController : ControllerBase
    {
        private readonly IWorkshopService _workshopService;
        private readonly ILogger<WorkshopsController> _logger;

        public WorkshopsController(IWorkshopService workshopService, ILogger<WorkshopsController> logger)
        {
            _workshopService = workshopService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<Models.Workshop>>> GetActiveWorkshops()
        {
            var workshops = await _workshopService.GetActiveWorkshopsAsync();
            return Ok(workshops);
        }
    }
}