using Engee.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Engee.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public static string ObtenerJson(string path)
        {
            string resultado;
            using (var reader = new StreamReader(path))
            {
                resultado = reader.ReadToEnd();
                
            }
            return resultado;

        }

        [HttpGet]
        public IActionResult BuscarDNI(string DNI)
        {
            var personas = ObtenerJson("Data/Persona.json");
            List<Persona> resultado = JsonConvert.DeserializeObject<List<Persona>>(personas);
            string nombre = resultado.Where(x => x.Dni == DNI).Select(x => x.Nombre).SingleOrDefault();
            string apellido= resultado.Where(x => x.Dni == DNI).Select(x => x.Apellido).SingleOrDefault();
            string res = nombre == null? null : nombre + ' ' + apellido;
            return new JsonResult(new { Data = res }) ;
        }

        [HttpGet]
        public IActionResult cargar_filtros(string sector, string nombre)
        {
            var empleados = ObtenerJson("Data/Empleados.json");
            List<Empleado> resultado = JsonConvert.DeserializeObject<List<Empleado>>(empleados);
            return new JsonResult(new { Data = resultado });
        }

        public IActionResult cargar_historial()
        {
            var historial = ObtenerJson("Data/Historial.json");
            List<Historial> resultado = JsonConvert.DeserializeObject<List<Historial>>(historial);

            return new JsonResult(new { Data = resultado });
        }

        [HttpPost]
        public IActionResult agregar_nuevo_historial(string ingreso, string visito, string fecha, string hora)
        {

            var historial = ObtenerJson("Data/Historial.json");
            List<Historial> resultado = JsonConvert.DeserializeObject<List<Historial>>(historial);

            Historial nuevo = new Historial {ingreso=Convert.ToInt32(ingreso), visito=visito,fecha=fecha,hora= hora }; 
            resultado.Add(nuevo);
            
            using (StreamWriter file = System.IO.File.CreateText("Data/Historial.json"))
            {
                JsonSerializer serializer = new JsonSerializer();

                serializer.Serialize(file, resultado);
            }

            return new JsonResult(new { data = "Cargado Correcatamente" });
        }

    }
}
