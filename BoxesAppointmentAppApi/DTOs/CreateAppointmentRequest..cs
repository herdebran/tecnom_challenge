using System.ComponentModel.DataAnnotations;
using BoxesAppointmentApp.Api.Models; 

namespace BoxesAppointmentApp.Api.DTOs
{
    public class CreateAppointmentRequest
    {
        [Required]
        public int PlaceId { get; set; }

        [Required]
        public DateTime AppointmentAt { get; set; }

        [Required]
        [MinLength(2)]
        public string ServiceType { get; set; } = string.Empty;

        [Required]
        public Person Contact { get; set; } = new Person();

        public Vehicle? Vehicle { get; set; }
    }
}