using System.Text;
using Newtonsoft.Json;
using BoxesAppointmentApp.Api.Models;
using Microsoft.Extensions.Configuration;

namespace BoxesAppointmentApp.Api.Services
{
    public class WorkshopService : IWorkshopService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<WorkshopService> _logger;
        private readonly string _apiUrl;
        private readonly string _user;
        private readonly string _pass;
        private List<Workshop>? _cachedWorkshops;
        private DateTime _cacheExpiry = DateTime.MinValue;

        public WorkshopService(HttpClient httpClient, ILogger<WorkshopService> logger, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;

            // desde el archivo appsettings.json
            _apiUrl = configuration["ExternalApi:BaseUrl"] ?? throw new InvalidOperationException("La configuración 'ExternalApi:BaseUrl' es obligatoria.");
            _user = configuration["ExternalApi:Username"] ?? throw new InvalidOperationException("La configuración 'ExternalApi:Username' es obligatoria.");
            _pass = configuration["ExternalApi:Password"] ?? throw new InvalidOperationException("La configuración 'ExternalApi:Password' es obligatoria.");
        }

private string ParseFormattedAddress(string addressJsonString)
        {
            try
            {
                // Parseamos la cadena JSON a un objeto dinámico
                var addressObject = JsonConvert.DeserializeObject<dynamic>(addressJsonString);
                // Accedemos al campo 'formatted_address'
                var formattedAddress = addressObject?.formatted_address?.ToString();
                // Devolvemos el valor o un string vacío si no se encuentra
                return formattedAddress ?? string.Empty;
            }
            catch (JsonException jsonEx)
            {
                _logger.LogError(jsonEx, "Error al parsear el campo 'address' como JSON: {AddressJson}", addressJsonString);
                return "Dirección no disponible";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inesperado al parsear el campo 'address': {AddressJson}", addressJsonString);
                return "Dirección no disponible";
            }
        }
        public async Task<List<Workshop>> GetActiveWorkshopsAsync()
        {
            // Implementación de caché simple (5 minutos)
            if (_cachedWorkshops != null && DateTime.UtcNow < _cacheExpiry)
            {
                _logger.LogInformation("Retornando talleres desde caché.");
                return _cachedWorkshops;
            }

            var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_user}:{_pass}"));
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Basic {credentials}");

            try
            {
                var response = await _httpClient.GetAsync(_apiUrl);
                response.EnsureSuccessStatusCode();

                var jsonString = await response.Content.ReadAsStringAsync();
                var externalWorkshops = JsonConvert.DeserializeObject<List<Workshop>>(jsonString) ?? new List<Workshop>();

                var workshops = externalWorkshops.Select(ew => new Workshop
                {
                    Id = ew.Id,
                    Name = ew.Name,
                    // A los fines del challenge mostramos FormattedAddres en Address
                    Address = ParseFormattedAddress(ew.Address),
                    Email = ew.Email,
                    Phone = ew.Phone,
                    Active = ew.Active
                }).ToList();

                // Actualizar caché
                _cachedWorkshops = workshops;
                _cacheExpiry = DateTime.UtcNow.AddMinutes(5);

                _logger.LogInformation("Talleres obtenidos y cacheados desde la API externa.");
                return workshops;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener talleres de la API externa.");
                // Si falla, devolver la caché si existe, o una lista vacía
                return _cachedWorkshops ?? new List<Workshop>();
            }
        }

        public async Task<Workshop?> GetWorkshopByIdAsync(int workshopId)
        {
            var workshops = await GetActiveWorkshopsAsync();
            return workshops.FirstOrDefault(w => w.Id == workshopId);
        }
    }
}