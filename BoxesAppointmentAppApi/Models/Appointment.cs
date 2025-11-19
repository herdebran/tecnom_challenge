namespace BoxesAppointmentApp.Api.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int PlaceId { get; set; }
        public DateTime AppointmentAt { get; set; }
        public string ServiceType { get; set; } = string.Empty;
        public Person Contact { get; set; } = new Person();
        public Vehicle? Vehicle { get; set; } // Opcional
    }
}